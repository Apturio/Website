#!/usr/bin/env node
/**
 * SEO + performance snapshot for apturio.com. Run it before and after a change
 * and diff the two JSON files (see seo-audit/README.md).
 *
 *   node scripts/seo-metrics.mjs <label> [--site https://apturio.com] [--skip-lighthouse] [--runs 3]
 *
 * Output: seo-audit/<label>/metrics.json
 *
 * Page checks use a Googlebot user agent so the IP-based language redirect on
 * `/` never skews the results. Lighthouse runs the stock Chrome UA, the same
 * way the 2026-10-13 baseline was captured.
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const args = process.argv.slice(2)
const label = args.find((a) => !a.startsWith('--'))
if (!label) {
  console.error('usage: node scripts/seo-metrics.mjs <label> [--site URL] [--skip-lighthouse]')
  process.exit(1)
}
const siteIdx = args.indexOf('--site')
const SITE = (siteIdx >= 0 ? args[siteIdx + 1] : 'https://apturio.com').replace(/\/$/, '')
const SKIP_LH = args.includes('--skip-lighthouse')
const runsIdx = args.indexOf('--runs')
// Lab runs are noisy (a single run moved the home mobile score from 46 to 86 on the same
// build), so every Lighthouse number is the median of several runs.
const RUNS = runsIdx >= 0 ? Math.max(1, Number(args[runsIdx + 1])) : 3
const UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'

const PAGES = [
  '/es',
  '/precios',
  '/es/precios',
  '/chatbot-whatsapp',
  '/es/chatbot-whatsapp',
  '/pay-per-use',
  '/unified-crm',
  '/es/crm-unificado',
  '/es/crm-para-clinicas',
  '/es/crm-para-esteticas',
  '/blog/speed-to-lead-wins-deals',
  '/es/blog/velocidad-de-respuesta-gana-ventas',
  '/es/blog/alternativas-a-kommo',
  '/es/blog/mejores-crm-venezuela',
  '/es/blog/reducir-no-shows-chatbot',
  '/es/blog/category/estrategia-de-crecimiento',
]
const LIGHTHOUSE_PAGES = ['/es', '/precios', '/chatbot-whatsapp', '/es/blog/alternativas-a-kommo']

const get = (url, init = {}) =>
  fetch(url, { redirect: 'manual', headers: { 'user-agent': UA }, ...init })

const status = async (url) => {
  try {
    return (await get(url)).status
  } catch {
    return 0
  }
}

async function pageCheck(path) {
  const url = SITE + path
  const res = await get(url, { redirect: 'follow' })
  const html = await res.text()
  const tags = (re) => [...html.matchAll(re)].map((m) => m[0])
  const hreflangTags = tags(/<link[^>]*hreflang[^>]*>/gi)
  const hrefs = hreflangTags
    .map((t) => /href="([^"]+)"/i.exec(t)?.[1])
    .filter(Boolean)
  const linkHeader = res.headers.get('link') ?? ''
  const headerTargets = [...linkHeader.matchAll(/<([^>]+)>;\s*rel="alternate";\s*hreflang="([^"]+)"/g)].map(
    (m) => ({ href: m[1], hreflang: m[2] }),
  )
  const headerBroken = []
  for (const t of headerTargets) {
    const s = await status(t.href)
    if (s >= 400 || s === 0) headerBroken.push({ ...t, status: s })
  }
  const htmlBroken = []
  for (const href of new Set(hrefs)) {
    const s = await status(href)
    if (s >= 400 || s === 0) htmlBroken.push({ href, status: s })
  }
  const jsonLd = tags(/<script[^>]*application\/ld\+json[^>]*>[\s\S]*?<\/script>/gi)
  const metaDesc = /<meta[^>]*name="description"[^>]*content="([^"]*)"/i.exec(html)?.[1] ?? null
  const h1s = (html.match(/<h1[\s>]/gi) ?? []).length
  const text = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')
  const jsonLdTypes = new Set()
  for (const block of jsonLd) {
    for (const m of block.matchAll(/"@type"\s*:\s*"([^"]+)"/g)) jsonLdTypes.add(m[1])
  }
  return {
    path,
    status: res.status,
    htmlBytes: Buffer.byteLength(html),
    words: text.split(/\s+/).filter(Boolean).length,
    h1Count: h1s,
    canonical: /<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i.exec(html)?.[1] ?? null,
    metaDescription: metaDesc,
    hreflangInHtml: hreflangTags.length,
    hreflangBrokenInHtml: htmlBroken,
    hreflangInLinkHeader: headerTargets.length,
    hreflangBrokenInLinkHeader: headerBroken,
    jsonLdBlocks: jsonLd.length,
    jsonLdTypes: [...jsonLdTypes].sort(),
    cacheControl: res.headers.get('cache-control'),
    contentEncoding: res.headers.get('content-encoding'),
  }
}

async function sitemapCheck() {
  const res = await get(`${SITE}/sitemap.xml`)
  const xml = await res.text()
  const urls = [...xml.matchAll(/<url>[\s\S]*?<\/url>/g)].map((m) => m[0])
  const lastmods = urls.map((u) => /<lastmod>([^<]+)<\/lastmod>/.exec(u)?.[1]).filter(Boolean)
  const now = Date.now()
  const nowLike = lastmods.filter((d) => Math.abs(now - Date.parse(d)) < 2 * 60 * 60 * 1000).length
  return {
    status: res.status,
    contentType: res.headers.get('content-type'),
    urlCount: urls.length,
    withPriority: urls.filter((u) => u.includes('<priority>')).length,
    withChangefreq: urls.filter((u) => u.includes('<changefreq>')).length,
    lastmodDistinct: new Set(lastmods).size,
    lastmodWithin2hOfNow: nowLike,
    hasXmlStylesheet: xml.includes('<?xml-stylesheet'),
    locs: urls.map((u) => /<loc>([^<]+)<\/loc>/.exec(u)?.[1]),
  }
}

function lighthouseOnce(path, formFactor) {
  const out = join(tmpdir(), `lh-${Date.now()}-${Math.random().toString(36).slice(2)}.json`)
  const flags = [
    `${SITE}${path}`,
    '--output=json',
    `--output-path=${out}`,
    '--only-categories=performance',
    '--quiet',
    '--chrome-flags=--headless=new --no-sandbox',
  ]
  if (formFactor === 'desktop') flags.push('--preset=desktop')
  execFileSync('lighthouse', flags, { stdio: 'ignore', timeout: 240_000 })
  const d = JSON.parse(readFileSync(out, 'utf8'))
  rmSync(out, { force: true })
  const a = d.audits
  const n = (id) => (a[id]?.numericValue != null ? Math.round(a[id].numericValue * 1000) / 1000 : null)
  return {
    path,
    formFactor,
    finalUrl: d.finalUrl,
    score: Math.round(d.categories.performance.score * 100),
    fcpMs: Math.round(n('first-contentful-paint')),
    lcpMs: Math.round(n('largest-contentful-paint')),
    tbtMs: Math.round(n('total-blocking-time')),
    cls: Math.round(n('cumulative-layout-shift') * 1000) / 1000,
    speedIndexMs: Math.round(n('speed-index')),
    ttfbMs: Math.round(n('server-response-time')),
    transferKiB: Math.round((n('total-byte-weight') ?? 0) / 1024),
    unusedJsKiB: Math.round((a['unused-javascript']?.details?.overallSavingsBytes ?? 0) / 1024),
    lighthouseVersion: d.lighthouseVersion,
  }
}

const median = (xs) => {
  const v = [...xs].sort((a, b) => a - b)
  return v[Math.floor(v.length / 2)]
}

function lighthouse(path, formFactor) {
  const runs = Array.from({ length: RUNS }, () => lighthouseOnce(path, formFactor))
  const pick = (k) => median(runs.map((r) => r[k]))
  return {
    ...runs[0],
    runs: RUNS,
    score: pick('score'),
    fcpMs: pick('fcpMs'),
    lcpMs: pick('lcpMs'),
    tbtMs: pick('tbtMs'),
    cls: pick('cls'),
    speedIndexMs: pick('speedIndexMs'),
    ttfbMs: pick('ttfbMs'),
    scoreRange: [Math.min(...runs.map((r) => r.score)), Math.max(...runs.map((r) => r.score))],
  }
}

const result = {
  label,
  site: SITE,
  capturedAt: new Date().toISOString(),
  notes:
    `Lighthouse values are the median of ${RUNS} lab run(s) with simulated throttling. Run-to-run noise is still +/- 10 score points; compare trends, not single numbers.`,
  headers: {},
  sitemap: await sitemapCheck(),
  pages: [],
  lighthouse: [],
}

const home = await get(`${SITE}/`)
for (const h of [
  'strict-transport-security',
  'x-content-type-options',
  'x-frame-options',
  'referrer-policy',
  'permissions-policy',
  'content-security-policy',
  'x-powered-by',
  'x-middleware-rewrite',
]) {
  result.headers[h] = home.headers.get(h)
}

for (const p of PAGES) {
  try {
    result.pages.push(await pageCheck(p))
  } catch (e) {
    result.pages.push({ path: p, error: String(e) })
  }
}

if (!SKIP_LH) {
  for (const p of LIGHTHOUSE_PAGES) {
    for (const ff of ['mobile', 'desktop']) {
      try {
        result.lighthouse.push(lighthouse(p, ff))
      } catch (e) {
        result.lighthouse.push({ path: p, formFactor: ff, error: String(e) })
      }
    }
  }
}

const dir = join('seo-audit', label)
mkdirSync(dir, { recursive: true })
writeFileSync(join(dir, 'metrics.json'), JSON.stringify(result, null, 2) + '\n')
console.log(`wrote ${join(dir, 'metrics.json')}`)
