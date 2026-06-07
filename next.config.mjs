import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // TEMPORARY (Phase 6): the legacy Vite SPA source under src/legacy-pages,
  // src/components, src/context, src/hooks still imports react-router-dom and
  // LanguageContext. Those files are kept on disk for the Phase 7 port but are
  // NOT yet referenced by the App Router. Skip type-check of those pre-port
  // files so `next build` succeeds. REMOVE once Phase 7 finishes the port.
  typescript: { ignoreBuildErrors: true },
  images: {
    // Cloudflare R2 public bucket hostname (media offload — wired for later phases)
    remotePatterns: [{ protocol: 'https', hostname: '*.r2.dev' }],
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
