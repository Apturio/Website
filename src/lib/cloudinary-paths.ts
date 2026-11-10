// Pure helpers shared by the Payload storage adapter, the migration script and the tests.
// No `@/` imports and no SDK import: Node's test runner loads this file directly.

export type CloudinaryResourceType = 'image' | 'video' | 'raw'

/** Cloudinary folder that holds every Payload upload. */
export const CLOUDINARY_FOLDER = 'apturio/media'

const IMAGE_EXT = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'svg', 'bmp', 'tif', 'tiff', 'ico', 'heic', 'jfif'])
const VIDEO_EXT = new Set(['mp4', 'webm', 'mov', 'm4v', 'mp3', 'wav', 'ogg'])

/** Extensions Cloudinary serves under another name (a .jfif is a JPEG; `.jfif` URLs 404). */
const URL_EXT: Record<string, string> = { jfif: 'jpg' }

function splitExt(filename: string): { base: string; ext: string } {
  const i = filename.lastIndexOf('.')
  if (i <= 0 || i === filename.length - 1) return { base: filename, ext: '' }
  return { base: filename.slice(0, i), ext: filename.slice(i + 1).toLowerCase() }
}

/** Decided from the extension so upload, delete and URL generation always agree. */
export function resourceTypeFor(filename: string): CloudinaryResourceType {
  const { ext } = splitExt(filename)
  if (IMAGE_EXT.has(ext)) return 'image'
  if (VIDEO_EXT.has(ext)) return 'video'
  return 'raw'
}

/** Image and video public ids carry no extension; raw ones keep it (Cloudinary rule). */
export function publicIdFor(filename: string, folder: string = CLOUDINARY_FOLDER): string {
  const type = resourceTypeFor(filename)
  const name = type === 'raw' ? filename : splitExt(filename).base
  return `${folder}/${name}`
}

/** Public delivery URL of the original file (no transformations). */
export function deliveryUrl(cloudName: string, filename: string, folder: string = CLOUDINARY_FOLDER): string {
  const type = resourceTypeFor(filename)
  const { ext } = splitExt(filename)
  const id = publicIdFor(filename, folder)
    .split('/')
    .map((s) => encodeURIComponent(s))
    .join('/')
  const suffix = type === 'raw' || !ext ? '' : `.${URL_EXT[ext] ?? ext}`
  return `https://res.cloudinary.com/${cloudName}/${type}/upload/${id}${suffix}`
}

/** Strips the few characters Cloudinary rejects in public ids. Spaces and accents are fine. */
export function safeFilename(name: string): string {
  return name.replace(/[?&#%<>\\/]+/g, '-')
}
