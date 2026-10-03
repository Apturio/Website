// Single place that decides how an image URL becomes an optimized, resized URL.
//
// Today: Next's built-in optimizer (`/_next/image`, WebP, cached on disk, `sharp`).
// Later: set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME at build time and every image goes through
// Cloudinary "fetch" mode instead (f_auto,q_auto): no upload or migration of the existing
// media is needed, Cloudinary pulls the originals from apturio.com on first request.
//
// Used by <OptImage> (plain <img> + srcset) and as `images.loaderFile` for next/image.
// No `@/` imports: Next loads this file in the client bundle too.

const SITE_ORIGIN = 'https://apturio.com'

/** Widths we ever request. Must match `images.deviceSizes` + `images.imageSizes` in next.config.mjs. */
export const IMAGE_WIDTHS = [64, 128, 256, 384, 480, 640, 768, 1024, 1280, 1600] as const

export interface LoaderArgs {
  src: string
  width: number
  quality?: number
}

/**
 * Uploads are always optimized from the same server, whatever origin Payload put in the stored
 * URL (production host, www, a preview or localhost): `https://any-host/api/media/file/x.png` ->
 * `/api/media/file/x.png`. Anything else is returned as is.
 */
export function toLocalPath(src: string): string {
  const m = /^https?:\/\/[^/]+(\/api\/media\/file\/.*)$/.exec(src)
  if (m) return m[1]
  if (src.startsWith(SITE_ORIGIN + '/')) return src.slice(SITE_ORIGIN.length)
  return src
}

export function isOptimizable(src: string): boolean {
  if (!src || src.startsWith('data:') || src.startsWith('blob:')) return false
  if (/\.(svg|gif)(\?|$)/i.test(src)) return false
  return true
}

export default function imageLoader({ src, width, quality }: LoaderArgs): string {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const local = toLocalPath(src)
  if (cloud) {
    const absolute = /^https?:\/\//.test(local) ? local : `${SITE_ORIGIN}${local}`
    const q = quality ? `q_${quality}` : 'q_auto'
    return `https://res.cloudinary.com/${cloud}/image/fetch/f_auto,${q},w_${width},c_limit/${encodeURIComponent(absolute)}`
  }
  return `/_next/image?url=${encodeURIComponent(local)}&w=${width}&q=${quality ?? 75}`
}
