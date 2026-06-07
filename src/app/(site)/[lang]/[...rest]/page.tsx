import { notFound } from 'next/navigation'

// Any unknown path within a locale (e.g. /en/does-not-exist) resolves here and
// returns a real HTTP 404 via the global not-found boundary.
export default function CatchAllNotFound() {
  notFound()
}
