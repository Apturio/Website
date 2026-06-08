import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { getPayload } from 'payload'
import config from '@payload-config'

import { slugify } from '@/lib/slugify'
import { seedServicePages } from '@/seed-service'

// ---------- Home page block layout (seeded from messages/*.json) ----------

const seedDir = path.dirname(fileURLToPath(import.meta.url))

type Messages = Record<string, any>

const loadMessages = (lang: string): Messages =>
  JSON.parse(fs.readFileSync(path.resolve(seedDir, `../messages/${lang}.json`), 'utf-8'))

const HOME_LOGOS = [
  { name: 'Sportsmed Academy', src: 'https://vibe.filesafe.space/1775831502235366632/attachments/40dbb601-c692-4abc-b2a9-6b77e3b414ea.png', old: true },
  { name: 'SM Privé', src: 'https://vibe.filesafe.space/1775831502235366632/attachments/112147e9-ed3a-4f3c-92e9-47c6f1c6cf81.png', old: true },
  { name: 'Venxel', src: 'https://vibe.filesafe.space/1775831502235366632/attachments/b5f01474-d965-4589-a2b4-d84fc8860b36.png', old: true },
  { name: 'En Otro Idioma', src: 'https://vibe.filesafe.space/1775831502235366632/attachments/6139c761-d36d-4240-8a90-ccec4045bec9.png', old: true },
  { name: 'Aprendo SEO', src: 'https://vibe.filesafe.space/1775831502235366632/attachments/7d0ff8ad-4917-46be-b2a4-501c8f5b0c9b.png', old: true },
  { name: 'Forja Group', src: 'https://vibe.filesafe.space/1775831502235366632/attachments/07fed6fa-f329-4106-b0a6-eaa6156111eb.png', old: false },
  { name: 'New Cargo Express', src: 'https://vibe.filesafe.space/1775831502235366632/attachments/2f4d42da-e799-4211-ae7e-7d72ed9b95e4.png', old: false },
  { name: 'Dharma Health', src: 'https://vibe.filesafe.space/1775831502235366632/attachments/b59b13fc-6550-45b1-8e9a-4ae25904dcf7.png', old: false },
]

const PROBLEM_ICONS = ['TrendingDown', 'Clock', 'Layers', 'Bot', 'Settings', 'Activity']
const COUNTRY_CODES = ['ca', 'ar', 'mx', 'es', 've']

/** Build the 8-block home layout from a locale's message bundle. */
const buildHomeLayout = (lang: string, m: Messages): Record<string, unknown>[] => {
  const secondaryHref = lang === 'es' ? 'https://wa.me/15614731298' : `/${lang}/strategy-call`
  const planPrice: Record<string, string> = { foundation: '$199', engine: '$299', growth: '$699' }

  const plan = (planId: 'foundation' | 'engine' | 'growth') => {
    const p = m.pricing.plans[planId]
    return {
      planId,
      name: p.name,
      price: planPrice[planId],
      description: p.description,
      features: (p.features as string[]).map((feature) => ({ feature })),
      highlighted: planId === 'engine',
      bonus: planId === 'engine' ? m.pricing.bonus : undefined,
      ctaLabel: p.cta,
      ctaHref: `/${lang}/checkout/${planId}`,
      subText: p.subText ?? undefined,
    }
  }

  return [
    {
      blockType: 'hero',
      badge: m.hero.badge,
      title: m.hero.title,
      description: m.hero.description,
      ctaPrimaryLabel: m.hero.ctaPrimary,
      ctaPrimaryHref: '#pricing',
      ctaSecondaryLabel: m.hero.ctaSecondary,
      ctaSecondaryHref: secondaryHref,
    },
    {
      blockType: 'problem',
      heading: m.problem.title,
      subtitle: m.problem.subtitle,
      items: (m.problem.items as { title: string; description: string }[]).map((it, i) => ({
        title: it.title,
        description: it.description,
        icon: PROBLEM_ICONS[i] ?? undefined,
      })),
    },
    {
      blockType: 'benefits',
      heading: m.benefits.title,
      subtitle: m.benefits.subtitle,
      items: (m.benefits.items as { title: string; description: string }[]).map((it) => ({
        title: it.title,
        description: it.description,
      })),
    },
    {
      blockType: 'logos',
      heading: m.trustedBy.title,
      logos: HOME_LOGOS,
      globalOperations: m.trustedBy.globalOperations,
      countries: COUNTRY_CODES.map((code) => ({ name: m.trustedBy.countries[code], code })),
    },
    {
      blockType: 'testimonials',
      heading: m.testimonials.title,
      subtitle: m.testimonials.subtitle,
      items: (m.testimonials.items as { name: string; text: string }[]).map((it) => ({
        quote: it.text,
        author: it.name,
      })),
    },
    {
      blockType: 'pricing',
      heading: m.pricing.title,
      subtitle: m.pricing.subtitle,
      plans: [plan('foundation'), plan('engine'), plan('growth')],
    },
    {
      blockType: 'faq',
      heading: m.faq.title,
      items: (m.faq.items as { q: string; a: string }[]).map((it) => ({
        question: it.q,
        answer: it.a,
      })),
    },
    {
      blockType: 'cta',
      badge: m.footer.bonus,
      heading: m.footer.advantageTitle,
      body: m.footer.advantageBody,
      goal: m.footer.advantageGoal,
      safety: m.footer.advantageSafety,
      cancelAnytime: m.footer.cancelAnytime,
    },
  ]
}

/**
 * Idempotent seed (native Payload localization).
 *
 * Wipes posts/pages/categories first, then creates ONE document per entity with
 * EN + ES localized fields written via `create({ locale:'en' })` + `update({
 * locale:'es' })`:
 *  - 5 categories (EN/ES title, slug, description)
 *  - 1 author (shared name/slug; localized role + bio)
 *  - 1 published Post (EN + ES title, slug, excerpt, content, seo) with a Callout
 *    block and an Inline CTA Banner block in both locales
 *  - 7 pages (home + 6 service/template pages), each one doc with localized slug,
 *    layout blocks and seo
 *
 * Run: `npm run seed` (→ `payload run src/seed.ts`). Running twice ends in the
 * same state (wipe-then-create).
 */

// ---------- Lexical content helpers ----------

const textNode = (text: string, format = 0) => ({
  type: 'text',
  text,
  format,
  detail: 0,
  mode: 'normal',
  style: '',
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

const heading = (text: string, tag: 'h2' | 'h3' = 'h2') => ({
  type: 'heading',
  tag,
  version: 1,
  direction: 'ltr',
  format: '',
  indent: 0,
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
const blockId = () => `seed-block-${Date.now()}-${blockIdCounter++}`

const calloutBlock = (heading: string, body: string, variant = 'keyTakeaway') => ({
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

const ctaBannerBlock = (opts: {
  label?: string
  heading: string
  body: string
  buttonLabel: string
  href: string
}) => ({
  type: 'block',
  version: 2,
  format: '',
  fields: {
    id: blockId(),
    blockName: '',
    blockType: 'inlineCTABanner',
    label: opts.label ?? '',
    heading: opts.heading,
    body: opts.body,
    buttonLabel: opts.buttonLabel,
    href: opts.href,
    dark: true,
  },
})

// ---------- Seed data ----------

const CATEGORY_PAIRS = [
  { en: 'Sales & Pipeline', es: 'Ventas & Pipeline' },
  { en: 'AI Automation', es: 'Automatización IA' },
  { en: 'Lead Generation', es: 'Generación de Leads' },
  { en: 'Customer Stories', es: 'Casos de Éxito' },
  { en: 'Growth Strategy', es: 'Estrategia de Crecimiento' },
]

/**
 * Seed the two form-builder forms (idempotent: cleared + recreated each run).
 * Field `name`s here MUST match src/lib/forms.ts and the front-end submit calls.
 * Forms are NOT localized — user-facing labels are driven by the localized
 * StrategyFormBlock.labels / blog i18n; these definitions hold canonical fields.
 */
const seedForms = async (payload: Awaited<ReturnType<typeof getPayload>>): Promise<void> => {
  // Clear submissions first — form-submissions.form_id is NOT NULL, so deleting a
  // referenced form otherwise throws a not-null violation.
  const subs = await payload.find({
    collection: 'form-submissions',
    depth: 0,
    limit: 1000,
    pagination: false,
  })
  for (const d of subs.docs) await payload.delete({ collection: 'form-submissions', id: d.id })

  const existing = await payload.find({ collection: 'forms', depth: 0, limit: 1000, pagination: false })
  for (const d of existing.docs) await payload.delete({ collection: 'forms', id: d.id })

  await payload.create({
    collection: 'forms',
    data: {
      title: 'Strategy Call',
      fields: [
        { blockType: 'text', name: 'name', label: 'Full name', required: true, width: 50 },
        { blockType: 'text', name: 'company', label: 'Company', required: false, width: 50 },
        { blockType: 'email', name: 'email', label: 'Work email', required: true, width: 100 },
        { blockType: 'textarea', name: 'message', label: 'Message', required: false, width: 100 },
      ],
      submitButtonLabel: 'Request my call',
      confirmationType: 'message',
      confirmationMessage: richTextRoot([
        paragraph("Thanks — we'll be in touch within 1 business day."),
      ]),
    } as never,
  })

  await payload.create({
    collection: 'forms',
    data: {
      title: 'Newsletter',
      fields: [{ blockType: 'email', name: 'email', label: 'Email', required: true, width: 100 }],
      submitButtonLabel: 'Subscribe',
      confirmationType: 'message',
      confirmationMessage: richTextRoot([paragraph('Thanks — you are subscribed.')]),
    } as never,
  })
}

/** Seed one example CMS redirect (idempotent). */
const seedRedirects = async (payload: Awaited<ReturnType<typeof getPayload>>): Promise<void> => {
  const existing = await payload.find({
    collection: 'redirects',
    depth: 0,
    limit: 1000,
    pagination: false,
  })
  for (const d of existing.docs) await payload.delete({ collection: 'redirects', id: d.id })

  await payload.create({
    collection: 'redirects',
    data: {
      from: '/en/old-demo',
      to: { type: 'custom', url: '/en/automated-booking' },
      type: '301',
    } as never,
  })
}

export const seed = async (): Promise<void> => {
  const payload = await getPayload({ config })
  payload.logger.info('[seed] starting…')

  // ---- Wipe old rows first (so the two-doc legacy data leaves no orphans) ----
  const clearCollection = async (
    collection: 'categories' | 'posts' | 'pages' | 'authors',
  ): Promise<number> => {
    const existing = await payload.find({ collection, depth: 0, limit: 1000, pagination: false })
    for (const d of existing.docs) {
      await payload.delete({ collection, id: d.id })
    }
    return existing.docs.length
  }

  // Clear posts before authors/categories so relationship FKs are gone first.
  const removed = {
    posts: await clearCollection('posts'),
    pages: await clearCollection('pages'),
    authors: await clearCollection('authors'),
    categories: await clearCollection('categories'),
  }
  payload.logger.info(
    `[seed] cleared posts=${removed.posts}, pages=${removed.pages}, ` +
      `authors=${removed.authors}, categories=${removed.categories}`,
  )

  // ---- Categories (5 docs, EN + ES localized) ----
  let firstCategoryId: number | string | undefined

  for (const pair of CATEGORY_PAIRS) {
    const created = await payload.create({
      collection: 'categories',
      locale: 'en',
      data: {
        title: pair.en,
        slug: slugify(pair.en),
        description: `Articles about ${pair.en}.`,
      } as never,
    })
    await payload.update({
      collection: 'categories',
      id: created.id,
      locale: 'es',
      data: {
        title: pair.es,
        slug: slugify(pair.es),
        description: `Artículos sobre ${pair.es}.`,
      } as never,
    })
    if (!firstCategoryId) firstCategoryId = created.id
  }

  // ---- Author (1 doc; shared name/slug, localized role + bio) ----
  const authorDoc = await payload.create({
    collection: 'authors',
    locale: 'en',
    data: {
      name: 'Arianna Lupi',
      slug: 'arianna-lupi',
      role: 'Head of Growth',
      bio: 'Arianna writes about AI-driven sales systems, speed-to-lead, and pipeline design at Apturio.',
      socials: {
        linkedin: 'https://www.linkedin.com/company/apturio',
        x: 'https://x.com/apturio',
        website: 'https://apturio.com',
      },
      expertise: [{ topic: 'AI Automation' }, { topic: 'Speed-to-Lead' }, { topic: 'Pipeline Design' }],
      stats: { reads: 12400 },
    } as never,
  })
  await payload.update({
    collection: 'authors',
    id: authorDoc.id,
    locale: 'es',
    data: {
      role: 'Directora de Crecimiento',
      bio: 'Arianna escribe sobre sistemas de ventas impulsados por IA, velocidad de respuesta y diseño de pipeline en Apturio.',
    } as never,
  })
  const author = { id: authorDoc.id }

  // ---- Post (1 doc, EN + ES localized, published, with custom blocks) ----
  const enContent = richTextRoot([
    paragraph(
      'Most teams lose deals not because of price, but because of speed. The first vendor to respond to a new lead wins the majority of the time.',
    ),
    heading('Why speed-to-lead decides the deal'),
    paragraph(
      'When a lead fills out a form, their intent is at its peak. Every minute of delay erodes that intent and hands the advantage to a faster competitor.',
    ),
    calloutBlock(
      'Key Takeaway',
      'Responding within five minutes makes you up to 21x more likely to qualify the lead than waiting thirty.',
    ),
    heading('Automating the first touch'),
    paragraph(
      'An AI booking agent can greet the lead, answer the first questions, and put a meeting on the calendar before a human ever opens the CRM.',
    ),
    ctaBannerBlock({
      label: 'Limited offer',
      heading: 'Turn every lead into a booked call — automatically',
      body: 'See how Apturio books meetings 24/7 with a $2,000 setup bonus included this month.',
      buttonLabel: 'Claim My Engine',
      href: '/en/strategy-call',
    }),
    paragraph(
      'The result is a pipeline that fills itself while your closers focus on what they do best: closing.',
    ),
  ])

  const esContent = richTextRoot([
    paragraph(
      'La mayoría de los equipos pierden ventas no por el precio, sino por la velocidad. El primer proveedor en responder a un nuevo lead gana la mayoría de las veces.',
    ),
    heading('Por qué la velocidad de respuesta decide la venta'),
    paragraph(
      'Cuando un lead completa un formulario, su intención está en su punto máximo. Cada minuto de demora la erosiona y le da ventaja a un competidor más rápido.',
    ),
    calloutBlock(
      'Clave',
      'Responder en menos de cinco minutos te hace hasta 21 veces más probable de calificar el lead que esperar treinta.',
    ),
    heading('Automatizar el primer contacto'),
    paragraph(
      'Un agente de reservas con IA puede saludar al lead, responder las primeras preguntas y agendar una reunión antes de que un humano abra el CRM.',
    ),
    ctaBannerBlock({
      label: 'Oferta limitada',
      heading: 'Convierte cada lead en una llamada agendada — automáticamente',
      body: 'Descubre cómo Apturio agenda reuniones 24/7 con un bono de implementación de $2,000 incluido este mes.',
      buttonLabel: 'Activar mi motor',
      href: '/es/strategy-call',
    }),
    paragraph(
      'El resultado es un pipeline que se llena solo mientras tus closers se enfocan en lo que mejor hacen: cerrar.',
    ),
  ])

  const post = await payload.create({
    collection: 'posts',
    locale: 'en',
    data: {
      title: 'Speed-to-Lead: Why the Fastest Reply Wins the Deal',
      slug: 'speed-to-lead-wins-deals',
      category: firstCategoryId,
      author: author.id,
      excerpt:
        'The first vendor to respond to a new lead wins most of the time. Here is how to make that vendor you — automatically.',
      content: enContent,
      featured: true,
      publishedAt: new Date('2026-05-20T09:00:00Z').toISOString(),
      _status: 'published',
      meta: {
        title: 'Speed-to-Lead: Why the Fastest Reply Wins the Deal | Apturio',
        description:
          'Responding to leads in under five minutes makes you 21x more likely to qualify them. Learn how to automate the first touch.',
      },
    } as never,
  })
  await payload.update({
    collection: 'posts',
    id: post.id,
    locale: 'es',
    data: {
      title: 'Velocidad de respuesta: por qué el primero en contestar gana la venta',
      slug: 'velocidad-de-respuesta-gana-ventas',
      excerpt:
        'El primer proveedor en responder a un nuevo lead gana la mayoría de las veces. Así logras que ese proveedor seas tú — automáticamente.',
      content: esContent,
      _status: 'published',
      meta: {
        title: 'Velocidad de respuesta: el primero en contestar gana la venta | Apturio',
        description:
          'Responder a los leads en menos de cinco minutos te hace 21 veces más probable de calificarlos. Aprende a automatizar el primer contacto.',
      },
    } as never,
  })

  // ---- Home Page (1 doc, EN + ES localized block layout, published) ----
  const enMessages = loadMessages('en')
  const esMessages = loadMessages('es')

  const home = await payload.create({
    collection: 'pages',
    locale: 'en',
    data: {
      title: 'Home',
      slug: 'home',
      layout: buildHomeLayout('en', enMessages),
      _status: 'published',
      meta: {
        title: enMessages.seo.home.title,
        description: enMessages.seo.home.description,
      },
    } as never,
  })
  await payload.update({
    collection: 'pages',
    id: home.id,
    locale: 'es',
    data: {
      title: 'Inicio',
      slug: 'home',
      layout: buildHomeLayout('es', esMessages),
      _status: 'published',
      meta: {
        title: esMessages.seo.home.title,
        description: esMessages.seo.home.description,
      },
    } as never,
  })

  // ---- Wave 2 — service pages (product pages + 4 template demos) ----
  const service = await seedServicePages(payload)

  // ---- Phase 13 — form-builder forms + example redirect ----
  await seedForms(payload)
  await seedRedirects(payload)
  payload.logger.info('[seed] forms (Strategy Call, Newsletter) + 1 redirect seeded')

  // ---- Report ----
  const [catCount, authorCount, postCount, pageCount] = await Promise.all([
    payload.count({ collection: 'categories' }),
    payload.count({ collection: 'authors' }),
    payload.count({ collection: 'posts' }),
    payload.count({ collection: 'pages' }),
  ])

  payload.logger.info(
    `[seed] done. categories=${catCount.totalDocs}, authors=${authorCount.totalDocs}, ` +
      `posts=${postCount.totalDocs}, pages=${pageCount.totalDocs}. ` +
      `post id=${post.id}, home id=${home.id}, service pages: ${service.total} docs.`,
  )
}

// Allow direct execution via `payload run src/seed.ts`.
await seed()

if (typeof process !== 'undefined') {
  process.exit(0)
}
