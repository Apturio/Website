import { getPayload } from 'payload'
import config from '@payload-config'

import type { Page } from '@/payload-types'

/**
 * Fetch a single published Page by slug + lang via the Payload Local API (no
 * HTTP hop). `depth: 1` resolves the Hero logo upload. Returns null when no
 * published match exists so callers can fall back / 404.
 */
export async function getPageBySlug(lang: string, slug: string): Promise<Page | null> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { slug: { equals: slug } },
        { lang: { equals: lang } },
        { _status: { equals: 'published' } },
      ],
    },
    limit: 1,
    depth: 1,
    pagination: false,
  })
  return (docs[0] as Page | undefined) ?? null
}
