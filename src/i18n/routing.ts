import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  // Both domains point to the same Vercel deployment; keep /en/ explicit.
  localePrefix: 'always',
})
