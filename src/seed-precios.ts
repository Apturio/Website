/**
 * One-off seed: Precios de CRM pilot page (EN + ES), draft status.
 * URL: apturio.com/es/precios
 * Run with: payload run src/seed-precios.ts
 * Standalone — does not touch any other collection or page.
 * The detailed feature-comparison table inside PricingBlock is i18n-driven
 * (messages/{lang}.json `pricing.table.*`), not CMS content — it renders
 * automatically once the pricing block is present, no extra seeding needed.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

type Lang = 'en' | 'es'
type Block = Record<string, unknown>

const t = (lang: Lang, en: string, es: string) => (lang === 'es' ? es : en)

/** Site-wide 3-tier pricing plans, reused verbatim from seed-service.ts. */
const plans = (lang: Lang): Block[] => [
  {
    planId: 'foundation',
    name: t(lang, 'CRM Sales Foundation', 'Base de Ventas CRM'),
    description: t(lang, 'Essential tools to manage leads and sales.', 'Herramientas esenciales para leads y ventas.'),
    price: '$199',
    period: t(lang, ' / month', ' / mes'),
    highlighted: false,
    features: [
      { feature: t(lang, 'Self-service setup', 'Configuración por Cuenta Propia') },
      { feature: t(lang, 'Core CRM features', 'Funciones de CRM Core') },
      { feature: t(lang, 'Lead management', 'Gestión de Leads') },
      { feature: t(lang, 'Basic automations', 'Automatizaciones Básicas') },
      { feature: t(lang, 'Email & SMS integration', 'Integración de Email y SMS') },
      { feature: t(lang, 'Standard support', 'Soporte Estándar') },
    ],
    ctaLabel: t(lang, 'Get Started', 'Empezar'),
    ctaHref: '#strategy',
    subText: t(lang, '*Implementation support available as a separate add-on.', '*Soporte de implementación disponible como complemento por separado.'),
  },
  {
    planId: 'engine',
    name: 'AI CRM Sales Engine',
    description: t(lang, 'The done-for-you foundation for automated sales.', 'La base perfecta para ventas automatizadas.'),
    price: '$299',
    period: t(lang, ' / month', ' / mes'),
    highlighted: true,
    bonus: t(lang, '$2,000 Bonus Included', 'Bono de $2.000 Incluido'),
    features: [
      { feature: t(lang, 'All Foundation features', 'Todas las funciones de Foundation') },
      { feature: t(lang, 'AI Conversational Bot', 'Bot Conversacional de IA') },
      { feature: t(lang, 'AI Lead Qualification', 'Calificación de Leads con IA') },
      { feature: t(lang, 'Automated Booking', 'Agendamiento Automático de Citas') },
      { feature: t(lang, 'FREE $2,000 Setup', 'Configuración de $2.000 GRATIS') },
    ],
    ctaLabel: t(lang, 'Claim My Engine + $2,000 Bonus', 'Reclamar mi Motor + Bono de $2.000'),
    ctaHref: '#strategy',
  },
  {
    planId: 'growth',
    name: 'AI CRM Growth Machine',
    description: t(
      lang,
      'For businesses needing complex architectures and large-scale engineering at zero upfront cost.',
      'Para empresas que requieren arquitecturas complejas e ingeniería a gran escala sin costo inicial.',
    ),
    price: '$699',
    period: t(lang, ' / month', ' / mes'),
    highlighted: false,
    features: [
      { feature: t(lang, 'Everything in Sales Engine + $2,000 Implementation Waived', 'Todo en el Motor de Ventas IA + $2.000 de Implementación Exonerada') },
      { feature: t(lang, 'Advanced Workflow Automations', 'Automatizaciones de Flujo de Trabajo Avanzadas') },
      { feature: t(lang, 'Website/Funnel Builder', 'Constructor de Sitios Web/Embudos') },
      { feature: t(lang, 'Reputation Management', 'Gestión de Reputación') },
      { feature: t(lang, 'Elite Engineering Concierge', 'Conserje de Ingeniería Elite') },
    ],
    ctaLabel: t(lang, 'Get My Ready-To-Run Machine', 'Obtener mi Máquina Lista'),
    ctaHref: '#strategy',
  },
]

const precioLayout = (lang: Lang): Block[] => [
  {
    blockType: 'heroCentered',
    pillIcon: 'tag',
    pillText: t(lang, 'Pricing', 'Precios'),
    titleStart: t(lang, 'AI CRM pricing for', 'Precios de CRM con IA para'),
    titleAccent: t(lang, 'every stage', 'cada etapa'),
    titleEnd: t(lang, 'of your business', 'de tu negocio'),
    accentColor: 'brand',
    subtitle: t(
      lang,
      'Choose the plan that fits your business today. No hidden fees, no long contracts, cancel anytime.',
      'Elige el plan que se ajusta a tu negocio hoy. Sin cargos ocultos, sin contratos largos, cancela cuando quieras.',
    ),
  },
  {
    blockType: 'benefits',
    heading: t(lang, 'How to choose the right plan for your business', 'Cómo elegir el plan correcto para tu negocio'),
    items: [
      {
        title: t(lang, "If you're just starting to organize your sales", 'Si estás empezando a ordenar tus ventas'),
        description: t(
          lang,
          'The Sales CRM Foundation plan gives you the essentials — lead management, basic automations, and a working CRM — with the option to add implementation whenever you need it.',
          'El plan Base de Ventas CRM te da lo esencial, gestión de leads, automatizaciones básicas y CRM funcionando, con la opción de sumar implementación como complemento cuando lo necesites.',
        ),
      },
      {
        title: t(lang, 'If you want AI working for you from day one', 'Si quieres que la IA trabaje por ti desde el día uno'),
        description: t(
          lang,
          'The AI CRM Sales Engine includes a conversational bot, AI lead qualification, and automated booking, plus the $2,000 setup at no cost.',
          'El AI CRM Sales Engine incluye bot conversacional, calificación de leads con IA y agendamiento automático, más la configuración de $2.000 sin costo.',
        ),
      },
      {
        title: t(lang, 'If your operation needs custom architecture', 'Si tu operación necesita arquitectura a medida'),
        description: t(
          lang,
          'The AI CRM Growth Machine is built for businesses with complex processes: advanced automations, a site/funnel builder, reputation management, and dedicated engineering, at no upfront cost.',
          'El AI CRM Growth Machine está pensado para negocios con procesos complejos: automatizaciones avanzadas, constructor de sitios y embudos, gestión de reputación e ingeniería dedicada, sin costo inicial.',
        ),
      },
    ],
  },
  {
    blockType: 'pricing',
    heading: t(lang, 'Simple, transparent pricing', 'Precios simples y transparentes'),
    subtitle: t(
      lang,
      'Choose the plan that fits your business today. No hidden fees, no long contracts, cancel anytime.',
      'Elige el plan que se ajusta a tu negocio hoy. Sin cargos ocultos, sin contratos largos, cancela cuando quieras.',
    ),
    plans: plans(lang),
  },
  {
    blockType: 'faq',
    heading: t(lang, 'Frequently asked questions', 'Preguntas frecuentes'),
    items: [
      {
        question: t(lang, 'Are there long-term contracts?', '¿Hay contratos a largo plazo?'),
        answer: t(
          lang,
          'No, none. You work on a monthly subscription you can cancel anytime. We keep you because the system works, not because a contract forces you to.',
          'No, ninguno. Trabajas con una suscripción mensual que puedes cancelar cuando quieras. Nos quedamos contigo porque el sistema funciona, no porque un contrato te obligue.',
        ),
      },
      {
        question: t(lang, 'Are there pay-per-use fees on top of the monthly plan?', '¿Existen tarifas de pago por uso además de la mensualidad?'),
        answer: t(
          lang,
          'Yes. Certain advanced features, like AI usage, premium workflow actions, and telecom services (SMS, calls, emails), are billed by usage directly on the platform. These rates are subject to change, so we recommend reviewing the detailed breakdown before signing up.',
          'Sí. Ciertas funciones avanzadas, como el uso de IA, acciones de flujos de trabajo premium y servicios de telecomunicaciones (SMS, llamadas, correos electrónicos), se facturan por uso directamente en la plataforma. Estas tarifas están sujetas a cambios, así que te recomendamos revisar el desglose detallado antes de contratar.',
        ),
      },
      {
        question: t(lang, 'Does implementation cost extra?', '¿La implementación tiene costo aparte?'),
        answer: t(
          lang,
          'Depends on the plan. On AI CRM Sales Engine and AI CRM Growth Machine, the $2,000 setup fee is waived. On the CRM Sales Foundation plan, implementation support is available as a separate add-on.',
          'Depende del plan. En AI CRM Sales Engine y AI CRM Growth Machine, la configuración de $2.000 queda exonerada. En el plan Base de Ventas CRM, el soporte de implementación está disponible como complemento por separado.',
        ),
      },
      {
        question: t(lang, 'What happens if my business grows and I need more features?', '¿Qué pasa si mi negocio crece y necesito más funciones?'),
        answer: t(
          lang,
          'You can switch plans anytime. You don\'t need to start from zero: your existing configuration, pipelines, and automations carry over when you move to a higher plan.',
          'Puedes cambiar de plan en cualquier momento. No necesitas empezar de cero: tu configuración, pipelines y automatizaciones existentes se mantienen al pasar a un plan superior.',
        ),
      },
      {
        question: t(lang, 'Do you offer add-ons besides the plans?', '¿Ofrecen complementos (add-ons) además de los planes?'),
        answer: t(
          lang,
          'Yes. Besides the main plans, we offer optional add-ons like dedicated phone systems, advanced prospecting tools, automated ad managers, and WordPress hosting, each priced separately.',
          'Sí. Además de los planes principales, ofrecemos complementos opcionales como sistemas telefónicos dedicados, herramientas de prospección avanzadas, gestores de anuncios automatizados y alojamiento WordPress, cada uno con precio separado.',
        ),
      },
      {
        question: t(lang, 'What countries can I sign up from?', '¿En qué países puedo contratar Apturio?'),
        answer: t(
          lang,
          'Apturio works in any country because it runs 100% in the cloud. Today we serve businesses in Argentina, Mexico, Venezuela, Spain, and Canada, and we keep adding new markets.',
          'Apturio funciona en cualquier país porque opera 100% en la nube. Hoy damos servicio en Argentina, México, Venezuela, España y Canadá, y seguimos sumando mercados.',
        ),
      },
    ],
  },
]

const seedPrecios = async (): Promise<void> => {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'pages',
    locale: 'en',
    where: { slug: { equals: 'precios' } },
    limit: 1,
  })

  const pageId = existing.docs[0]?.id

  const enData = {
    title: 'CRM Pricing',
    slug: 'precios',
    layout: precioLayout('en'),
    _status: 'draft',
    meta: {
      title: 'AI CRM Pricing for Every Stage of Your Business',
      description:
        'Compare Apturio plans and pick the AI CRM that fits your business. No long contracts, cancel anytime. See pricing.',
    },
  }

  const created = pageId
    ? await payload.update({ collection: 'pages', id: pageId, locale: 'en', data: enData as never })
    : await payload.create({ collection: 'pages', locale: 'en', data: enData as never })

  await payload.update({
    collection: 'pages',
    id: created.id,
    locale: 'es',
    data: {
      title: 'Precios de CRM',
      slug: 'precios',
      layout: precioLayout('es'),
      _status: 'draft',
      meta: {
        title: 'Precios de CRM con IA para cada etapa de tu negocio',
        description:
          'Compara los planes de Apturio y elige el CRM con IA que se ajusta a tu negocio. Sin contratos largos, cancela cuando quieras. Ve los precios.',
      },
    } as never,
  })

  payload.logger.info(`[seed-precios] page id=${created.id} (en+es, slug=precios)`)
}

await seedPrecios()

if (typeof process !== 'undefined') {
  process.exit(0)
}
