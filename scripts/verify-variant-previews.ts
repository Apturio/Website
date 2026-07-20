import assert from 'node:assert/strict'
import { existsSync, statSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

/**
 * Phase gate for VARPREV-01..05: proves the 3 existing variant selects
 * (PricingBlock.planId, heroFields.accentColor, Callout.variant) are wired
 * through `selectVariantField` and that their pre-existing `admin.description`
 * help text was preserved, plus that all 9 preview PNGs exist on disk.
 *
 * The block/field configs use `@/` alias imports raw Node's ESM loader
 * cannot resolve, so this script reads the config SOURCE files textually
 * instead of importing them — same pattern as verify-block-previews.ts.
 *
 * The PNG assertions are EXPECTED to fail until 20-02 generates them; the
 * wiring + help-text assertions must pass as soon as this plan (20-01) lands.
 */

const scriptDir = dirname(fileURLToPath(import.meta.url))
const srcDir = join(scriptDir, '..', 'src')
const previewsDir = join(scriptDir, '..', 'public', 'variant-previews')

const CONFIG_FILES = [
  'blocks/PricingBlock/config.ts',
  'blocks/_shared/heroFields.ts',
  'blocks/Callout.ts',
]

// Ordered source of truth for the 9 preview values across the 3 selects.
const PREVIEW_VALUES = [
  'brand',
  'green',
  'keyTakeaway',
  'info',
  'success',
  'warning',
  'foundation',
  'engine',
  'growth',
]

const EXPECTED_COUNT = 9
assert.equal(
  PREVIEW_VALUES.length,
  EXPECTED_COUNT,
  `expected ${EXPECTED_COUNT} preview values, listed ${PREVIEW_VALUES.length}`,
)

// (1) all 3 config files call selectVariantField(
for (const rel of CONFIG_FILES) {
  const configPath = join(srcDir, rel)
  assert.ok(existsSync(configPath), `config not found: src/${rel}`)

  const source = readFileSync(configPath, 'utf8')

  assert.ok(
    source.includes('selectVariantField('),
    `src/${rel} must call selectVariantField(`,
  )
}

// (2) help text preserved on Callout.variant and PricingBlock.planId
const calloutSource = readFileSync(join(srcDir, 'blocks/Callout.ts'), 'utf8')
assert.ok(
  calloutSource.includes('Visual style of the callout box.'),
  'Callout.ts must preserve the original admin.description for variant',
)

const pricingSource = readFileSync(
  join(srcDir, 'blocks/PricingBlock/config.ts'),
  'utf8',
)
assert.ok(
  pricingSource.includes(
    'Drives the per-tier styling (engine = highlighted center card).',
  ),
  'PricingBlock/config.ts must preserve the original admin.description for planId',
)

// (3) 9 non-empty PNGs on disk (expected to fail until 20-02)
let pngsFound = 0
for (const value of PREVIEW_VALUES) {
  const pngPath = join(previewsDir, `${value}.png`)
  assert.ok(
    existsSync(pngPath),
    `missing preview PNG for '${value}' (expected public/variant-previews/${value}.png)`,
  )
  assert.ok(
    statSync(pngPath).size > 0,
    `preview PNG for '${value}' is empty (0 bytes)`,
  )
  pngsFound += 1
}

console.log(`variant previews OK: ${pngsFound}/${EXPECTED_COUNT}`)
