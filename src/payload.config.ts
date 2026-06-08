import path from 'path'
import { fileURLToPath } from 'url'

import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import type { Plugin } from 'payload'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Pages } from './collections/Pages'
import { Categories } from './collections/Categories'
import { Authors } from './collections/Authors'
import { Faqs } from './collections/Faqs'

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
  collections: [Posts, Pages, Categories, Authors, Faqs, Media, Users],
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
