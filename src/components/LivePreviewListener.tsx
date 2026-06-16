'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

/**
 * Bridges Payload's admin live-preview iframe to the Next.js router. When an
 * editor saves (or autosaves a draft) in the admin, Payload posts a message to
 * the previewed URL; this listener calls `router.refresh()` so the server
 * components re-fetch and the preview reflects the change. Rendered globally in
 * the locale layout — a no-op outside the admin preview iframe.
 */
export function LivePreviewListener() {
  const router = useRouter()
  const serverURL =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '')
  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={serverURL} />
}
