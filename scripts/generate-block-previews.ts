import { spawn, type ChildProcess } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium } from 'playwright'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Playwright screenshot pipeline for the "Add Block" drawer previews
 * (BLOCKPREV-01/03). Assembles an ephemeral draft `pages` document containing
 * all 24 registered blocks (in `src/collections/Pages.ts` order), renders it
 * via `next dev`, screenshots each block by position under <main>, then
 * deletes the temp doc and shuts down the dev server.
 *
 * Sample field shapes are copied from src/seed.ts (8 home blocks) and
 * src/seed-service.ts (16 service blocks) — proven-rendering shapes, not
 * invented. Optional upload/media fields are omitted on purpose (7 blocks
 * have one — bigQuote, featureAccordion, hero, featureZigzag, heroSplit,
 * heroDashboard, tabs); each falls back to its own `placeholder` text/UI.
 *
 * Run: `npm run generate:previews` (→ `payload run scripts/generate-block-previews.ts`,
 * matching the launcher `npm run seed` already uses for `@payload-config` / `@/*`
 * alias resolution). Requires `website/.env` (DATABASE_URI, PAYLOAD_SECRET) to be
 * configured — same as any local dev/seed session.
 *
 * Idempotent (BLOCKPREV-03): deletes any pre-existing `__block-preview-temp`
 * doc before creating a new one, so a prior crash never blocks a rerun.
 */

const scriptDir = dirname(fileURLToPath(import.meta.url))
const websiteRoot = join(scriptDir, '..')
const previewsDir = join(websiteRoot, 'public', 'block-previews')

const PORT = Number(process.env.PORT ?? 3000)
const baseUrl = `http://localhost:${PORT}`
const TEMP_SLUG = '__block-preview-temp'

// ---------------------------------------------------------------------------
// Sample block content — copied from src/seed.ts / src/seed-service.ts shapes.
// Order matches the `blocks:` array in src/collections/Pages.ts exactly.
// ---------------------------------------------------------------------------

type Block = Record<string, unknown>

const sampleBlocks: Block[] = [
  // ---- Home blocks (src/seed.ts) ----
  {
    blockType: 'hero',
    badge: 'AI-Powered Growth',
    title: 'Turn every lead into a booked call — automatically',
    description:
      'Apturio combines an AI Salesman, a Unified CRM, and Automated Booking into one done-for-you sales machine.',
    ctaPrimaryLabel: 'Get Started',
    ctaPrimaryHref: '#pricing',
    ctaSecondaryLabel: 'Free Strategy Call',
    ctaSecondaryHref: '/en/strategy-call',
  },
  {
    blockType: 'logos',
    heading: 'Trusted by innovative companies worldwide',
    logos: [
      { name: 'Sportsmed Academy', src: 'https://vibe.filesafe.space/1775831502235366632/attachments/40dbb601-c692-4abc-b2a9-6b77e3b414ea.png', old: true },
      { name: 'SM Privé', src: 'https://vibe.filesafe.space/1775831502235366632/attachments/112147e9-ed3a-4f3c-92e9-47c6f1c6cf81.png', old: true },
      { name: 'Venxel', src: 'https://vibe.filesafe.space/1775831502235366632/attachments/b5f01474-d965-4589-a2b4-d84fc8860b36.png', old: true },
      { name: 'Forja Group', src: 'https://vibe.filesafe.space/1775831502235366632/attachments/07fed6fa-f329-4106-b0a6-eaa6156111eb.png', old: false },
    ],
    globalOperations: 'Global operations',
    countries: [
      { name: 'Canada', code: 'ca' },
      { name: 'Argentina', code: 'ar' },
      { name: 'Mexico', code: 'mx' },
    ],
  },
  {
    blockType: 'problem',
    heading: "You're not losing to competitors. You're losing to speed.",
    subtitle: 'Every minute of delay hands the deal to whoever answers first.',
    items: [
      { title: 'Slow lead response', description: 'By the time you reply, the lead already booked with someone else.', icon: 'TrendingDown' },
      { title: 'Manual scheduling', description: 'Back-and-forth emails kill momentum and no-show rates climb.', icon: 'Clock' },
      { title: 'Disconnected tools', description: 'Your CRM, calendar, and inbox never talk to each other.', icon: 'Layers' },
    ],
  },
  {
    blockType: 'benefits',
    heading: 'Everything you need to close faster',
    subtitle: 'One engineered system, not a pile of disconnected tools.',
    items: [
      { title: 'Always-on AI Salesman', description: 'Responds and qualifies leads the instant they arrive, 24/7.' },
      { title: 'Automated Booking', description: 'Qualified leads land directly on the right calendar.' },
      { title: 'Unified CRM', description: 'Every contact, deal, and conversation in one hub.' },
    ],
  },
  {
    blockType: 'testimonials',
    heading: 'What our customers say',
    subtitle: 'Real results from real teams.',
    items: [
      { quote: 'The AI books calls while we sleep. Our calendar is full and nobody touches scheduling anymore.', author: 'Venxel Team' },
      { quote: 'They consolidated my entire database of over 5,000 contacts and gave me real insight into my business.', author: 'Bella Bellarda' },
    ],
  },
  {
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
        features: [{ feature: 'All Foundation features' }, { feature: 'AI Conversational Bot' }, { feature: 'Automated Booking' }],
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
  },
  {
    blockType: 'faq',
    heading: 'Frequently asked questions',
    items: [
      { question: 'How fast can we go live?', answer: 'Most teams are live within 30 days of the strategy call.' },
      { question: 'Do I need to change my CRM?', answer: 'No — the Cerebro connects to the tools you already use.' },
    ],
  },
  {
    blockType: 'cta',
    badge: '$2,000 Bonus',
    heading: 'Get the $2,000 setup advantage — done for you',
    body: 'While other platforms sell you a subscription and wish you luck, we build it for you.',
    goal: 'Live in 30 days',
    safety: 'No long-term contracts',
    cancelAnytime: 'Cancel anytime',
  },

  // ---- Wave 2 service blocks (src/seed-service.ts) ----
  {
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
    micro: [{ text: 'Live in 30 days' }, { text: '$2,000 setup waived' }, { text: 'Cancel anytime' }],
  },
  {
    blockType: 'heroSplit',
    pillIcon: 'calendar-check',
    pillText: 'Automated Booking',
    titleStart: 'Fill your calendar',
    titleAccent: 'without the back-and-forth.',
    accentColor: 'brand',
    subtitle:
      "Qualified leads book themselves onto the right rep's calendar — instantly, 24/7, with reminders that kill no-shows.",
    ctaPrimaryLabel: 'Get Started',
    ctaPrimaryHref: '#pricing',
    ctaSecondaryIcon: 'phone-call',
    ctaSecondaryLabel: 'Free Strategy Call',
    ctaSecondaryHref: '#strategy',
    micro: [{ text: 'Calendar & CRM sync' }, { text: 'Smart routing' }, { text: 'Live in 30 days' }],
    placeholder: 'Booking / calendar screenshot',
  },
  {
    blockType: 'heroDashboard',
    pillIcon: 'database',
    pillText: 'Unified CRM · The "Cerebro"',
    titleStart: 'Every tool, every contact —',
    titleAccent: 'one brain.',
    accentColor: 'green',
    subtitle:
      'Stop paying for disconnected tools. The Cerebro unifies your entire stack into one centralized hub with real-time data.',
    ctaPrimaryLabel: 'Get Started',
    ctaPrimaryHref: '#pricing',
    ctaSecondaryIcon: 'play',
    ctaSecondaryLabel: 'See the Cerebro',
    ctaSecondaryHref: '#strategy',
    placeholder: 'CRM dashboard screenshot',
  },
  {
    blockType: 'heroBold',
    pillIcon: 'trending-up',
    pillText: 'Built for scale',
    titleStart: 'Stop managing tools.',
    titleAccent: 'Start managing results.',
    accentColor: 'green',
    subtitle: 'An editorial, statement-led hero for the services that need to feel premium and confident.',
    ctaPrimaryLabel: 'Get Started',
    ctaPrimaryHref: '#pricing',
    ctaSecondaryLabel: 'Free Strategy Call',
    ctaSecondaryHref: '#strategy',
    cards: [
      { icon: 'zap', big: '<5 min', label: 'Lead response, automated' },
      { icon: 'gift', big: '$2,000', label: 'Done-for-you setup, waived', green: true },
      { icon: 'rocket', big: '30 days', label: 'From kickoff to live' },
    ],
  },
  {
    blockType: 'featureGrid',
    eyebrow: 'The ecosystem',
    heading: 'Everything included in this service',
    subtitle: 'Stop managing tools. Start managing results with an integrated, done-for-you build.',
    cards: [
      { icon: 'bot', title: '24/7 AI Salesman', description: 'An intelligent agent that responds and qualifies leads instantly.' },
      { icon: 'database', title: 'Unified CRM', description: 'All customer data in one centralized hub — the Cerebro.' },
      { icon: 'calendar-check', title: 'Automated Booking', description: 'Fill your calendar without manual back-and-forth.' },
      { icon: 'wrench', title: 'Expert Engineering', description: 'Our team handles the heavy lifting so you can sell.' },
      { icon: 'bar-chart-3', title: 'Real-Time Data', description: 'Actionable insight on your pipeline, the moment it changes.' },
      { icon: 'zap', title: 'Speed-to-Lead', description: 'Engineered to respond in under 5 minutes, every time.' },
    ],
  },
  {
    blockType: 'featureZigzag',
    eyebrow: 'How it works',
    heading: 'From qualified to booked, automatically',
    rows: [
      {
        num: '01',
        title: 'The AI qualifies, then offers times',
        description:
          'The moment a lead qualifies, the agent surfaces real-time availability inside the same conversation.',
        bullets: [{ text: 'Real-time calendar availability' }, { text: 'Timezone-aware scheduling' }],
        placeholder: 'Image',
      },
      {
        num: '02',
        title: 'Routed to the right rep',
        description: 'Smart rules assign every meeting by territory, product, or round-robin — no overlaps, no gaps.',
        bullets: [{ text: 'Territory & round-robin routing' }, { text: 'Auto-buffer & limits' }],
        placeholder: 'Image',
      },
    ],
  },
  {
    blockType: 'featureAccordion',
    eyebrow: 'Inside the Cerebro',
    heading: 'One hub for the whole customer journey',
    placeholder: 'CRM screenshot',
    items: [
      {
        icon: 'users',
        title: 'Unified contact records',
        body: 'Every email, message, deal and note for a contact lives in one timeline — no more tab-switching.',
      },
      {
        icon: 'git-merge',
        title: 'Native integrations',
        body: 'Connect email, chat, ads, payments and calendars — the Cerebro keeps them in sync automatically.',
      },
      {
        icon: 'bar-chart-3',
        title: 'Real-time pipeline',
        body: 'Live dashboards show exactly where every deal stands, the moment anything changes.',
      },
      {
        icon: 'workflow',
        title: 'Automations & workflows',
        body: 'Trigger follow-ups, tasks and routing rules without writing a line of code.',
      },
    ],
  },
  {
    blockType: 'steps',
    eyebrow: 'How it works',
    heading: 'From kickoff to live in 30 days',
    items: [
      { title: 'Strategy call', description: 'We map your pipeline, tools, and goals in a free session.' },
      { title: '20-hour build', description: 'Our engineers configure your custom architecture end to end.' },
      { title: 'Go live', description: 'Your machine runs — qualifying, booking, and scaling 24/7.' },
    ],
  },
  {
    blockType: 'timeline',
    eyebrow: 'Migration, handled',
    heading: "We move you in — you don't lift a finger",
    items: [
      {
        icon: 'search',
        tag: 'Audit',
        title: 'We map your current stack',
        description: 'Every tool, field and workflow you use today, documented.',
      },
      {
        icon: 'database',
        tag: 'Migrate',
        title: 'Clean import into the Cerebro',
        description: 'Contacts, history and automations move over — deduped and structured.',
      },
      {
        icon: 'check',
        tag: 'Live',
        title: 'One hub, fully running',
        description: 'Your team works from a single source of truth from day one.',
      },
    ],
  },
  {
    blockType: 'tabs',
    eyebrow: 'How it works',
    heading: 'One platform, every stage covered',
    tabs: [
      {
        icon: 'zap',
        label: 'Capture',
        title: 'Capture every lead',
        description: 'Forms, ads, DMs and chat all flow into one unified inbox.',
        bullets: [{ text: 'Omnichannel intake' }, { text: 'Zero leads lost' }],
        placeholder: 'Screenshot',
      },
      {
        icon: 'filter',
        label: 'Qualify',
        title: 'Qualify with AI',
        description: 'The agent asks the right questions and scores fit automatically.',
        bullets: [{ text: 'Custom qualification logic' }],
        placeholder: 'Screenshot',
      },
      {
        icon: 'calendar-check',
        label: 'Book',
        title: 'Book automatically',
        description: 'Hot leads schedule themselves onto your calendar in seconds.',
        bullets: [{ text: 'Calendar sync' }],
        placeholder: 'Screenshot',
      },
    ],
  },
  {
    blockType: 'metrics',
    items: [
      { value: '0', green: true, label: 'Manual scheduling emails' },
      { value: '24/7', label: 'Booking availability' },
      { value: '<5 min', green: true, label: 'Lead to booked call' },
      { value: '−40%', label: 'Fewer no-shows' },
    ],
  },
  {
    blockType: 'bigQuote',
    glowTop: true,
    quote:
      'The AI books calls while we sleep. Our calendar is full and nobody on the team touches scheduling anymore.',
    authorName: 'Venxel Team',
    authorRole: 'Agency Partner',
  },
  {
    blockType: 'miniPricing',
    eyebrow: 'Pricing',
    heading: 'Simple, transparent pricing',
    subtitle: 'No hidden fees. Cancel anytime.',
    single: false,
    plans: [
      {
        name: 'CRM Sales Foundation',
        sub: 'Essential tools to manage leads and sales.',
        price: '$199',
        period: '/mo',
        featured: false,
        features: [{ text: 'Self-service setup' }, { text: 'Core CRM features' }],
        ctaLabel: 'Get Started',
        ctaHref: '#strategy',
      },
      {
        name: 'AI CRM Sales Engine',
        sub: 'The done-for-you foundation for automated sales.',
        price: '$299',
        period: '/mo',
        featured: true,
        bonusTag: '$2,000 Bonus Included',
        features: [{ text: 'All Foundation features' }, { text: 'AI Conversational Bot' }, { text: 'FREE $2,000 Setup', hot: true }],
        ctaLabel: 'Claim My Engine + $2,000 Bonus',
        ctaHref: '#strategy',
      },
      {
        name: 'AI CRM Growth Machine',
        sub: 'Full-scale engineering at zero upfront cost.',
        price: '$699',
        period: '/mo',
        featured: false,
        features: [{ text: 'Everything in Sales Engine' }, { text: '$2,000 setup waived' }],
        ctaLabel: 'Get My Ready-To-Run Machine',
        ctaHref: '#strategy',
      },
    ],
  },
  {
    blockType: 'strategyForm',
    eyebrow: 'Free Strategy Call',
    heading: 'Book your free strategy call',
    body: 'Tell us where you are. An Apturio engineer will map your turnkey setup — no commitment.',
    bullets: [
      { text: '30-minute working session' },
      { text: 'Custom architecture map' },
      { text: '$2,000 setup bonus eligibility' },
    ],
    labels: {
      name: 'Full name',
      namePlaceholder: 'Jane Founder',
      company: 'Company',
      companyPlaceholder: 'Acme Inc.',
      email: 'Work email',
      emailPlaceholder: 'you@company.com',
      leads: 'Monthly leads',
      submit: 'Request my call',
      fine: 'No commitment · We reply within 1 business day.',
      success: "Thanks — we'll be in touch within 1 business day.",
    },
    leadOptions: [{ text: 'Under 100' }, { text: '100–500' }, { text: '500–2,000' }, { text: '2,000+' }],
  },
  {
    blockType: 'stickyCta',
    title: 'Ready to run your sales machine?',
    subtitle: '$2,000 setup bonus included',
    ctaLabel: 'Claim My Engine',
    ctaHref: '#strategy',
  },
  {
    blockType: 'bonusBanner',
    pillText: '$2,000 Setup Bonus Included',
    heading: 'Get your machine built — free $2,000 setup',
    body: '20 hours of senior engineering, included. Live in 30 days. Capped at 5 Elite builds per month.',
    ctaPrimaryLabel: 'Claim My Engine + $2,000 Bonus',
    ctaPrimaryHref: '#strategy',
    ctaSecondaryLabel: 'Free Strategy Call',
    ctaSecondaryHref: '#strategy',
    fine: 'Setup subject to client cooperation. Cancel anytime.',
  },
]

const blockOrder: string[] = sampleBlocks.map((b) => b.blockType as string)

const EXPECTED_COUNT = 24
if (blockOrder.length !== EXPECTED_COUNT) {
  throw new Error(`expected ${EXPECTED_COUNT} sample blocks, built ${blockOrder.length}`)
}

// ---------------------------------------------------------------------------
// Dev-server lifecycle
// ---------------------------------------------------------------------------

async function waitForReady(url: string, timeoutMs = 60_000): Promise<void> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url)
      if (res.status) return // any HTTP response = server is up
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

  // Idempotent recovery: delete any pre-existing temp doc first (crash-safe).
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: TEMP_SLUG } },
    locale: 'en',
    depth: 0,
    limit: 10,
    pagination: false,
  })
  for (const doc of existing.docs) {
    await payload.delete({ collection: 'pages', id: doc.id })
  }

  const tempPage = await payload.create({
    collection: 'pages',
    locale: 'en',
    data: {
      title: 'Block Preview (temporary — auto-deleted)',
      slug: TEMP_SLUG,
      _status: 'draft',
      layout: sampleBlocks,
    } as never,
  })

  let devServer: ChildProcess | undefined
  let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined

  try {
    devServer = spawn('npx', ['next', 'dev', '-p', String(PORT)], {
      cwd: websiteRoot,
      stdio: 'inherit',
      detached: true,
    })

    await waitForReady(`${baseUrl}/en`)

    browser = await chromium.launch()
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
    await page.goto(`${baseUrl}/en/${TEMP_SLUG}?draft=true`, { waitUntil: 'networkidle' })

    const blockEls = page.locator('main').locator(':scope > *')
    const count = await blockEls.count()
    console.log(`[generate-block-previews] found ${count} direct children of <main>`)

    for (const [i, slug] of blockOrder.entries()) {
      const target = join(previewsDir, `${slug}.png`)
      await blockEls.nth(i).screenshot({ path: target })
      console.log(`[generate-block-previews] captured ${slug}.png (${i + 1}/${blockOrder.length})`)
    }
  } finally {
    if (browser) await browser.close()
    await payload.delete({ collection: 'pages', id: tempPage.id })
    if (devServer) await killDevServer(devServer)
  }

  console.log(`[generate-block-previews] done — ${blockOrder.length} PNGs in public/block-previews/`)
}

await main()

if (typeof process !== 'undefined') {
  process.exit(0)
}
