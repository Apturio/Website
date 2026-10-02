import path from 'node:path'

/**
 * Where uploaded files live on disk (used when S3/R2 is not configured).
 *
 * 1. `MEDIA_DIR` wins when set (absolute path outside the release folder).
 * 2. On Hostinger the app runs from `<site>/hbuilds/versions/<id>/nodejs` (or via the
 *    `current` symlink), a folder that is replaced on every deploy. Uploads belong in
 *    `<site>/media`, which survives deploys, so that is derived from the working dir.
 * 3. Anywhere else (local dev) it is `<cwd>/media`, as Payload does by default.
 */
export function resolveMediaDir(cwd: string, mediaDirEnv?: string): string {
  if (mediaDirEnv) return path.resolve(mediaDirEnv)
  const m = /^(.*)\/hbuilds\/(?:versions\/[^/]+|current)\/nodejs$/.exec(cwd.replace(/\\/g, '/'))
  if (m) return path.posix.join(m[1], 'media')
  return path.resolve(cwd, 'media')
}
