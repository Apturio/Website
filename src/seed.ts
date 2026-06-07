import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@payload-config'

import { slugify } from '@/lib/slugify'

/**
 * Idempotent seed for Phase 8.
 *
 * Creates (or reuses, keyed by slug+lang / slug):
 *  - 5 EN/ES category pairs, linked both directions via relatedLocale
 *  - 1 author
 *  - 1 published Post per locale (EN + ES), linked via relatedLocale, with real
 *    Lexical content that includes a Callout block and an Inline CTA Banner block
 *
 * Run: `npm run seed` (→ `payload run src/seed.ts`). Running twice does not
 * duplicate rows.
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

export const seed = async (): Promise<void> => {
  const payload = await getPayload({ config })
  payload.logger.info('[seed] starting…')

  // Helper: find-or-create keyed by where clause.
  const findOrCreate = async (
    collection: 'categories' | 'authors' | 'posts',
    where: Where,
    data: Record<string, unknown>,
  ): Promise<{ id: number | string; created: boolean }> => {
    const existing = await payload.find({
      collection,
      where,
      limit: 1,
      depth: 0,
      pagination: false,
    })
    if (existing.docs.length > 0) {
      return { id: existing.docs[0].id as number | string, created: false }
    }
    const doc = await payload.create({ collection, data: data as never })
    return { id: doc.id as number | string, created: true }
  }

  const link = async (
    collection: 'categories' | 'posts',
    id: number | string,
    relatedLocaleId: number | string,
  ): Promise<void> => {
    await payload.update({
      collection,
      id,
      data: { relatedLocale: relatedLocaleId } as never,
    })
  }

  // ---- Categories (5 EN/ES pairs) ----
  let categoriesCreated = 0
  let firstEnCategoryId: number | string | undefined
  let firstEsCategoryId: number | string | undefined

  for (const pair of CATEGORY_PAIRS) {
    const enSlug = slugify(pair.en)
    const esSlug = slugify(pair.es)

    const en = await findOrCreate(
      'categories',
      { and: [{ slug: { equals: enSlug } }, { lang: { equals: 'en' } }] },
      { title: pair.en, slug: enSlug, lang: 'en', description: `Articles about ${pair.en}.` },
    )
    const es = await findOrCreate(
      'categories',
      { and: [{ slug: { equals: esSlug } }, { lang: { equals: 'es' } }] },
      { title: pair.es, slug: esSlug, lang: 'es', description: `Artículos sobre ${pair.es}.` },
    )
    if (en.created) categoriesCreated++
    if (es.created) categoriesCreated++

    // Link both directions (idempotent — update is safe to repeat).
    await link('categories', en.id, es.id)
    await link('categories', es.id, en.id)

    if (!firstEnCategoryId) {
      firstEnCategoryId = en.id
      firstEsCategoryId = es.id
    }
  }

  // ---- Author ----
  const author = await findOrCreate(
    'authors',
    { slug: { equals: 'arianna-lupi' } },
    {
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
    },
  )

  // ---- Posts (EN + ES, linked, published, with custom blocks) ----
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

  const enPost = await findOrCreate(
    'posts',
    { and: [{ slug: { equals: 'speed-to-lead-wins-deals' } }, { lang: { equals: 'en' } }] },
    {
      title: 'Speed-to-Lead: Why the Fastest Reply Wins the Deal',
      slug: 'speed-to-lead-wins-deals',
      lang: 'en',
      category: firstEnCategoryId,
      author: author.id,
      excerpt:
        'The first vendor to respond to a new lead wins most of the time. Here is how to make that vendor you — automatically.',
      content: enContent,
      featured: true,
      publishedAt: new Date('2026-05-20T09:00:00Z').toISOString(),
      _status: 'published',
      seo: {
        metaTitle: 'Speed-to-Lead: Why the Fastest Reply Wins the Deal | Apturio',
        metaDescription:
          'Responding to leads in under five minutes makes you 21x more likely to qualify them. Learn how to automate the first touch.',
      },
    },
  )

  const esPost = await findOrCreate(
    'posts',
    { and: [{ slug: { equals: 'velocidad-de-respuesta-gana-ventas' } }, { lang: { equals: 'es' } }] },
    {
      title: 'Velocidad de respuesta: por qué el primero en contestar gana la venta',
      slug: 'velocidad-de-respuesta-gana-ventas',
      lang: 'es',
      category: firstEsCategoryId,
      author: author.id,
      excerpt:
        'El primer proveedor en responder a un nuevo lead gana la mayoría de las veces. Así logras que ese proveedor seas tú — automáticamente.',
      content: esContent,
      featured: true,
      publishedAt: new Date('2026-05-20T09:00:00Z').toISOString(),
      _status: 'published',
      seo: {
        metaTitle: 'Velocidad de respuesta: el primero en contestar gana la venta | Apturio',
        metaDescription:
          'Responder a los leads en menos de cinco minutos te hace 21 veces más probable de calificarlos. Aprende a automatizar el primer contacto.',
      },
    },
  )

  // Link the EN/ES post pair both directions.
  await link('posts', enPost.id, esPost.id)
  await link('posts', esPost.id, enPost.id)

  // ---- Report ----
  const [catCount, authorCount, postCount] = await Promise.all([
    payload.count({ collection: 'categories' }),
    payload.count({ collection: 'authors' }),
    payload.count({ collection: 'posts' }),
  ])

  payload.logger.info(
    `[seed] done. categories=${catCount.totalDocs} (created ${categoriesCreated} this run), ` +
      `authors=${authorCount.totalDocs}, posts=${postCount.totalDocs}. ` +
      `EN post id=${enPost.id} <-> ES post id=${esPost.id}`,
  )
}

// Allow direct execution via `payload run src/seed.ts`.
await seed()

if (typeof process !== 'undefined') {
  process.exit(0)
}
