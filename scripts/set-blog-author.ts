/**
 * Credits every blog post to one author and (optionally) removes the previous one.
 *
 *   npx payload run scripts/set-blog-author.ts                    # dry run, writes nothing
 *   APPLY=1 npx payload run scripts/set-blog-author.ts            # create author + assign posts
 *   APPLY=1 DELETE_PREVIOUS=1 npx payload run scripts/set-blog-author.ts
 *
 * Environment (all optional):
 *   AUTHOR_NAME   display name       default "Carlos Ramon Burgues Capasso"
 *   AUTHOR_SLUG   url slug           default derived from the name
 *   PREVIOUS_SLUG author to retire   default "arianna-lupi"
 *
 * Only the name is written. Role, bio and social links stay empty until the person supplies
 * them: nothing is invented. The script connects to whatever DATABASE_URI points at, so check
 * the printed host before using --apply.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { getPayload } from 'payload'
import config from '@payload-config'

// `payload run` does not forward flags reliably, so env vars work too (APPLY=1, DELETE_PREVIOUS=1).
const APPLY = process.argv.includes('--apply') || process.env.APPLY === '1'
const DELETE_PREVIOUS = process.argv.includes('--delete-previous') || process.env.DELETE_PREVIOUS === '1'
const NAME = process.env.AUTHOR_NAME ?? 'Carlos Ramon Burgues Capasso'
const PREVIOUS_SLUG = process.env.PREVIOUS_SLUG ?? 'arianna-lupi'

const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
const SLUG = process.env.AUTHOR_SLUG ?? slugify(NAME)

const payload = await getPayload({ config })

try {
  const host = new URL(process.env.DATABASE_URI ?? '').host
  console.log(`database host: ${host}`)
} catch {
  console.log('database host: (could not parse DATABASE_URI)')
}
console.log(APPLY ? 'MODE: APPLY (writes)' : 'MODE: dry run (no writes)')

// 1. Author (find or create).
const existing = await payload.find({
  collection: 'authors',
  where: { slug: { equals: SLUG } },
  limit: 1,
  depth: 0,
  overrideAccess: true,
})
let authorId: number | string | null = existing.docs[0]?.id ?? null
console.log(authorId ? `author exists: id=${authorId}` : `author "${NAME}" (${SLUG}) will be created`)

if (!authorId && APPLY) {
  const created = await payload.create({
    collection: 'authors',
    data: { name: NAME, slug: SLUG } as never,
    overrideAccess: true,
  })
  authorId = created.id
  console.log(`created author id=${authorId}`)
}

// 2. Posts (published and drafts).
const posts = await payload.find({
  collection: 'posts',
  limit: 1000,
  pagination: false,
  depth: 0,
  draft: true,
  overrideAccess: true,
  select: { title: true, author: true, _status: true },
})
const idOf = (v: unknown) => (v && typeof v === 'object' ? (v as { id: unknown }).id : v)
const toChange = posts.docs.filter(
  (p) => !authorId || String(idOf((p as { author?: unknown }).author)) !== String(authorId),
)
console.log(`posts: ${posts.docs.length} total, ${toChange.length} to reassign`)

if (APPLY && authorId) {
  // Restore point: previous author of every post, plus the author document about to go.
  const prevDoc = (
    await payload.find({
      collection: 'authors',
      where: { slug: { equals: PREVIOUS_SLUG } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      locale: 'all',
    })
  ).docs[0]
  mkdirSync('seo-audit', { recursive: true })
  const backup = `seo-audit/author-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  writeFileSync(
    backup,
    JSON.stringify(
      {
        posts: posts.docs.map((p) => ({ id: p.id, author: idOf((p as { author?: unknown }).author) ?? null })),
        previousAuthor: prevDoc ?? null,
      },
      null,
      2,
    ),
  )
  console.log(`backup written: ${backup}`)
  for (const p of toChange) {
    // Title and slug are required per locale, so the write has to happen in a locale where the
    // post really exists (a Spanish-only post fails validation when saved as English).
    const all = (await payload.findByID({
      collection: 'posts',
      id: p.id,
      locale: 'all',
      depth: 0,
      draft: true,
      overrideAccess: true,
    })) as unknown as { title?: Record<string, unknown> }
    const hasTitle = (loc: string) => typeof all.title?.[loc] === 'string' && !!(all.title[loc] as string).trim()
    const writeLocale = hasTitle('en') ? 'en' : hasTitle('es') ? 'es' : 'en'
    await payload.update({
      collection: 'posts',
      id: p.id,
      locale: writeLocale,
      data: { author: authorId } as never,
      depth: 0,
      overrideAccess: true,
      // Keep the document in its current state (published stays published).
      draft: (p as { _status?: string })._status === 'draft',
    })
    console.log(`  reassigned post ${p.id}`)
  }
}

// 3. Previous author.
const previous = await payload.find({
  collection: 'authors',
  where: { slug: { equals: PREVIOUS_SLUG } },
  limit: 1,
  depth: 0,
  overrideAccess: true,
})
const prev = previous.docs[0]
if (!prev) {
  console.log(`previous author "${PREVIOUS_SLUG}" not found: nothing to retire`)
} else {
  const stillUsed = APPLY
    ? (
        await payload.find({
          collection: 'posts',
          where: { author: { equals: prev.id } },
          limit: 1,
          depth: 0,
          draft: true,
          overrideAccess: true,
        })
      ).totalDocs
    : posts.docs.filter((p) => String(idOf((p as { author?: unknown }).author)) === String(prev.id)).length
  console.log(`previous author id=${prev.id}: still on ${stillUsed} post(s) ${APPLY ? 'after reassignment' : 'now'}`)
  if (APPLY && DELETE_PREVIOUS) {
    if (stillUsed > 0) {
      console.log('NOT deleting: posts still reference the previous author')
    } else {
      await payload.delete({ collection: 'authors', id: prev.id, overrideAccess: true })
      console.log('deleted previous author')
    }
  } else if (DELETE_PREVIOUS) {
    console.log('(dry run) previous author would be deleted once no post references it')
  }
}

process.exit(0)
