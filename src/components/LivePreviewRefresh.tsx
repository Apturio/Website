'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

/**
 * Bridges Payload's admin live-preview iframe to the Next.js router. When an
 * editor saves (or autosaves a draft) in the admin, Payload posts a message to
 * the previewed URL; this calls `router.refresh()` so the server components
 * re-fetch and the preview reflects the change.
 */
export default function LivePreviewRefresh() {
  const router = useRouter()
  const serverURL =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '')
  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={serverURL} />
}
