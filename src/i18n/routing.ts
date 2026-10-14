import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  // English (default) is served WITHOUT a prefix; only Spanish lives under /es.
  // Every URL builder (canonicals, hreflang, sitemap, links) goes through
  // localePath/localeUrl in src/lib/site.ts, which follow this same rule.
  localePrefix: 'as-needed',
  // Disabled: next-intl would otherwise redirect on the browser's Accept-Language.
  // First-visit language is decided by IP in src/middleware.ts (Spain + LatAm → es).
  localeDetection: false,
  // next-intl would otherwise add `Link: rel="alternate"; hreflang` response headers that
  // assume the SAME slug in every language. Slugs are localized here (and many posts exist in
  // one language only), so those headers pointed at 404s and contradicted the HTML <link>s and
  // the sitemap. hreflang is emitted per page in generateMetadata and in the sitemap instead.
  alternateLinks: false,
})
