import { v2 as cloudinary } from 'cloudinary'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import type { Adapter, StaticHandler } from '@payloadcms/plugin-cloud-storage/types'
import type { Plugin } from 'payload'

import { CLOUDINARY_FOLDER, deliveryUrl, publicIdFor, resourceTypeFor } from './cloudinary-paths'

export interface CloudinaryStorageOptions {
  cloudName: string
  apiKey: string
  apiSecret: string
  /** Upload collection slugs to offload. */
  collections: string[]
  folder?: string
}

/**
 * Payload storage adapter for Cloudinary.
 *
 * Files live under `<folder>/<filename>`; the public id is derived from the stored filename, so
 * the database needs no extra column and the existing Media rows keep working. `url` points
 * straight at res.cloudinary.com (CDN, no hop through our server). Old `/api/media/file/<name>`
 * links keep answering through a proxy handler, because they are baked into rich text and
 * third-party pages.
 */
export const cloudinaryStorage =
  (opts: CloudinaryStorageOptions): Plugin =>
  (incomingConfig) => {
    const folder = opts.folder ?? CLOUDINARY_FOLDER
    cloudinary.config({
      cloud_name: opts.cloudName,
      api_key: opts.apiKey,
      api_secret: opts.apiSecret,
      secure: true,
    })

    const proxy: StaticHandler = async (_req, { params: { filename } }) => {
      const upstream = await fetch(deliveryUrl(opts.cloudName, filename, folder))
      if (!upstream.ok) return new Response('Not found', { status: upstream.status === 404 ? 404 : 502 })
      return new Response(upstream.body, {
        status: 200,
        headers: {
          'Content-Type': upstream.headers.get('Content-Type') ?? 'application/octet-stream',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    const adapter: Adapter = () => ({
      name: 'cloudinary',
      generateURL: ({ filename }) => deliveryUrl(opts.cloudName, filename, folder),
      handleUpload: async ({ file, data }) => {
        await new Promise<void>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              public_id: publicIdFor(file.filename, folder),
              resource_type: resourceTypeFor(file.filename),
              overwrite: true,
              invalidate: true,
              unique_filename: false,
              use_filename: false,
            },
            (err) => (err ? reject(err) : resolve()),
          )
          stream.end(file.buffer)
        })
        return data
      },
      handleDelete: async ({ filename }) => {
        await cloudinary.uploader.destroy(publicIdFor(filename, folder), {
          resource_type: resourceTypeFor(filename),
          invalidate: true,
        })
      },
      staticHandler: proxy,
    })

    const slugs = new Set(opts.collections)
    const config = {
      ...incomingConfig,
      collections: (incomingConfig.collections ?? []).map((c) => {
        if (!slugs.has(c.slug)) return c
        const upload = typeof c.upload === 'object' ? c.upload : {}
        return {
          ...c,
          upload: {
            ...upload,
            disableLocalStorage: true,
            handlers: [...(upload.handlers ?? []), proxy],
          },
        }
      }),
    }

    return cloudStoragePlugin({
      collections: Object.fromEntries(
        opts.collections.map((slug) => [slug, { adapter, disablePayloadAccessControl: true as const }]),
      ),
    })(config)
  }
