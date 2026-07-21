import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_navigation_mega_menus_columns_items_children_status" AS ENUM('live', 'comingSoon');
  CREATE TYPE "public"."enum_navigation_mega_menus_columns_items_status" AS ENUM('live', 'comingSoon');
  CREATE TYPE "public"."enum_navigation_direct_links_children_status" AS ENUM('live', 'comingSoon');
  CREATE TYPE "public"."enum_navigation_direct_links_status" AS ENUM('live', 'comingSoon');
  CREATE TYPE "public"."enum_navigation_footer_columns_items_children_status" AS ENUM('live', 'comingSoon');
  CREATE TYPE "public"."enum_navigation_footer_columns_items_status" AS ENUM('live', 'comingSoon');
  CREATE TYPE "public"."enum_navigation_footer_columns_subgroup_items_children_status" AS ENUM('live', 'comingSoon');
  CREATE TYPE "public"."enum_navigation_footer_columns_subgroup_items_status" AS ENUM('live', 'comingSoon');
  CREATE TABLE "pages_blocks_comparison_table_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"highlight" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_comparison_table_rows_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"highlight" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_comparison_table_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_comparison_table" (
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
  
  CREATE TABLE "_pages_v_blocks_comparison_table_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"highlight" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_comparison_table_rows_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"highlight" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_comparison_table_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_comparison_table" (
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
  
  CREATE TABLE "navigation_mega_menus_columns_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"status" "enum_navigation_mega_menus_columns_items_children_status" DEFAULT 'comingSoon' NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "navigation_mega_menus_columns_items_children_locales" (
  	"label" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_mega_menus_columns_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"status" "enum_navigation_mega_menus_columns_items_status" DEFAULT 'comingSoon' NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "navigation_mega_menus_columns_items_locales" (
  	"label" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_mega_menus_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "navigation_mega_menus_columns_locales" (
  	"column_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_mega_menus" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "navigation_mega_menus_locales" (
  	"trigger_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_direct_links_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"status" "enum_navigation_direct_links_children_status" DEFAULT 'comingSoon' NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "navigation_direct_links_children_locales" (
  	"label" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_direct_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"status" "enum_navigation_direct_links_status" DEFAULT 'comingSoon' NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "navigation_direct_links_locales" (
  	"label" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_footer_columns_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"status" "enum_navigation_footer_columns_items_children_status" DEFAULT 'comingSoon' NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "navigation_footer_columns_items_children_locales" (
  	"label" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_footer_columns_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"status" "enum_navigation_footer_columns_items_status" DEFAULT 'comingSoon' NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "navigation_footer_columns_items_locales" (
  	"label" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_footer_columns_subgroup_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"status" "enum_navigation_footer_columns_subgroup_items_children_status" DEFAULT 'comingSoon' NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "navigation_footer_columns_subgroup_items_children_locales" (
  	"label" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_footer_columns_subgroup_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"status" "enum_navigation_footer_columns_subgroup_items_status" DEFAULT 'comingSoon' NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "navigation_footer_columns_subgroup_items_locales" (
  	"label" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "navigation_footer_columns_locales" (
  	"heading" varchar NOT NULL,
  	"subgroup_heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_blocks_comparison_table_columns" ADD CONSTRAINT "pages_blocks_comparison_table_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_comparison_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_comparison_table_rows_values" ADD CONSTRAINT "pages_blocks_comparison_table_rows_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_comparison_table_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_comparison_table_rows" ADD CONSTRAINT "pages_blocks_comparison_table_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_comparison_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_comparison_table" ADD CONSTRAINT "pages_blocks_comparison_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_comparison_table_columns" ADD CONSTRAINT "_pages_v_blocks_comparison_table_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_comparison_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_comparison_table_rows_values" ADD CONSTRAINT "_pages_v_blocks_comparison_table_rows_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_comparison_table_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_comparison_table_rows" ADD CONSTRAINT "_pages_v_blocks_comparison_table_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_comparison_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_comparison_table" ADD CONSTRAINT "_pages_v_blocks_comparison_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_mega_menus_columns_items_children" ADD CONSTRAINT "navigation_mega_menus_columns_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_mega_menus_columns_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_mega_menus_columns_items_children_locales" ADD CONSTRAINT "navigation_mega_menus_columns_items_children_locales_pare_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_mega_menus_columns_items_children"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_mega_menus_columns_items" ADD CONSTRAINT "navigation_mega_menus_columns_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_mega_menus_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_mega_menus_columns_items_locales" ADD CONSTRAINT "navigation_mega_menus_columns_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_mega_menus_columns_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_mega_menus_columns" ADD CONSTRAINT "navigation_mega_menus_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_mega_menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_mega_menus_columns_locales" ADD CONSTRAINT "navigation_mega_menus_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_mega_menus_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_mega_menus" ADD CONSTRAINT "navigation_mega_menus_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_mega_menus_locales" ADD CONSTRAINT "navigation_mega_menus_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_mega_menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_direct_links_children" ADD CONSTRAINT "navigation_direct_links_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_direct_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_direct_links_children_locales" ADD CONSTRAINT "navigation_direct_links_children_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_direct_links_children"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_direct_links" ADD CONSTRAINT "navigation_direct_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_direct_links_locales" ADD CONSTRAINT "navigation_direct_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_direct_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns_items_children" ADD CONSTRAINT "navigation_footer_columns_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_columns_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns_items_children_locales" ADD CONSTRAINT "navigation_footer_columns_items_children_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_columns_items_children"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns_items" ADD CONSTRAINT "navigation_footer_columns_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns_items_locales" ADD CONSTRAINT "navigation_footer_columns_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_columns_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns_subgroup_items_children" ADD CONSTRAINT "navigation_footer_columns_subgroup_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_columns_subgroup_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns_subgroup_items_children_locales" ADD CONSTRAINT "navigation_footer_columns_subgroup_items_children_locales_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_columns_subgroup_items_children"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns_subgroup_items" ADD CONSTRAINT "navigation_footer_columns_subgroup_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns_subgroup_items_locales" ADD CONSTRAINT "navigation_footer_columns_subgroup_items_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_columns_subgroup_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns" ADD CONSTRAINT "navigation_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns_locales" ADD CONSTRAINT "navigation_footer_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_comparison_table_columns_order_idx" ON "pages_blocks_comparison_table_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_comparison_table_columns_parent_id_idx" ON "pages_blocks_comparison_table_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_comparison_table_columns_locale_idx" ON "pages_blocks_comparison_table_columns" USING btree ("_locale");
  CREATE INDEX "pages_blocks_comparison_table_rows_values_order_idx" ON "pages_blocks_comparison_table_rows_values" USING btree ("_order");
  CREATE INDEX "pages_blocks_comparison_table_rows_values_parent_id_idx" ON "pages_blocks_comparison_table_rows_values" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_comparison_table_rows_values_locale_idx" ON "pages_blocks_comparison_table_rows_values" USING btree ("_locale");
  CREATE INDEX "pages_blocks_comparison_table_rows_order_idx" ON "pages_blocks_comparison_table_rows" USING btree ("_order");
  CREATE INDEX "pages_blocks_comparison_table_rows_parent_id_idx" ON "pages_blocks_comparison_table_rows" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_comparison_table_rows_locale_idx" ON "pages_blocks_comparison_table_rows" USING btree ("_locale");
  CREATE INDEX "pages_blocks_comparison_table_order_idx" ON "pages_blocks_comparison_table" USING btree ("_order");
  CREATE INDEX "pages_blocks_comparison_table_parent_id_idx" ON "pages_blocks_comparison_table" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_comparison_table_path_idx" ON "pages_blocks_comparison_table" USING btree ("_path");
  CREATE INDEX "pages_blocks_comparison_table_locale_idx" ON "pages_blocks_comparison_table" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_comparison_table_columns_order_idx" ON "_pages_v_blocks_comparison_table_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_comparison_table_columns_parent_id_idx" ON "_pages_v_blocks_comparison_table_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_comparison_table_columns_locale_idx" ON "_pages_v_blocks_comparison_table_columns" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_comparison_table_rows_values_order_idx" ON "_pages_v_blocks_comparison_table_rows_values" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_comparison_table_rows_values_parent_id_idx" ON "_pages_v_blocks_comparison_table_rows_values" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_comparison_table_rows_values_locale_idx" ON "_pages_v_blocks_comparison_table_rows_values" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_comparison_table_rows_order_idx" ON "_pages_v_blocks_comparison_table_rows" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_comparison_table_rows_parent_id_idx" ON "_pages_v_blocks_comparison_table_rows" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_comparison_table_rows_locale_idx" ON "_pages_v_blocks_comparison_table_rows" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_comparison_table_order_idx" ON "_pages_v_blocks_comparison_table" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_comparison_table_parent_id_idx" ON "_pages_v_blocks_comparison_table" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_comparison_table_path_idx" ON "_pages_v_blocks_comparison_table" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_comparison_table_locale_idx" ON "_pages_v_blocks_comparison_table" USING btree ("_locale");
  CREATE INDEX "navigation_mega_menus_columns_items_children_order_idx" ON "navigation_mega_menus_columns_items_children" USING btree ("_order");
  CREATE INDEX "navigation_mega_menus_columns_items_children_parent_id_idx" ON "navigation_mega_menus_columns_items_children" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_mega_menus_columns_items_children_locales_locale_" ON "navigation_mega_menus_columns_items_children_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_mega_menus_columns_items_order_idx" ON "navigation_mega_menus_columns_items" USING btree ("_order");
  CREATE INDEX "navigation_mega_menus_columns_items_parent_id_idx" ON "navigation_mega_menus_columns_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_mega_menus_columns_items_locales_locale_parent_id" ON "navigation_mega_menus_columns_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_mega_menus_columns_order_idx" ON "navigation_mega_menus_columns" USING btree ("_order");
  CREATE INDEX "navigation_mega_menus_columns_parent_id_idx" ON "navigation_mega_menus_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_mega_menus_columns_locales_locale_parent_id_uniqu" ON "navigation_mega_menus_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_mega_menus_order_idx" ON "navigation_mega_menus" USING btree ("_order");
  CREATE INDEX "navigation_mega_menus_parent_id_idx" ON "navigation_mega_menus" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_mega_menus_locales_locale_parent_id_unique" ON "navigation_mega_menus_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_direct_links_children_order_idx" ON "navigation_direct_links_children" USING btree ("_order");
  CREATE INDEX "navigation_direct_links_children_parent_id_idx" ON "navigation_direct_links_children" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_direct_links_children_locales_locale_parent_id_un" ON "navigation_direct_links_children_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_direct_links_order_idx" ON "navigation_direct_links" USING btree ("_order");
  CREATE INDEX "navigation_direct_links_parent_id_idx" ON "navigation_direct_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_direct_links_locales_locale_parent_id_unique" ON "navigation_direct_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_footer_columns_items_children_order_idx" ON "navigation_footer_columns_items_children" USING btree ("_order");
  CREATE INDEX "navigation_footer_columns_items_children_parent_id_idx" ON "navigation_footer_columns_items_children" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_footer_columns_items_children_locales_locale_pare" ON "navigation_footer_columns_items_children_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_footer_columns_items_order_idx" ON "navigation_footer_columns_items" USING btree ("_order");
  CREATE INDEX "navigation_footer_columns_items_parent_id_idx" ON "navigation_footer_columns_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_footer_columns_items_locales_locale_parent_id_uni" ON "navigation_footer_columns_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_footer_columns_subgroup_items_children_order_idx" ON "navigation_footer_columns_subgroup_items_children" USING btree ("_order");
  CREATE INDEX "navigation_footer_columns_subgroup_items_children_parent_id_idx" ON "navigation_footer_columns_subgroup_items_children" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_footer_columns_subgroup_items_children_locales_lo" ON "navigation_footer_columns_subgroup_items_children_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_footer_columns_subgroup_items_order_idx" ON "navigation_footer_columns_subgroup_items" USING btree ("_order");
  CREATE INDEX "navigation_footer_columns_subgroup_items_parent_id_idx" ON "navigation_footer_columns_subgroup_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_footer_columns_subgroup_items_locales_locale_pare" ON "navigation_footer_columns_subgroup_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_footer_columns_order_idx" ON "navigation_footer_columns" USING btree ("_order");
  CREATE INDEX "navigation_footer_columns_parent_id_idx" ON "navigation_footer_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_footer_columns_locales_locale_parent_id_unique" ON "navigation_footer_columns_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_comparison_table_columns" CASCADE;
  DROP TABLE "pages_blocks_comparison_table_rows_values" CASCADE;
  DROP TABLE "pages_blocks_comparison_table_rows" CASCADE;
  DROP TABLE "pages_blocks_comparison_table" CASCADE;
  DROP TABLE "_pages_v_blocks_comparison_table_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_comparison_table_rows_values" CASCADE;
  DROP TABLE "_pages_v_blocks_comparison_table_rows" CASCADE;
  DROP TABLE "_pages_v_blocks_comparison_table" CASCADE;
  DROP TABLE "navigation_mega_menus_columns_items_children" CASCADE;
  DROP TABLE "navigation_mega_menus_columns_items_children_locales" CASCADE;
  DROP TABLE "navigation_mega_menus_columns_items" CASCADE;
  DROP TABLE "navigation_mega_menus_columns_items_locales" CASCADE;
  DROP TABLE "navigation_mega_menus_columns" CASCADE;
  DROP TABLE "navigation_mega_menus_columns_locales" CASCADE;
  DROP TABLE "navigation_mega_menus" CASCADE;
  DROP TABLE "navigation_mega_menus_locales" CASCADE;
  DROP TABLE "navigation_direct_links_children" CASCADE;
  DROP TABLE "navigation_direct_links_children_locales" CASCADE;
  DROP TABLE "navigation_direct_links" CASCADE;
  DROP TABLE "navigation_direct_links_locales" CASCADE;
  DROP TABLE "navigation_footer_columns_items_children" CASCADE;
  DROP TABLE "navigation_footer_columns_items_children_locales" CASCADE;
  DROP TABLE "navigation_footer_columns_items" CASCADE;
  DROP TABLE "navigation_footer_columns_items_locales" CASCADE;
  DROP TABLE "navigation_footer_columns_subgroup_items_children" CASCADE;
  DROP TABLE "navigation_footer_columns_subgroup_items_children_locales" CASCADE;
  DROP TABLE "navigation_footer_columns_subgroup_items" CASCADE;
  DROP TABLE "navigation_footer_columns_subgroup_items_locales" CASCADE;
  DROP TABLE "navigation_footer_columns" CASCADE;
  DROP TABLE "navigation_footer_columns_locales" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TYPE "public"."enum_navigation_mega_menus_columns_items_children_status";
  DROP TYPE "public"."enum_navigation_mega_menus_columns_items_status";
  DROP TYPE "public"."enum_navigation_direct_links_children_status";
  DROP TYPE "public"."enum_navigation_direct_links_status";
  DROP TYPE "public"."enum_navigation_footer_columns_items_children_status";
  DROP TYPE "public"."enum_navigation_footer_columns_items_status";
  DROP TYPE "public"."enum_navigation_footer_columns_subgroup_items_children_status";
  DROP TYPE "public"."enum_navigation_footer_columns_subgroup_items_status";`)
}
