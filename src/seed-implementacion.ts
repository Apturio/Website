/**
 * One-off seed: Implementación de CRM con IA pilot page (EN + ES), draft status.
 * URL: apturio.com/es/implementacion — the "Software de ventas" doc page,
 * distinct from apturio.com/es/implementacion-crm (already seeded separately).
 * Run with: payload run src/seed-implementacion.ts
 * Standalone — does not touch any other collection or page.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

type Lang = 'en' | 'es'
type Block = Record<string, unknown>

const t = (lang: Lang, en: string, es: string) => (lang === 'es' ? es : en)

/** Unified CRM's featureAccordion, reused verbatim (site-wide "inside the Cerebro" showcase). */
const cerebroAccordion = (lang: Lang): Block => ({
  blockType: 'featureAccordion',
  eyebrow: t(lang, 'Inside the Cerebro', 'Dentro del Cerebro'),
  heading: t(lang, 'One hub for the whole customer journey', 'Un hub para todo el journey del cliente'),
  placeholder: 'CRM screenshot',
  items: [
    {
      icon: 'users',
      title: t(lang, 'Unified contact records', 'Registros de contacto unificados'),
      body: t(
        lang,
        'Every email, message, deal and note for a contact lives in one timeline — no more tab-switching.',
        'Cada correo, mensaje, deal y nota de un contacto vive en una sola línea de tiempo.',
      ),
    },
    {
      icon: 'git-merge',
      title: t(lang, 'Native integrations', 'Integraciones nativas'),
      body: t(
        lang,
        'Connect email, chat, ads, payments and calendars — the Cerebro keeps them in sync automatically.',
        'Conecta email, chat, ads, pagos y calendarios — el Cerebro los mantiene sincronizados.',
      ),
    },
    {
      icon: 'bar-chart-3',
      title: t(lang, 'Real-time pipeline', 'Pipeline en tiempo real'),
      body: t(
        lang,
        'Live dashboards show exactly where every deal stands, the moment anything changes.',
        'Dashboards en vivo muestran dónde está cada deal, al instante.',
      ),
    },
    {
      icon: 'workflow',
      title: t(lang, 'Automations & workflows', 'Automatizaciones y flujos'),
      body: t(
        lang,
        'Trigger follow-ups, tasks and routing rules without writing a line of code.',
        'Dispara follow-ups, tareas y reglas de ruteo sin escribir código.',
      ),
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

const implementacionLayout = (lang: Lang): Block[] => [
  {
    blockType: 'heroCentered',
    pillIcon: 'sparkles',
    pillText: t(lang, 'Done-for-You Service', 'Servicio Hecho Para Ti'),
    titleStart: t(lang, 'We implement your AI CRM for you,', 'Implementamos tu CRM con IA por ti,'),
    titleAccent: t(lang, 'ready to run', 'listo para funcionar'),
    accentColor: 'brand',
    subtitle: t(
      lang,
      'Get a complete AI CRM setup (worth $2,000) designed to qualify leads, manage your funnel, and scale without hiring more people.',
      'Obtén una configuración completa de CRM con IA (valorada en $2.000) diseñada para calificar leads, gestionar tu embudo y escalar sin contratar más personal.',
    ),
    ctaPrimaryLabel: t(lang, 'See pricing', 'Ver precios'),
    ctaPrimaryHref: '#pricing',
    ctaSecondaryIcon: 'message-circle',
    ctaSecondaryLabel: t(lang, 'Message us on WhatsApp', 'Escríbenos por WhatsApp'),
    ctaSecondaryHref: 'https://wa.me/15614731298',
    micro: [
      { text: t(lang, 'Live in 30 days', 'En vivo en 30 días') },
      { text: t(lang, '$2,000 setup waived', 'Configuración de $2.000 exonerada') },
      { text: t(lang, 'Cancel anytime', 'Cancela cuando quieras') },
    ],
  },
  {
    blockType: 'featureGrid',
    eyebrow: t(lang, 'The problem', 'El problema'),
    heading: t(
      lang,
      "Buying a CRM is easy. Making it work is where it all breaks down",
      'Comprar un CRM es fácil. Dejarlo funcionando es donde todo se traba',
    ),
    subtitle: t(
      lang,
      "Most companies pay for a CRM and end up with an empty tool nobody configures. Technology isn't the problem — putting it to work for your business is.",
      'La mayoría de las empresas paga por un CRM y termina con una herramienta vacía que nadie configura. La tecnología no es el problema; ponerla a trabajar para tu negocio, sí.',
    ),
    cards: [
      {
        icon: 'package',
        title: t(lang, 'Unconfigured software', 'Software sin configurar'),
        description: t(lang, 'You pay for the license, but nobody leaves it operational.', 'Pagas la licencia, pero nadie lo deja operativo.'),
      },
      {
        icon: 'hourglass',
        title: t(lang, 'Months of ramp-up', 'Meses de curva'),
        description: t(lang, 'Your team wastes time learning instead of selling.', 'Tu equipo pierde tiempo aprendiendo en vez de vender.'),
      },
      {
        icon: 'copy',
        title: t(lang, 'Generic configuration', 'Configuración genérica'),
        description: t(lang, "Templates that don't fit your real process.", 'Plantillas que no encajan con tu proceso real.'),
      },
      {
        icon: 'trash-2',
        title: t(lang, 'Abandoned project', 'Proyecto abandonado'),
        description: t(lang, "It gets installed, never adopted, and ends up dropped.", 'Se instala, no se adopta y se termina dejando.'),
      },
    ],
  },
  {
    blockType: 'featureGrid',
    splitIntro: true,
    eyebrow: t(lang, 'The ecosystem', 'El ecosistema'),
    heading: t(lang, 'What the CRM implementation includes', 'Qué incluye la implementación del CRM'),
    subtitle: t(
      lang,
      "We don't hand you software to figure out. We hand you a working system, built around your business.",
      'No te entregamos un software para que lo resuelvas tú. Te entregamos un sistema funcionando, construido alrededor de tu negocio.',
    ),
    cards: [
      {
        icon: 'clock',
        title: t(lang, '20-hour sprint', 'Sprint de 20 horas'),
        description: t(lang, 'Dedicated engineering that builds your business logic from scratch.', 'Ingeniería dedicada que construye tu lógica de negocio desde cero.'),
      },
      {
        icon: 'blocks',
        title: t(lang, 'Custom architecture', 'Arquitectura personalizada'),
        description: t(lang, 'Designed for your funnel, your channels, and how you sell.', 'Diseñada para tu embudo, tus canales y tu forma de vender.'),
      },
      {
        icon: 'key',
        title: t(lang, 'Turnkey setup', 'Configuración llave en mano'),
        description: t(lang, 'We leave the CRM, chatbot, and automations connected and running.', 'Dejamos el CRM, el chatbot y las automatizaciones conectados y operativos.'),
      },
      {
        icon: 'filter',
        title: t(lang, 'Lead qualification', 'Calificación de leads'),
        description: t(lang, 'AI filters and prioritizes contacts based on your real criteria.', 'La IA filtra y prioriza contactos según tus criterios reales.'),
      },
      {
        icon: 'plug',
        title: t(lang, 'Channel integration', 'Integración de canales'),
        description: t(lang, 'WhatsApp, Instagram, calendar, and the tools you already use.', 'WhatsApp, Instagram, calendario y las herramientas que ya usas.'),
      },
      {
        icon: 'crown',
        title: t(lang, 'Elite priority queue', 'Cola prioritaria Elite'),
        description: t(lang, 'Elite clients go first in the engineering line.', 'Los clientes Elite entran primero en la fila de ingeniería.'),
      },
    ],
  },
  cerebroAccordion(lang),
  {
    blockType: 'steps',
    heading: t(lang, 'What implementing an AI CRM looks like', 'Cómo es el proceso para implementar un CRM con IA'),
    items: [
      {
        title: t(lang, 'Diagnosis', 'Diagnóstico'),
        description: t(
          lang,
          'We analyze your business, channels, and sales process to define the architecture.',
          'Analizamos tu negocio, tus canales y tu proceso de ventas para definir la arquitectura.',
        ),
      },
      {
        title: t(lang, 'Engineering sprint (20 hrs)', 'Sprint de ingeniería (20 hrs)'),
        description: t(
          lang,
          'Our team builds your business logic and configures the CRM, chatbot, and automations.',
          'Nuestro equipo construye tu lógica de negocio y configura el CRM, el chatbot y las automatizaciones.',
        ),
      },
      {
        title: t(lang, 'Connection and testing', 'Conexión y pruebas'),
        description: t(
          lang,
          'We integrate WhatsApp, Instagram, and your calendar, and test everything before delivery.',
          'Integramos WhatsApp, Instagram y tu calendario, y probamos todo antes de entregar.',
        ),
      },
      {
        title: t(lang, 'Ready-to-use delivery', 'Entrega lista para usar'),
        description: t(
          lang,
          'You receive your AI CRM running from day one. Your team just starts selling.',
          'Recibes tu CRM con IA operativo desde el día uno. Tu equipo solo empieza a vender.',
        ),
      },
    ],
  },
  {
    blockType: 'bonusBanner',
    pillText: t(lang, '$2,000 Turnkey Setup Waived', '$2.000 en Configuración Llave en Mano Exonerada'),
    heading: t(
      lang,
      'Turnkey setup worth $2,000, waived',
      'Configuración llave en mano valorada en $2.000, exonerada',
    ),
    body: t(
      lang,
      'The Elite plan includes the dedicated engineering sprint and the full setup at no extra cost. We handle the heavy lifting so you stop worrying about technology and focus on growing.',
      'El plan Elite incluye el sprint de ingeniería dedicado y la configuración completa sin costo adicional de setup. Nosotros manejamos el trabajo pesado para que dejes de preocuparte por la tecnología y te enfoques en crecer.',
    ),
    ctaPrimaryLabel: t(lang, 'Claim my spot', 'Reclamar mi cupo'),
    ctaPrimaryHref: '#strategy',
    fine: t(
      lang,
      'Limited spots: only 5 Elite implementations per month to keep engineering quality high. Projects are scheduled in the order assets are received.',
      'Cupos limitados: solo 5 implementaciones Elite al mes para garantizar la calidad de la ingeniería. Los proyectos se programan en el orden en que se reciben los activos.',
    ),
  },
  {
    blockType: 'faq',
    heading: t(lang, 'Frequently asked questions', 'Preguntas frecuentes'),
    items: [
      {
        question: t(lang, 'What does an AI CRM implementation include?', '¿Qué incluye la implementación de un CRM con IA?'),
        answer: t(
          lang,
          'It includes the complete setup of your CRM, ready to use. Our team designs the architecture tailored to your business, trains the AI on your information, configures the chatbot and automations, and integrates your channels (WhatsApp, Instagram, calendar, and the tools you already use). You get a working system, not empty software for you to figure out.',
          'Incluye la configuración completa de tu CRM lista para usar. Nuestro equipo diseña la arquitectura a la medida de tu negocio, entrena la IA con tu información, configura el chatbot y las automatizaciones, e integra tus canales (WhatsApp, Instagram, calendario y las herramientas que ya usas). Recibes un sistema funcionando, no un software vacío para que lo resuelvas tú.',
        ),
      },
      {
        question: t(lang, 'How long does the implementation take?', '¿Cuánto tarda la implementación?'),
        answer: t(
          lang,
          "The implementation takes around 30 days. Our Ready-to-Sell sprint is designed to get you running in that timeframe, executing your turnkey setup within an assigned 20-hour engineering window. The timeline holds as long as you deliver the necessary access and assets on time.",
          'La implementación tarda alrededor de 30 días. Nuestro sprint Ready-to-Sell está diseñado para dejarte operando en ese plazo, ejecutando tu configuración llave en mano dentro de una ventana asignada de 20 horas de ingeniería. El cronograma se cumple siempre que entregues a tiempo los accesos y activos necesarios.',
        ),
      },
      {
        question: t(lang, 'What is the 20-hour engineering sprint?', '¿Qué es el sprint de ingeniería de 20 horas?'),
        answer: t(
          lang,
          "It's a dedicated 20-hour block of work where our engineers build your CRM from scratch. During that sprint we define your business logic, configure the system, train the AI, and connect your channels, all in one high-intensity collaboration. Instead of a generic template, we build a solution made specifically for your operation.",
          'Es un bloque de 20 horas de trabajo dedicado en el que nuestros ingenieros construyen tu CRM desde cero. Durante ese sprint definimos tu lógica de negocio, configuramos el sistema, entrenamos la IA y conectamos tus canales, todo en una colaboración de alta intensidad. En lugar de darte una plantilla genérica, levantamos una solución hecha específicamente para tu operación.',
        ),
      },
      {
        question: t(lang, 'Do I need technical knowledge on my end?', '¿Necesito conocimientos técnicos de mi parte?'),
        answer: t(
          lang,
          'None at all. We handle all the engineering, AI training, and CRM configuration for you. Your only task is to give us your business information and access; we take care of the rest. Once the system is ready, you just log in and sell.',
          'No, ninguno. Nosotros nos encargamos de toda la ingeniería, el entrenamiento de la IA y la configuración del CRM por ti. Tu única tarea es entregarnos la información y los accesos de tu negocio; del resto nos ocupamos nosotros. Cuando el sistema esté listo, solo entras y vendes.',
        ),
      },
      {
        question: t(lang, 'Do you configure everything or do I take part?', '¿Ustedes lo configuran todo o participo yo?'),
        answer: t(
          lang,
          'We configure everything. Your involvement is limited to two moments: at the start, when you share your business information and access, and at the final review, to confirm everything is exactly as you need it. All the technical work is on us.',
          'Nosotros lo configuramos todo. Tu participación se limita a dos momentos: al inicio, cuando nos compartes la información y los accesos de tu negocio, y en la revisión final, para validar que todo quede como lo necesitas. Todo el trabajo técnico corre por nuestra cuenta.',
        ),
      },
    ],
  },
  strategyForm(lang),
]

const seedImplementacion = async (): Promise<void> => {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'pages',
    locale: 'en',
    where: { slug: { equals: 'implementacion' } },
    limit: 1,
  })

  const pageId = existing.docs[0]?.id

  const enData = {
    title: 'AI CRM Implementation',
    slug: 'implementacion',
    layout: implementacionLayout('en'),
    _status: 'draft',
    meta: {
      title: 'Turnkey AI CRM Implementation | Apturio',
      description:
        'We implement your AI CRM for you — 20-hour engineering sprint and turnkey setup. Limited spots. Book your demo.',
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
      title: 'Implementación de CRM con IA',
      slug: 'implementacion',
      layout: implementacionLayout('es'),
      _status: 'draft',
      meta: {
        title: 'Implementación de CRM con IA llave en mano | Apturio',
        description:
          'Nosotros implementamos tu CRM con IA por ti, sprint de ingeniería de 20 horas y configuración llave en mano. Cupos limitados. Agenda tu demo.',
      },
    } as never,
  })

  payload.logger.info(`[seed-implementacion] page id=${created.id} (en+es, slug=implementacion)`)
}

await seedImplementacion()

if (typeof process !== 'undefined') {
  process.exit(0)
}
