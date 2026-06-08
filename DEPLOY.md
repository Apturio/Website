# Apturio v2.0 — Deploy & Launch Checklist

Ordered, concrete runbook for taking the Next.js 16 + Payload 3 build from the
`feature/cms-implementation` branch to production at **https://apturio.com**.

Legend:
- 🤖 **CI** — automated in the Vercel build pipeline (the `build` script). No human action.
- [M] **Manual** — a one-time human step at deploy (dashboard click, DNS, curl gate).

> Never commit secrets. All values below are **env var names** only. Fill them in
> the Vercel dashboard / provider consoles. Local placeholders live in
> `website/.env.example`.

---

## 0. Pre-flight (local, before touching infra)

- [ ] 🤖 `npx tsc --noEmit` → exit 0
- [ ] 🤖 `npx payload generate:types` → no diff vs committed `src/payload-types.ts`
- [ ] 🤖 `npx next build` → exit 0
- [ ] [M] `npm run seed` against a throwaway DB completes without throwing (the
      `afterChange` revalidate hook logs "skipped (outside request scope)" — that
      is expected and harmless).

---

## 1. Neon (Postgres) — production database

- [ ] [M] Create a **production branch** in the Neon project (keep dev/preview on
      separate branches so a preview deploy's `payload migrate` never touches prod).
- [ ] [M] Copy the **pooler** connection string — it MUST end in
      `-pooler.neon.tech` and carry `?sslmode=require`. Example shape:
      `postgresql://USER:PASSWORD@ep-xxxx-pooler.<region>.aws.neon.tech/DB?sslmode=require`
- [ ] 🤖 `pool.max` is already pinned to **3** in `src/payload.config.ts`
      (`postgresAdapter({ pool: { max: 3 } })`) — required so concurrent Vercel
      serverless instances don't exhaust Neon's connection limit. No change needed.
- [ ] [M] Confirm in Neon dashboard that the production branch connection limit
      gives headroom (target < 70% utilization under expected load).
- [ ] [M] **Generate a tracked migration for a FRESH prod DB.** The dev Neon DB was
      built incrementally via Payload dev schema-push, so only the *initial* migration
      is tracked in `src/migrations/`; the Phase-8 collections + Phase-11 block schema
      live in the dev DB but are NOT yet in a committed migration. On a clean production
      Neon branch, before the first deploy, run against that branch:
      `DATABASE_URI=<prod-branch-url> npx payload migrate:create` then commit the
      generated file. The build command's `payload migrate` will then create the full
      schema (Users, Media, Posts, Pages w/ layout blocks, Categories, Authors, Faqs)
      on fresh databases. (On the existing dev DB the schema is already present, so do
      NOT run a fresh migrate against it — it would conflict.)

**Why pooler:** each Vercel function holds its own pool; the PgBouncer pooler URL
multiplexes them. The direct URL will hit `too many connections` under traffic.

---

## 2. Cloudflare R2 — media storage

- [ ] [M] Create an R2 bucket (e.g. `apturio-media`).
- [ ] [M] Generate an R2 **API token** (Access Key ID + Secret Access Key).
- [ ] [M] Set the bucket **CORS policy** to allow the Vercel optimizer origin and
      the production domain:
      ```json
      [
        {
          "AllowedOrigins": ["https://apturio.com", "https://*.vercel.app"],
          "AllowedMethods": ["GET", "HEAD"],
          "AllowedHeaders": ["*"],
          "MaxAgeSeconds": 3600
        }
      ]
      ```
- [ ] [M] Enable public access and attach a **custom domain** for media
      (e.g. `media.apturio.com`) so the public URL is stable and CDN-accelerated.
- [ ] [M] Add the media hostname to `images.remotePatterns` in `next.config.mjs`
      if not already present (required for `next/image` optimization of R2 assets).

**Storage activation:** `src/payload.config.ts` only enables the `s3Storage`
plugin when **all four** S3 env vars are present
(`S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_ENDPOINT`).
Without them it falls back to local-disk storage — so dev keeps working with no R2,
and production uses R2 automatically once the vars are set. No code toggle needed.

---

## 3. Vercel — project + environment

- [ ] [M] Import the repo into Vercel; root directory = `website/`.
- [ ] [M] Set Node version to **20.x** (Project Settings → Build → Node.js Version,
      or `engines.node` in `package.json` which already pins `>=20.9.0`).
- [ ] [M] Set the **Build Command** to:
      ```
      payload migrate && payload generate:importmap && payload generate:types && next build
      ```
      (This is already the repo's `npm run build` script — Vercel can use the
      default. Migrations are idempotent; running them in the build is the only
      serverless-safe option.)
- [ ] [M] Set **Environment Variables** (Production scope; use a separate Neon
      branch URL for Preview scope):

  | Variable | Value (shape) | Notes |
  |----------|---------------|-------|
  | `DATABASE_URI` | `postgresql://…-pooler.neon.tech/DB?sslmode=require` | 🤖 consumed by `postgresAdapter`. MUST be the **pooler** URL. |
  | `PAYLOAD_SECRET` | long random string | Admin auth/session secret. Rotate if leaked. |
  | `NEXT_PUBLIC_SERVER_URL` | `https://apturio.com` | Public origin; drives canonical/OG URLs. |
  | `S3_BUCKET` | `apturio-media` | Activates R2 storage when set. |
  | `S3_REGION` | `auto` | R2 requires `auto`. |
  | `S3_ENDPOINT` | `https://<accountid>.r2.cloudflarestorage.com` | Required for R2 (else SDK targets AWS). |
  | `S3_ACCESS_KEY_ID` | R2 token key id | |
  | `S3_SECRET_ACCESS_KEY` | R2 token secret | |

- [ ] [M] Deploy. Note the generated `https://<project>.vercel.app` preview URL —
      run the §5 gates against it **before** DNS cutover.

---

## 4. Cloudflare — DNS / CDN in front of Vercel

- [ ] [M] Point the apex/`www` DNS records at Vercel (proxied / orange-cloud).
- [ ] [M] Add a **Cache Rule to BYPASS cache for HTML** so Cloudflare does not
      double-cache over Vercel's ISR (prevents stale HTML after a deploy or after
      an on-publish `revalidatePath`):
      - Match: response content-type `text/html` (or path-based: all non-asset paths)
      - Action: **Cache Level → Bypass** (let only Vercel's edge cache HTML)
      - Static fingerprinted assets (`/_next/static/*`, images) stay cacheable.
- [ ] [M] Confirm **Bot Fight Mode** / WAF does **not** block AI crawlers — verify
      `GPTBot`, `ClaudeBot`, `PerplexityBot` (and `Googlebot`) are allowed. These
      are explicitly welcomed by `robots.ts`; a CF bot rule must not override it.
- [ ] [M] Do **not** enable Rocket Loader (breaks Next.js hydration).

---

## 5. Pre-DNS-cutover gates (binary — all must pass on the Vercel URL)

Run these against the `https://<project>.vercel.app` deployment (or a staging
hostname) before pointing production DNS. Every item is pass/fail.

- [ ] [M] **Old route 301s** — each of the 7 legacy routes returns `301`:
      ```
      curl -I https://<vercel-url>/pay-per-use      # → 301 → /en/pay-per-use
      curl -I https://<vercel-url>/add-ons          # → 301 → /en/add-ons
      curl -I https://<vercel-url>/strategy-call    # → 301 → /en/strategy-call
      curl -I https://<vercel-url>/privacy-policy   # → 301 → /en/privacy-policy
      curl -I https://<vercel-url>/terms-of-service # → 301 → /en/terms-of-service
      curl -I https://<vercel-url>/thank-you        # → 301 → /en/thank-you
      curl -I https://<vercel-url>/demo-spanish     # → 301 → /es/demo-spanish
      ```
      (Root `/` → `/en` should be **307**, not 301 — intentional, keeps future
      Accept-Language detection open.)
- [ ] [M] **Sitemap** — `curl https://<vercel-url>/sitemap.xml` returns valid XML
      and is referenced in `/robots.txt`.
- [ ] [M] **hreflang** — run the published EN/ES pair through hreflang.org
      validator → **0 errors** (reciprocal en/es + `x-default`→en).
- [ ] [M] **Neon connections** — Neon dashboard shows connection count **< 70%**
      of the branch limit during a smoke test.
- [ ] [M] **On-publish ISR** — in `/admin`, edit & save a post → its
      `/en/blog/[slug]` **and** `/es/blog/[slug]` update within **~5s** without a
      redeploy. (The `afterChange` hook revalidates both locales + both blog
      indexes + `/sitemap.xml`.)
- [ ] [M] **Cloudflare bypass** (once DNS/staging is proxied) — HTML response
      shows `cf-cache-status: BYPASS`:
      ```
      curl -I https://apturio.com/en/blog/<slug> | grep -i cf-cache-status   # → BYPASS
      ```
- [ ] [M] **Image optimization** — a `/_next/image?...` response is `image/webp`
      (confirms `sharp` + R2 CORS are wired).

---

## 6. DNS cutover

- [ ] [M] With all §5 gates green, switch production DNS for `apturio.com`
      (and `www`) to the Vercel target via Cloudflare.
- [ ] [M] Immediately re-run the §5 `301` and `cf-cache-status: BYPASS` curls
      against `https://apturio.com` (not the vercel.app URL) to confirm the
      production edge behaves identically.

---

## 7. Rollback

If a post-cutover gate fails:

- **Fast path:** revert the DNS records in Cloudflare to the previous origin
  (the old Vite/SPA host). DNS is the single switch; no data is lost — Neon and R2
  are untouched by a DNS revert.
- **Cache stuck:** purge Cloudflare cache (dashboard or API) and confirm the HTML
  Cache Rule is set to Bypass.
- **Bad migration:** Neon point-in-time recovery on the production branch; never
  run destructive migrations without first deploying code that ignores the dropped
  column.

---

## Automated-in-CI vs manual-at-deploy — summary

| Step | Where |
|------|-------|
| `payload migrate` (idempotent) | 🤖 CI (build command) |
| `payload generate:importmap` | 🤖 CI |
| `payload generate:types` | 🤖 CI |
| `next build` | 🤖 CI |
| `pool.max: 3` connection cap | 🤖 code (`payload.config.ts`) |
| s3Storage activation when S3 env present | 🤖 code (`payload.config.ts`) |
| On-publish `revalidatePath` (both locales) | 🤖 code (`afterChange` hooks) |
| Neon production branch + pooler URL | [M] Manual |
| R2 bucket + CORS + custom domain | [M] Manual |
| Vercel project + env vars + Node 20 | [M] Manual |
| Cloudflare proxy DNS + HTML Bypass Cache Rule + bot allowlist | [M] Manual |
| §5 pre-cutover curl/validator gates | [M] Manual |
| DNS cutover + rollback | [M] Manual |
