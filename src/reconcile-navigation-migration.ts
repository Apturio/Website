/**
 * One-off: reconcile the `20260721_054200_navigation_global` migration against Neon.
 *
 * Running `npm run dev` locally auto-pushes schema changes in Payload dev mode — so once
 * `Navigation` was added to `payload.config.ts` (Phase 23-01), starting the dev server already
 * created its tables/enum types in the database, before the formal migration ever ran. Running
 * the migration's `up()` then fails with "type already exists" and blocks migrate from
 * completing (same root cause as `reconcile-integrations-migration.ts`, just triggered by dev
 * mode instead of an explicit `push`).
 *
 * This script verifies the expected tables actually exist (does NOT trust the error alone),
 * and only if they do, records the migration as applied in Payload's `payload-migrations`
 * collection — the same mechanism `payload migrate` itself uses (@payloadcms/drizzle/dist/migrate.js).
 * It does not touch any table/type DDL.
 *
 * Run with: payload run src/reconcile-navigation-migration.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const MIGRATION_NAME = '20260721_054200_navigation_global'

// A representative sample of tables the migration creates — not exhaustive, enough to prove
// the dev-mode push actually landed the Navigation global's schema (not a false positive).
const EXPECTED_TABLES = [
  'navigation',
  'navigation_mega_menus',
  'navigation_direct_links',
  'navigation_footer_columns',
]

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

  const drizzle = (payload.db as unknown as { drizzle: { execute: (q: unknown) => Promise<{ rows: Array<{ table_name: string }> }> } }).drizzle
  const { sql } = await import('@payloadcms/db-postgres')
  const result = await drizzle.execute(
    sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ANY(${EXPECTED_TABLES})`,
  )
  const foundTables = new Set(result.rows.map((r) => r.table_name))
  const missing = EXPECTED_TABLES.filter((t) => !foundTables.has(t))

  if (missing.length > 0) {
    payload.logger.error(
      `[reconcile] ${missing.length}/${EXPECTED_TABLES.length} expected tables are MISSING (${missing.join(', ')}) — the dev-push hypothesis does not hold. NOT marking as applied. Investigate before retrying "npx payload migrate".`,
    )
    process.exit(1)
  }

  payload.logger.info(`[reconcile] Verified all ${EXPECTED_TABLES.length} expected tables exist (dev-mode push confirmed) — recording migration as applied.`)

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

  payload.logger.info(`[reconcile] Recorded ${MIGRATION_NAME} as applied (batch ${newBatch}). Now run: npx payload migrate:status to confirm, then proceed with the seed script.`)
}

await run()

if (typeof process !== 'undefined') {
  process.exit(0)
}
