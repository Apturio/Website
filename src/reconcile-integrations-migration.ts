/**
 * One-off: reconcile the `20260713_210004_integrations_block` migration against Neon.
 *
 * Its tables (pages_blocks_integrations*, _pages_v_blocks_integrations*) already exist in
 * the database — created via `payload push` (dev mode) before this migration file existed,
 * per PROJECT.md's tracked "reconcile dev-push → payload migrate" debt (v2.2+). Running the
 * migration's `up()` fails with "relation already exists" and blocks every later migration
 * (including 20260721_054200_navigation_global) from running.
 *
 * This does NOT touch the tables themselves — it only records the migration as applied in
 * Payload's own `payload-migrations` collection (the exact mechanism `payload migrate` uses
 * internally, see @payloadcms/drizzle/dist/migrate.js), using the next batch number.
 *
 * Run with: payload run src/reconcile-integrations-migration.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const MIGRATION_NAME = '20260713_210004_integrations_block'

const run = async (): Promise<void> => {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'payload-migrations',
    where: { name: { equals: MIGRATION_NAME } },
    limit: 1,
  })
  if (existing.docs.length > 0) {
    payload.logger.info(`[reconcile] ${MIGRATION_NAME} already recorded (batch ${(existing.docs[0] as { batch: number }).batch}) — nothing to do`)
    process.exit(0)
  }

  const { docs: latest } = await payload.find({
    collection: 'payload-migrations',
    limit: 1,
    sort: '-name',
  })
  const latestBatch = latest[0] ? Number((latest[0] as { batch: number }).batch) : 0
  const newBatch = latestBatch > 0 ? latestBatch + 1 : 1

  await payload.create({
    collection: 'payload-migrations',
    data: { name: MIGRATION_NAME, batch: newBatch },
  })

  payload.logger.info(`[reconcile] Recorded ${MIGRATION_NAME} as applied (batch ${newBatch}). Now run: npx payload migrate`)
}

await run()

if (typeof process !== 'undefined') {
  process.exit(0)
}
