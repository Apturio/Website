import type { AppLocale } from '@/lib/site'
import type { Page } from '@/payload-types'
import type { Thing, WithContext } from 'schema-dts'

import { SITE_URL } from '@/lib/site'
import { buildBreadcrumbList, HOME_LABEL, type BreadcrumbItem } from './builders/breadcrumb'
import { buildCollectionPage } from './builders/collection'
import { buildContactPage } from './builders/contact'
import { buildFaqPage } from './builders/faq'
import { buildProduct, type PricingPlan } from './builders/product'
import { buildProfilePage, type AuthorInput } from './builders/profile'
import { buildService } from './builders/service'
import { buildWebPage } from './builders/webpage'

/**
 * Discriminated union of every page kind wired this phase. The route reads its locale from
 * `params.lang` (never a client hook) and the canonical locale-prefixed `url`, then hands a
 * fully-resolved props object to {@link resolvePageSchemas}. Builders stay pure: all Payload
 * data arrives here as primitives, never fetched inside the dispatcher.
 */
export type PageJsonLdProps =
  | { kind: 'home'; locale: AppLocale; url: string; title: string; description?: string }
  | { kind: 'pricing'; locale: AppLocale; url: string; title: string; description?: string; plans: PricingPlan[] }
  | { kind: 'payload-page'; locale: AppLocale; url: string; page: Page }
  | { kind: 'blog-index'; locale: AppLocale; url: string; title: string; description?: string }
  | { kind: 'blog-category'; locale: AppLocale; url: string; title: string; description?: string }
  | { kind: 'author'; locale: AppLocale; url: string; author: AuthorInput }
  | { kind: 'legal'; locale: AppLocale; url: string; title: string; description?: string }
  | { kind: 'strategy-call'; locale: AppLocale; url: string; title: string; description?: string }
  | { kind: 'demo'; locale: AppLocale; url: string; title: string; description?: string }

/** The Home crumb every breadcrumb list starts with (Home-first — Pitfall 12). */
function homeCrumb(locale: AppLocale): BreadcrumbItem {
  return { name: HOME_LABEL[locale], url: `${SITE_URL}/${locale}` }
}

/** The Blog crumb, used by blog-scoped breadcrumb trails (category, author). */
function blogCrumb(locale: AppLocale): BreadcrumbItem {
  return { name: 'Blog', url: `${SITE_URL}/${locale}/blog` }
}

/**
 * Pure dispatcher — the single source of truth mapping a page `kind` to its array of
 * `WithContext<Thing>` schemas by calling the Wave 1-2 builders. No JSX, no Payload access.
 *
 * Every indexable kind emits a `WebPage` (or subtype) plus a Home-first `BreadcrumbList`.
 *
 * Payload `[...slug]` pages get a Service node by INFERENCE — there is NO discriminator
 * field on the Pages collection and NO Payload migration is run (SCHEMA-09 treats every
 * landing page as a Service). If such a page additionally carries a `faq` layout block, a
 * `FAQPage` is appended (SCHEMA-13 auto-detection). Both are inferred purely from existing
 * signals (page.title / page.meta / page.layout).
 */
export function resolvePageSchemas(props: PageJsonLdProps): WithContext<Thing>[] {
  const { locale, url } = props
  const schemas: WithContext<Thing>[] = []

  switch (props.kind) {
    case 'home': {
      schemas.push(buildWebPage({ locale, url, title: props.title, description: props.description }))
      schemas.push(buildBreadcrumbList([homeCrumb(locale)], locale))
      break
    }

    case 'pricing': {
      schemas.push(buildWebPage({ locale, url, title: props.title, description: props.description }))
      schemas.push(
        buildBreadcrumbList([homeCrumb(locale), { name: props.title, url }], locale),
      )
      for (const plan of props.plans) {
        schemas.push(buildProduct(plan, locale))
      }
      break
    }

    case 'payload-page': {
      const { page } = props
      schemas.push(
        buildWebPage({ locale, url, title: page.title, description: page.meta?.description ?? undefined }),
      )
      schemas.push(
        buildBreadcrumbList([homeCrumb(locale), { name: page.title, url }], locale),
      )
      // Service ALWAYS for a Payload landing page — inference, no discriminator field.
      schemas.push(
        buildService({ locale, url, name: page.title, description: page.meta?.description ?? undefined }),
      )
      // Auto-detect a faq block → also emit FAQPage (no schema migration).
      const faqBlock = page.layout?.find(
        (b): b is Extract<NonNullable<Page['layout']>[number], { blockType: 'faq' }> =>
          b.blockType === 'faq',
      )
      if (faqBlock?.items?.length) {
        schemas.push(
          buildFaqPage(
            faqBlock.items.map((i) => ({ question: i.question, answer: i.answer })),
            locale,
          ),
        )
      }
      break
    }

    case 'blog-index': {
      schemas.push(buildCollectionPage({ locale, url, title: props.title, description: props.description }))
      schemas.push(
        buildBreadcrumbList([homeCrumb(locale), { name: props.title, url }], locale),
      )
      break
    }

    case 'blog-category': {
      schemas.push(buildCollectionPage({ locale, url, title: props.title, description: props.description }))
      schemas.push(
        buildBreadcrumbList([homeCrumb(locale), blogCrumb(locale), { name: props.title, url }], locale),
      )
      break
    }

    case 'author': {
      const { author } = props
      schemas.push(buildProfilePage(author, locale))
      schemas.push(
        buildBreadcrumbList(
          [homeCrumb(locale), blogCrumb(locale), { name: author.name, url }],
          locale,
        ),
      )
      break
    }

    case 'strategy-call': {
      schemas.push(buildContactPage({ locale, url, title: props.title, description: props.description }))
      schemas.push(
        buildBreadcrumbList([homeCrumb(locale), { name: props.title, url }], locale),
      )
      break
    }

    case 'legal':
    case 'demo': {
      schemas.push(buildWebPage({ locale, url, title: props.title, description: props.description }))
      schemas.push(
        buildBreadcrumbList([homeCrumb(locale), { name: props.title, url }], locale),
      )
      break
    }
  }

  return schemas
}
