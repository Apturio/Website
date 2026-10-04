/* THIS FILE WAS GENERATED FOLLOWING THE OFFICIAL PAYLOAD 3 TEMPLATE.
 * DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME.
 */
import config from '@payload-config'
import '@payloadcms/next/css'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

export const GET = REST_GET(config)
// Payload's REST router only matches GET, so a HEAD (CDN revalidation, crawlers, link
// checkers) hit `/api/media/file/*` and got a JSON 404 while the same GET answered 200.
// Answer HEAD with the GET response minus the body.
export const HEAD = async (request: Request, context: { params: Promise<{ slug: string[] }> }) => {
  const res = await (GET as (req: Request, ctx: typeof context) => Promise<Response>)(
    new Request(request.url, { method: 'GET', headers: request.headers }),
    context,
  )
  await res.body?.cancel()
  return new Response(null, { status: res.status, headers: res.headers })
}
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
