import assert from 'node:assert/strict'
import { existsSync, statSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

/**
 * Phase gate for BLOCKPREV-01/02: proves every block registered in the
 * page-builder "Add Block" drawer has (a) a generated PNG on disk and
 * (b) imageURL/imageAltText wired on its Block config. Fails until 19-02
 * (PNGs) and 19-03 (config wiring) are complete.
 *
 * The block configs use extensionless / `@/` alias imports that raw Node's
 * ESM loader cannot resolve, so this script reads the config SOURCE files
 * textually instead of importing them. The list below mirrors the `blocks:`
 * array in src/collections/Pages.ts (24 blocks). Callout and InlineCTABanner
 * are intentionally excluded — they are not registered in the page builder.
 */

const scriptDir = dirname(fileURLToPath(import.meta.url))
const srcBlocks = join(scriptDir, '..', 'src', 'blocks')
const previewsDir = join(scriptDir, '..', 'public', 'block-previews')

const CONFIG_FILES = [
  'HeroBlock/config.ts',
  'LogosBlock/config.ts',
  'ProblemBlock/config.ts',
  'BenefitsBlock/config.ts',
  'TestimonialsBlock/config.ts',
  'PricingBlock/config.ts',
  'FaqBlock/config.ts',
  'CtaBlock/config.ts',
  'HeroCenteredBlock/config.ts',
  'HeroSplitBlock/config.ts',
  'HeroDashboardBlock/config.ts',
  'HeroBoldBlock/config.ts',
  'FeatureGridBlock/config.ts',
  'FeatureZigzagBlock/config.ts',
  'FeatureAccordionBlock/config.ts',
  'StepsBlock/config.ts',
  'TimelineBlock/config.ts',
  'TabsBlock/config.ts',
  'MetricsBlock/config.ts',
  'BigQuoteBlock/config.ts',
  'MiniPricingBlock/config.ts',
  'StrategyFormBlock/config.ts',
  'StickyCtaBlock/config.ts',
  'BonusBannerBlock/config.ts',
]

const EXPECTED_COUNT = 24
assert.equal(
  CONFIG_FILES.length,
  EXPECTED_COUNT,
  `expected ${EXPECTED_COUNT} registered block configs, listed ${CONFIG_FILES.length}`,
)

let checked = 0

for (const rel of CONFIG_FILES) {
  const configPath = join(srcBlocks, rel)
  assert.ok(existsSync(configPath), `block config not found: src/blocks/${rel}`)

  const source = readFileSync(configPath, 'utf8')

  const slugMatch = source.match(/slug:\s*['"]([^'"]+)['"]/)
  assert.ok(slugMatch, `could not read slug from src/blocks/${rel}`)
  const slug = slugMatch![1]

  // (a) generated PNG exists and is non-empty
  const pngPath = join(previewsDir, `${slug}.png`)
  assert.ok(
    existsSync(pngPath),
    `missing preview PNG for block '${slug}' (expected public/block-previews/${slug}.png)`,
  )
  assert.ok(
    statSync(pngPath).size > 0,
    `preview PNG for block '${slug}' is empty (0 bytes)`,
  )

  // (b) imageURL wired to the generated path
  assert.ok(
    source.includes(`imageURL: '/block-previews/${slug}.png'`) ||
      source.includes(`imageURL: "/block-previews/${slug}.png"`),
    `block '${slug}' must set imageURL to /block-previews/${slug}.png in src/blocks/${rel}`,
  )

  // (b) non-empty imageAltText wired
  const altMatch = source.match(/imageAltText:\s*['"]([^'"]+)['"]/)
  assert.ok(
    altMatch && altMatch[1].trim().length > 0,
    `block '${slug}' must set a non-empty imageAltText in src/blocks/${rel}`,
  )

  checked += 1
}

console.log(`block previews OK: ${checked}/${EXPECTED_COUNT}`)
