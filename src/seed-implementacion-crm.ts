/**
 * One-off seed: Implementación CRM pilot page (EN + ES), draft status.
 * URL: apturio.com/es/implementacion-crm — distinct from apturio.com/es/implementacion
 * ("Software de ventas" page in the doc), which is seeded separately.
 * Run with: payload run src/seed-implementacion-crm.ts
 * Standalone — does not touch any other collection or page.
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

/** Split template's generic showcase zigzag, reused verbatim (site-wide component, not doc-specific copy). */
const showcaseZigzag = (lang: Lang): Block => ({
  blockType: 'featureZigzag',
  eyebrow: t(lang, 'Capabilities', 'Capacidades'),
  heading: t(lang, 'Built around how you actually sell', 'Construido en torno a cómo vendes'),
  rows: [
    {
      num: '01',
      title: t(lang, 'Capture and qualify, instantly', 'Captura y califica al instante'),
      description: t(
        lang,
        'The AI engages every inbound lead the moment it arrives and scores intent before your team wakes up.',
        'La IA atiende cada lead entrante apenas llega y puntúa la intención antes de que tu equipo despierte.',
      ),
      bullets: [
        { text: t(lang, 'Natural, on-brand conversation', 'Conversación natural y de marca') },
        { text: t(lang, 'Automatic enrichment & scoring', 'Enriquecimiento y scoring automático') },
      ],
      placeholder: 'Image',
    },
    {
      num: '02',
      title: t(lang, 'Book meetings on autopilot', 'Agenda reuniones en piloto automático'),
      description: t(
        lang,
        'Qualified leads land directly on the right calendar — no manual back-and-forth, ever.',
        'Los leads calificados caen directo en el calendario correcto — sin idas y vueltas.',
      ),
      bullets: [
        { text: t(lang, 'Smart routing by rep & territory', 'Ruteo inteligente por rep y zona') },
        { text: t(lang, 'Reminders that cut no-shows', 'Recordatorios que reducen ausencias') },
      ],
      placeholder: 'Image',
    },
  ],
})

const strategyForm = (lang: Lang): Block => ({
  blockType: 'strategyForm',
  eyebrow: t(lang, 'Free Strategy Call', 'Llamada de Estrategia Gratis'),
  heading: t(lang, 'Book your free strategy call', 'Agenda tu llamada de estrategia gratis'),
  body: t(
    lang,
    'Tell us where you are. An Apturio engineer will map your turnkey setup — no commitment.',
    'Cuéntanos dónde estás. Un ingeniero de Apturio mapeará tu setup llave en mano — sin compromiso.',
  ),
  bullets: [
    { text: t(lang, '30-minute working session', 'Sesión de trabajo de 30 min') },
    { text: t(lang, 'Custom architecture map', 'Mapa de arquitectura a medida') },
    { text: t(lang, '$2,000 setup bonus eligibility', 'Elegibilidad al bono de $2,000') },
  ],
  labels: {
    name: t(lang, 'Full name', 'Nombre'),
    namePlaceholder: t(lang, 'Jane Founder', 'Juana Fundadora'),
    company: t(lang, 'Company', 'Empresa'),
    companyPlaceholder: 'Acme Inc.',
    email: t(lang, 'Work email', 'Correo de trabajo'),
    emailPlaceholder: 'you@company.com',
    leads: t(lang, 'Monthly leads', 'Leads mensuales'),
    submit: t(lang, 'Request my call', 'Solicitar mi llamada'),
    fine: t(lang, 'No commitment · We reply within 1 business day.', 'Sin compromiso · Respondemos en 1 día hábil.'),
    success: t(lang, "Thanks — we'll be in touch within 1 business day.", 'Gracias — te contactamos en 1 día hábil.'),
  },
  leadOptions: [
    { text: t(lang, 'Under 100', 'Menos de 100') },
    { text: '100–500' },
    { text: '500–2,000' },
    { text: '2,000+' },
  ],
})

const implementacionCrmLayout = (lang: Lang): Block[] => [
  {
    blockType: 'heroDashboard',
    pillIcon: 'sparkles',
    pillText: t(lang, 'Turnkey implementation', 'Implementación llave en mano'),
    titleStart: t(lang, 'CRM implementation', 'Implementación de CRM'),
    titleAccent: t(lang, "that doesn't leave you alone with the setup", 'que no te deja solo con la configuración'),
    accentColor: 'green',
    subtitle: t(
      lang,
      'Our team migrates your data, configures your pipeline, and leaves everything tested and running from day one.',
      'Nuestro equipo migra tus datos, configura tu pipeline y deja todo probado y funcionando desde el día uno.',
    ),
    ctaPrimaryLabel: t(lang, 'See pricing', 'Ver precios'),
    ctaPrimaryHref: '#pricing',
    ctaSecondaryIcon: 'play',
    ctaSecondaryLabel: t(lang, 'Book a free trial', 'Agendar prueba gratuita'),
    ctaSecondaryHref: '#strategy',
    placeholder: t(lang, 'Dashboard screenshot', 'Captura del dashboard'),
  },
  {
    blockType: 'benefits',
    heading: t(lang, "Why our CRM implementation is different", 'Por qué nuestra implementación de CRM es diferente'),
    subtitle: t(
      lang,
      "Most CRMs give you access to the platform and leave you alone with the hardest part: configuring it. We do the opposite. Your plan includes a dedicated 20-hour Engineering Sprint, where our team builds your business logic from scratch — not a generic template you have to force-fit later.",
      'La mayoría de los CRM te dan acceso a la plataforma y te dejan solo con la parte más difícil, configurarla. Nosotros hacemos lo contrario. Tu plan incluye un Sprint de Ingeniería Dedicado de 20 horas, donde nuestro equipo construye la lógica específica de tu negocio desde cero, no una plantilla genérica que después tienes que adaptar a la fuerza.',
    ),
    items: [
      {
        title: t(lang, 'Priority engineering queue', 'Cola de ingeniería prioritaria'),
        description: t(lang, 'Elite plan clients go first in the implementation line.', 'Los clientes del plan Elite pasan primero en la fila de implementación.'),
      },
      {
        title: t(lang, 'Dedicated 20-hour build', 'Construcción dedicada de 20 horas'),
        description: t(
          lang,
          'An exclusive block of time where your architecture is built to your specs, not run in parallel with ten other clients.',
          'Un bloque de tiempo exclusivo donde tu arquitectura se construye a tu medida, no en paralelo con otros diez clientes.',
        ),
      },
      {
        title: t(lang, 'Turnkey setup', 'Configuración llave en mano'),
        description: t(
          lang,
          'The $2,000 setup fee is waived — you get the full build with no extra cost.',
          'La tarifa de $2.000 de configuración queda exonerada, recibes el trabajo completo sin costo adicional.',
        ),
      },
      {
        title: t(lang, 'Architecture built for you', 'Arquitectura hecha a tu medida'),
        description: t(
          lang,
          'We build your specific business logic from scratch, not a generic template you have to force to fit.',
          'Construimos la lógica específica de tu negocio desde cero, no una plantilla genérica que después tienes que adaptar a la fuerza.',
        ),
      },
    ],
  },
  {
    blockType: 'featureAccordion',
    eyebrow: t(lang, 'How it works', 'Cómo funciona'),
    heading: t(lang, 'How your CRM implementation works', 'Cómo funciona la implementación de tu CRM'),
    placeholder: t(lang, 'Feature screenshot', 'Captura del producto'),
    items: [
      {
        icon: 'phone-call',
        title: t(lang, 'Kickoff call', 'Llamada de arranque'),
        body: t(
          lang,
          'You tell us how your business sells today, your channels, your process, and what you want to automate first.',
          'Nos cuentas cómo vende tu negocio hoy, tus canales, tu proceso y qué quieres automatizar primero.',
        ),
      },
      {
        icon: 'plug',
        title: t(lang, 'We connect your channels', 'Conectamos tus canales'),
        body: t(
          lang,
          'WhatsApp, Instagram, Facebook, your phone number, and your website chat all get connected to the same system.',
          'WhatsApp, Instagram, Facebook, tu número de teléfono y el chat de tu sitio web quedan conectados al mismo sistema.',
        ),
      },
      {
        icon: 'database',
        title: t(lang, 'We migrate your data', 'Migramos tu información'),
        body: t(
          lang,
          'We move your current contacts, opportunities, and automations into the new CRM, without losing your history.',
          'Pasamos tus contactos, oportunidades y automatizaciones actuales al nuevo CRM, sin que pierdas historial.',
        ),
      },
      {
        icon: 'workflow',
        title: t(lang, 'We set up your pipeline and automations', 'Configuramos tu pipeline y tus automatizaciones'),
        body: t(
          lang,
          'We rebuild your real sales process — stages, reminders, automatic messages, and critical flows like review replies or missed-call auto-texts.',
          'Reconstruimos tu proceso de ventas real, etapas, recordatorios, mensajes automáticos y flujos críticos, como respuestas a reseñas o textos automáticos cuando se pierde una llamada.',
        ),
      },
      {
        icon: 'clipboard-check',
        title: t(lang, 'We test everything before you see it', 'Probamos todo antes de que lo veas'),
        body: t(
          lang,
          'We simulate your full sales process end to end, to confirm every automation, message, and stage works as it should.',
          'Simulamos tu proceso de venta completo, de principio a fin, para confirmar que cada automatización, mensaje y etapa funciona como debería.',
        ),
      },
      {
        icon: 'graduation-cap',
        title: t(lang, 'We train your team', 'Capacitamos a tu equipo'),
        body: t(
          lang,
          'A training session so your team starts using the system from day one, plus post-launch follow-up to fine-tune anything needed.',
          'Una sesión de formación para que tu equipo empiece a usar el sistema desde el primer día, más seguimiento después del lanzamiento para ajustar lo que haga falta.',
        ),
      },
    ],
  },
  showcaseZigzag(lang),
  {
    blockType: 'pricing',
    heading: t(lang, 'Simple, transparent pricing', 'Precios simples y transparentes'),
    subtitle: t(
      lang,
      'Choose the plan that fits your team. No hidden fees, cancel anytime.',
      'Elige el plan perfecto para las necesidades de tu equipo. Sin cargos ocultos, cancela en cualquier momento.',
    ),
    plans: plans(lang),
  },
  {
    blockType: 'faq',
    heading: t(lang, 'Frequently asked questions', 'Preguntas frecuentes'),
    items: [
      {
        question: t(lang, 'Do I need tech skills to go through the CRM implementation?', '¿Necesito saber de tecnología para pasar por la implementación de CRM?'),
        answer: t(
          lang,
          'No. Our engineering team handles the entire technical side — data migration, pipeline configuration, automations, and integrations. You just need to share your access and current data, and be available for the kickoff call and final training.',
          'No. Nuestro equipo de ingeniería se encarga de toda la parte técnica, migración de datos, configuración de pipelines, automatizaciones e integraciones. Tú solo necesitas compartir tus accesos y datos actuales, y estar disponible para la llamada de arranque y la capacitación final.',
        ),
      },
      {
        question: t(lang, 'What happens to my contacts and data from my previous system?', '¿Qué pasa con mis contactos y datos del sistema anterior?'),
        answer: t(
          lang,
          "We migrate them for you. We export your contacts, opportunities, and automations from whatever system you currently use, prep them, and rebuild them inside your new CRM, without losing your customer history.",
          'Los migramos por ti. Exportamos tus contactos, oportunidades y automatizaciones del sistema que uses actualmente, los preparamos y los reconstruimos dentro de tu nuevo CRM, sin que pierdas tu historial de clientes.',
        ),
      },
      {
        question: t(lang, 'Can I keep using my old system while the new one is implemented?', '¿Puedo seguir usando mi sistema anterior mientras se implementa el nuevo?'),
        answer: t(
          lang,
          'Yes. If your operation needs it, we can run both systems in parallel during the transition, and we only retire the old one after confirming everything works correctly in the new CRM.',
          'Sí. Si tu operación lo requiere, podemos correr ambos sistemas en paralelo durante la transición, y damos de baja el anterior solo después de validar que todo funciona correctamente en el nuevo CRM.',
        ),
      },
      {
        question: t(lang, 'What does the Dedicated Engineering Sprint include?', '¿Qué incluye el Sprint de Ingeniería Dedicado?'),
        answer: t(
          lang,
          'A dedicated 20-hour block where our team builds your specific business logic: pipelines, automations, channel integrations, and full testing of your sales process. The $2,000 setup fee is waived as part of this sprint.',
          'Un bloque de 20 horas donde nuestro equipo construye la lógica específica de tu negocio: pipelines, automatizaciones, integraciones de canales y pruebas completas de tu proceso de venta. La tarifa de configuración de $2.000 queda exonerada dentro de este sprint.',
        ),
      },
      {
        question: t(lang, 'What happens after the implementation is done?', '¿Qué pasa después de que termina la implementación?'),
        answer: t(
          lang,
          'You get training for your team and post-launch follow-up, where we monitor and adjust automations based on how they perform in practice, not just in theory.',
          'Recibes formación para tu equipo y seguimiento posterior al lanzamiento, donde monitoreamos y ajustamos automatizaciones según cómo esté funcionando en la práctica, no solo en la teoría.',
        ),
      },
    ],
  },
  strategyForm(lang),
]

const seedImplementacionCrm = async (): Promise<void> => {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'pages',
    locale: 'en',
    where: { slug: { equals: 'implementacion-crm' } },
    limit: 1,
  })

  const pageId = existing.docs[0]?.id

  const enData = {
    title: 'CRM Implementation',
    slug: 'implementacion-crm',
    layout: implementacionCrmLayout('en'),
    _status: 'draft',
    meta: {
      title: 'CRM Implementation with AI for Your Business',
      description:
        'We migrate, configure, and test your CRM for you. Dedicated engineering sprint, without you lifting a finger. Book your demo.',
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
      title: 'Implementación CRM',
      slug: 'implementacion-crm',
      layout: implementacionCrmLayout('es'),
      _status: 'draft',
      meta: {
        title: 'Implementación de CRM con IA para tu negocio',
        description:
          'Migramos, configuramos y probamos tu CRM por ti. Sprint de ingeniería dedicado, sin que muevas un dedo. Agenda tu demo.',
      },
    } as never,
  })

  payload.logger.info(`[seed-implementacion-crm] page id=${created.id} (en+es, slug=implementacion-crm)`)
}

await seedImplementacionCrm()

if (typeof process !== 'undefined') {
  process.exit(0)
}
