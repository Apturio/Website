#!/usr/bin/env node
/**
 * Side-by-side diff of two snapshots made by scripts/seo-metrics.mjs.
 *
 *   node scripts/seo-compare.mjs <before-label> <after-label>
 */
import { readFileSync } from 'node:fs'

const [beforeLabel, afterLabel] = process.argv.slice(2)
if (!beforeLabel || !afterLabel) {
  console.error('usage: node scripts/seo-compare.mjs <before-label> <after-label>')
  process.exit(1)
}
const load = (l) => JSON.parse(readFileSync(`seo-audit/${l}/metrics.json`, 'utf8'))
const a = load(beforeLabel)
const b = load(afterLabel)

const arrow = (x, y, lowerIsBetter = true) => {
  if (x == null || y == null || x === y) return '  ='
  const better = lowerIsBetter ? y < x : y > x
  return better ? ' ✔' : ' ✘'
}
const row = (name, x, y, lowerIsBetter = true) =>
  console.log(`${name.padEnd(46)} ${String(x ?? '-').padStart(10)} → ${String(y ?? '-').padEnd(10)}${arrow(x, y, lowerIsBetter)}`)

console.log(`\n${beforeLabel}  →  ${afterLabel}\n`)

console.log('SITEMAP')
row('urls', a.sitemap.urlCount, b.sitemap.urlCount, false)
row('distinct lastmod values', a.sitemap.lastmodDistinct, b.sitemap.lastmodDistinct, false)
row('lastmod within 2h of now', a.sitemap.lastmodWithin2hOfNow, b.sitemap.lastmodWithin2hOfNow)
row('entries with <priority>', a.sitemap.withPriority, b.sitemap.withPriority)
row('entries with <changefreq>', a.sitemap.withChangefreq, b.sitemap.withChangefreq)

console.log('\nHEADERS')
for (const k of Object.keys({ ...a.headers, ...b.headers })) {
  const x = a.headers[k] ?? null
  const y = b.headers[k] ?? null
  if (x !== y) console.log(`${k.padEnd(30)} ${String(x)} → ${String(y)}`)
}

console.log('\nPAGES (hreflang / head / size)')
const byPath = (d) => Object.fromEntries(d.pages.map((p) => [p.path, p]))
const pa = byPath(a)
const pb = byPath(b)
for (const path of Object.keys(pb)) {
  const x = pa[path]
  const y = pb[path]
  if (!x || !y || y.error || x.error) continue
  const brokenX = x.hreflangBrokenInHtml.length + x.hreflangBrokenInLinkHeader.length
  const brokenY = y.hreflangBrokenInHtml.length + y.hreflangBrokenInLinkHeader.length
  console.log(
    `${path.padEnd(46)} broken hreflang ${brokenX}→${brokenY}${arrow(brokenX, brokenY)}  ` +
      `html ${Math.round(x.htmlBytes / 1024)}→${Math.round(y.htmlBytes / 1024)} KB${arrow(x.htmlBytes, y.htmlBytes)}  ` +
      `jsonld ${x.jsonLdBlocks}→${y.jsonLdBlocks}  h1 ${x.h1Count}→${y.h1Count}`,
  )
}

console.log('\nLIGHTHOUSE (median)')
const key = (l) => `${l.path} ${l.formFactor}`
const la = Object.fromEntries(a.lighthouse.filter((l) => !l.error).map((l) => [key(l), l]))
for (const l of b.lighthouse.filter((l) => !l.error)) {
  const x = la[key(l)]
  if (!x) continue
  console.log(`\n${key(l)}`)
  row('  performance score', x.score, l.score, false)
  row('  LCP (ms)', x.lcpMs, l.lcpMs)
  row('  TBT (ms)', x.tbtMs, l.tbtMs)
  row('  CLS', x.cls, l.cls)
  row('  TTFB (ms)', x.ttfbMs, l.ttfbMs)
  row('  transfer (KiB)', x.transferKiB, l.transferKiB)
  row('  unused JS (KiB)', x.unusedJsKiB, l.unusedJsKiB)
}
console.log('\nLab noise is about ±10 score points: treat small moves as unchanged.\n')
