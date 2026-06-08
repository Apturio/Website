#!/usr/bin/env node
/**
 * SCHEMA-16 — CI JSON-LD validation gate.
 *
 * Globs the prerendered static HTML emitted by `next build`
 * (`.next/server/app/**\/*.html`), extracts every inline
 * `<script type="application/ld+json">` block, and runs three checks:
 *
 *   1. SCHEMA ERRORS  — feeds each node to @adobe/structured-data-validator
 *      (headless, no HTTP, built-in Google Rich Results handlers) and fails on
 *      any result with severity === 'ERROR'.
 *   2. DEAD MARKUP    — recursively asserts NO node has @type 'SearchAction'
 *      and NO key named 'potentialAction' or 'SearchAction' exists at any depth
 *      (Pitfall 3 — Sitelinks Searchbox was discontinued by Google).
 *   3. inLanguage     — asserts every concrete page-type ROOT node (a script's
 *      top-level object carrying an @type other than BreadcrumbList) includes an
 *      `inLanguage` key (Pitfall 7 — hardcoded/missing language).
 *
 * DB-FREE: reads only static .next HTML. No getPayload, no Postgres connection.
 * Runs AFTER a build, decoupled from `payload migrate`.
 *
 * Usage:
 *   node scripts/validate-jsonld.mjs                 # scan .next/server/app
 *   node scripts/validate-jsonld.mjs <path>          # scan a single HTML file/dir
 *   FIXTURE=scripts/fixtures/bad-jsonld.html node scripts/validate-jsonld.mjs
 *
 * Exit code: 1 if any ERROR / SearchAction / potentialAction / missing
 * inLanguage is found, else 0.
 */

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import Validator from '@adobe/structured-data-validator'

const __dirname = dirname(fileURLToPath(import.meta.url))
const WEBSITE_ROOT = resolve(__dirname, '..')

// --- Target resolution (CLI arg or FIXTURE env override, else the real build) ---
const cliTarget = process.argv[2]
const envTarget = process.env.FIXTURE
const DEFAULT_TARGET = join(WEBSITE_ROOT, '.next', 'server', 'app')
const target = resolve(WEBSITE_ROOT, cliTarget || envTarget || DEFAULT_TARGET)

// --- Recursive .html discovery (no extra glob dep) ---
function findHtmlFiles(path) {
  if (!existsSync(path)) return []
  const st = statSync(path)
  if (st.isFile()) return path.endsWith('.html') ? [path] : []
  const out = []
  for (const entry of readdirSync(path)) {
    out.push(...findHtmlFiles(join(path, entry)))
  }
  return out
}

// --- Extract inline JSON-LD script blocks from an HTML string ---
const LDJSON_RE =
  /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi

function extractJsonLd(html) {
  const blocks = []
  let match
  while ((match = LDJSON_RE.exec(html)) !== null) {
    // JSON.parse decodes safeSerialize's < / > / & / ' escapes
    // back to their literal characters automatically — no manual unescaping.
    const raw = match[1].trim()
    if (!raw) continue
    blocks.push(raw)
  }
  return blocks
}

// --- Recursive walk: forbid dead/spam markup ---
// Mirrors the override validate hook (jsonLdOverride.ts) so this gate is a true
// backstop on PRODUCTION HTML, not just at save time:
//   - @type 'SearchAction'                       → discontinued Sitelinks Searchbox.
//   - @type 'AggregateRating' / 'Review' / 'Reviews' → fake-rating bypass that does
//     NOT use the property names aggregateRating/review (SCHEMA-15 / Pitfall manual
//     action). Matched case-insensitively.
//   - property keys potentialAction / SearchAction.
const FORBIDDEN_KEYS = ['potentialAction', 'SearchAction']
const FORBIDDEN_TYPES = ['searchaction', 'aggregaterating', 'review', 'reviews']
function findDeadMarkup(node, trail = '$') {
  const hits = []
  if (Array.isArray(node)) {
    node.forEach((item, i) => hits.push(...findDeadMarkup(item, `${trail}[${i}]`)))
    return hits
  }
  if (node && typeof node === 'object') {
    const type = node['@type']
    const typeList = Array.isArray(type) ? type : [type]
    for (const x of typeList) {
      if (typeof x === 'string' && FORBIDDEN_TYPES.includes(x.toLowerCase())) {
        hits.push(`${trail}: @type '${x}'`)
      }
    }
    for (const key of Object.keys(node)) {
      if (FORBIDDEN_KEYS.includes(key)) {
        hits.push(`${trail}.${key}: forbidden key '${key}'`)
      }
      hits.push(...findDeadMarkup(node[key], `${trail}.${key}`))
    }
  }
  return hits
}

// --- Build the Web-Auto-Extractor-shaped input the Adobe validator expects ---
// { jsonld: { <RootType>: [ ...nodes ] } } — built-in handlers run without schemaOrg JSON.
function toWaeData(roots) {
  const jsonld = {}
  for (const root of roots) {
    const type = root && root['@type']
    const key = Array.isArray(type) ? type[0] : type || 'Thing'
    ;(jsonld[key] ||= []).push(root)
  }
  return { jsonld }
}

async function main() {
  const files = findHtmlFiles(target)

  if (files.length === 0) {
    console.error(`✗ No .html files found under: ${target}`)
    console.error(
      '  (Run `npm run build:next` first, or pass a fixture path / FIXTURE env var.)',
    )
    process.exit(1)
  }

  const validator = new Validator() // headless — built-in Google Rich Results handlers
  const schemaErrors = []
  const deadMarkup = []
  const missingInLanguage = []
  let scriptCount = 0

  for (const file of files) {
    const rel = file.replace(WEBSITE_ROOT + '/', '')
    const html = readFileSync(file, 'utf8')
    const blocks = extractJsonLd(html)

    for (const raw of blocks) {
      let parsed
      try {
        parsed = JSON.parse(raw)
      } catch (e) {
        schemaErrors.push(`${rel}: invalid JSON-LD — ${e.message}`)
        continue
      }
      scriptCount++

      // Each script may hold a single object or an array of root nodes.
      const roots = Array.isArray(parsed) ? parsed : [parsed]

      // Check 3 — inLanguage on every concrete page-type ROOT node (BreadcrumbList exempt).
      for (const root of roots) {
        if (!root || typeof root !== 'object') continue
        const type = root['@type']
        const typeList = Array.isArray(type) ? type : [type]
        if (!type) continue
        if (typeList.length === 1 && typeList[0] === 'BreadcrumbList') continue
        if (!('inLanguage' in root)) {
          missingInLanguage.push(`${rel}: ${typeList.join('/')} missing 'inLanguage'`)
        }
      }

      // Check 2 — dead SearchAction / potentialAction markup (recursive, any depth).
      const dead = findDeadMarkup(parsed)
      for (const hit of dead) deadMarkup.push(`${rel} ${hit}`)

      // Check 1 — schema severity ERROR via the Adobe validator.
      const results = await validator.validate(toWaeData(roots))
      for (const r of results) {
        if (r.severity === 'ERROR') {
          schemaErrors.push(`${rel}: [${r.rootType}] ${r.issueMessage}`)
        }
      }
    }
  }

  // --- Report ---
  console.log(
    `Scanned ${files.length} HTML file(s), ${scriptCount} JSON-LD block(s) under ${target.replace(
      WEBSITE_ROOT + '/',
      '',
    )}`,
  )

  const fail = schemaErrors.length || deadMarkup.length || missingInLanguage.length

  if (schemaErrors.length) {
    console.error(`\n✗ ${schemaErrors.length} schema ERROR(s):`)
    schemaErrors.forEach((e) => console.error('  - ' + e))
  }
  if (deadMarkup.length) {
    console.error(`\n✗ ${deadMarkup.length} dead-markup finding(s) (SearchAction/potentialAction):`)
    deadMarkup.forEach((e) => console.error('  - ' + e))
  }
  if (missingInLanguage.length) {
    console.error(`\n✗ ${missingInLanguage.length} node(s) missing inLanguage:`)
    missingInLanguage.forEach((e) => console.error('  - ' + e))
  }

  if (fail) {
    console.error('\nJSON-LD validation gate: FAIL')
    process.exit(1)
  }

  console.log('\n✓ JSON-LD validation gate: PASS')
  process.exit(0)
}

main().catch((e) => {
  console.error('✗ validate-jsonld.mjs crashed:', e.stack || e.message)
  process.exit(1)
})
