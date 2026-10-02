// IP → country helpers used by src/middleware.ts to pick the first-visit locale.
// No imports on purpose: this file is also run directly by scripts/test-geo.ts.

/**
 * Spanish-speaking countries (Spain + Latin America). Matched against the
 * English country name returned by https://ip.guide (it has no ISO code field).
 * Brazil and Haiti are intentionally excluded (Portuguese / French-Creole).
 */
const SPANISH_COUNTRIES = new Set([
  'spain',
  'mexico',
  'guatemala',
  'honduras',
  'el salvador',
  'nicaragua',
  'costa rica',
  'panama',
  'cuba',
  'dominican republic',
  'puerto rico',
  'colombia',
  'venezuela',
  'ecuador',
  'peru',
  'bolivia',
  'paraguay',
  'uruguay',
  'argentina',
  'chile',
  'equatorial guinea',
])

/** "Venezuela, Bolivarian Republic of" / "Bolivia (Plurinational State of)" → "venezuela" / "bolivia". */
function normalizeCountry(name: string): string {
  return name.split(/[,(]/)[0].trim().toLowerCase()
}

export function isSpanishCountry(country: string | null | undefined): boolean {
  return Boolean(country) && SPANISH_COUNTRIES.has(normalizeCountry(country as string))
}

const BOT_UA =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora link preview|pinterest|lighthouse|pagespeed|headless|curl|wget|python-requests|go-http-client/i

export function isBot(userAgent: string | null | undefined): boolean {
  // No UA at all is almost always a script, not a person.
  return !userAgent || BOT_UA.test(userAgent)
}

const IPV4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
const IPV6 = /^[0-9a-f:.]+$/i

function isPublicIp(ip: string): boolean {
  const v4 = IPV4.exec(ip)
  if (v4) {
    const o = v4.slice(1).map(Number)
    if (o.some((n) => n > 255)) return false
    const [a, b] = o
    if (a === 0 || a === 10 || a === 127) return false
    if (a === 169 && b === 254) return false
    if (a === 172 && b >= 16 && b <= 31) return false
    if (a === 192 && b === 168) return false
    if (a === 100 && b >= 64 && b <= 127) return false // CGNAT
    if (a >= 224) return false
    return true
  }
  if (ip.includes(':') && IPV6.test(ip)) {
    const l = ip.toLowerCase()
    if (l === '::1' || l === '::') return false
    if (l.startsWith('fe80') || l.startsWith('fc') || l.startsWith('fd')) return false
    return true
  }
  return false
}

interface HeaderReader {
  get(name: string): string | null
}

/** Best-effort real client IP from proxy headers. Returns null for private/invalid values. */
export function extractClientIp(headers: HeaderReader): string | null {
  const candidates = [
    headers.get('cf-connecting-ip'),
    headers.get('x-real-ip'),
    // XFF is "client, proxy1, proxy2": the first public entry is the client.
    ...(headers.get('x-forwarded-for')?.split(',') ?? []),
  ]
  for (const raw of candidates) {
    if (!raw) continue
    // Strip an IPv4 ":port" suffix and IPv6 brackets.
    const ip = raw.trim().replace(/^(\d+\.\d+\.\d+\.\d+):\d+$/, '$1').replace(/^\[|\]$/g, '')
    if (isPublicIp(ip)) return ip
  }
  return null
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000
const CACHE_MAX = 5000
const cache = new Map<string, { country: string | null; expires: number }>()

/**
 * Country name for an IP via ip.guide. Never throws: any failure (timeout,
 * rate limit, bad JSON) resolves to null so callers fall back to English.
 * Failures are cached briefly so an outage does not add latency to every visit.
 */
export async function countryFromIp(
  ip: string,
  opts: { timeoutMs?: number; fetchImpl?: typeof fetch } = {},
): Promise<string | null> {
  const now = Date.now()
  const hit = cache.get(ip)
  if (hit && hit.expires > now) return hit.country

  const { timeoutMs = 1200, fetchImpl = fetch } = opts
  let country: string | null = null
  let ttl = CACHE_TTL_MS
  try {
    const res = await fetchImpl(`https://ip.guide/${encodeURIComponent(ip)}`, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(timeoutMs),
    })
    if (res.ok) {
      const data = (await res.json()) as { location?: { country?: string } }
      country = data?.location?.country ?? null
    } else {
      ttl = 60 * 1000
    }
  } catch {
    ttl = 60 * 1000
  }

  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value as string)
  cache.set(ip, { country, expires: now + ttl })
  return country
}

export function clearGeoCache(): void {
  cache.clear()
}
