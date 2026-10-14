# SEO audit snapshots

Each folder holds one `metrics.json` produced by `scripts/seo-metrics.mjs`. Run it before
and after a change and compare.

```bash
# capture
node scripts/seo-metrics.mjs after-2026-10-xx                    # 3 Lighthouse runs per page
node scripts/seo-metrics.mjs after-2026-10-xx --skip-lighthouse  # SEO checks only (fast)
node scripts/seo-metrics.mjs local --site http://localhost:3000  # against a local `next start`

# compare
node scripts/seo-compare.mjs baseline-2026-10-13 after-2026-10-xx
```

## What a snapshot contains

- `headers`: security and framework headers served on `/`.
- `sitemap`: URL count, `lastmod` spread, `priority`/`changefreq` tags, content type.
- `pages[]`: per URL, HTML size, word count, H1 count, canonical, meta description,
  hreflang tags in the HTML and in the `Link` header (with the broken targets), JSON-LD
  blocks and types, cache headers.
- `lighthouse[]`: mobile and desktop for four templates (home, pricing, feature landing,
  blog post). Median of N runs plus the min/max score.

## Reading the numbers

Lab runs are noisy. On the same build, the home page on mobile scored 46 in one run
(taken while other jobs were using the machine) and 86 in another. That is why the script
takes the median of several runs and why only large moves count as real.

The first numbers quoted in the 2026-10-13 audit report (home mobile LCP 6.7 s, score 46)
came from a single run on a busy machine. The baseline in `baseline-2026-10-13/` was
re-measured on an idle machine and is the one to compare against.

## Baseline: 2026-10-13

Captured against production before any change from branch `feature/seo-audit-fixes`.
