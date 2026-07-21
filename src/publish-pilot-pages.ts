/**
 * One-off: publish the 10 pilot pages built from the July content doc.
 * Run with: payload run src/publish-pilot-pages.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const SLUGS = [
  'pipeline-crm',
  'automatizaciones-crm',
  'implementacion-crm',
  'precios',
  'implementacion',
  'chatbot-ia',
  'chatbot-whatsapp',
  'chatbot-instagram',
  'sistema-reservas',
  'recordatorios-automaticos',
]

const publishPilotPages = async (): Promise<void> => {
  const payload = await getPayload({ config })
  const results: { slug: string; id: number | string; en: string; es: string }[] = []

  for (const slug of SLUGS) {
    const found = await payload.find({
      collection: 'pages',
      locale: 'en',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    const doc = found.docs[0]
    if (!doc) {
      payload.logger.warn(`[publish-pilot-pages] no page found for slug=${slug}`)
      continue
    }

    const enUpdated = await payload.update({
      collection: 'pages',
      id: doc.id,
      locale: 'en',
      data: { _status: 'published' } as never,
    })
    const esUpdated = await payload.update({
      collection: 'pages',
      id: doc.id,
      locale: 'es',
      data: { _status: 'published' } as never,
    })

    results.push({
      slug,
      id: doc.id,
      en: (enUpdated as unknown as { slug: string }).slug,
      es: (esUpdated as unknown as { slug: string }).slug,
    })
  }

  payload.logger.info(`[publish-pilot-pages] published ${results.length} pages: ${JSON.stringify(results)}`)
}

await publishPilotPages()

if (typeof process !== 'undefined') {
  process.exit(0)
}
