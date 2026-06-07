import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  // `upload: true` enables the file-upload UI. With no S3 env vars configured,
  // Payload falls back to local-disk storage (dev). The s3Storage plugin in
  // payload.config.ts only activates when S3_* env vars are present.
  upload: true,
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
