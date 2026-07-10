import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Match every path EXCEPT:
  //  - Payload admin + API route group (`/admin`, `/api`) — must never get a locale prefix
  //  - Next.js internals (`/_next`, `/_vercel`)
  //  - The old SPA routes handled by next.config 301 redirects (so they stay 301, not
  //    a 307 locale-redirect from this middleware)
  //  - Static files (anything with a dot)
  matcher: [
    // Root — served directly as `en` (default locale, unprefixed).
    '/',
    '/((?!admin|api|_next|_vercel|pay-per-use|add-ons|strategy-call|privacy-policy|terms-of-service|thank-you|checkout|demo-spanish|.*\\..*).*)',
  ],
}
