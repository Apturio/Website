import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum_pages_blocks_problem_items_icon" AS ENUM('TrendingDown', 'Clock', 'Layers', 'Bot', 'Settings', 'Activity');
  CREATE TYPE "public"."enum_pages_blocks_pricing_plans_plan_id" AS ENUM('foundation', 'engine', 'growth');
  CREATE TYPE "public"."enum_pages_blocks_hero_centered_accent_color" AS ENUM('brand', 'green');
  CREATE TYPE "public"."enum_pages_blocks_hero_split_accent_color" AS ENUM('brand', 'green');
  CREATE TYPE "public"."enum_pages_blocks_hero_dashboard_accent_color" AS ENUM('brand', 'green');
  CREATE TYPE "public"."enum_pages_blocks_hero_bold_accent_color" AS ENUM('brand', 'green');
  CREATE TYPE "public"."enum__pages_v_blocks_problem_items_icon" AS ENUM('TrendingDown', 'Clock', 'Layers', 'Bot', 'Settings', 'Activity');
  CREATE TYPE "public"."enum__pages_v_blocks_pricing_plans_plan_id" AS ENUM('foundation', 'engine', 'growth');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_centered_accent_color" AS ENUM('brand', 'green');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_split_accent_color" AS ENUM('brand', 'green');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_dashboard_accent_color" AS ENUM('brand', 'green');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_bold_accent_color" AS ENUM('brand', 'green');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_redirects_type" AS ENUM('301', '302');
  CREATE TABLE "posts_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"read_time" numeric,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_read_time" numeric,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"title" varchar,
  	"description" varchar,
  	"cta_primary_label" varchar,
  	"cta_primary_href" varchar,
  	"cta_secondary_label" varchar,
  	"cta_secondary_href" varchar,
  	"logo_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_logos_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"src" varchar,
  	"old" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_logos_countries" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"code" varchar
  );
  
  CREATE TABLE "pages_blocks_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"global_operations" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_problem_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"icon" "enum_pages_blocks_problem_items_icon"
  );
  
  CREATE TABLE "pages_blocks_problem" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subtitle" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_benefits_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subtitle" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subtitle" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pricing_plans_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar
  );
  
  CREATE TABLE "pages_blocks_pricing_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"plan_id" "enum_pages_blocks_pricing_plans_plan_id",
  	"name" varchar,
  	"price" varchar,
  	"period" varchar,
  	"description" varchar,
  	"highlighted" boolean DEFAULT false,
  	"bonus" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"sub_text" varchar
  );
  
  CREATE TABLE "pages_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subtitle" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"goal" varchar,
  	"safety" varchar,
  	"cancel_anytime" varchar,
  	"button_label" varchar,
  	"button_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_centered_micro" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_centered" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"pill_icon" varchar,
  	"pill_text" varchar,
  	"title_start" varchar,
  	"title_accent" varchar,
  	"title_end" varchar,
  	"accent_color" "enum_pages_blocks_hero_centered_accent_color" DEFAULT 'brand',
  	"subtitle" varchar,
  	"cta_primary_label" varchar,
  	"cta_primary_href" varchar,
  	"cta_secondary_icon" varchar,
  	"cta_secondary_label" varchar,
  	"cta_secondary_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_split_micro" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"pill_icon" varchar,
  	"pill_text" varchar,
  	"title_start" varchar,
  	"title_accent" varchar,
  	"title_end" varchar,
  	"accent_color" "enum_pages_blocks_hero_split_accent_color" DEFAULT 'brand',
  	"subtitle" varchar,
  	"cta_primary_label" varchar,
  	"cta_primary_href" varchar,
  	"cta_secondary_icon" varchar,
  	"cta_secondary_label" varchar,
  	"cta_secondary_href" varchar,
  	"image_id" integer,
  	"placeholder" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_dashboard_micro" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_dashboard" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"pill_icon" varchar,
  	"pill_text" varchar,
  	"title_start" varchar,
  	"title_accent" varchar,
  	"title_end" varchar,
  	"accent_color" "enum_pages_blocks_hero_dashboard_accent_color" DEFAULT 'brand',
  	"subtitle" varchar,
  	"cta_primary_label" varchar,
  	"cta_primary_href" varchar,
  	"cta_secondary_icon" varchar,
  	"cta_secondary_label" varchar,
  	"cta_secondary_href" varchar,
  	"image_id" integer,
  	"placeholder" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_bold_micro" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_bold_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"big" varchar,
  	"label" varchar,
  	"green" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_hero_bold" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"pill_icon" varchar,
  	"pill_text" varchar,
  	"title_start" varchar,
  	"title_accent" varchar,
  	"title_end" varchar,
  	"accent_color" "enum_pages_blocks_hero_bold_accent_color" DEFAULT 'brand',
  	"subtitle" varchar,
  	"cta_primary_label" varchar,
  	"cta_primary_href" varchar,
  	"cta_secondary_icon" varchar,
  	"cta_secondary_label" varchar,
  	"cta_secondary_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subtitle" varchar,
  	"split_intro" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_zigzag_rows_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_zigzag_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"num" varchar,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"placeholder" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_zigzag" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_accordion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"image_id" integer,
  	"placeholder" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_steps_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"tag" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_tabs_tabs_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_tabs_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"label" varchar,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"placeholder" varchar
  );
  
  CREATE TABLE "pages_blocks_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_metrics_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"green" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"glow_top" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_big_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"glow_top" boolean DEFAULT false,
  	"quote" varchar,
  	"author_name" varchar,
  	"author_role" varchar,
  	"avatar_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_mini_pricing_plans_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"hot" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_mini_pricing_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"sub" varchar,
  	"price" varchar,
  	"period" varchar DEFAULT '/mo',
  	"featured" boolean DEFAULT false,
  	"bonus_tag" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar DEFAULT '#strategy'
  );
  
  CREATE TABLE "pages_blocks_mini_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subtitle" varchar,
  	"single" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_strategy_form_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_strategy_form_lead_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_strategy_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Free Strategy Call',
  	"heading" varchar DEFAULT 'Book your free strategy call',
  	"body" varchar DEFAULT 'Tell us where you are. An Apturio engineer will map your turnkey setup — no commitment.',
  	"labels_name" varchar DEFAULT 'Full name',
  	"labels_name_placeholder" varchar DEFAULT 'Jane Founder',
  	"labels_company" varchar DEFAULT 'Company',
  	"labels_company_placeholder" varchar DEFAULT 'Acme Inc.',
  	"labels_email" varchar DEFAULT 'Work email',
  	"labels_email_placeholder" varchar DEFAULT 'you@company.com',
  	"labels_leads" varchar DEFAULT 'Monthly leads',
  	"labels_submit" varchar DEFAULT 'Request my call',
  	"labels_fine" varchar DEFAULT 'No commitment · We reply within 1 business day.',
  	"labels_success" varchar DEFAULT 'Thanks — we''ll be in touch within 1 business day.',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_sticky_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar DEFAULT '#strategy',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_bonus_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"pill_text" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_primary_label" varchar,
  	"cta_primary_href" varchar DEFAULT '#strategy',
  	"cta_secondary_label" varchar,
  	"cta_secondary_href" varchar DEFAULT '#strategy',
  	"fine" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"title" varchar,
  	"description" varchar,
  	"cta_primary_label" varchar,
  	"cta_primary_href" varchar,
  	"cta_secondary_label" varchar,
  	"cta_secondary_href" varchar,
  	"logo_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logos_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"src" varchar,
  	"old" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logos_countries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"code" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"global_operations" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_problem_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"icon" "enum__pages_v_blocks_problem_items_icon",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_problem" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subtitle" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_benefits_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subtitle" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subtitle" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing_plans_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"feature" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"plan_id" "enum__pages_v_blocks_pricing_plans_plan_id",
  	"name" varchar,
  	"price" varchar,
  	"period" varchar,
  	"description" varchar,
  	"highlighted" boolean DEFAULT false,
  	"bonus" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"sub_text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subtitle" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"goal" varchar,
  	"safety" varchar,
  	"cancel_anytime" varchar,
  	"button_label" varchar,
  	"button_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_centered_micro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_centered" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"pill_icon" varchar,
  	"pill_text" varchar,
  	"title_start" varchar,
  	"title_accent" varchar,
  	"title_end" varchar,
  	"accent_color" "enum__pages_v_blocks_hero_centered_accent_color" DEFAULT 'brand',
  	"subtitle" varchar,
  	"cta_primary_label" varchar,
  	"cta_primary_href" varchar,
  	"cta_secondary_icon" varchar,
  	"cta_secondary_label" varchar,
  	"cta_secondary_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_split_micro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"pill_icon" varchar,
  	"pill_text" varchar,
  	"title_start" varchar,
  	"title_accent" varchar,
  	"title_end" varchar,
  	"accent_color" "enum__pages_v_blocks_hero_split_accent_color" DEFAULT 'brand',
  	"subtitle" varchar,
  	"cta_primary_label" varchar,
  	"cta_primary_href" varchar,
  	"cta_secondary_icon" varchar,
  	"cta_secondary_label" varchar,
  	"cta_secondary_href" varchar,
  	"image_id" integer,
  	"placeholder" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_dashboard_micro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_dashboard" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"pill_icon" varchar,
  	"pill_text" varchar,
  	"title_start" varchar,
  	"title_accent" varchar,
  	"title_end" varchar,
  	"accent_color" "enum__pages_v_blocks_hero_dashboard_accent_color" DEFAULT 'brand',
  	"subtitle" varchar,
  	"cta_primary_label" varchar,
  	"cta_primary_href" varchar,
  	"cta_secondary_icon" varchar,
  	"cta_secondary_label" varchar,
  	"cta_secondary_href" varchar,
  	"image_id" integer,
  	"placeholder" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_bold_micro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_bold_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"big" varchar,
  	"label" varchar,
  	"green" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_bold" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"pill_icon" varchar,
  	"pill_text" varchar,
  	"title_start" varchar,
  	"title_accent" varchar,
  	"title_end" varchar,
  	"accent_color" "enum__pages_v_blocks_hero_bold_accent_color" DEFAULT 'brand',
  	"subtitle" varchar,
  	"cta_primary_label" varchar,
  	"cta_primary_href" varchar,
  	"cta_secondary_icon" varchar,
  	"cta_secondary_label" varchar,
  	"cta_secondary_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subtitle" varchar,
  	"split_intro" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_zigzag_rows_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_zigzag_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"num" varchar,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"placeholder" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_zigzag" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_accordion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"image_id" integer,
  	"placeholder" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_steps_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"tag" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_tabs_tabs_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_tabs_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"label" varchar,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"placeholder" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_metrics_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"green" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"glow_top" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_big_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"glow_top" boolean DEFAULT false,
  	"quote" varchar,
  	"author_name" varchar,
  	"author_role" varchar,
  	"avatar_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_mini_pricing_plans_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"hot" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_mini_pricing_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"sub" varchar,
  	"price" varchar,
  	"period" varchar DEFAULT '/mo',
  	"featured" boolean DEFAULT false,
  	"bonus_tag" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar DEFAULT '#strategy',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_mini_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subtitle" varchar,
  	"single" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_strategy_form_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_strategy_form_lead_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_strategy_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Free Strategy Call',
  	"heading" varchar DEFAULT 'Book your free strategy call',
  	"body" varchar DEFAULT 'Tell us where you are. An Apturio engineer will map your turnkey setup — no commitment.',
  	"labels_name" varchar DEFAULT 'Full name',
  	"labels_name_placeholder" varchar DEFAULT 'Jane Founder',
  	"labels_company" varchar DEFAULT 'Company',
  	"labels_company_placeholder" varchar DEFAULT 'Acme Inc.',
  	"labels_email" varchar DEFAULT 'Work email',
  	"labels_email_placeholder" varchar DEFAULT 'you@company.com',
  	"labels_leads" varchar DEFAULT 'Monthly leads',
  	"labels_submit" varchar DEFAULT 'Request my call',
  	"labels_fine" varchar DEFAULT 'No commitment · We reply within 1 business day.',
  	"labels_success" varchar DEFAULT 'Thanks — we''ll be in touch within 1 business day.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_sticky_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar DEFAULT '#strategy',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_bonus_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"pill_text" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_primary_label" varchar,
  	"cta_primary_href" varchar DEFAULT '#strategy',
  	"cta_secondary_label" varchar,
  	"cta_secondary_href" varchar DEFAULT '#strategy',
  	"fine" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "categories_locales" (
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "authors_locales" (
  	"role" varchar,
  	"bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "faqs_locales" (
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_checkbox_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_country" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_country_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_email_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_message_locales" (
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_number_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_state" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_state_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_text_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar
  );
  
  CREATE TABLE "forms_emails_locales" (
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_locales" (
  	"submit_button_label" varchar,
  	"confirmation_message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"type" "enum_redirects_type" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  ALTER TABLE "posts" DROP CONSTRAINT "posts_related_locale_id_posts_id_fk";
  
  ALTER TABLE "posts" DROP CONSTRAINT "posts_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_related_locale_id_posts_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_related_locale_id_pages_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_related_locale_id_pages_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "categories" DROP CONSTRAINT "categories_related_locale_id_categories_id_fk";
  
  DROP INDEX "posts_slug_idx";
  DROP INDEX "posts_related_locale_idx";
  DROP INDEX "posts_seo_seo_og_image_idx";
  DROP INDEX "_posts_v_version_version_slug_idx";
  DROP INDEX "_posts_v_version_version_related_locale_idx";
  DROP INDEX "_posts_v_version_seo_version_seo_og_image_idx";
  DROP INDEX "pages_slug_idx";
  DROP INDEX "pages_related_locale_idx";
  DROP INDEX "pages_seo_seo_og_image_idx";
  DROP INDEX "_pages_v_version_version_slug_idx";
  DROP INDEX "_pages_v_version_version_related_locale_idx";
  DROP INDEX "_pages_v_version_seo_version_seo_og_image_idx";
  DROP INDEX "categories_slug_idx";
  DROP INDEX "categories_related_locale_idx";
  ALTER TABLE "_posts_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_posts_v" ADD COLUMN "published_locale" "enum__posts_v_published_locale";
  ALTER TABLE "_pages_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_pages_v" ADD COLUMN "published_locale" "enum__pages_v_published_locale";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "forms_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "form_submissions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "redirects_id" integer;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logos_logos" ADD CONSTRAINT "pages_blocks_logos_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logos_countries" ADD CONSTRAINT "pages_blocks_logos_countries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logos" ADD CONSTRAINT "pages_blocks_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_problem_items" ADD CONSTRAINT "pages_blocks_problem_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_problem"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_problem" ADD CONSTRAINT "pages_blocks_problem_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_benefits_items" ADD CONSTRAINT "pages_blocks_benefits_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_benefits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_benefits" ADD CONSTRAINT "pages_blocks_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_items" ADD CONSTRAINT "pages_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_plans_features" ADD CONSTRAINT "pages_blocks_pricing_plans_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_plans" ADD CONSTRAINT "pages_blocks_pricing_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing" ADD CONSTRAINT "pages_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_centered_micro" ADD CONSTRAINT "pages_blocks_hero_centered_micro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_centered"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_centered" ADD CONSTRAINT "pages_blocks_hero_centered_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_split_micro" ADD CONSTRAINT "pages_blocks_hero_split_micro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_split" ADD CONSTRAINT "pages_blocks_hero_split_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_split" ADD CONSTRAINT "pages_blocks_hero_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_dashboard_micro" ADD CONSTRAINT "pages_blocks_hero_dashboard_micro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_dashboard"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_dashboard" ADD CONSTRAINT "pages_blocks_hero_dashboard_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_dashboard" ADD CONSTRAINT "pages_blocks_hero_dashboard_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_bold_micro" ADD CONSTRAINT "pages_blocks_hero_bold_micro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_bold"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_bold_cards" ADD CONSTRAINT "pages_blocks_hero_bold_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_bold"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_bold" ADD CONSTRAINT "pages_blocks_hero_bold_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid_cards" ADD CONSTRAINT "pages_blocks_feature_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid" ADD CONSTRAINT "pages_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_zigzag_rows_bullets" ADD CONSTRAINT "pages_blocks_feature_zigzag_rows_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_zigzag_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_zigzag_rows" ADD CONSTRAINT "pages_blocks_feature_zigzag_rows_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_zigzag_rows" ADD CONSTRAINT "pages_blocks_feature_zigzag_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_zigzag"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_zigzag" ADD CONSTRAINT "pages_blocks_feature_zigzag_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_accordion_items" ADD CONSTRAINT "pages_blocks_feature_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_accordion" ADD CONSTRAINT "pages_blocks_feature_accordion_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_accordion" ADD CONSTRAINT "pages_blocks_feature_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_items" ADD CONSTRAINT "pages_blocks_steps_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps" ADD CONSTRAINT "pages_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_items" ADD CONSTRAINT "pages_blocks_timeline_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline" ADD CONSTRAINT "pages_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tabs_tabs_bullets" ADD CONSTRAINT "pages_blocks_tabs_tabs_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_tabs_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tabs_tabs" ADD CONSTRAINT "pages_blocks_tabs_tabs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_tabs_tabs" ADD CONSTRAINT "pages_blocks_tabs_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tabs" ADD CONSTRAINT "pages_blocks_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_metrics_items" ADD CONSTRAINT "pages_blocks_metrics_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_metrics" ADD CONSTRAINT "pages_blocks_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_big_quote" ADD CONSTRAINT "pages_blocks_big_quote_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_big_quote" ADD CONSTRAINT "pages_blocks_big_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_mini_pricing_plans_features" ADD CONSTRAINT "pages_blocks_mini_pricing_plans_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_mini_pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_mini_pricing_plans" ADD CONSTRAINT "pages_blocks_mini_pricing_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_mini_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_mini_pricing" ADD CONSTRAINT "pages_blocks_mini_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_strategy_form_bullets" ADD CONSTRAINT "pages_blocks_strategy_form_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_strategy_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_strategy_form_lead_options" ADD CONSTRAINT "pages_blocks_strategy_form_lead_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_strategy_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_strategy_form" ADD CONSTRAINT "pages_blocks_strategy_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_sticky_cta" ADD CONSTRAINT "pages_blocks_sticky_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_bonus_banner" ADD CONSTRAINT "pages_blocks_bonus_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logos_logos" ADD CONSTRAINT "_pages_v_blocks_logos_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logos_countries" ADD CONSTRAINT "_pages_v_blocks_logos_countries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logos" ADD CONSTRAINT "_pages_v_blocks_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_problem_items" ADD CONSTRAINT "_pages_v_blocks_problem_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_problem"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_problem" ADD CONSTRAINT "_pages_v_blocks_problem_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_benefits_items" ADD CONSTRAINT "_pages_v_blocks_benefits_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_benefits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_benefits" ADD CONSTRAINT "_pages_v_blocks_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_items" ADD CONSTRAINT "_pages_v_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing_plans_features" ADD CONSTRAINT "_pages_v_blocks_pricing_plans_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing_plans" ADD CONSTRAINT "_pages_v_blocks_pricing_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing" ADD CONSTRAINT "_pages_v_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_centered_micro" ADD CONSTRAINT "_pages_v_blocks_hero_centered_micro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_centered"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_centered" ADD CONSTRAINT "_pages_v_blocks_hero_centered_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_split_micro" ADD CONSTRAINT "_pages_v_blocks_hero_split_micro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_split" ADD CONSTRAINT "_pages_v_blocks_hero_split_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_split" ADD CONSTRAINT "_pages_v_blocks_hero_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_dashboard_micro" ADD CONSTRAINT "_pages_v_blocks_hero_dashboard_micro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_dashboard"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_dashboard" ADD CONSTRAINT "_pages_v_blocks_hero_dashboard_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_dashboard" ADD CONSTRAINT "_pages_v_blocks_hero_dashboard_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_bold_micro" ADD CONSTRAINT "_pages_v_blocks_hero_bold_micro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_bold"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_bold_cards" ADD CONSTRAINT "_pages_v_blocks_hero_bold_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_bold"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_bold" ADD CONSTRAINT "_pages_v_blocks_hero_bold_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_grid_cards" ADD CONSTRAINT "_pages_v_blocks_feature_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_grid" ADD CONSTRAINT "_pages_v_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_zigzag_rows_bullets" ADD CONSTRAINT "_pages_v_blocks_feature_zigzag_rows_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_zigzag_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_zigzag_rows" ADD CONSTRAINT "_pages_v_blocks_feature_zigzag_rows_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_zigzag_rows" ADD CONSTRAINT "_pages_v_blocks_feature_zigzag_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_zigzag"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_zigzag" ADD CONSTRAINT "_pages_v_blocks_feature_zigzag_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_accordion_items" ADD CONSTRAINT "_pages_v_blocks_feature_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_accordion" ADD CONSTRAINT "_pages_v_blocks_feature_accordion_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_accordion" ADD CONSTRAINT "_pages_v_blocks_feature_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps_items" ADD CONSTRAINT "_pages_v_blocks_steps_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps" ADD CONSTRAINT "_pages_v_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_items" ADD CONSTRAINT "_pages_v_blocks_timeline_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline" ADD CONSTRAINT "_pages_v_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tabs_tabs_bullets" ADD CONSTRAINT "_pages_v_blocks_tabs_tabs_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_tabs_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tabs_tabs" ADD CONSTRAINT "_pages_v_blocks_tabs_tabs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tabs_tabs" ADD CONSTRAINT "_pages_v_blocks_tabs_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tabs" ADD CONSTRAINT "_pages_v_blocks_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_metrics_items" ADD CONSTRAINT "_pages_v_blocks_metrics_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_metrics" ADD CONSTRAINT "_pages_v_blocks_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_big_quote" ADD CONSTRAINT "_pages_v_blocks_big_quote_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_big_quote" ADD CONSTRAINT "_pages_v_blocks_big_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_mini_pricing_plans_features" ADD CONSTRAINT "_pages_v_blocks_mini_pricing_plans_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_mini_pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_mini_pricing_plans" ADD CONSTRAINT "_pages_v_blocks_mini_pricing_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_mini_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_mini_pricing" ADD CONSTRAINT "_pages_v_blocks_mini_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_strategy_form_bullets" ADD CONSTRAINT "_pages_v_blocks_strategy_form_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_strategy_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_strategy_form_lead_options" ADD CONSTRAINT "_pages_v_blocks_strategy_form_lead_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_strategy_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_strategy_form" ADD CONSTRAINT "_pages_v_blocks_strategy_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_sticky_cta" ADD CONSTRAINT "_pages_v_blocks_sticky_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_bonus_banner" ADD CONSTRAINT "_pages_v_blocks_bonus_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "authors_locales" ADD CONSTRAINT "authors_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_locales" ADD CONSTRAINT "faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox_locales" ADD CONSTRAINT "forms_blocks_checkbox_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_checkbox"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country_locales" ADD CONSTRAINT "forms_blocks_country_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_country"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email_locales" ADD CONSTRAINT "forms_blocks_email_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_email"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message_locales" ADD CONSTRAINT "forms_blocks_message_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_message"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number_locales" ADD CONSTRAINT "forms_blocks_number_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_number"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options_locales" ADD CONSTRAINT "forms_blocks_select_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_locales" ADD CONSTRAINT "forms_blocks_select_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state" ADD CONSTRAINT "forms_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state_locales" ADD CONSTRAINT "forms_blocks_state_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_state"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text_locales" ADD CONSTRAINT "forms_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea_locales" ADD CONSTRAINT "forms_blocks_textarea_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_textarea"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails_locales" ADD CONSTRAINT "forms_emails_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_emails"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_locales" ADD CONSTRAINT "forms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_slug_idx" ON "posts_locales" USING btree ("slug","_locale");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v_locales" USING btree ("version_slug","_locale");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_locale_idx" ON "pages_blocks_hero" USING btree ("_locale");
  CREATE INDEX "pages_blocks_hero_logo_idx" ON "pages_blocks_hero" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_logos_logos_order_idx" ON "pages_blocks_logos_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_logos_logos_parent_id_idx" ON "pages_blocks_logos_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logos_logos_locale_idx" ON "pages_blocks_logos_logos" USING btree ("_locale");
  CREATE INDEX "pages_blocks_logos_countries_order_idx" ON "pages_blocks_logos_countries" USING btree ("_order");
  CREATE INDEX "pages_blocks_logos_countries_parent_id_idx" ON "pages_blocks_logos_countries" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logos_countries_locale_idx" ON "pages_blocks_logos_countries" USING btree ("_locale");
  CREATE INDEX "pages_blocks_logos_order_idx" ON "pages_blocks_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_logos_parent_id_idx" ON "pages_blocks_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logos_path_idx" ON "pages_blocks_logos" USING btree ("_path");
  CREATE INDEX "pages_blocks_logos_locale_idx" ON "pages_blocks_logos" USING btree ("_locale");
  CREATE INDEX "pages_blocks_problem_items_order_idx" ON "pages_blocks_problem_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_problem_items_parent_id_idx" ON "pages_blocks_problem_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_problem_items_locale_idx" ON "pages_blocks_problem_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_problem_order_idx" ON "pages_blocks_problem" USING btree ("_order");
  CREATE INDEX "pages_blocks_problem_parent_id_idx" ON "pages_blocks_problem" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_problem_path_idx" ON "pages_blocks_problem" USING btree ("_path");
  CREATE INDEX "pages_blocks_problem_locale_idx" ON "pages_blocks_problem" USING btree ("_locale");
  CREATE INDEX "pages_blocks_benefits_items_order_idx" ON "pages_blocks_benefits_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_benefits_items_parent_id_idx" ON "pages_blocks_benefits_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_benefits_items_locale_idx" ON "pages_blocks_benefits_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_benefits_order_idx" ON "pages_blocks_benefits" USING btree ("_order");
  CREATE INDEX "pages_blocks_benefits_parent_id_idx" ON "pages_blocks_benefits" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_benefits_path_idx" ON "pages_blocks_benefits" USING btree ("_path");
  CREATE INDEX "pages_blocks_benefits_locale_idx" ON "pages_blocks_benefits" USING btree ("_locale");
  CREATE INDEX "pages_blocks_testimonials_items_order_idx" ON "pages_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_items_parent_id_idx" ON "pages_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_items_locale_idx" ON "pages_blocks_testimonials_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_locale_idx" ON "pages_blocks_testimonials" USING btree ("_locale");
  CREATE INDEX "pages_blocks_pricing_plans_features_order_idx" ON "pages_blocks_pricing_plans_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_plans_features_parent_id_idx" ON "pages_blocks_pricing_plans_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_plans_features_locale_idx" ON "pages_blocks_pricing_plans_features" USING btree ("_locale");
  CREATE INDEX "pages_blocks_pricing_plans_order_idx" ON "pages_blocks_pricing_plans" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_plans_parent_id_idx" ON "pages_blocks_pricing_plans" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_plans_locale_idx" ON "pages_blocks_pricing_plans" USING btree ("_locale");
  CREATE INDEX "pages_blocks_pricing_order_idx" ON "pages_blocks_pricing" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_parent_id_idx" ON "pages_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_path_idx" ON "pages_blocks_pricing" USING btree ("_path");
  CREATE INDEX "pages_blocks_pricing_locale_idx" ON "pages_blocks_pricing" USING btree ("_locale");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_items_locale_idx" ON "pages_blocks_faq_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_locale_idx" ON "pages_blocks_faq" USING btree ("_locale");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_locale_idx" ON "pages_blocks_cta" USING btree ("_locale");
  CREATE INDEX "pages_blocks_hero_centered_micro_order_idx" ON "pages_blocks_hero_centered_micro" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_centered_micro_parent_id_idx" ON "pages_blocks_hero_centered_micro" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_centered_micro_locale_idx" ON "pages_blocks_hero_centered_micro" USING btree ("_locale");
  CREATE INDEX "pages_blocks_hero_centered_order_idx" ON "pages_blocks_hero_centered" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_centered_parent_id_idx" ON "pages_blocks_hero_centered" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_centered_path_idx" ON "pages_blocks_hero_centered" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_centered_locale_idx" ON "pages_blocks_hero_centered" USING btree ("_locale");
  CREATE INDEX "pages_blocks_hero_split_micro_order_idx" ON "pages_blocks_hero_split_micro" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_split_micro_parent_id_idx" ON "pages_blocks_hero_split_micro" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_split_micro_locale_idx" ON "pages_blocks_hero_split_micro" USING btree ("_locale");
  CREATE INDEX "pages_blocks_hero_split_order_idx" ON "pages_blocks_hero_split" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_split_parent_id_idx" ON "pages_blocks_hero_split" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_split_path_idx" ON "pages_blocks_hero_split" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_split_locale_idx" ON "pages_blocks_hero_split" USING btree ("_locale");
  CREATE INDEX "pages_blocks_hero_split_image_idx" ON "pages_blocks_hero_split" USING btree ("image_id");
  CREATE INDEX "pages_blocks_hero_dashboard_micro_order_idx" ON "pages_blocks_hero_dashboard_micro" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_dashboard_micro_parent_id_idx" ON "pages_blocks_hero_dashboard_micro" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_dashboard_micro_locale_idx" ON "pages_blocks_hero_dashboard_micro" USING btree ("_locale");
  CREATE INDEX "pages_blocks_hero_dashboard_order_idx" ON "pages_blocks_hero_dashboard" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_dashboard_parent_id_idx" ON "pages_blocks_hero_dashboard" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_dashboard_path_idx" ON "pages_blocks_hero_dashboard" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_dashboard_locale_idx" ON "pages_blocks_hero_dashboard" USING btree ("_locale");
  CREATE INDEX "pages_blocks_hero_dashboard_image_idx" ON "pages_blocks_hero_dashboard" USING btree ("image_id");
  CREATE INDEX "pages_blocks_hero_bold_micro_order_idx" ON "pages_blocks_hero_bold_micro" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_bold_micro_parent_id_idx" ON "pages_blocks_hero_bold_micro" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_bold_micro_locale_idx" ON "pages_blocks_hero_bold_micro" USING btree ("_locale");
  CREATE INDEX "pages_blocks_hero_bold_cards_order_idx" ON "pages_blocks_hero_bold_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_bold_cards_parent_id_idx" ON "pages_blocks_hero_bold_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_bold_cards_locale_idx" ON "pages_blocks_hero_bold_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_hero_bold_order_idx" ON "pages_blocks_hero_bold" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_bold_parent_id_idx" ON "pages_blocks_hero_bold" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_bold_path_idx" ON "pages_blocks_hero_bold" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_bold_locale_idx" ON "pages_blocks_hero_bold" USING btree ("_locale");
  CREATE INDEX "pages_blocks_feature_grid_cards_order_idx" ON "pages_blocks_feature_grid_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_grid_cards_parent_id_idx" ON "pages_blocks_feature_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_cards_locale_idx" ON "pages_blocks_feature_grid_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_feature_grid_order_idx" ON "pages_blocks_feature_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_grid_parent_id_idx" ON "pages_blocks_feature_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_path_idx" ON "pages_blocks_feature_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_feature_grid_locale_idx" ON "pages_blocks_feature_grid" USING btree ("_locale");
  CREATE INDEX "pages_blocks_feature_zigzag_rows_bullets_order_idx" ON "pages_blocks_feature_zigzag_rows_bullets" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_zigzag_rows_bullets_parent_id_idx" ON "pages_blocks_feature_zigzag_rows_bullets" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_zigzag_rows_bullets_locale_idx" ON "pages_blocks_feature_zigzag_rows_bullets" USING btree ("_locale");
  CREATE INDEX "pages_blocks_feature_zigzag_rows_order_idx" ON "pages_blocks_feature_zigzag_rows" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_zigzag_rows_parent_id_idx" ON "pages_blocks_feature_zigzag_rows" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_zigzag_rows_locale_idx" ON "pages_blocks_feature_zigzag_rows" USING btree ("_locale");
  CREATE INDEX "pages_blocks_feature_zigzag_rows_image_idx" ON "pages_blocks_feature_zigzag_rows" USING btree ("image_id");
  CREATE INDEX "pages_blocks_feature_zigzag_order_idx" ON "pages_blocks_feature_zigzag" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_zigzag_parent_id_idx" ON "pages_blocks_feature_zigzag" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_zigzag_path_idx" ON "pages_blocks_feature_zigzag" USING btree ("_path");
  CREATE INDEX "pages_blocks_feature_zigzag_locale_idx" ON "pages_blocks_feature_zigzag" USING btree ("_locale");
  CREATE INDEX "pages_blocks_feature_accordion_items_order_idx" ON "pages_blocks_feature_accordion_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_accordion_items_parent_id_idx" ON "pages_blocks_feature_accordion_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_accordion_items_locale_idx" ON "pages_blocks_feature_accordion_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_feature_accordion_order_idx" ON "pages_blocks_feature_accordion" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_accordion_parent_id_idx" ON "pages_blocks_feature_accordion" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_accordion_path_idx" ON "pages_blocks_feature_accordion" USING btree ("_path");
  CREATE INDEX "pages_blocks_feature_accordion_locale_idx" ON "pages_blocks_feature_accordion" USING btree ("_locale");
  CREATE INDEX "pages_blocks_feature_accordion_image_idx" ON "pages_blocks_feature_accordion" USING btree ("image_id");
  CREATE INDEX "pages_blocks_steps_items_order_idx" ON "pages_blocks_steps_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_items_parent_id_idx" ON "pages_blocks_steps_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_items_locale_idx" ON "pages_blocks_steps_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_steps_order_idx" ON "pages_blocks_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_parent_id_idx" ON "pages_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_path_idx" ON "pages_blocks_steps" USING btree ("_path");
  CREATE INDEX "pages_blocks_steps_locale_idx" ON "pages_blocks_steps" USING btree ("_locale");
  CREATE INDEX "pages_blocks_timeline_items_order_idx" ON "pages_blocks_timeline_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_items_parent_id_idx" ON "pages_blocks_timeline_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_items_locale_idx" ON "pages_blocks_timeline_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_timeline_order_idx" ON "pages_blocks_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_parent_id_idx" ON "pages_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_path_idx" ON "pages_blocks_timeline" USING btree ("_path");
  CREATE INDEX "pages_blocks_timeline_locale_idx" ON "pages_blocks_timeline" USING btree ("_locale");
  CREATE INDEX "pages_blocks_tabs_tabs_bullets_order_idx" ON "pages_blocks_tabs_tabs_bullets" USING btree ("_order");
  CREATE INDEX "pages_blocks_tabs_tabs_bullets_parent_id_idx" ON "pages_blocks_tabs_tabs_bullets" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_tabs_tabs_bullets_locale_idx" ON "pages_blocks_tabs_tabs_bullets" USING btree ("_locale");
  CREATE INDEX "pages_blocks_tabs_tabs_order_idx" ON "pages_blocks_tabs_tabs" USING btree ("_order");
  CREATE INDEX "pages_blocks_tabs_tabs_parent_id_idx" ON "pages_blocks_tabs_tabs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_tabs_tabs_locale_idx" ON "pages_blocks_tabs_tabs" USING btree ("_locale");
  CREATE INDEX "pages_blocks_tabs_tabs_image_idx" ON "pages_blocks_tabs_tabs" USING btree ("image_id");
  CREATE INDEX "pages_blocks_tabs_order_idx" ON "pages_blocks_tabs" USING btree ("_order");
  CREATE INDEX "pages_blocks_tabs_parent_id_idx" ON "pages_blocks_tabs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_tabs_path_idx" ON "pages_blocks_tabs" USING btree ("_path");
  CREATE INDEX "pages_blocks_tabs_locale_idx" ON "pages_blocks_tabs" USING btree ("_locale");
  CREATE INDEX "pages_blocks_metrics_items_order_idx" ON "pages_blocks_metrics_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_metrics_items_parent_id_idx" ON "pages_blocks_metrics_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_metrics_items_locale_idx" ON "pages_blocks_metrics_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_metrics_order_idx" ON "pages_blocks_metrics" USING btree ("_order");
  CREATE INDEX "pages_blocks_metrics_parent_id_idx" ON "pages_blocks_metrics" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_metrics_path_idx" ON "pages_blocks_metrics" USING btree ("_path");
  CREATE INDEX "pages_blocks_metrics_locale_idx" ON "pages_blocks_metrics" USING btree ("_locale");
  CREATE INDEX "pages_blocks_big_quote_order_idx" ON "pages_blocks_big_quote" USING btree ("_order");
  CREATE INDEX "pages_blocks_big_quote_parent_id_idx" ON "pages_blocks_big_quote" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_big_quote_path_idx" ON "pages_blocks_big_quote" USING btree ("_path");
  CREATE INDEX "pages_blocks_big_quote_locale_idx" ON "pages_blocks_big_quote" USING btree ("_locale");
  CREATE INDEX "pages_blocks_big_quote_avatar_idx" ON "pages_blocks_big_quote" USING btree ("avatar_id");
  CREATE INDEX "pages_blocks_mini_pricing_plans_features_order_idx" ON "pages_blocks_mini_pricing_plans_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_mini_pricing_plans_features_parent_id_idx" ON "pages_blocks_mini_pricing_plans_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_mini_pricing_plans_features_locale_idx" ON "pages_blocks_mini_pricing_plans_features" USING btree ("_locale");
  CREATE INDEX "pages_blocks_mini_pricing_plans_order_idx" ON "pages_blocks_mini_pricing_plans" USING btree ("_order");
  CREATE INDEX "pages_blocks_mini_pricing_plans_parent_id_idx" ON "pages_blocks_mini_pricing_plans" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_mini_pricing_plans_locale_idx" ON "pages_blocks_mini_pricing_plans" USING btree ("_locale");
  CREATE INDEX "pages_blocks_mini_pricing_order_idx" ON "pages_blocks_mini_pricing" USING btree ("_order");
  CREATE INDEX "pages_blocks_mini_pricing_parent_id_idx" ON "pages_blocks_mini_pricing" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_mini_pricing_path_idx" ON "pages_blocks_mini_pricing" USING btree ("_path");
  CREATE INDEX "pages_blocks_mini_pricing_locale_idx" ON "pages_blocks_mini_pricing" USING btree ("_locale");
  CREATE INDEX "pages_blocks_strategy_form_bullets_order_idx" ON "pages_blocks_strategy_form_bullets" USING btree ("_order");
  CREATE INDEX "pages_blocks_strategy_form_bullets_parent_id_idx" ON "pages_blocks_strategy_form_bullets" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_strategy_form_bullets_locale_idx" ON "pages_blocks_strategy_form_bullets" USING btree ("_locale");
  CREATE INDEX "pages_blocks_strategy_form_lead_options_order_idx" ON "pages_blocks_strategy_form_lead_options" USING btree ("_order");
  CREATE INDEX "pages_blocks_strategy_form_lead_options_parent_id_idx" ON "pages_blocks_strategy_form_lead_options" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_strategy_form_lead_options_locale_idx" ON "pages_blocks_strategy_form_lead_options" USING btree ("_locale");
  CREATE INDEX "pages_blocks_strategy_form_order_idx" ON "pages_blocks_strategy_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_strategy_form_parent_id_idx" ON "pages_blocks_strategy_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_strategy_form_path_idx" ON "pages_blocks_strategy_form" USING btree ("_path");
  CREATE INDEX "pages_blocks_strategy_form_locale_idx" ON "pages_blocks_strategy_form" USING btree ("_locale");
  CREATE INDEX "pages_blocks_sticky_cta_order_idx" ON "pages_blocks_sticky_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_sticky_cta_parent_id_idx" ON "pages_blocks_sticky_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_sticky_cta_path_idx" ON "pages_blocks_sticky_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_sticky_cta_locale_idx" ON "pages_blocks_sticky_cta" USING btree ("_locale");
  CREATE INDEX "pages_blocks_bonus_banner_order_idx" ON "pages_blocks_bonus_banner" USING btree ("_order");
  CREATE INDEX "pages_blocks_bonus_banner_parent_id_idx" ON "pages_blocks_bonus_banner" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_bonus_banner_path_idx" ON "pages_blocks_bonus_banner" USING btree ("_path");
  CREATE INDEX "pages_blocks_bonus_banner_locale_idx" ON "pages_blocks_bonus_banner" USING btree ("_locale");
  CREATE INDEX "pages_slug_idx" ON "pages_locales" USING btree ("slug","_locale");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_locale_idx" ON "_pages_v_blocks_hero" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_hero_logo_idx" ON "_pages_v_blocks_hero" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_logos_logos_order_idx" ON "_pages_v_blocks_logos_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logos_logos_parent_id_idx" ON "_pages_v_blocks_logos_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logos_logos_locale_idx" ON "_pages_v_blocks_logos_logos" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_logos_countries_order_idx" ON "_pages_v_blocks_logos_countries" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logos_countries_parent_id_idx" ON "_pages_v_blocks_logos_countries" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logos_countries_locale_idx" ON "_pages_v_blocks_logos_countries" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_logos_order_idx" ON "_pages_v_blocks_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logos_parent_id_idx" ON "_pages_v_blocks_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logos_path_idx" ON "_pages_v_blocks_logos" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_logos_locale_idx" ON "_pages_v_blocks_logos" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_problem_items_order_idx" ON "_pages_v_blocks_problem_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_problem_items_parent_id_idx" ON "_pages_v_blocks_problem_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_problem_items_locale_idx" ON "_pages_v_blocks_problem_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_problem_order_idx" ON "_pages_v_blocks_problem" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_problem_parent_id_idx" ON "_pages_v_blocks_problem" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_problem_path_idx" ON "_pages_v_blocks_problem" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_problem_locale_idx" ON "_pages_v_blocks_problem" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_benefits_items_order_idx" ON "_pages_v_blocks_benefits_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_benefits_items_parent_id_idx" ON "_pages_v_blocks_benefits_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_benefits_items_locale_idx" ON "_pages_v_blocks_benefits_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_benefits_order_idx" ON "_pages_v_blocks_benefits" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_benefits_parent_id_idx" ON "_pages_v_blocks_benefits" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_benefits_path_idx" ON "_pages_v_blocks_benefits" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_benefits_locale_idx" ON "_pages_v_blocks_benefits" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_testimonials_items_order_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_items_parent_id_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_items_locale_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_path_idx" ON "_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_locale_idx" ON "_pages_v_blocks_testimonials" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_pricing_plans_features_order_idx" ON "_pages_v_blocks_pricing_plans_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_plans_features_parent_id_idx" ON "_pages_v_blocks_pricing_plans_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_plans_features_locale_idx" ON "_pages_v_blocks_pricing_plans_features" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_pricing_plans_order_idx" ON "_pages_v_blocks_pricing_plans" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_plans_parent_id_idx" ON "_pages_v_blocks_pricing_plans" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_plans_locale_idx" ON "_pages_v_blocks_pricing_plans" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_pricing_order_idx" ON "_pages_v_blocks_pricing" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_parent_id_idx" ON "_pages_v_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_path_idx" ON "_pages_v_blocks_pricing" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_pricing_locale_idx" ON "_pages_v_blocks_pricing" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_faq_items_order_idx" ON "_pages_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_items_parent_id_idx" ON "_pages_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_items_locale_idx" ON "_pages_v_blocks_faq_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_locale_idx" ON "_pages_v_blocks_faq" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_locale_idx" ON "_pages_v_blocks_cta" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_hero_centered_micro_order_idx" ON "_pages_v_blocks_hero_centered_micro" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_centered_micro_parent_id_idx" ON "_pages_v_blocks_hero_centered_micro" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_centered_micro_locale_idx" ON "_pages_v_blocks_hero_centered_micro" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_hero_centered_order_idx" ON "_pages_v_blocks_hero_centered" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_centered_parent_id_idx" ON "_pages_v_blocks_hero_centered" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_centered_path_idx" ON "_pages_v_blocks_hero_centered" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_centered_locale_idx" ON "_pages_v_blocks_hero_centered" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_hero_split_micro_order_idx" ON "_pages_v_blocks_hero_split_micro" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_split_micro_parent_id_idx" ON "_pages_v_blocks_hero_split_micro" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_split_micro_locale_idx" ON "_pages_v_blocks_hero_split_micro" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_hero_split_order_idx" ON "_pages_v_blocks_hero_split" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_split_parent_id_idx" ON "_pages_v_blocks_hero_split" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_split_path_idx" ON "_pages_v_blocks_hero_split" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_split_locale_idx" ON "_pages_v_blocks_hero_split" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_hero_split_image_idx" ON "_pages_v_blocks_hero_split" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_hero_dashboard_micro_order_idx" ON "_pages_v_blocks_hero_dashboard_micro" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_dashboard_micro_parent_id_idx" ON "_pages_v_blocks_hero_dashboard_micro" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_dashboard_micro_locale_idx" ON "_pages_v_blocks_hero_dashboard_micro" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_hero_dashboard_order_idx" ON "_pages_v_blocks_hero_dashboard" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_dashboard_parent_id_idx" ON "_pages_v_blocks_hero_dashboard" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_dashboard_path_idx" ON "_pages_v_blocks_hero_dashboard" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_dashboard_locale_idx" ON "_pages_v_blocks_hero_dashboard" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_hero_dashboard_image_idx" ON "_pages_v_blocks_hero_dashboard" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_hero_bold_micro_order_idx" ON "_pages_v_blocks_hero_bold_micro" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_bold_micro_parent_id_idx" ON "_pages_v_blocks_hero_bold_micro" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_bold_micro_locale_idx" ON "_pages_v_blocks_hero_bold_micro" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_hero_bold_cards_order_idx" ON "_pages_v_blocks_hero_bold_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_bold_cards_parent_id_idx" ON "_pages_v_blocks_hero_bold_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_bold_cards_locale_idx" ON "_pages_v_blocks_hero_bold_cards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_hero_bold_order_idx" ON "_pages_v_blocks_hero_bold" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_bold_parent_id_idx" ON "_pages_v_blocks_hero_bold" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_bold_path_idx" ON "_pages_v_blocks_hero_bold" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_bold_locale_idx" ON "_pages_v_blocks_hero_bold" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_feature_grid_cards_order_idx" ON "_pages_v_blocks_feature_grid_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_grid_cards_parent_id_idx" ON "_pages_v_blocks_feature_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_cards_locale_idx" ON "_pages_v_blocks_feature_grid_cards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_feature_grid_order_idx" ON "_pages_v_blocks_feature_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_grid_parent_id_idx" ON "_pages_v_blocks_feature_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_path_idx" ON "_pages_v_blocks_feature_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_feature_grid_locale_idx" ON "_pages_v_blocks_feature_grid" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_feature_zigzag_rows_bullets_order_idx" ON "_pages_v_blocks_feature_zigzag_rows_bullets" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_zigzag_rows_bullets_parent_id_idx" ON "_pages_v_blocks_feature_zigzag_rows_bullets" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_zigzag_rows_bullets_locale_idx" ON "_pages_v_blocks_feature_zigzag_rows_bullets" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_feature_zigzag_rows_order_idx" ON "_pages_v_blocks_feature_zigzag_rows" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_zigzag_rows_parent_id_idx" ON "_pages_v_blocks_feature_zigzag_rows" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_zigzag_rows_locale_idx" ON "_pages_v_blocks_feature_zigzag_rows" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_feature_zigzag_rows_image_idx" ON "_pages_v_blocks_feature_zigzag_rows" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_feature_zigzag_order_idx" ON "_pages_v_blocks_feature_zigzag" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_zigzag_parent_id_idx" ON "_pages_v_blocks_feature_zigzag" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_zigzag_path_idx" ON "_pages_v_blocks_feature_zigzag" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_feature_zigzag_locale_idx" ON "_pages_v_blocks_feature_zigzag" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_feature_accordion_items_order_idx" ON "_pages_v_blocks_feature_accordion_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_accordion_items_parent_id_idx" ON "_pages_v_blocks_feature_accordion_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_accordion_items_locale_idx" ON "_pages_v_blocks_feature_accordion_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_feature_accordion_order_idx" ON "_pages_v_blocks_feature_accordion" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_accordion_parent_id_idx" ON "_pages_v_blocks_feature_accordion" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_accordion_path_idx" ON "_pages_v_blocks_feature_accordion" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_feature_accordion_locale_idx" ON "_pages_v_blocks_feature_accordion" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_feature_accordion_image_idx" ON "_pages_v_blocks_feature_accordion" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_steps_items_order_idx" ON "_pages_v_blocks_steps_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_steps_items_parent_id_idx" ON "_pages_v_blocks_steps_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_items_locale_idx" ON "_pages_v_blocks_steps_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_steps_order_idx" ON "_pages_v_blocks_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_steps_parent_id_idx" ON "_pages_v_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_path_idx" ON "_pages_v_blocks_steps" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_steps_locale_idx" ON "_pages_v_blocks_steps" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_timeline_items_order_idx" ON "_pages_v_blocks_timeline_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_items_parent_id_idx" ON "_pages_v_blocks_timeline_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_items_locale_idx" ON "_pages_v_blocks_timeline_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_timeline_order_idx" ON "_pages_v_blocks_timeline" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_parent_id_idx" ON "_pages_v_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_path_idx" ON "_pages_v_blocks_timeline" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_timeline_locale_idx" ON "_pages_v_blocks_timeline" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_tabs_tabs_bullets_order_idx" ON "_pages_v_blocks_tabs_tabs_bullets" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_tabs_tabs_bullets_parent_id_idx" ON "_pages_v_blocks_tabs_tabs_bullets" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_tabs_tabs_bullets_locale_idx" ON "_pages_v_blocks_tabs_tabs_bullets" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_tabs_tabs_order_idx" ON "_pages_v_blocks_tabs_tabs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_tabs_tabs_parent_id_idx" ON "_pages_v_blocks_tabs_tabs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_tabs_tabs_locale_idx" ON "_pages_v_blocks_tabs_tabs" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_tabs_tabs_image_idx" ON "_pages_v_blocks_tabs_tabs" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_tabs_order_idx" ON "_pages_v_blocks_tabs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_tabs_parent_id_idx" ON "_pages_v_blocks_tabs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_tabs_path_idx" ON "_pages_v_blocks_tabs" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_tabs_locale_idx" ON "_pages_v_blocks_tabs" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_metrics_items_order_idx" ON "_pages_v_blocks_metrics_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_metrics_items_parent_id_idx" ON "_pages_v_blocks_metrics_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_metrics_items_locale_idx" ON "_pages_v_blocks_metrics_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_metrics_order_idx" ON "_pages_v_blocks_metrics" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_metrics_parent_id_idx" ON "_pages_v_blocks_metrics" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_metrics_path_idx" ON "_pages_v_blocks_metrics" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_metrics_locale_idx" ON "_pages_v_blocks_metrics" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_big_quote_order_idx" ON "_pages_v_blocks_big_quote" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_big_quote_parent_id_idx" ON "_pages_v_blocks_big_quote" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_big_quote_path_idx" ON "_pages_v_blocks_big_quote" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_big_quote_locale_idx" ON "_pages_v_blocks_big_quote" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_big_quote_avatar_idx" ON "_pages_v_blocks_big_quote" USING btree ("avatar_id");
  CREATE INDEX "_pages_v_blocks_mini_pricing_plans_features_order_idx" ON "_pages_v_blocks_mini_pricing_plans_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_mini_pricing_plans_features_parent_id_idx" ON "_pages_v_blocks_mini_pricing_plans_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_mini_pricing_plans_features_locale_idx" ON "_pages_v_blocks_mini_pricing_plans_features" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_mini_pricing_plans_order_idx" ON "_pages_v_blocks_mini_pricing_plans" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_mini_pricing_plans_parent_id_idx" ON "_pages_v_blocks_mini_pricing_plans" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_mini_pricing_plans_locale_idx" ON "_pages_v_blocks_mini_pricing_plans" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_mini_pricing_order_idx" ON "_pages_v_blocks_mini_pricing" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_mini_pricing_parent_id_idx" ON "_pages_v_blocks_mini_pricing" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_mini_pricing_path_idx" ON "_pages_v_blocks_mini_pricing" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_mini_pricing_locale_idx" ON "_pages_v_blocks_mini_pricing" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_strategy_form_bullets_order_idx" ON "_pages_v_blocks_strategy_form_bullets" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_strategy_form_bullets_parent_id_idx" ON "_pages_v_blocks_strategy_form_bullets" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_strategy_form_bullets_locale_idx" ON "_pages_v_blocks_strategy_form_bullets" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_strategy_form_lead_options_order_idx" ON "_pages_v_blocks_strategy_form_lead_options" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_strategy_form_lead_options_parent_id_idx" ON "_pages_v_blocks_strategy_form_lead_options" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_strategy_form_lead_options_locale_idx" ON "_pages_v_blocks_strategy_form_lead_options" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_strategy_form_order_idx" ON "_pages_v_blocks_strategy_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_strategy_form_parent_id_idx" ON "_pages_v_blocks_strategy_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_strategy_form_path_idx" ON "_pages_v_blocks_strategy_form" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_strategy_form_locale_idx" ON "_pages_v_blocks_strategy_form" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_sticky_cta_order_idx" ON "_pages_v_blocks_sticky_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_sticky_cta_parent_id_idx" ON "_pages_v_blocks_sticky_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_sticky_cta_path_idx" ON "_pages_v_blocks_sticky_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_sticky_cta_locale_idx" ON "_pages_v_blocks_sticky_cta" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_bonus_banner_order_idx" ON "_pages_v_blocks_bonus_banner" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_bonus_banner_parent_id_idx" ON "_pages_v_blocks_bonus_banner" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_bonus_banner_path_idx" ON "_pages_v_blocks_bonus_banner" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_bonus_banner_locale_idx" ON "_pages_v_blocks_bonus_banner" USING btree ("_locale");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v_locales" USING btree ("version_slug","_locale");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_slug_idx" ON "categories_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "authors_locales_locale_parent_id_unique" ON "authors_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "faqs_locales_locale_parent_id_unique" ON "faqs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_locales_locale_parent_id_unique" ON "forms_blocks_checkbox_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_country_order_idx" ON "forms_blocks_country" USING btree ("_order");
  CREATE INDEX "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_country_path_idx" ON "forms_blocks_country" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_country_locales_locale_parent_id_unique" ON "forms_blocks_country_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_email_locales_locale_parent_id_unique" ON "forms_blocks_email_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_message_locales_locale_parent_id_unique" ON "forms_blocks_message_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_number_locales_locale_parent_id_unique" ON "forms_blocks_number_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_select_options_locales_locale_parent_id_unique" ON "forms_blocks_select_options_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_select_locales_locale_parent_id_unique" ON "forms_blocks_select_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_state_order_idx" ON "forms_blocks_state" USING btree ("_order");
  CREATE INDEX "forms_blocks_state_parent_id_idx" ON "forms_blocks_state" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_state_path_idx" ON "forms_blocks_state" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_state_locales_locale_parent_id_unique" ON "forms_blocks_state_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_text_locales_locale_parent_id_unique" ON "forms_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_textarea_locales_locale_parent_id_unique" ON "forms_blocks_textarea_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_emails_locales_locale_parent_id_unique" ON "forms_emails_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE UNIQUE INDEX "forms_locales_locale_parent_id_unique" ON "forms_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE INDEX "redirects_rels_posts_id_idx" ON "redirects_rels" USING btree ("posts_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  ALTER TABLE "posts" DROP COLUMN "title";
  ALTER TABLE "posts" DROP COLUMN "slug";
  ALTER TABLE "posts" DROP COLUMN "lang";
  ALTER TABLE "posts" DROP COLUMN "related_locale_id";
  ALTER TABLE "posts" DROP COLUMN "excerpt";
  ALTER TABLE "posts" DROP COLUMN "content";
  ALTER TABLE "posts" DROP COLUMN "read_time";
  ALTER TABLE "posts" DROP COLUMN "seo_meta_title";
  ALTER TABLE "posts" DROP COLUMN "seo_meta_description";
  ALTER TABLE "posts" DROP COLUMN "seo_og_image_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_title";
  ALTER TABLE "_posts_v" DROP COLUMN "version_slug";
  ALTER TABLE "_posts_v" DROP COLUMN "version_lang";
  ALTER TABLE "_posts_v" DROP COLUMN "version_related_locale_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_excerpt";
  ALTER TABLE "_posts_v" DROP COLUMN "version_content";
  ALTER TABLE "_posts_v" DROP COLUMN "version_read_time";
  ALTER TABLE "_posts_v" DROP COLUMN "version_seo_meta_title";
  ALTER TABLE "_posts_v" DROP COLUMN "version_seo_meta_description";
  ALTER TABLE "_posts_v" DROP COLUMN "version_seo_og_image_id";
  ALTER TABLE "pages" DROP COLUMN "title";
  ALTER TABLE "pages" DROP COLUMN "slug";
  ALTER TABLE "pages" DROP COLUMN "lang";
  ALTER TABLE "pages" DROP COLUMN "related_locale_id";
  ALTER TABLE "pages" DROP COLUMN "content";
  ALTER TABLE "pages" DROP COLUMN "seo_meta_title";
  ALTER TABLE "pages" DROP COLUMN "seo_meta_description";
  ALTER TABLE "pages" DROP COLUMN "seo_og_image_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_title";
  ALTER TABLE "_pages_v" DROP COLUMN "version_slug";
  ALTER TABLE "_pages_v" DROP COLUMN "version_lang";
  ALTER TABLE "_pages_v" DROP COLUMN "version_related_locale_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_content";
  ALTER TABLE "_pages_v" DROP COLUMN "version_seo_meta_title";
  ALTER TABLE "_pages_v" DROP COLUMN "version_seo_meta_description";
  ALTER TABLE "_pages_v" DROP COLUMN "version_seo_og_image_id";
  ALTER TABLE "categories" DROP COLUMN "title";
  ALTER TABLE "categories" DROP COLUMN "slug";
  ALTER TABLE "categories" DROP COLUMN "lang";
  ALTER TABLE "categories" DROP COLUMN "related_locale_id";
  ALTER TABLE "categories" DROP COLUMN "description";
  ALTER TABLE "authors" DROP COLUMN "role";
  ALTER TABLE "authors" DROP COLUMN "bio";
  ALTER TABLE "faqs" DROP COLUMN "question";
  ALTER TABLE "faqs" DROP COLUMN "answer";
  ALTER TABLE "faqs" DROP COLUMN "lang";
  DROP TYPE "public"."enum_posts_lang";
  DROP TYPE "public"."enum__posts_v_version_lang";
  DROP TYPE "public"."enum_pages_lang";
  DROP TYPE "public"."enum__pages_v_version_lang";
  DROP TYPE "public"."enum_categories_lang";
  DROP TYPE "public"."enum_faqs_lang";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_lang" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum__posts_v_version_lang" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum_pages_lang" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum__pages_v_version_lang" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum_categories_lang" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum_faqs_lang" AS ENUM('en', 'es');
  ALTER TABLE "posts_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_logos_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_logos_countries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_problem_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_problem" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_benefits_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_testimonials_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_pricing_plans_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_pricing_plans" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_pricing" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_centered_micro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_centered" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_split_micro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_split" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_dashboard_micro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_dashboard" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_bold_micro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_bold_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_bold" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_feature_grid_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_feature_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_feature_zigzag_rows_bullets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_feature_zigzag_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_feature_zigzag" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_feature_accordion_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_feature_accordion" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_steps_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_timeline_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_tabs_tabs_bullets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_tabs_tabs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_tabs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_metrics_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_metrics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_big_quote" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_mini_pricing_plans_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_mini_pricing_plans" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_mini_pricing" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_strategy_form_bullets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_strategy_form_lead_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_strategy_form" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_sticky_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_bonus_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_logos_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_logos_countries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_problem_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_problem" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_benefits_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_testimonials_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_pricing_plans_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_pricing_plans" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_pricing" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_centered_micro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_centered" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_split_micro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_split" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_dashboard_micro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_dashboard" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_bold_micro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_bold_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_bold" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_feature_grid_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_feature_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_feature_zigzag_rows_bullets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_feature_zigzag_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_feature_zigzag" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_feature_accordion_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_feature_accordion" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_steps_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_timeline_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_tabs_tabs_bullets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_tabs_tabs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_tabs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_metrics_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_metrics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_big_quote" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_mini_pricing_plans_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_mini_pricing_plans" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_mini_pricing" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_strategy_form_bullets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_strategy_form_lead_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_strategy_form" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_sticky_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_bonus_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "authors_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faqs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_checkbox" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_checkbox_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_country" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_country_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_email" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_email_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_message" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_message_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_number" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_number_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_select_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_select_options_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_select" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_select_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_state" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_state_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_text_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_textarea" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_textarea_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_emails" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_emails_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_submissions_submission_data" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_submissions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "redirects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "redirects_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_logos_logos" CASCADE;
  DROP TABLE "pages_blocks_logos_countries" CASCADE;
  DROP TABLE "pages_blocks_logos" CASCADE;
  DROP TABLE "pages_blocks_problem_items" CASCADE;
  DROP TABLE "pages_blocks_problem" CASCADE;
  DROP TABLE "pages_blocks_benefits_items" CASCADE;
  DROP TABLE "pages_blocks_benefits" CASCADE;
  DROP TABLE "pages_blocks_testimonials_items" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_pricing_plans_features" CASCADE;
  DROP TABLE "pages_blocks_pricing_plans" CASCADE;
  DROP TABLE "pages_blocks_pricing" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_hero_centered_micro" CASCADE;
  DROP TABLE "pages_blocks_hero_centered" CASCADE;
  DROP TABLE "pages_blocks_hero_split_micro" CASCADE;
  DROP TABLE "pages_blocks_hero_split" CASCADE;
  DROP TABLE "pages_blocks_hero_dashboard_micro" CASCADE;
  DROP TABLE "pages_blocks_hero_dashboard" CASCADE;
  DROP TABLE "pages_blocks_hero_bold_micro" CASCADE;
  DROP TABLE "pages_blocks_hero_bold_cards" CASCADE;
  DROP TABLE "pages_blocks_hero_bold" CASCADE;
  DROP TABLE "pages_blocks_feature_grid_cards" CASCADE;
  DROP TABLE "pages_blocks_feature_grid" CASCADE;
  DROP TABLE "pages_blocks_feature_zigzag_rows_bullets" CASCADE;
  DROP TABLE "pages_blocks_feature_zigzag_rows" CASCADE;
  DROP TABLE "pages_blocks_feature_zigzag" CASCADE;
  DROP TABLE "pages_blocks_feature_accordion_items" CASCADE;
  DROP TABLE "pages_blocks_feature_accordion" CASCADE;
  DROP TABLE "pages_blocks_steps_items" CASCADE;
  DROP TABLE "pages_blocks_steps" CASCADE;
  DROP TABLE "pages_blocks_timeline_items" CASCADE;
  DROP TABLE "pages_blocks_timeline" CASCADE;
  DROP TABLE "pages_blocks_tabs_tabs_bullets" CASCADE;
  DROP TABLE "pages_blocks_tabs_tabs" CASCADE;
  DROP TABLE "pages_blocks_tabs" CASCADE;
  DROP TABLE "pages_blocks_metrics_items" CASCADE;
  DROP TABLE "pages_blocks_metrics" CASCADE;
  DROP TABLE "pages_blocks_big_quote" CASCADE;
  DROP TABLE "pages_blocks_mini_pricing_plans_features" CASCADE;
  DROP TABLE "pages_blocks_mini_pricing_plans" CASCADE;
  DROP TABLE "pages_blocks_mini_pricing" CASCADE;
  DROP TABLE "pages_blocks_strategy_form_bullets" CASCADE;
  DROP TABLE "pages_blocks_strategy_form_lead_options" CASCADE;
  DROP TABLE "pages_blocks_strategy_form" CASCADE;
  DROP TABLE "pages_blocks_sticky_cta" CASCADE;
  DROP TABLE "pages_blocks_bonus_banner" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_logos_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_logos_countries" CASCADE;
  DROP TABLE "_pages_v_blocks_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_problem_items" CASCADE;
  DROP TABLE "_pages_v_blocks_problem" CASCADE;
  DROP TABLE "_pages_v_blocks_benefits_items" CASCADE;
  DROP TABLE "_pages_v_blocks_benefits" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_items" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing_plans_features" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing_plans" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_centered_micro" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_centered" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_split_micro" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_split" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_dashboard_micro" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_dashboard" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_bold_micro" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_bold_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_bold" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_grid_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_zigzag_rows_bullets" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_zigzag_rows" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_zigzag" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_accordion_items" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_accordion" CASCADE;
  DROP TABLE "_pages_v_blocks_steps_items" CASCADE;
  DROP TABLE "_pages_v_blocks_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_items" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline" CASCADE;
  DROP TABLE "_pages_v_blocks_tabs_tabs_bullets" CASCADE;
  DROP TABLE "_pages_v_blocks_tabs_tabs" CASCADE;
  DROP TABLE "_pages_v_blocks_tabs" CASCADE;
  DROP TABLE "_pages_v_blocks_metrics_items" CASCADE;
  DROP TABLE "_pages_v_blocks_metrics" CASCADE;
  DROP TABLE "_pages_v_blocks_big_quote" CASCADE;
  DROP TABLE "_pages_v_blocks_mini_pricing_plans_features" CASCADE;
  DROP TABLE "_pages_v_blocks_mini_pricing_plans" CASCADE;
  DROP TABLE "_pages_v_blocks_mini_pricing" CASCADE;
  DROP TABLE "_pages_v_blocks_strategy_form_bullets" CASCADE;
  DROP TABLE "_pages_v_blocks_strategy_form_lead_options" CASCADE;
  DROP TABLE "_pages_v_blocks_strategy_form" CASCADE;
  DROP TABLE "_pages_v_blocks_sticky_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_bonus_banner" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "authors_locales" CASCADE;
  DROP TABLE "faqs_locales" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_checkbox_locales" CASCADE;
  DROP TABLE "forms_blocks_country" CASCADE;
  DROP TABLE "forms_blocks_country_locales" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_email_locales" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_message_locales" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_number_locales" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select_options_locales" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_select_locales" CASCADE;
  DROP TABLE "forms_blocks_state" CASCADE;
  DROP TABLE "forms_blocks_state_locales" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_text_locales" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_blocks_textarea_locales" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms_emails_locales" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "forms_locales" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_forms_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_form_submissions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_redirects_fk";
  
  DROP INDEX "_posts_v_snapshot_idx";
  DROP INDEX "_posts_v_published_locale_idx";
  DROP INDEX "_pages_v_snapshot_idx";
  DROP INDEX "_pages_v_published_locale_idx";
  DROP INDEX "payload_locked_documents_rels_forms_id_idx";
  DROP INDEX "payload_locked_documents_rels_form_submissions_id_idx";
  DROP INDEX "payload_locked_documents_rels_redirects_id_idx";
  ALTER TABLE "posts" ADD COLUMN "title" varchar;
  ALTER TABLE "posts" ADD COLUMN "slug" varchar;
  ALTER TABLE "posts" ADD COLUMN "lang" "enum_posts_lang" DEFAULT 'en';
  ALTER TABLE "posts" ADD COLUMN "related_locale_id" integer;
  ALTER TABLE "posts" ADD COLUMN "excerpt" varchar;
  ALTER TABLE "posts" ADD COLUMN "content" jsonb;
  ALTER TABLE "posts" ADD COLUMN "read_time" numeric;
  ALTER TABLE "posts" ADD COLUMN "seo_meta_title" varchar;
  ALTER TABLE "posts" ADD COLUMN "seo_meta_description" varchar;
  ALTER TABLE "posts" ADD COLUMN "seo_og_image_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_slug" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_lang" "enum__posts_v_version_lang" DEFAULT 'en';
  ALTER TABLE "_posts_v" ADD COLUMN "version_related_locale_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_excerpt" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_content" jsonb;
  ALTER TABLE "_posts_v" ADD COLUMN "version_read_time" numeric;
  ALTER TABLE "_posts_v" ADD COLUMN "version_seo_meta_title" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_seo_meta_description" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_seo_og_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "title" varchar;
  ALTER TABLE "pages" ADD COLUMN "slug" varchar;
  ALTER TABLE "pages" ADD COLUMN "lang" "enum_pages_lang" DEFAULT 'en';
  ALTER TABLE "pages" ADD COLUMN "related_locale_id" integer;
  ALTER TABLE "pages" ADD COLUMN "content" jsonb;
  ALTER TABLE "pages" ADD COLUMN "seo_meta_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "seo_meta_description" varchar;
  ALTER TABLE "pages" ADD COLUMN "seo_og_image_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_slug" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_lang" "enum__pages_v_version_lang" DEFAULT 'en';
  ALTER TABLE "_pages_v" ADD COLUMN "version_related_locale_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_content" jsonb;
  ALTER TABLE "_pages_v" ADD COLUMN "version_seo_meta_title" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_seo_meta_description" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_seo_og_image_id" integer;
  ALTER TABLE "categories" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "categories" ADD COLUMN "slug" varchar NOT NULL;
  ALTER TABLE "categories" ADD COLUMN "lang" "enum_categories_lang" DEFAULT 'en' NOT NULL;
  ALTER TABLE "categories" ADD COLUMN "related_locale_id" integer;
  ALTER TABLE "categories" ADD COLUMN "description" varchar;
  ALTER TABLE "authors" ADD COLUMN "role" varchar;
  ALTER TABLE "authors" ADD COLUMN "bio" varchar;
  ALTER TABLE "faqs" ADD COLUMN "question" varchar NOT NULL;
  ALTER TABLE "faqs" ADD COLUMN "answer" jsonb NOT NULL;
  ALTER TABLE "faqs" ADD COLUMN "lang" "enum_faqs_lang" DEFAULT 'en' NOT NULL;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_related_locale_id_posts_id_fk" FOREIGN KEY ("related_locale_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_related_locale_id_posts_id_fk" FOREIGN KEY ("version_related_locale_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_related_locale_id_pages_id_fk" FOREIGN KEY ("related_locale_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_related_locale_id_pages_id_fk" FOREIGN KEY ("version_related_locale_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_related_locale_id_categories_id_fk" FOREIGN KEY ("related_locale_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_related_locale_idx" ON "posts" USING btree ("related_locale_id");
  CREATE INDEX "posts_seo_seo_og_image_idx" ON "posts" USING btree ("seo_og_image_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_related_locale_idx" ON "_posts_v" USING btree ("version_related_locale_id");
  CREATE INDEX "_posts_v_version_seo_version_seo_og_image_idx" ON "_posts_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_related_locale_idx" ON "pages" USING btree ("related_locale_id");
  CREATE INDEX "pages_seo_seo_og_image_idx" ON "pages" USING btree ("seo_og_image_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_related_locale_idx" ON "_pages_v" USING btree ("version_related_locale_id");
  CREATE INDEX "_pages_v_version_seo_version_seo_og_image_idx" ON "_pages_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_related_locale_idx" ON "categories" USING btree ("related_locale_id");
  ALTER TABLE "_posts_v" DROP COLUMN "snapshot";
  ALTER TABLE "_posts_v" DROP COLUMN "published_locale";
  ALTER TABLE "_pages_v" DROP COLUMN "snapshot";
  ALTER TABLE "_pages_v" DROP COLUMN "published_locale";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "forms_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "form_submissions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "redirects_id";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum_pages_blocks_problem_items_icon";
  DROP TYPE "public"."enum_pages_blocks_pricing_plans_plan_id";
  DROP TYPE "public"."enum_pages_blocks_hero_centered_accent_color";
  DROP TYPE "public"."enum_pages_blocks_hero_split_accent_color";
  DROP TYPE "public"."enum_pages_blocks_hero_dashboard_accent_color";
  DROP TYPE "public"."enum_pages_blocks_hero_bold_accent_color";
  DROP TYPE "public"."enum__pages_v_blocks_problem_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_pricing_plans_plan_id";
  DROP TYPE "public"."enum__pages_v_blocks_hero_centered_accent_color";
  DROP TYPE "public"."enum__pages_v_blocks_hero_split_accent_color";
  DROP TYPE "public"."enum__pages_v_blocks_hero_dashboard_accent_color";
  DROP TYPE "public"."enum__pages_v_blocks_hero_bold_accent_color";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_forms_confirmation_type";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_redirects_type";`)
}
