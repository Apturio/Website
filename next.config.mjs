import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Inline the (small) critical CSS into the HTML instead of 3 render-blocking stylesheets.
  experimental: { inlineCss: true },
  // Self-hosted (Hostinger VPS / Node app). Emits a self-contained
  // `.next/standalone/server.js` with traced deps — no full node_modules needed
  // at runtime. `.next/static` and `public/` must be copied in alongside it.
  output: 'standalone',
  images: {
    // Cloudflare R2 public bucket hostname (media offload — wired for later phases)
    remotePatterns: [
      { protocol: 'https', hostname: '*.r2.dev' },
      // Brand assets (logo, hero background, client logos) still live here.
      { protocol: 'https', hostname: 'vibe.filesafe.space' },
    ],
    // Uploads served by Payload (`/api/media/file/...`) go through the optimizer too.
    localPatterns: [{ pathname: '/api/media/file/**' }, { pathname: '/**' }],
    // Keep in sync with IMAGE_WIDTHS in src/lib/image-loader.ts.
    deviceSizes: [480, 640, 768, 1024, 1280, 1600],
    imageSizes: [64, 128, 256, 384],
    // Un solo formato (evita duplicar transformaciones avif+webp) y cache
    // largo: las imágenes no cambian de URL al editarse.
    formats: ['image/webp'],
    minimumCacheTTL: 2678400,
  },
  async redirects() {
    // statusCode: 301 (not `permanent: true`, which emits 308) so old SPA links
    // resolve with a classic 301 Moved Permanently. English pages are unprefixed
    // (/pay-per-use, /add-ons, ...) and are served by the next-intl rewrite in
    // src/middleware.ts, so only the Spanish-only demo funnel needs a redirect.
    return [
      // Demo funnel was Spanish-first — redirect to ES locale
      { source: '/demo-spanish', destination: '/es/demo-spanish', statusCode: 301 },
      { source: '/demo-spanish/thank-you', destination: '/es/demo-spanish/thank-you', statusCode: 301 },
    ]
  },
}

export default withPayload(withNextIntl(nextConfig))
