import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Turns on Next.js Draft Mode for the admin live-preview iframe, then redirects to the
 * page being previewed. Only a signed-in admin user can enable it: the preview iframe is
 * same-origin, so the Payload session cookie travels with the request.
 *
 * GET /api/draft?path=/es/precios
 */
export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path') ?? ''

  // Only same-site relative paths: no protocol-relative or absolute URLs (open redirect).
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) {
    return new Response('Invalid path', { status: 400 })
  }

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    return new Response('You are not allowed to preview drafts.', { status: 403 })
  }

  const draft = await draftMode()
  draft.enable()
  redirect(path)
}
