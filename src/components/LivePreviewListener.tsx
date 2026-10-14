'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

/**
 * Payload's live-preview client only matters inside the admin preview iframe, so it is
 * split into its own chunk and loaded only when the page is framed (and the browser has
 * Draft Mode's bypass cookie). Everyone else downloads and runs none of it.
 */
const RefreshRoute = dynamic(() => import('./LivePreviewRefresh'), { ssr: false })

export function LivePreviewListener() {
  const [framed, setFramed] = useState(false)

  useEffect(() => {
    try {
      setFramed(window.self !== window.top)
    } catch {
      // Cross-origin parent access throws: that also means we are inside a frame.
      setFramed(true)
    }
  }, [])

  return framed ? <RefreshRoute /> : null
}
