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
})
