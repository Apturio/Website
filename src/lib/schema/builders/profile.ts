import type { AppLocale } from '@/lib/site'
import type { Person, ProfilePage, WithContext } from 'schema-dts'
import { SITE_URL } from '@/lib/site'
import { IDS } from '@/lib/schema/ids'

/**
 * Author identity input for {@link buildPerson} / {@link buildProfilePage}.
 *
 * The CALLER resolves Payload primitives before passing them in (builders stay pure):
 * - `sameAs` is the filtered, non-empty list mapped from the `socials` group
 *   `{ linkedin, x, website }` (T-15-07 — only the author's own profile URLs).
 * - `avatarUrl` is resolved via `asMedia(author.avatar)?.url`.
 */
export interface AuthorInput {
  name: string
  slug: string
  bio?: string
  avatarUrl?: string
  sameAs?: string[]
  role?: string
}

/**
 * Person node for an author (E-E-A-T). Carries a stable `@id` via
 * `IDS.person(authorUrl)` so `BlogPosting.author` resolves to this exact node.
 *
 * Employment links to the canonical Organization via an `@id` cross-reference
 * (Pitfall 5 / T-15-09 — never inline an Organization). `sameAs` only when non-empty.
 * `inLanguage` is required (Pitfall 7); schema.org scopes it to CreativeWork so the
 * literal is asserted to `WithContext<Person>` (same narrow-cast pattern as
 * organization.ts — only suppresses the excess-property check).
 */
export function buildPerson(
  author: AuthorInput,
  authorUrl: string,
  locale: AppLocale,
): WithContext<Person> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': IDS.person(authorUrl),
    name: author.name,
    url: authorUrl,
    ...(author.bio ? { description: author.bio } : {}),
    ...(author.avatarUrl ? { image: author.avatarUrl } : {}),
    ...(author.role ? { jobTitle: author.role } : {}),
    ...(author.sameAs && author.sameAs.length > 0 ? { sameAs: author.sameAs } : {}),
    worksFor: { '@id': IDS.organization },
    inLanguage: locale,
  } as WithContext<Person>
}

/**
 * ProfilePage for an author page. `mainEntity` is the author's Person node (built
 * with the profile page URL as `authorUrl`). `isPartOf` is an `@id` ref to the
 * WebSite; `inLanguage` is required (Pitfall 7).
 */
export function buildProfilePage(author: AuthorInput, locale: AppLocale): WithContext<ProfilePage> {
  const authorUrl = `${SITE_URL}/${locale}/blog/author/${author.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: authorUrl,
    inLanguage: locale,
    isPartOf: { '@id': IDS.website },
    mainEntity: buildPerson(author, authorUrl, locale),
  }
}
