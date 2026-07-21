import { getPayload } from 'payload'
import config from '@payload-config'
import { SITE_URL, localizedAlternates } from '@/lib/site'
import { HOME_MARKER_SLUGS } from '@/lib/hooks'

// ISR — the sitemap does not need per-request freshness (consistent with the
// rest of the app's DB-backed prerendering).
export const revalidate = 3600

// Indexable static routes (paths after the locale segment). noindex routes
// (checkout, thank-you, demo funnel) are intentionally excluded.
const STATIC_PATHS = [
  '',
  '/pay-per-use',
  '/add-ons',
  '/strategy-call',
  '/privacy-policy',
  '/terms-of-service',
] as const

const LOCALES = ['en', 'es'] as const

interface SitemapEntry {
  loc: string
  lastmod: string
  changefreq: string
  priority: string
  alternates: Record<string, string>
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

type DynamicCollection = 'pages' | 'posts' | 'categories' | 'authors'

interface CollectionSpec {
  collection: DynamicCollection
  filterPublished: boolean
  changefreq: string
  priority: string
  makeUrl: (locale: string, slug: string) => string
}

const COLLECTION_SPECS: CollectionSpec[] = [
  {
    collection: 'pages',
    filterPublished: true,
    changefreq: 'weekly',
    priority: '0.7',
    makeUrl: (locale, slug) => `${SITE_URL}/${locale}/${slug}`,
  },
  {
    collection: 'posts',
    filterPublished: true,
    changefreq: 'weekly',
    priority: '0.6',
    makeUrl: (locale, slug) => `${SITE_URL}/${locale}/blog/${slug}`,
  },
  {
    collection: 'categories',
    filterPublished: false,
    changefreq: 'weekly',
    priority: '0.5',
    makeUrl: (locale, slug) => `${SITE_URL}/${locale}/blog/category/${slug}`,
  },
  {
    collection: 'authors',
    filterPublished: false,
    changefreq: 'weekly',
    priority: '0.5',
    makeUrl: (locale, slug) => `${SITE_URL}/${locale}/blog/author/${slug}`,
  },
]

/**
 * Normalizes a doc's raw `locale: 'all'` slug read into a per-locale map.
 * Authors' `slug` is NOT localized (a plain string) — the same value applies
 * to every locale. Pages/Posts/Categories' `slug` IS localized (an object
 * keyed by locale) — only non-empty string entries are kept.
 */
function normalizeSlugMap(rawSlug: unknown): Record<string, string> {
  const out: Record<string, string> = {}
  if (typeof rawSlug === 'string' && rawSlug) {
    for (const locale of LOCALES) out[locale] = rawSlug
    return out
  }
  if (rawSlug && typeof rawSlug === 'object') {
    for (const [locale, value] of Object.entries(rawSlug as Record<string, unknown>)) {
      if (typeof value === 'string' && value) out[locale] = value
    }
  }
  return out
}

function buildStaticEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = []
  for (const path of STATIC_PATHS) {
    for (const locale of LOCALES) {
      entries.push({
        loc: `${SITE_URL}/${locale}${path}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: path === '' ? '1.0' : '0.7',
        alternates: {
          en: `${SITE_URL}/en${path}`,
          es: `${SITE_URL}/es${path}`,
          'x-default': `${SITE_URL}/en${path}`,
        },
      })
    }
  }
  return entries
}

/**
 * Resilient per-collection helper: queries ONE collection and returns its
 * sitemap entries. Deliberately throws on a failed query — the caller wraps
 * EACH collection's call in its OWN try/catch (backstop requirement) so one
 * rejecting collection never 500s the whole route.
 */
async function collectCollectionEntries(
  payload: Awaited<ReturnType<typeof getPayload>>,
  spec: CollectionSpec,
): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = []

  const { docs } = await payload.find({
    collection: spec.collection,
    locale: 'all',
    where: spec.filterPublished ? { _status: { equals: 'published' } } : {},
    depth: 0,
    pagination: false,
    overrideAccess: false,
  })

  for (const doc of docs as unknown as Array<Record<string, unknown>>) {
    const slugMap = normalizeSlugMap(doc.slug)
    if (Object.keys(slugMap).length === 0) continue

    const updatedAtRaw = doc.updatedAt
    const lastmod = new Date(
      typeof updatedAtRaw === 'string' ? updatedAtRaw : Date.now(),
    ).toISOString()

    for (const locale of Object.keys(slugMap)) {
      // The homepage is already the STATIC '' entry for THIS locale — never
      // double-list it. Checked per-locale (not per-document) so a page that
      // is the homepage in one locale but has a real, distinct slug in the
      // other locale is only skipped for the locale where it's actually the
      // homepage, not dropped from the sitemap entirely. Reuses the same
      // HOME_MARKER_SLUGS convention as src/lib/hooks.ts's revalidatePagePaths.
      if (spec.collection === 'pages' && HOME_MARKER_SLUGS.has(slugMap[locale])) continue

      // Home-marker slugs (e.g. 'home'/'index') never resolve through
      // spec.makeUrl here — that would emit `${SITE_URL}/{loc}/home`, which
      // is not the actual static homepage URL and is excluded from
      // generateStaticParams (see [...slug]/page.tsx). Substitute the bare
      // locale root instead, so every alternate (including x-default, which
      // derives from languages['en']) points at a real, indexable URL.
      const { canonical, languages } = localizedAlternates(
        locale as 'en' | 'es',
        slugMap,
        (loc, slug) =>
          spec.collection === 'pages' && HOME_MARKER_SLUGS.has(slug)
            ? `${SITE_URL}/${loc}`
            : spec.makeUrl(loc, slug),
      )
      entries.push({
        loc: canonical,
        lastmod,
        changefreq: spec.changefreq,
        priority: spec.priority,
        alternates: languages,
      })
    }
  }

  return entries
}

const [PAGES_SPEC, POSTS_SPEC, CATEGORIES_SPEC, AUTHORS_SPEC] = COLLECTION_SPECS

/**
 * Queries the four public Payload collections. Each collection is called
 * inside its OWN try/catch so a single failing/rejecting query never 500s
 * the whole route — it is simply logged and contributes zero rows.
 */
async function collectDynamicEntries(
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = []

  try {
    entries.push(...(await collectCollectionEntries(payload, PAGES_SPEC)))
  } catch (err) {
    console.error('[sitemap] pages query failed', err)
  }

  try {
    entries.push(...(await collectCollectionEntries(payload, POSTS_SPEC)))
  } catch (err) {
    console.error('[sitemap] posts query failed', err)
  }

  try {
    entries.push(...(await collectCollectionEntries(payload, CATEGORIES_SPEC)))
  } catch (err) {
    console.error('[sitemap] categories query failed', err)
  }

  try {
    entries.push(...(await collectCollectionEntries(payload, AUTHORS_SPEC)))
  } catch (err) {
    console.error('[sitemap] authors query failed', err)
  }

  return entries
}

function serializeSitemap(entries: SitemapEntry[]): string {
  const urls = entries
    .map((entry) => {
      const alternates = Object.entries(entry.alternates)
        .map(
          ([hreflang, href]) =>
            `    <xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}"/>`,
        )
        .join('\n')
      return [
        '  <url>',
        `    <loc>${escapeXml(entry.loc)}</loc>`,
        `    <lastmod>${entry.lastmod}</lastmod>`,
        `    <changefreq>${entry.changefreq}</changefreq>`,
        `    <priority>${entry.priority}</priority>`,
        alternates,
        '  </url>',
      ].join('\n')
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`
}

export async function GET() {
  const staticEntries = buildStaticEntries()

  // Guard the ENTIRE dynamic portion — including `getPayload()` itself — so
  // a DB-init failure degrades to a static-only sitemap (200) instead of a
  // full 500. This mirrors the per-collection resilience in
  // `collectDynamicEntries` and `src/lib/navigation.ts`'s `getNavigationView`.
  let dynamicEntries: SitemapEntry[] = []
  try {
    const payload = await getPayload({ config })
    dynamicEntries = await collectDynamicEntries(payload)
  } catch (err) {
    console.error('[sitemap] payload init failed — serving static-only sitemap', err)
  }

  // Dedupe by `loc` (statics first) so a CMS slug that collides with a
  // hardcoded static route can never produce a duplicate <url>.
  const deduped = new Map<string, SitemapEntry>()
  for (const entry of [...staticEntries, ...dynamicEntries]) {
    if (!deduped.has(entry.loc)) deduped.set(entry.loc, entry)
  }

  const xml = serializeSitemap([...deduped.values()])

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
