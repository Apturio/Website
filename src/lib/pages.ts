import { getPayload } from 'payload'
import config from '@payload-config'

import type { Page } from '@/payload-types'

/**
 * Fetch a single published Page by slug + lang via the Payload Local API (no
 * HTTP hop). `depth: 1` resolves the Hero logo upload. Returns null when no
 * published match exists so callers can fall back / 404.
 */
export async function getPageBySlug(
  lang: string,
  slug: string,
  opts: { draft?: boolean } = {},
): Promise<Page | null> {
  const payload = await getPayload({ config })
  const { draft = false } = opts
  const { docs } = await payload.find({
    collection: 'pages',
    locale: lang as 'en' | 'es',
    // In draft/preview mode, drop the published filter and pull the latest draft
    // version so admin live-preview renders unsaved/unpublished content.
    where: draft
      ? { slug: { equals: slug } }
      : { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    draft,
    overrideAccess: draft,
    limit: 1,
    depth: 1,
    pagination: false,
  })
  return (docs[0] as Page | undefined) ?? null
}
