import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-hosted (Hostinger VPS / Node app). Emits a self-contained
  // `.next/standalone/server.js` with traced deps — no full node_modules needed
  // at runtime. `.next/static` and `public/` must be copied in alongside it.
  output: 'standalone',
  images: {
    // Cloudflare R2 public bucket hostname (media offload — wired for later phases)
    remotePatterns: [{ protocol: 'https', hostname: '*.r2.dev' }],
    // Un solo formato (evita duplicar transformaciones avif+webp) y cache
    // largo: las imágenes no cambian de URL al editarse.
    formats: ['image/webp'],
    minimumCacheTTL: 2678400,
  },
  async redirects() {
    // statusCode: 301 (not `permanent: true`, which emits 308) so old SPA links
    // resolve with a classic 301 Moved Permanently.
    return [
      // Marketing pages — default to English
      { source: '/pay-per-use', destination: '/en/pay-per-use', statusCode: 301 },
      { source: '/add-ons', destination: '/en/add-ons', statusCode: 301 },
      { source: '/strategy-call', destination: '/en/strategy-call', statusCode: 301 },
      { source: '/privacy-policy', destination: '/en/privacy-policy', statusCode: 301 },
      { source: '/terms-of-service', destination: '/en/terms-of-service', statusCode: 301 },
      { source: '/thank-you', destination: '/en/thank-you', statusCode: 301 },
      { source: '/checkout/:planId', destination: '/en/checkout/:planId', statusCode: 301 },
      // Demo funnel was Spanish-first — redirect to ES locale
      { source: '/demo-spanish', destination: '/es/demo-spanish', statusCode: 301 },
      { source: '/demo-spanish/thank-you', destination: '/es/demo-spanish/thank-you', statusCode: 301 },
    ]
  },
}

export default withPayload(withNextIntl(nextConfig))
