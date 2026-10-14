/**
 * Content fixes from the 2026-10-13 SEO audit that live in CMS data.
 *
 *   npx payload run scripts/apply-content-fixes.ts          # dry run: prints what would change
 *   APPLY=1 npx payload run scripts/apply-content-fixes.ts  # writes (a JSON backup goes to seo-audit/)
 *
 * Idempotent: a second run finds nothing to change. Only facts supplied by the owners are
 * written; nothing is inferred.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { getPayload } from 'payload'
import config from '@payload-config'

const APPLY = process.argv.includes('--apply') || process.env.APPLY === '1'
const payload = await getPayload({ config })
console.log(APPLY ? 'MODE: APPLY (writes)' : 'MODE: dry run (no writes)')

const backup: Record<string, unknown> = {}

/* ---------------------------------------------------------------- author */
const AUTHOR_SLUG = 'carlos-ramon-burgues-capasso'
const author = (
  await payload.find({
    collection: 'authors',
    where: { slug: { equals: AUTHOR_SLUG } },
    locale: 'all',
    depth: 0,
    limit: 1,
    overrideAccess: true,
  })
).docs[0] as unknown as Record<string, any> | undefined

if (!author) {
  console.log(`author ${AUTHOR_SLUG}: not found (run scripts/set-blog-author.ts first)`)
} else {
  backup.author = author
  const want = {
    name: 'Carlos Ramón Burgués Capasso',
    linkedin: 'https://www.linkedin.com/in/carlosburgues/',
    en: {
      role: 'Cofounder & CRO',
      bio: 'Carlos Ramón Burgués Capasso is cofounder and CRO of Apturio. He is also founder and CEO of Venxel and works in marketing and advertising at Dalca.',
    },
    es: {
      role: 'Cofundador y CRO',
      bio: 'Carlos Ramón Burgués Capasso es cofundador y CRO de Apturio. También es fundador y CEO de Venxel y trabaja en marketing y publicidad en Dalca.',
    },
    expertise: ['Marketing & Advertising'],
  }
  const changes: string[] = []
  if (author.name !== want.name) changes.push(`name → ${want.name}`)
  if (author.socials?.linkedin !== want.linkedin) changes.push('socials.linkedin')
  for (const loc of ['en', 'es'] as const) {
    if (author.role?.[loc] !== want[loc].role) changes.push(`role.${loc}`)
    if (author.bio?.[loc] !== want[loc].bio) changes.push(`bio.${loc}`)
  }
  const haveTopics = (author.expertise ?? []).map((e: any) => e.topic)
  if (JSON.stringify(haveTopics) !== JSON.stringify(want.expertise)) changes.push('expertise')
  console.log(`author: ${changes.length ? changes.join(', ') : 'already up to date'}`)

  if (APPLY && changes.length) {
    await payload.update({
      collection: 'authors',
      id: author.id,
      locale: 'en',
      overrideAccess: true,
      data: {
        name: want.name,
        role: want.en.role,
        bio: want.en.bio,
        socials: { linkedin: want.linkedin },
        expertise: want.expertise.map((topic) => ({ topic })),
      } as never,
    })
    await payload.update({
      collection: 'authors',
      id: author.id,
      locale: 'es',
      overrideAccess: true,
      data: { role: want.es.role, bio: want.es.bio } as never,
    })
    console.log('author: updated')
  }
}

/* ------------------------------------------------------- /es/precios H1 */
// "Planes de CRM con IA" + accent "CRM con IA" rendered the phrase twice.
const precios = (
  await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'precios' } },
    locale: 'es',
    fallbackLocale: false,
    depth: 0,
    limit: 1,
    overrideAccess: true,
  })
).docs[0] as unknown as Record<string, any> | undefined

if (!precios) {
  console.log('page precios (es): not found')
} else {
  const layout = precios.layout as Array<Record<string, any>>
  const hero = layout.find((b) => b.blockType === 'heroCentered')
  if (!hero) {
    console.log('page precios (es): no heroCentered block')
  } else {
    const before = { titleStart: hero.titleStart, titleAccent: hero.titleAccent, titleEnd: hero.titleEnd }
    const after = { titleStart: 'Planes de', titleAccent: 'CRM con IA', titleEnd: 'para cada tipo de negocio' }
    const same = JSON.stringify(before) === JSON.stringify(after)
    console.log(`page precios (es) H1: ${same ? 'already up to date' : `${JSON.stringify(before)} → ${JSON.stringify(after)}`}`)
    if (APPLY && !same) {
      backup.preciosLayout = layout
      Object.assign(hero, after)
      await payload.update({
        collection: 'pages',
        id: precios.id,
        locale: 'es',
        draft: false,
        overrideAccess: true,
        data: { layout } as never,
      })
      console.log('page precios (es): updated')
    }
  }
}

if (APPLY && Object.keys(backup).length) {
  mkdirSync('seo-audit', { recursive: true })
  const file = `seo-audit/content-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  writeFileSync(file, JSON.stringify(backup, null, 2))
  console.log(`backup written: ${file}`)
}
process.exit(0)
