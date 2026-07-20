/** One-off: re-publish Home (id 46) after an update accidentally dropped it to draft. */
import { getPayload } from 'payload'
import config from '@payload-config'

const run = async (): Promise<void> => {
  const payload = await getPayload({ config })
  await payload.update({ collection: 'pages', id: 46, locale: 'en', data: { _status: 'published' } as never })
  await payload.update({ collection: 'pages', id: 46, locale: 'es', data: { _status: 'published' } as never })
  payload.logger.info('[republish-home] Home re-published (en+es)')
}

await run()

if (typeof process !== 'undefined') {
  process.exit(0)
}
