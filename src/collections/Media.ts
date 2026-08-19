import path from 'path'

import type { CollectionConfig } from 'payload'

// Where uploaded files live on disk when S3/R2 is not configured.
//
// Payload's default (`staticDir: 'media'`) resolves against the *running
// process's* cwd — i.e. inside the deployed release directory. Self-hosted
// deploys check the repo out into a fresh directory on every build, so every
// deploy silently orphaned the previous release's uploads and `/api/media/file/*`
// started answering 500 ("file is missing on the disk"). Pointing MEDIA_DIR at
// an absolute path *outside* the release directory keeps uploads across deploys.
//
// Unset (local dev) it falls back to `<repo>/media`, which is what Payload did
// before — so nothing changes locally.
const staticDir = process.env.MEDIA_DIR
  ? path.resolve(process.env.MEDIA_DIR)
  : path.resolve(process.cwd(), 'media')

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  // With no S3 env vars configured, Payload stores files on local disk at
  // `staticDir`. The s3Storage plugin in payload.config.ts only activates when
  // the S3_* env vars are present, and takes over serving when it does —
  // `staticDir` is then unused.
  upload: {
    staticDir,
  },
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional caption shown under figures in article content.',
      },
    },
  ],
}
