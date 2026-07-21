/**
 * Shared navbar/footer link registry (LINKSTATE-01).
 *
 * Single typed source of truth for every navbar and footer link: label key,
 * href, live/comingSoon status, description key, and lucide icon name.
 * Imported by Navbar (Phase 21) and Footer (Phase 22) so activating a
 * published page later is a data-only change and the two components never
 * duplicate the list.
 *
 * Only translation KEYS are stored here (resolved via next-intl `t()` in the
 * consuming components) — never plain-text labels or descriptions, since the
 * site is bilingual EN/ES.
 */

export type NavStatus = 'live' | 'comingSoon'

export interface NavLink {
  /** Translation key resolving the item's visible label. */
  labelKey: string
  /** Locale-relative path with a leading slash (e.g. "/pipeline-crm"). Omitted for comingSoon items. */
  href?: string
  status: NavStatus
  /** Translation key resolving the item's one-line description, if any. */
  descriptionKey?: string
  /** Kebab-case lucide icon name (e.g. "refresh-cw"), resolved via Icon.tsx's getIcon. */
  icon?: string
  /** Grouped child entries (e.g. Comparativas' four comparison pages). */
  children?: NavLink[]
}

export interface NavColumn {
  /** Translation key for the column heading. Omitted for single-column, headingless menus. */
  labelKey?: string
  items: NavLink[]
}

export interface NavMenu {
  /** Translation key for the mega menu's trigger label. */
  triggerLabelKey: string
  columns: NavColumn[]
}

export const navMenus: NavMenu[] = [
  {
    triggerLabelKey: 'nav.producto',
    columns: [
      {
        labelKey: 'nav.plataforma',
        items: [
          {
            labelKey: 'nav.pipelineCrm.label',
            descriptionKey: 'nav.pipelineCrm.description',
            icon: 'zap',
            status: 'live',
            href: '/pipeline-crm',
          },
          {
            labelKey: 'nav.chatbotIa.label',
            descriptionKey: 'nav.chatbotIa.description',
            icon: 'bot',
            status: 'live',
            href: '/chatbot-ia',
          },
          {
            labelKey: 'nav.automatizaciones.label',
            descriptionKey: 'nav.automatizaciones.description',
            icon: 'refresh-cw',
            status: 'live',
            href: '/automatizaciones-crm',
          },
          {
            labelKey: 'nav.implementacion.label',
            descriptionKey: 'nav.implementacion.description',
            icon: 'rocket',
            status: 'live',
            href: '/implementacion-crm',
          },
        ],
      },
      {
        labelKey: 'nav.funcionalidades',
        items: [
          {
            labelKey: 'nav.softwareVentas.label',
            status: 'comingSoon',
          },
          {
            labelKey: 'nav.chatbotWhatsapp.label',
            status: 'live',
            href: '/chatbot-whatsapp',
          },
          {
            labelKey: 'nav.instagramChatbot.label',
            status: 'live',
            href: '/chatbot-instagram',
          },
          {
            labelKey: 'nav.gestionReservas.label',
            status: 'live',
            href: '/sistema-reservas',
          },
          {
            labelKey: 'nav.recordatorios.label',
            status: 'live',
            href: '/recordatorios-automaticos',
          },
        ],
      },
    ],
  },
  {
    triggerLabelKey: 'nav.industrias',
    columns: [
      {
        items: [
          { labelKey: 'nav.clinicas.label', status: 'comingSoon' },
          { labelKey: 'nav.esteticas.label', status: 'comingSoon' },
          { labelKey: 'nav.bienesRaices.label', status: 'comingSoon' },
          { labelKey: 'nav.academias.label', status: 'comingSoon' },
        ],
      },
    ],
  },
  {
    triggerLabelKey: 'nav.recursos',
    columns: [
      {
        items: [
          {
            labelKey: 'nav.blog.label',
            descriptionKey: 'nav.blog.description',
            status: 'live',
            href: '/blog',
          },
          {
            labelKey: 'nav.casosEstudio.label',
            descriptionKey: 'nav.casosEstudio.description',
            status: 'comingSoon',
          },
          {
            labelKey: 'nav.herramientasGratis.label',
            descriptionKey: 'nav.herramientasGratis.description',
            status: 'comingSoon',
          },
          {
            labelKey: 'nav.comparativas.label',
            descriptionKey: 'nav.comparativas.description',
            status: 'comingSoon',
            children: [
              { labelKey: 'nav.comparativas.leadsales', status: 'comingSoon' },
              { labelKey: 'nav.comparativas.kommo', status: 'comingSoon' },
              { labelKey: 'nav.comparativas.pipedrive', status: 'comingSoon' },
              { labelKey: 'nav.comparativas.hubspot', status: 'comingSoon' },
            ],
          },
        ],
      },
    ],
  },
]

export const navDirectLinks: NavLink[] = [
  {
    labelKey: 'nav.pricing',
    status: 'live',
    href: '/precios',
  },
  {
    labelKey: 'nav.sobreNosotros.label',
    status: 'comingSoon',
  },
]

/**
 * Footer-only extension of the shared registry (Phase 22, LINKSTATE-03).
 *
 * `footerColumns` is composed BY REFERENCE from `navMenus` / `navDirectLinks`
 * above plus a handful of footer-only entries (Pago por uso, Add-Ons,
 * Plantillas, Contacto, Privacy, Terms) that the navbar doesn't surface.
 * Because the reused items are references (not copies), flipping a status in
 * `navMenus` / `navDirectLinks` (comingSoon -> live) reflects in both the
 * Navbar and the Footer with no structural edit here.
 */

export interface FooterSubgroup {
  /** Translation key for the subgroup's small heading (e.g. "Features"). */
  headingKey: string
  items: NavLink[]
}

export interface FooterColumn {
  /** Translation key for the column's primary heading (e.g. "Producto"). */
  headingKey: string
  items: NavLink[]
  subgroup?: FooterSubgroup
}

// Footer-only links: not present anywhere in navMenus/navDirectLinks.
const footerPayPerUse: NavLink = {
  labelKey: 'footer.payPerUse',
  status: 'live',
  href: '/pay-per-use',
}

const footerAddOns: NavLink = {
  labelKey: 'footer.addOns',
  status: 'live',
  href: '/add-ons',
}

const footerPlantillas: NavLink = {
  labelKey: 'footer.plantillas',
  status: 'comingSoon',
}

const footerContacto: NavLink = {
  labelKey: 'footer.contacto',
  status: 'comingSoon',
}

const footerPrivacy: NavLink = {
  labelKey: 'footer.privacy',
  status: 'live',
  href: '/privacy-policy',
}

const footerTerms: NavLink = {
  labelKey: 'footer.terms',
  status: 'live',
  href: '/terms-of-service',
}

// NOTE (24-REVIEW CR-02): This entry only updates the STATIC fallback
// registry consumed when the Payload `navigation` Global is empty/unreachable
// (see src/lib/navigation.ts header docs). It does NOT change the live
// Global, which is the actual source rendered by the Footer/sitemap.html
// under normal operation (nav-links.ts is only the seed source, per
// src/seed-navigation.ts). For this link to appear on the live footer,
// someone with production DB/admin access must add the equivalent item to
// the persisted Navigation Global — either via the Payload admin UI
// (Navigation > Footer > Recursos > Empresa subgroup) or by re-running
// seed-navigation.ts against that environment — as a manual, one-time
// post-deploy step. This sandbox has no live Postgres access to do that
// here (see 23-02 SUMMARYs for the same limitation).
const footerSitemap: NavLink = {
  labelKey: 'footer.sitemap',
  status: 'live',
  href: '/sitemap.html',
}

// Comparativas is a single collapsed item in the navbar (its 4 comparison
// pages live under `.children`); the footer expands those 4 children inline
// inside the Industrias column's "Comparativas" subgroup instead.
const comparativasEntry = navMenus[2].columns[0].items.find(
  (item) => item.labelKey === 'nav.comparativas.label',
)
if (!comparativasEntry?.children) {
  throw new Error(
    'nav-links: expected navMenus[2] to contain a nav.comparativas.label entry with children',
  )
}
const comparativasItems = comparativasEntry.children

export const footerColumns: FooterColumn[] = [
  {
    headingKey: 'footer.col.producto',
    items: [
      ...navMenus[0].columns[0].items,
      navDirectLinks[0],
      footerPayPerUse,
      footerAddOns,
    ],
    subgroup: {
      headingKey: 'footer.subgroup.features',
      items: navMenus[0].columns[1].items,
    },
  },
  {
    headingKey: 'footer.col.industrias',
    items: navMenus[1].columns[0].items,
    subgroup: {
      headingKey: 'footer.subgroup.comparativas',
      items: comparativasItems,
    },
  },
  {
    headingKey: 'footer.col.recursos',
    items: [
      ...navMenus[2].columns[0].items.filter(
        (item) => item.labelKey !== 'nav.comparativas.label',
      ),
      footerPlantillas,
    ],
    subgroup: {
      headingKey: 'footer.subgroup.empresa',
      items: [navDirectLinks[1], footerContacto, footerPrivacy, footerTerms, footerSitemap],
    },
  },
]
