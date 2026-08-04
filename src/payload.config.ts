import path from 'path'
import { fileURLToPath } from 'url'

import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { resendAdapter } from '@payloadcms/email-resend'
import type { Plugin } from 'payload'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Pages } from './collections/Pages'
import { Categories } from './collections/Categories'
import { Authors } from './collections/Authors'
import { Faqs } from './collections/Faqs'
import { Navigation } from './globals/Navigation'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// S3 storage (Cloudflare R2) is wired but inactive until all S3 env vars are set.
// Without them, Payload uses local-disk storage for the Media collection (dev fallback).
const hasS3 = Boolean(
  process.env.S3_BUCKET &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY &&
    process.env.S3_ENDPOINT,
)

// Front-end origin used for live-preview iframes. Falls back to localhost in dev.
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// CORS/CSRF allowlist. `serverURL` alone only covers ONE origin — insufficient
// while the app is reachable from more than one host at once (temporary hosting
// domains during migration, the eventual apturio.com). Without its origin in
// this list, the browser's admin-panel writes (POST/PATCH) get silently
// rejected by Payload's CSRF check ("You are not allowed to perform this
// action"), even though the user is authenticated and has no access restriction.
// `ADDITIONAL_ALLOWED_ORIGINS` (comma-separated) covers any other host without
// a redeploy.
const ALLOWED_ORIGINS = Array.from(
  new Set(
    [
      SERVER_URL,
      'https://apturio.com',
      'https://apturio.aprendoclub.com',
      'https://seagreen-rat-707084.hostingersite.com',
      ...(process.env.ADDITIONAL_ALLOWED_ORIGINS?.split(',').map((origin) => origin.trim()) ?? []),
    ].filter(Boolean),
  ),
)

/**
 * Build the front-end preview URL for a Pages/Posts document. Includes the
 * active locale + `?draft=true` so the route renders the draft version inside
 * the admin live-preview iframe. Home page maps to the locale root.
 */
const buildPreviewURL = (
  kind: 'pages' | 'posts',
  data: Record<string, unknown>,
  localeCode: string,
): string => {
  const slug = typeof data?.slug === 'string' ? data.slug : ''
  if (kind === 'posts') {
    return `${SERVER_URL}/${localeCode}/blog/${slug}?draft=true`
  }
  if (!slug || slug === 'home') return `${SERVER_URL}/${localeCode}?draft=true`
  return `${SERVER_URL}/${localeCode}/${slug}?draft=true`
}

// Core plugins (SEO, Form Builder, Redirects). S3 storage is appended only when
// the R2 credentials are present (otherwise local-disk media in dev).
const corePlugins: Plugin[] = [
  seoPlugin({
    collections: ['posts', 'pages'],
    uploadsCollection: 'media',
    // The plugin's default meta fields (title/description/image) are already
    // `localized: true`, so the injected `meta` group is fully localized.
    generateTitle: ({ doc }: { doc: { title?: string } }) => doc?.title ?? '',
    generateDescription: ({ doc }: { doc: { excerpt?: string } }) =>
      doc?.excerpt ?? '',
  }),
  formBuilderPlugin({
    // No email adapter wired yet — submissions are stored in admin only.
    fields: {
      text: true,
      textarea: true,
      email: true,
      select: true,
      checkbox: true,
      message: true,
      // Disable payment/upload/state/country/number/date we don't use.
      payment: false,
    },
    formOverrides: {
      admin: { group: 'Forms' },
    },
    formSubmissionOverrides: {
      admin: { group: 'Forms' },
    },
  }),
  redirectsPlugin({
    collections: ['pages', 'posts'],
    // Enables the `type` select (from/to/type). Without this the plugin omits it.
    redirectTypes: ['301', '302'],
    overrides: {
      admin: { group: 'Content' },
    },
  }),
]

export default buildConfig({
  // Public origin of the app. Drives email links + live-preview. Falls back
  // to localhost in dev. Set NEXT_PUBLIC_SERVER_URL in prod (https://apturio.com).
  serverURL: SERVER_URL,
  cors: ALLOWED_ORIGINS,
  csrf: ALLOWED_ORIGINS,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, './app/(payload)'),
    },
    livePreview: {
      collections: ['pages', 'posts'],
      url: ({ collectionConfig, data, locale }) =>
        buildPreviewURL(
          collectionConfig?.slug === 'posts' ? 'posts' : 'pages',
          data,
          locale?.code ?? 'en',
        ),
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  // Resend email adapter. Used for password-reset, form-submission emails, etc.
  // Requires RESEND_API_KEY + a verified sender domain in the Resend dashboard.
  // Falls back to undefined (Payload logs emails to console) when the key is absent.
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        defaultFromName: process.env.RESEND_FROM_NAME || 'Apturio',
        defaultFromAddress: process.env.RESEND_FROM_ADDRESS || 'noreply@aprendoseo.com',
        apiKey: process.env.RESEND_API_KEY,
      })
    : undefined,
  collections: [Posts, Pages, Categories, Authors, Faqs, Media, Users],
  globals: [Navigation],
  localization: {
    locales: [
      { code: 'en', label: 'English' },
      { code: 'es', label: 'Español' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
      max: 3,
    },
    migrationDir: path.resolve(dirname, './migrations'),
  }),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  plugins: [
    ...corePlugins,
    ...(hasS3
      ? [
          s3Storage({
            collections: { media: true },
            bucket: process.env.S3_BUCKET!,
            config: {
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID!,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
              },
              region: process.env.S3_REGION ?? 'auto',
              endpoint: process.env.S3_ENDPOINT,
            },
          }),
        ]
      : []),
  ],
})
