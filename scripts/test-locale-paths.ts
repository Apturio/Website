// Run: node --test scripts/test-locale-paths.ts
// English is unprefixed; Spanish lives under /es. Guards the URL helpers every
// canonical, hreflang, sitemap entry and internal link is built from.
import test from 'node:test'
import assert from 'node:assert/strict'

import { localePath, localePrefix, localeUrl } from '../src/lib/site.ts'

test('localePrefix', () => {
  assert.equal(localePrefix('en'), '')
  assert.equal(localePrefix('es'), '/es')
})

test('localePath: English unprefixed, Spanish under /es', () => {
  assert.equal(localePath('en'), '/')
  assert.equal(localePath('en', '/'), '/')
  assert.equal(localePath('en', '/blog'), '/blog')
  assert.equal(localePath('en', 'blog'), '/blog')
  assert.equal(localePath('en', '/blog/category/ai'), '/blog/category/ai')
  assert.equal(localePath('en', '#pricing'), '/#pricing')
  assert.equal(localePath('es'), '/es')
  assert.equal(localePath('es', '/blog'), '/es/blog')
  assert.equal(localePath('es', '#pricing'), '/es#pricing')
})

test('localeUrl: absolute URLs never contain /en/ or double slashes', () => {
  assert.equal(localeUrl('en'), 'https://apturio.com/')
  assert.equal(localeUrl('en', '/pay-per-use'), 'https://apturio.com/pay-per-use')
  assert.equal(localeUrl('es'), 'https://apturio.com/es')
  assert.equal(localeUrl('es', '/pay-per-use'), 'https://apturio.com/es/pay-per-use')
  for (const l of ['en', 'es']) {
    for (const p of ['', '/', '/a', '/a/b']) {
      const u = localeUrl(l, p)
      assert.ok(!/\/en(\/|$)/.test(u), u)
      assert.ok(!u.slice(8).includes('//'), u)
    }
  }
})

test('cleanHref: strips legacy /en, leaves everything else alone', async () => {
  const { cleanHref } = await import('../src/lib/site.ts')
  assert.equal(cleanHref('/en/checkout/foundation'), '/checkout/foundation')
  assert.equal(cleanHref('/en'), '/')
  assert.equal(cleanHref('/en#pricing'), '/#pricing')
  assert.equal(cleanHref('/en?x=1'), '/?x=1')
  assert.equal(cleanHref('/es/checkout/foundation'), '/es/checkout/foundation')
  assert.equal(cleanHref('/engine'), '/engine')
  assert.equal(cleanHref('/enterprise/x'), '/enterprise/x')
  assert.equal(cleanHref('https://example.com/en/x'), 'https://example.com/en/x')
  assert.equal(cleanHref('#strategy'), '#strategy')
})
