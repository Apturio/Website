import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_integrations_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"logo_id" integer,
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_integrations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subtitle" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_integrations_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"logo_id" integer,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_integrations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subtitle" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_integrations_items" ADD CONSTRAINT "pages_blocks_integrations_items_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_integrations_items" ADD CONSTRAINT "pages_blocks_integrations_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_integrations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_integrations" ADD CONSTRAINT "pages_blocks_integrations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_integrations_items" ADD CONSTRAINT "_pages_v_blocks_integrations_items_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_integrations_items" ADD CONSTRAINT "_pages_v_blocks_integrations_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_integrations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_integrations" ADD CONSTRAINT "_pages_v_blocks_integrations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_integrations_items_order_idx" ON "pages_blocks_integrations_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_integrations_items_parent_id_idx" ON "pages_blocks_integrations_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_integrations_items_locale_idx" ON "pages_blocks_integrations_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_integrations_items_logo_idx" ON "pages_blocks_integrations_items" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_integrations_order_idx" ON "pages_blocks_integrations" USING btree ("_order");
  CREATE INDEX "pages_blocks_integrations_parent_id_idx" ON "pages_blocks_integrations" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_integrations_path_idx" ON "pages_blocks_integrations" USING btree ("_path");
  CREATE INDEX "pages_blocks_integrations_locale_idx" ON "pages_blocks_integrations" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_integrations_items_order_idx" ON "_pages_v_blocks_integrations_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_integrations_items_parent_id_idx" ON "_pages_v_blocks_integrations_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_integrations_items_locale_idx" ON "_pages_v_blocks_integrations_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_integrations_items_logo_idx" ON "_pages_v_blocks_integrations_items" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_integrations_order_idx" ON "_pages_v_blocks_integrations" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_integrations_parent_id_idx" ON "_pages_v_blocks_integrations" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_integrations_path_idx" ON "_pages_v_blocks_integrations" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_integrations_locale_idx" ON "_pages_v_blocks_integrations" USING btree ("_locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_integrations_items" CASCADE;
  DROP TABLE "pages_blocks_integrations" CASCADE;
  DROP TABLE "_pages_v_blocks_integrations_items" CASCADE;
  DROP TABLE "_pages_v_blocks_integrations" CASCADE;`)
}
