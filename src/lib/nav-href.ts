/**
 * Zero-dependency href helper, split out of `lib/navigation.ts` on purpose.
 *
 * `lib/navigation.ts` imports `getPayload`/`payload.config` (server-only:
 * DB drivers, sharp, fs, etc.). `NavbarClient.tsx` is a Client Component
 * that needs `isExternalHref` at render time (not just as a type), so a
 * value-import from `lib/navigation.ts` pulls that entire server module
 * graph into the client bundle and breaks `next build` (Turbopack:
 * "chunking context does not support external modules (request: node:fs)").
 * This file has no imports, so it is safe to value-import from both
 * Server and Client Components.
 */

/**
 * True when `href` is an absolute http(s) URL rather than a locale-relative
 * path. `href` is validated (globals/Navigation.ts's `validateNavHref`) to
 * accept either shape, so every consumer must branch on this before
 * concatenating the locale prefix (CR-01) — an admin-entered absolute URL
 * must render as-is, never as `${home}${href}`.
 */
export const isExternalHref = (href?: string | null): boolean =>
  !!href && /^https?:\/\//i.test(href)
