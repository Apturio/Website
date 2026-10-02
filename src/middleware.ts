import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'

import { routing } from './i18n/routing'
import { countryFromIp, extractClientIp, isBot, isSpanishCountry } from './lib/geo'

const intlMiddleware = createMiddleware(routing)

const LOCALE_COOKIE = 'NEXT_LOCALE'
const COOKIE_OPTIONS = {
  path: '/',
  maxAge: 60 * 60 * 24 * 365,
  sameSite: 'lax' as const,
  secure: true,
}

/**
 * URL scheme: English is unprefixed (`/pay-per-use`), Spanish lives under `/es`.
 *
 * 1. `/en/...` is not a valid public URL: 301 to the unprefixed path (keeps old
 *    links and indexed URLs working) and pin English so the IP rule below does
 *    not bounce a Spanish-IP visitor who explicitly asked for English.
 * 2. First visit to `/` is decided by IP: Spain + Latin America go to `/es`,
 *    everyone else stays on English. Only the root is geo-routed: localized slugs
 *    differ per locale, so deep links are never rewritten. Order of precedence:
 *      a. NEXT_LOCALE cookie (last locale used or chosen with the switcher);
 *      b. crawlers/scripts always get English (stable for SEO, no IP lookup);
 *      c. IP country via ip.guide. Lookup failure or unknown IP → English.
 */
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(3) || '/'
    const response = NextResponse.redirect(url, 301)
    response.cookies.set(LOCALE_COOKIE, 'en', COOKIE_OPTIONS)
    return response
  }

  if (pathname === '/') {
    const cookie = request.cookies.get(LOCALE_COOKIE)?.value
    let preferSpanish = cookie === 'es'
    let country: string | null = null

    if (!cookie && !isBot(request.headers.get('user-agent'))) {
      const ip = extractClientIp(request.headers)
      country = ip ? await countryFromIp(ip) : null
      preferSpanish = isSpanishCountry(country)
    }

    if (preferSpanish) {
      const response = NextResponse.redirect(new URL('/es', request.url), 307)
      response.cookies.set(LOCALE_COOKIE, 'es', COOKIE_OPTIONS)
      // The target depends on the visitor's IP: never let a cache reuse this redirect.
      response.headers.set('Cache-Control', 'private, no-store')
      if (country) response.headers.set('x-geo-country', country)
      return response
    }

    const response = intlMiddleware(request)
    if (country) response.headers.set('x-geo-country', country)
    return response
  }

  return intlMiddleware(request)
}

export const config = {
  // Match every path EXCEPT:
  //  - Payload admin + API route group (`/admin`, `/api`) — must never get a locale prefix
  //  - Next.js internals (`/_next`, `/_vercel`)
  //  - Static files (anything with a dot)
  // English paths (`/pay-per-use`, `/blog/x`, ...) must pass through so next-intl
  // can rewrite them to the internal `/en/...` route.
  matcher: ['/', '/((?!admin|api|_next|_vercel|.*\\..*).*)'],
}
