// Run: node --test scripts/test-geo.ts   (Node >= 22.6 runs TypeScript natively)
// Live tests call https://ip.guide; set GEO_OFFLINE=1 to skip them.
import test from 'node:test'
import assert from 'node:assert/strict'

import {
  clearGeoCache,
  countryFromIp,
  extractClientIp,
  isBot,
  isSpanishCountry,
} from '../src/lib/geo.ts'

const h = (obj: Record<string, string>) => ({
  get: (name: string) => obj[name.toLowerCase()] ?? null,
})
const live = process.env.GEO_OFFLINE ? { skip: 'GEO_OFFLINE set' } : {}

test('isSpanishCountry: Spain and LatAm yes, rest no', () => {
  for (const c of [
    'Spain', 'Mexico', 'Guatemala', 'Honduras', 'El Salvador', 'Nicaragua', 'Costa Rica',
    'Panama', 'Cuba', 'Dominican Republic', 'Puerto Rico', 'Colombia', 'Venezuela', 'Ecuador',
    'Peru', 'Bolivia', 'Paraguay', 'Uruguay', 'Argentina', 'Chile', 'Equatorial Guinea',
    'Venezuela, Bolivarian Republic of', 'Bolivia (Plurinational State of)', 'SPAIN',
  ]) {
    assert.equal(isSpanishCountry(c), true, c)
  }
  for (const c of ['United States', 'Brazil', 'Haiti', 'Portugal', 'France', 'Canada', 'India', '', null, undefined]) {
    assert.equal(isSpanishCountry(c), false, String(c))
  }
})

test('isBot: crawlers and empty UA yes, browsers no', () => {
  assert.equal(isBot(null), true)
  assert.equal(isBot(''), true)
  assert.equal(isBot('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'), true)
  assert.equal(isBot('Mozilla/5.0 (compatible; bingbot/2.0)'), true)
  assert.equal(isBot('GPTBot/1.1'), true)
  assert.equal(isBot('curl/8.7.1'), true)
  assert.equal(
    isBot('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15'),
    false,
  )
  assert.equal(
    isBot('Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1'),
    false,
  )
})

test('extractClientIp: header precedence, XFF chain, ports, private ranges', () => {
  assert.equal(extractClientIp(h({ 'x-forwarded-for': '81.45.12.1' })), '81.45.12.1')
  assert.equal(extractClientIp(h({ 'x-forwarded-for': '10.0.0.5, 189.203.1.1, 172.16.0.1' })), '189.203.1.1')
  assert.equal(extractClientIp(h({ 'cf-connecting-ip': '200.29.1.1', 'x-forwarded-for': '8.8.8.8' })), '200.29.1.1')
  assert.equal(extractClientIp(h({ 'x-real-ip': '8.8.8.8' })), '8.8.8.8')
  assert.equal(extractClientIp(h({ 'x-forwarded-for': '81.45.12.1:51234' })), '81.45.12.1')
  assert.equal(extractClientIp(h({ 'x-forwarded-for': '2001:4860:4860::8888' })), '2001:4860:4860::8888')
  assert.equal(extractClientIp(h({ 'x-forwarded-for': '[2001:4860:4860::8888]' })), '2001:4860:4860::8888')
  for (const bad of ['127.0.0.1', '10.1.2.3', '192.168.1.5', '172.20.0.1', '169.254.1.1', '::1', 'fe80::1', '999.1.1.1', 'not-an-ip', '8.8.8.8/../admin']) {
    assert.equal(extractClientIp(h({ 'x-forwarded-for': bad })), null, bad)
  }
  assert.equal(extractClientIp(h({})), null)
})

test('countryFromIp: live ip.guide returns the expected country', live, async () => {
  clearGeoCache()
  const cases: [string, string, boolean][] = [
    ['81.45.12.1', 'Spain', true],
    ['189.203.1.1', 'Mexico', true],
    ['200.29.1.1', 'Chile', true],
    ['8.8.8.8', 'United States', false],
  ]
  for (const [ip, name, es] of cases) {
    const country = await countryFromIp(ip, { timeoutMs: 5000 })
    assert.equal(country, name, ip)
    assert.equal(isSpanishCountry(country), es, ip)
  }
})

test('countryFromIp: timeout, HTTP error and bad JSON all resolve to null (English fallback)', async () => {
  clearGeoCache()
  const slow = (async (_u: unknown, init?: RequestInit) =>
    new Promise((_r, reject) => init?.signal?.addEventListener('abort', () => reject(new Error('timeout'))))) as unknown as typeof fetch
  const t0 = Date.now()
  assert.equal(await countryFromIp('1.1.1.1', { timeoutMs: 150, fetchImpl: slow }), null)
  assert.ok(Date.now() - t0 < 1000, 'timeout must be enforced')

  const http429 = (async () => new Response('slow down', { status: 429 })) as unknown as typeof fetch
  assert.equal(await countryFromIp('1.1.1.2', { fetchImpl: http429 }), null)

  const badJson = (async () => new Response('<html>', { status: 200 })) as unknown as typeof fetch
  assert.equal(await countryFromIp('1.1.1.3', { fetchImpl: badJson }), null)
})

test('countryFromIp: caches successes (one upstream call) and escapes the IP in the URL', async () => {
  clearGeoCache()
  let calls = 0
  let lastUrl = ''
  const stub = (async (url: string) => {
    calls++
    lastUrl = url
    return new Response(JSON.stringify({ location: { country: 'Spain' } }), { status: 200 })
  }) as unknown as typeof fetch
  assert.equal(await countryFromIp('81.45.12.1', { fetchImpl: stub }), 'Spain')
  assert.equal(await countryFromIp('81.45.12.1', { fetchImpl: stub }), 'Spain')
  assert.equal(calls, 1)
  assert.equal(lastUrl, 'https://ip.guide/81.45.12.1')
})
