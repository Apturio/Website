import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'

export interface ResolvedRedirect {
  to: string
  /** HTTP status — '301' | '302' | '303' | '307' | '308'. */
  type: string
}

/**
 * Look up a CMS-managed redirect (@payloadcms/plugin-redirects) whose `from`
 * matches the requested path. Resolves both `custom` URLs and `reference`
 * targets (to a referenced page/post slug). Returns null when no match — the
 * caller then falls through to notFound().
 */
export async function findRedirect(fromPath: string): Promise<ResolvedRedirect | null> {
  const payload = await getPayload({ config })

  // Match the path as stored, and tolerate a trailing-slash variant.
  const candidates = Array.from(
    new Set([fromPath, fromPath.replace(/\/$/, ''), `${fromPath.replace(/\/$/, '')}/`]),
  )

  const { docs } = await payload.find({
    collection: 'redirects',
    where: { from: { in: candidates } },
    limit: 1,
    depth: 1,
    pagination: false,
  })

  const r = docs[0] as
    | {
        type?: string | null
        to?: {
          type?: string | null
          url?: string | null
          reference?: { relationTo?: string; value?: { slug?: string } | number | string } | null
        } | null
      }
    | undefined
  if (!r?.to) return null

  const status = r.type ?? '301'

  if (r.to.type === 'custom' && r.to.url) {
    return { to: r.to.url, type: status }
  }

  if (r.to.type === 'reference' && r.to.reference && typeof r.to.reference.value === 'object') {
    const slug = r.to.reference.value?.slug
    if (slug) {
      const prefix = r.to.reference.relationTo === 'posts' ? '/blog/' : '/'
      return { to: `${prefix}${slug}`, type: status }
    }
  }

  return null
}
