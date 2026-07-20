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
