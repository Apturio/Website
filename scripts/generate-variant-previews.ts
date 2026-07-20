import { spawn, type ChildProcess } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium } from 'playwright'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Playwright screenshot pipeline for the 9 select-variant preview images
 * (VARPREV-01..05). Standalone script — does NOT import or share code with
 * Phase 19's `generate-block-previews.ts` (milestone-level decision). Uses
 * temp slugs distinct from Phase 19's block-preview temp slug to avoid the
 * concurrent-cleanup race documented in 20-RESEARCH.md §Pitfall 4.
 *
 * Assembles TWO ephemeral published docs:
 *  (1) a `pages` doc with 2 `heroCentered` blocks (accentColor brand/green)
 *      and 1 `pricing` block with all 3 plan tiers (foundation/engine/growth)
 *  (2) a `posts` doc whose Lexical `content` has 4 `callout` blocks, one per
 *      variant (keyTakeaway/info/success/warning) — shape copied inline from
 *      src/seed.ts's `calloutBlock` helper (not imported).
 *
 * Crops 9 elements into public/variant-previews/{value}.png, then deletes
 * both temp docs and the dev server in a finally block (each step
 * independently guarded, mirroring generate-block-previews.ts).
 *
 * Run: `npm run generate:variant-previews` (→ `payload run
 * scripts/generate-variant-previews.ts`). Requires `website/.env`
 * (DATABASE_URI, PAYLOAD_SECRET). Honors `PORT` env var (defaults 3000) —
 * use a free port, e.g. `PORT=3200 npm run generate:variant-previews`.
 *
 * Idempotent: deletes any pre-existing temp docs (by slug) before creating
 * new ones, so a prior crash never blocks a rerun.
 */

const scriptDir = dirname(fileURLToPath(import.meta.url))
const websiteRoot = join(scriptDir, '..')
const previewsDir = join(websiteRoot, 'public', 'variant-previews')

const PORT = Number(process.env.PORT ?? 3000)
const baseUrl = `http://localhost:${PORT}`

const PAGE_TEMP_SLUG = '__variant-preview-page-temp'
const POST_TEMP_SLUG = '__variant-preview-post-temp'

// ---------------------------------------------------------------------------
// Lexical richText helpers — copied inline from src/seed.ts (NOT imported;
// milestone-level "no shared code between phases" decision applies at the
// data-shape level too).
// ---------------------------------------------------------------------------

const textNode = (text: string) => ({
  type: 'text',
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text,
  version: 1,
})

const paragraph = (text: string) => ({
  type: 'paragraph',
  version: 1,
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  children: [textNode(text)],
})

const richTextRoot = (children: unknown[]) => ({
  root: {
    type: 'root',
    version: 1,
    direction: 'ltr',
    format: '',
    indent: 0,
    children,
  },
})

let blockIdCounter = 0
const blockId = () => `variant-preview-block-${Date.now()}-${blockIdCounter++}`

const calloutBlock = (heading: string, body: string, variant: string) => ({
  type: 'block',
  version: 2,
  format: '',
  fields: {
    id: blockId(),
    blockName: '',
    blockType: 'callout',
    variant,
    heading,
    text: richTextRoot([paragraph(body)]),
  },
})

// ---------------------------------------------------------------------------
// Sample content — proven shapes copied inline from generate-block-previews.ts
// (heroCentered / pricing) and src/seed.ts (calloutBlock), NOT imported.
// ---------------------------------------------------------------------------

type Block = Record<string, unknown>

const heroBrand: Block = {
  blockType: 'heroCentered',
  pillIcon: 'sparkles',
  pillText: 'Done-for-You Service',
  titleStart: 'The service headline goes here,',
  titleAccent: 'expertly built',
  titleEnd: 'and ready to run.',
  accentColor: 'brand',
  subtitle: 'A one-line promise that names the outcome and the pain it removes.',
  ctaPrimaryLabel: 'Get Started',
  ctaPrimaryHref: '#pricing',
  ctaSecondaryIcon: 'phone-call',
  ctaSecondaryLabel: 'Free Strategy Call',
  ctaSecondaryHref: '#strategy',
  micro: [{ text: 'Live in 30 days' }],
}

const heroGreen: Block = {
  blockType: 'heroCentered',
  pillIcon: 'database',
  pillText: 'Unified CRM · The "Cerebro"',
  titleStart: 'Every tool, every contact —',
  titleAccent: 'one brain.',
  titleEnd: '',
  accentColor: 'green',
  subtitle: 'Stop paying for disconnected tools.',
  ctaPrimaryLabel: 'Get Started',
  ctaPrimaryHref: '#pricing',
  ctaSecondaryIcon: 'play',
  ctaSecondaryLabel: 'See the Cerebro',
  ctaSecondaryHref: '#strategy',
  micro: [{ text: 'Real-time data' }],
}

const pricingBlock: Block = {
  blockType: 'pricing',
  heading: 'Simple, transparent pricing',
  subtitle: 'No hidden fees. Cancel anytime.',
  plans: [
    {
      planId: 'foundation',
      name: 'CRM Sales Foundation',
      price: '$199',
      description: 'Essential tools to manage leads and sales.',
      features: [{ feature: 'Self-service setup' }, { feature: 'Core CRM features' }],
      highlighted: false,
      ctaLabel: 'Get Started',
      ctaHref: '/en/checkout/foundation',
    },
    {
      planId: 'engine',
      name: 'AI CRM Sales Engine',
      price: '$299',
      description: 'The done-for-you foundation for automated sales.',
      features: [{ feature: 'All Foundation features' }, { feature: 'Automated Booking' }],
      highlighted: true,
      bonus: '$2,000 Bonus Included',
      ctaLabel: 'Claim My Engine + $2,000 Bonus',
      ctaHref: '/en/checkout/engine',
    },
    {
      planId: 'growth',
      name: 'AI CRM Growth Machine',
      price: '$699',
      description: 'Full-scale engineering at zero upfront cost.',
      features: [{ feature: 'Everything in Sales Engine' }, { feature: 'Advanced automations' }],
      highlighted: false,
      ctaLabel: 'Get My Ready-To-Run Machine',
      ctaHref: '/en/checkout/growth',
    },
  ],
}

const pageLayout: Block[] = [heroBrand, heroGreen, pricingBlock]

const postContent = richTextRoot([
  paragraph('Variant preview generation — temporary post content.'),
  calloutBlock('Key takeaway', 'Responding within five minutes makes you far more likely to qualify the lead.', 'keyTakeaway'),
  calloutBlock('Note', 'This is an informational aside about the process.', 'info'),
  calloutBlock('Success', 'The pipeline now fills itself automatically.', 'success'),
  calloutBlock('Heads up', 'Double-check your CRM sync before going live.', 'warning'),
])

// Crop targets, in generation order.
const CALLOUT_VARIANTS = ['keyTakeaway', 'info', 'success', 'warning'] as const
const PRICING_PLAN_IDS = ['foundation', 'engine', 'growth'] as const

// ---------------------------------------------------------------------------
// Dev-server lifecycle (mirrors generate-block-previews.ts)
// ---------------------------------------------------------------------------

async function waitForReady(url: string, timeoutMs = 60_000): Promise<void> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url)
      if (res.status) return
    } catch {
      /* not ready yet */
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error(`next dev did not become ready within ${timeoutMs}ms`)
}

async function killDevServer(child: ChildProcess): Promise<void> {
  if (!child.pid) return
  try {
    process.kill(-child.pid, 'SIGTERM')
  } catch {
    /* already dead */
  }
  await new Promise((r) => setTimeout(r, 2000))
  try {
    process.kill(-child.pid, 'SIGKILL')
  } catch {
    /* already dead */
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  mkdirSync(previewsDir, { recursive: true })

  // Fail fast if the DB is unreachable, BEFORE spawning next dev.
  const payload = await getPayload({ config })

  // Idempotent recovery: delete any pre-existing temp docs first (crash-safe).
  const existingPages = await payload.find({
    collection: 'pages',
    where: { slug: { equals: PAGE_TEMP_SLUG } },
    locale: 'en',
    depth: 0,
    limit: 10,
    pagination: false,
  })
  for (const doc of existingPages.docs) {
    await payload.delete({ collection: 'pages', id: doc.id })
  }

  const existingPosts = await payload.find({
    collection: 'posts',
    where: { slug: { equals: POST_TEMP_SLUG } },
    locale: 'en',
    depth: 0,
    limit: 10,
    pagination: false,
  })
  for (const doc of existingPosts.docs) {
    await payload.delete({ collection: 'posts', id: doc.id })
  }

  let tempPage: Awaited<ReturnType<typeof payload.create>> | undefined
  let tempPost: Awaited<ReturnType<typeof payload.create>> | undefined
  let devServer: ChildProcess | undefined
  let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined

  try {
    tempPage = await payload.create({
      collection: 'pages',
      locale: 'en',
      data: {
        title: 'Variant Preview Page (temporary — auto-deleted)',
        slug: PAGE_TEMP_SLUG,
        _status: 'published',
        layout: pageLayout,
      } as never,
    })
    console.log(`[generate-variant-previews] temp page id=${tempPage.id} slug=${PAGE_TEMP_SLUG}`)

    tempPost = await payload.create({
      collection: 'posts',
      locale: 'en',
      data: {
        title: 'Variant Preview Post (temporary — auto-deleted)',
        slug: POST_TEMP_SLUG,
        excerpt: 'Temporary post for callout variant preview generation.',
        content: postContent,
        _status: 'published',
        publishedAt: new Date().toISOString(),
      } as never,
    })
    console.log(`[generate-variant-previews] temp post id=${tempPost.id} slug=${POST_TEMP_SLUG}`)

    // Reuse an already-running dev server on PORT if present (warm iteration);
    // otherwise spawn our own and tear it down in finally.
    let serverAlreadyUp = false
    try {
      const probe = await fetch(`${baseUrl}/`)
      if (probe.status) serverAlreadyUp = true
    } catch {
      /* not up — we spawn our own */
    }

    if (!serverAlreadyUp) {
      devServer = spawn('npx', ['next', 'dev', '-p', String(PORT)], {
        cwd: websiteRoot,
        stdio: 'inherit',
        detached: true,
      })
      devServer.on('error', (err) => {
        console.error(`[generate-variant-previews] dev server spawn error: ${err.message}`)
      })
      await waitForReady(`${baseUrl}/`, 300_000)
    } else {
      console.log(`[generate-variant-previews] reusing dev server already listening on ${baseUrl}`)
    }

    browser = await chromium.launch()
    const page = await browser.newPage({ viewport: { width: 800, height: 600 } })

    const failures: string[] = []

    // ---- (1) Pages doc: 2 heroCentered accent crops + 3 pricing plan crops ----
    await page.goto(`${baseUrl}/${PAGE_TEMP_SLUG}`, { waitUntil: 'load', timeout: 300_000 })

    const heroSections = page.locator('main').locator(':scope > *').filter({ has: page.locator('h1') })
    await heroSections.first().waitFor({ state: 'visible', timeout: 30_000 })
    const heroCount = await heroSections.count()
    if (heroCount < 2) {
      throw new Error(`expected at least 2 heroCentered sections under <main>, found ${heroCount}`)
    }

    const heroOrder: Array<{ name: string; accentClass: string }> = [
      { name: 'brand', accentClass: 'accent' },
      { name: 'green', accentClass: 'green' },
    ]
    for (const [i, { name, accentClass }] of heroOrder.entries()) {
      const target = join(previewsDir, `${name}.png`)
      try {
        const section = heroSections.nth(i)
        const h1 = section.locator('h1').first()
        await h1.waitFor({ state: 'visible', timeout: 10_000 })
        // Prefer cropping the accent span itself; fall back to the whole h1.
        const span = h1.locator(`span.${accentClass}`).first()
        const hasSpan = (await span.count()) > 0
        if (hasSpan) {
          await span.screenshot({ path: target, timeout: 12_000, animations: 'disabled' })
        } else {
          await h1.screenshot({ path: target, timeout: 12_000, animations: 'disabled' })
        }
        console.log(`[generate-variant-previews] captured ${name}.png`)
      } catch (err) {
        failures.push(name)
        console.error(`[generate-variant-previews] FAILED ${name}: ${(err as Error).message}`)
      }
    }

    const pricingCards = page.locator('#pricing .grid > div')
    await pricingCards.first().waitFor({ state: 'visible', timeout: 30_000 })
    const pricingCount = await pricingCards.count()
    if (pricingCount !== 3) {
      throw new Error(`expected 3 pricing plan cards, found ${pricingCount}`)
    }
    for (const [i, planId] of PRICING_PLAN_IDS.entries()) {
      const target = join(previewsDir, `${planId}.png`)
      try {
        const card = pricingCards.nth(i)
        await card.scrollIntoViewIfNeeded({ timeout: 5_000 }).catch(() => {})
        await card.screenshot({ path: target, timeout: 12_000, animations: 'disabled' })
        console.log(`[generate-variant-previews] captured ${planId}.png`)
      } catch (err) {
        failures.push(planId)
        console.error(`[generate-variant-previews] FAILED ${planId}: ${(err as Error).message}`)
      }
    }

    // ---- (2) Post doc: 4 callout crops ----
    // Default locale (en) is served UNPREFIXED (routing.localePrefix: 'as-needed'),
    // matching the pages route above — /blog/{slug}, not /en/blog/{slug}.
    await page.goto(`${baseUrl}/blog/${POST_TEMP_SLUG}`, { waitUntil: 'load', timeout: 300_000 })

    const callouts = page.locator('.callout')
    await callouts.first().waitFor({ state: 'visible', timeout: 30_000 })
    const calloutCount = await callouts.count()
    if (calloutCount !== 4) {
      throw new Error(`expected 4 .callout elements, found ${calloutCount}`)
    }
    for (const [i, variant] of CALLOUT_VARIANTS.entries()) {
      const target = join(previewsDir, `${variant}.png`)
      try {
        const el = callouts.nth(i)
        await el.scrollIntoViewIfNeeded({ timeout: 5_000 }).catch(() => {})
        await el.screenshot({ path: target, timeout: 12_000, animations: 'disabled' })
        console.log(`[generate-variant-previews] captured ${variant}.png`)
      } catch (err) {
        failures.push(variant)
        console.error(`[generate-variant-previews] FAILED ${variant}: ${(err as Error).message}`)
      }
    }

    if (failures.length > 0) {
      throw new Error(`failed to capture ${failures.length} preview(s): ${failures.join(', ')}`)
    }
  } finally {
    // Each cleanup step is independently guarded: a failure in one must never
    // skip the others — the dev-server process group must ALWAYS be killed.
    if (browser) {
      await browser.close().catch((e) =>
        console.error(`[generate-variant-previews] failed to close browser: ${(e as Error).message}`),
      )
    }
    if (tempPage) {
      await payload.delete({ collection: 'pages', id: tempPage.id }).catch((e) =>
        console.error(`[generate-variant-previews] failed to delete temp page: ${(e as Error).message}`),
      )
    }
    if (tempPost) {
      await payload.delete({ collection: 'posts', id: tempPost.id }).catch((e) =>
        console.error(`[generate-variant-previews] failed to delete temp post: ${(e as Error).message}`),
      )
    }
    if (devServer) {
      await killDevServer(devServer).catch((e) =>
        console.error(`[generate-variant-previews] failed to kill dev server: ${(e as Error).message}`),
      )
    }
  }

  console.log('[generate-variant-previews] done — 9 PNGs in public/variant-previews/')
}

await main()

if (typeof process !== 'undefined') {
  process.exit(0)
}
