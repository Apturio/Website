import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" ADD COLUMN "json_ld_override" jsonb;
  ALTER TABLE "_posts_v" ADD COLUMN "version_json_ld_override" jsonb;
  ALTER TABLE "pages" ADD COLUMN "json_ld_override" jsonb;
  ALTER TABLE "_pages_v" ADD COLUMN "version_json_ld_override" jsonb;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" DROP COLUMN "json_ld_override";
  ALTER TABLE "_posts_v" DROP COLUMN "version_json_ld_override";
  ALTER TABLE "pages" DROP COLUMN "json_ld_override";
  ALTER TABLE "_pages_v" DROP COLUMN "version_json_ld_override";`)
}
