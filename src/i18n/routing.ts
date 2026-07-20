import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  // Default locale (en) served unprefixed; only /es gets a prefix.
  localePrefix: 'as-needed',
})
