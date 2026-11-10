/**
 * Uploads every existing Media file to Cloudinary. Does not touch the database: the adapter derives
 * each file's Cloudinary URL from its stored filename, so Media rows stay as they are.
 *
 *   npx payload run scripts/migrate-media-to-cloudinary.ts            # dry run, uploads nothing
 *   APPLY=1 npx payload run scripts/migrate-media-to-cloudinary.ts    # upload
 *
 * Environment:
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET  (required with APPLY=1)
 *   MEDIA_DIR      folder with the original files, default <cwd>/media
 *   SOURCE_ORIGIN  where to download files missing from MEDIA_DIR, default https://apturio.com
 *   LIST_FROM_API=1  list the files from SOURCE_ORIGIN/api/media (public) instead of the database.
 *                    Needs no DATABASE_URI: use it when Neon is unreachable from this machine.
 *
 * Safe to re-run: files already on Cloudinary are skipped. Run it BEFORE enabling the adapter in
 * production (setting CLOUDINARY_API_KEY/SECRET), otherwise existing media answers 404.
 * It connects to whatever DATABASE_URI points at.
 */
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { v2 as cloudinary } from 'cloudinary'
import { CLOUDINARY_FOLDER, publicIdFor, resourceTypeFor } from '../src/lib/cloudinary-paths'
import { resolveMediaDir } from '../src/lib/media-dir'

const APPLY = process.argv.includes('--apply') || process.env.APPLY === '1'
const SOURCE_ORIGIN = (process.env.SOURCE_ORIGIN ?? 'https://apturio.com').replace(/\/+$/, '')

async function readOriginal(dir: string, filename: string): Promise<Buffer | null> {
  const local = path.join(dir, filename)
  if (existsSync(local)) return readFile(local)
  const res = await fetch(`${SOURCE_ORIGIN}/api/media/file/${encodeURIComponent(filename)}`)
  return res.ok ? Buffer.from(await res.arrayBuffer()) : null
}

async function exists(filename: string): Promise<boolean> {
  try {
    await cloudinary.api.resource(publicIdFor(filename), { resource_type: resourceTypeFor(filename) })
    return true
  } catch {
    return false
  }
}

async function listFilenames(): Promise<string[]> {
  if (process.env.LIST_FROM_API === '1') {
    const res = await fetch(`${SOURCE_ORIGIN}/api/media?limit=1000&depth=0&select[filename]=true`)
    if (!res.ok) throw new Error(`GET ${SOURCE_ORIGIN}/api/media -> ${res.status}`)
    const body = (await res.json()) as { docs: { filename?: string }[]; hasNextPage?: boolean }
    if (body.hasNextPage) throw new Error('More than 1000 media docs: raise the limit or page the request')
    return body.docs.map((d) => d.filename).filter((f): f is string => Boolean(f))
  }
  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'media', limit: 1000, depth: 0, pagination: false })
  return docs.map((d) => d.filename).filter((f): f is string => Boolean(f))
}

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
if (APPLY) {
  if (!cloudName || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET')
  }
  cloudinary.config({
    cloud_name: cloudName,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })
}

const dir = resolveMediaDir(process.cwd(), process.env.MEDIA_DIR)
console.log(`mode: ${APPLY ? 'APPLY' : 'dry run'} | folder: ${CLOUDINARY_FOLDER} | source dir: ${dir}`)

const filenames = await listFilenames()
const counts = { uploaded: 0, skipped: 0, missing: 0, failed: 0 }

for (const filename of filenames) {
  try {
    if (!APPLY) {
      const found = existsSync(path.join(dir, filename)) ? 'local' : 'remote?'
      console.log(`would upload  ${filename}  [${resourceTypeFor(filename)}, ${found}]`)
      continue
    }
    if (await exists(filename)) {
      counts.skipped++
      console.log(`skip          ${filename} (already on Cloudinary)`)
      continue
    }
    const buffer = await readOriginal(dir, filename)
    if (!buffer) {
      counts.missing++
      console.warn(`MISSING       ${filename} (not in ${dir} nor ${SOURCE_ORIGIN})`)
      continue
    }
    await new Promise<void>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            public_id: publicIdFor(filename),
            resource_type: resourceTypeFor(filename),
            overwrite: false,
            unique_filename: false,
            use_filename: false,
          },
          (err) => (err ? reject(err) : resolve()),
        )
        .end(buffer)
    })
    counts.uploaded++
    console.log(`uploaded      ${filename}`)
  } catch (err) {
    counts.failed++
    console.error(`FAILED        ${filename}:`, err instanceof Error ? err.message : err)
  }
}

console.log(APPLY ? counts : `${filenames.length} media files. Re-run with APPLY=1 to upload.`)
process.exit(counts.failed || counts.missing ? 1 : 0)
