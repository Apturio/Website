/**
 * One-off seed: Automatización de CRM pilot page (EN + ES), draft status.
 * Run with: payload run src/seed-automatizaciones-crm.ts
 * Standalone — does not touch any other collection or page.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

type Lang = 'en' | 'es'
type Block = Record<string, unknown>

const t = (lang: Lang, en: string, es: string) => (lang === 'es' ? es : en)

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

const automatizacionesCrmLayout = (lang: Lang): Block[] => [
  {
    blockType: 'heroSplit',
    pillIcon: 'zap',
    pillText: t(lang, 'CRM automation', 'Automatización de CRM'),
    titleStart: t(lang, 'Automate your CRM', 'Automatiza tu CRM'),
    titleAccent: t(lang, 'so it works for you', 'para que trabaje por ti'),
    accentColor: 'brand',
    subtitle: t(
      lang,
      "Every time something important happens in your business — a customer books, a lead goes quiet, a sale closes — your system acts on its own, without you having to remember any of it.",
      'Cada vez que pasa algo importante en tu negocio, un cliente agenda, un lead no responde, una venta se cierra, tu sistema actúa solo, sin que tengas que acordarte de nada.',
    ),
    ctaPrimaryLabel: t(lang, 'See pricing', 'Ver precios'),
    ctaPrimaryHref: '#pricing',
    ctaSecondaryLabel: t(lang, 'Book a free trial', 'Agendar prueba gratuita'),
    ctaSecondaryHref: '#strategy',
    placeholder: t(lang, 'Product screenshot', 'Captura del producto'),
    micro: [
      { text: t(lang, 'No automation limit', 'Sin límite de automatizaciones') },
      { text: t(lang, 'No tech skills needed', 'No necesitas saber de tecnología') },
    ],
  },
  {
    blockType: 'featureGrid',
    splitIntro: true,
    eyebrow: t(lang, 'The solution', 'La solución'),
    heading: t(lang, 'Every automation your CRM can run for you', 'Todas las automatizaciones que tu CRM puede hacer por ti'),
    subtitle: t(
      lang,
      "When every message, reminder, and follow-up depends on someone remembering to do it, your business can't grow faster than you can work. With automation, those tasks run themselves, every day, without depending on you or your team.",
      'Cuando cada mensaje, recordatorio y seguimiento depende de que alguien se acuerde de hacerlo, tu negocio no puede crecer más rápido de lo que tú puedes trabajar. Con automatización, esas tareas se ejecutan solas, todos los días, sin que dependan de ti ni de tu equipo.',
    ),
    cards: [
      {
        icon: 'message-square',
        title: t(lang, 'Automatic messages', 'Mensajes automáticos'),
        description: t(
          lang,
          'Send SMS, email, or WhatsApp at the exact moment you define, with nobody writing them by hand.',
          'Envía SMS, email o WhatsApp en el momento exacto que definas, sin que nadie los escriba a mano.',
        ),
      },
      {
        icon: 'bell',
        title: t(lang, 'Reminders & follow-ups', 'Recordatorios y seguimientos'),
        description: t(
          lang,
          'Appointment confirmations, post-sale follow-ups, and re-engagement of inactive customers, all at the right moment.',
          'Confirmaciones de cita, seguimientos post-venta, reactivación de clientes inactivos, todo en el momento justo.',
        ),
      },
      {
        icon: 'move-right',
        title: t(lang, 'Automatic pipeline movement', 'Movimiento automático en tu pipeline'),
        description: t(
          lang,
          'When something changes — a payment, a reply, a confirmed appointment — the opportunity advances to the next stage on its own.',
          'Cuando algo cambia (un pago, una respuesta, una cita confirmada), la oportunidad avanza sola a la siguiente etapa.',
        ),
      },
      {
        icon: 'clipboard-check',
        title: t(lang, 'Tasks for your team', 'Tareas para tu equipo'),
        description: t(
          lang,
          'The system assigns the right person what they need to do, without you having to hand out tasks manually.',
          'El sistema asigna a la persona correcta lo que tiene que hacer, sin que tengas que repartir tareas manualmente.',
        ),
      },
      {
        icon: 'bot',
        title: t(lang, 'AI conversations', 'Conversaciones con IA'),
        description: t(
          lang,
          'Turn on an assistant that responds and qualifies automatically, even outside business hours.',
          'Activa un asistente que responde y califica automáticamente, incluso fuera de horario.',
        ),
      },
      {
        icon: 'sparkles',
        title: t(lang, 'Built for you, no tech needed', 'Creado a tu medida, sin saber de tecnología'),
        description: t(
          lang,
          'Choose from ready-made industry templates (like pre-built appointment reminders) or describe what you need in plain language, and the system builds the automation for you.',
          'Elige entre plantillas listas por industria (por ejemplo, recordatorios de cita ya armados) o describe lo que necesitas en lenguaje simple, y el sistema construye la automatización por ti.',
        ),
      },
    ],
  },
  {
    blockType: 'featureAccordion',
    eyebrow: t(lang, 'Use cases', 'Casos de uso'),
    heading: t(lang, 'CRM automation in your day to day', 'Automatización de CRM en tu día a día'),
    placeholder: t(lang, 'Feature screenshot', 'Captura del producto'),
    items: [
      {
        icon: 'party-popper',
        title: t(lang, 'Automatic welcome', 'Bienvenida automática'),
        body: t(
          lang,
          'As soon as a new lead writes in or fills out a form, they get an instant reply, no matter if it is the middle of the night or a weekend. Response in seconds, all day — zero unanswered leads.',
          'En cuanto un lead nuevo escribe o llena un formulario, recibe respuesta al instante, sin importar si es de madrugada o fin de semana. Respuesta en segundos, todo el día — cero leads sin contestar.',
        ),
      },
      {
        icon: 'calendar-clock',
        title: t(lang, 'Appointment reminder', 'Recordatorio de cita'),
        body: t(
          lang,
          'The system sends an automatic SMS 24 hours before and another 1 hour before, so the customer never forgets their appointment and your calendar does not fill up with no-shows. Fewer no-shows — zero manual follow-up.',
          'El sistema envía un SMS automático 24 horas antes y otro 1 hora antes, para que el cliente nunca olvide su turno y tu agenda no se llene de ausencias. Menos inasistencias — cero seguimiento manual.',
        ),
      },
      {
        icon: 'star',
        title: t(lang, 'Post-appointment follow-up', 'Seguimiento post-cita'),
        body: t(
          lang,
          'After every appointment, the customer gets a thank-you message and a review request, right when they are most satisfied with your service. More reviews earned — customer served with zero effort on your part.',
          'Después de cada cita, el cliente recibe un mensaje de agradecimiento y un pedido de reseña, justo en el momento en que está más satisfecho con tu servicio. Más reseñas conseguidas — cliente atendido sin esfuerzo de tu parte.',
        ),
      },
    ],
  },
  {
    blockType: 'tabs',
    eyebrow: t(lang, 'How it works', 'Cómo funciona'),
    heading: t(lang, 'How we implement your CRM automation', 'Cómo implementamos tu automatización de CRM'),
    tabs: [
      {
        icon: 'message-circle',
        label: t(lang, 'You tell us', 'Nos cuentas'),
        title: t(lang, 'You tell us what to automate', 'Nos cuentas qué quieres automatizar'),
        description: t(
          lang,
          'You tell us which task you repeat every day — a reminder, a welcome message, a follow-up — in plain language, with no need to know anything technical.',
          'Nos dices qué tarea repites todos los días, un recordatorio, un mensaje de bienvenida, un seguimiento, en lenguaje simple, sin necesidad de saber de tecnología.',
        ),
        bullets: [{ text: t(lang, 'Plain language, no jargon', 'Lenguaje simple, sin tecnicismos') }],
        placeholder: t(lang, 'Image', 'Imagen'),
      },
      {
        icon: 'wrench',
        label: t(lang, 'We build it', 'Lo armamos'),
        title: t(lang, 'We build it for you', 'Lo armamos por ti'),
        description: t(
          lang,
          'We pick the template that best fits your business or build the automation to your exact needs, ready to run from day one.',
          'Elegimos la plantilla que mejor se adapta a tu negocio o construimos la automatización a tu medida, lista para funcionar desde el primer día.',
        ),
        bullets: [{ text: t(lang, 'Ready from day one', 'Lista desde el día uno') }],
        placeholder: t(lang, 'Image', 'Imagen'),
      },
      {
        icon: 'check-circle',
        label: t(lang, 'It runs itself', 'Queda solo'),
        title: t(lang, 'The system keeps working on its own', 'El sistema queda trabajando solo'),
        description: t(
          lang,
          'Every time the condition is met, the automation runs with nobody stepping in. You just check the results.',
          'Cada vez que se cumple la condición, la automatización se ejecuta sin que nadie intervenga. Tú solo revisas los resultados.',
        ),
        bullets: [{ text: t(lang, 'Zero manual upkeep', 'Cero mantenimiento manual') }],
        placeholder: t(lang, 'Image', 'Imagen'),
      },
    ],
  },
  {
    blockType: 'bigQuote',
    quote: t(
      lang,
      '[Placeholder — replace with a real client testimonial before publishing]',
      '[Placeholder — reemplazar con un testimonio real de cliente antes de publicar]',
    ),
    authorName: t(lang, '[Name pending]', '[Nombre pendiente]'),
    authorRole: t(lang, '[Role pending]', '[Cargo pendiente]'),
  },
  {
    blockType: 'timeline',
    eyebrow: t(lang, 'The build sprint', 'El sprint de build'),
    heading: t(lang, 'Your 30-day path to live', 'Tu camino de 30 días a producción'),
    items: [
      {
        icon: 'phone-call',
        tag: t(lang, 'Day 0', 'Día 0'),
        title: t(lang, 'Free strategy call', 'Llamada de estrategia gratis'),
        description: t(
          lang,
          'We map your pipeline, tools and goals — then scope the build.',
          'Mapeamos tu pipeline, herramientas y metas — luego definimos el build.',
        ),
      },
      {
        icon: 'wrench',
        tag: t(lang, 'Days 1–20', 'Días 1–20'),
        title: t(lang, '20-hour engineering sprint', 'Sprint de ingeniería de 20 horas'),
        description: t(
          lang,
          'Our engineers build your custom architecture from the ground up.',
          'Nuestros ingenieros construyen tu arquitectura a medida desde cero.',
        ),
      },
      {
        icon: 'check',
        tag: t(lang, 'Day 30', 'Día 30'),
        title: t(lang, 'Go live', 'En vivo'),
        description: t(
          lang,
          'Your machine runs 24/7 — qualifying, booking and scaling.',
          'Tu máquina funciona 24/7 — califica, agenda y escala.',
        ),
      },
    ],
  },
  {
    blockType: 'faq',
    heading: t(lang, 'Frequently asked questions', 'Preguntas frecuentes'),
    items: [
      {
        question: t(lang, 'Do I need tech skills to build a CRM automation?', '¿Necesito saber de tecnología para crear una automatización de CRM?'),
        answer: t(
          lang,
          'No. The CRM is built so any business owner can create an automation without coding or configuring anything technical. You can choose from ready-made automation templates for your type of business, like appointment reminders, welcoming new leads, or re-engaging inactive customers, or simply describe in plain language what you want to happen, and the system builds the automated workflow for you.',
          'No. el CRM está pensado para que cualquier dueño de negocio pueda crear una automatización sin programar ni configurar nada técnico. Puedes elegir entre plantillas de automatización ya armadas para tu tipo de negocio, como recordatorios de cita, bienvenida a nuevos leads o reactivación de clientes inactivos, o simplemente describir en lenguaje simple qué quieres que pase, y el sistema construye el flujo de trabajo automatizado por ti.',
        ),
      },
      {
        question: t(lang, 'Is there a limit on how many automations I can create in my CRM?', '¿Hay un límite de automatizaciones que puedo crear en mi CRM?'),
        answer: t(
          lang,
          "There is no fixed limit on the number of active automations you can have. You can create as many automated workflows as your business needs, whether for WhatsApp messages, appointment reminders, lead follow-up, or pipeline management. Some more advanced actions, like certain premium triggers or specific integrations, may depend on the plan you choose, but basic CRM automation has no quantity restriction.",
          'No existe un límite fijo en la cantidad de automatizaciones que puedes tener activas. Puedes crear tantos flujos de trabajo automatizados como tu negocio necesite, ya sea para mensajes de WhatsApp, recordatorios de citas, seguimiento de leads o gestión de tu pipeline de ventas. Algunas acciones más avanzadas, como ciertos triggers premium o integraciones específicas, pueden depender del plan que elijas, pero la automatización básica de CRM no tiene restricción de cantidad.',
        ),
      },
      {
        question: t(lang, 'Can I automate WhatsApp messages?', '¿Puedo automatizar mensajes de WhatsApp?'),
        answer: t(
          lang,
          'Yes. Apturio\'s CRM automation runs on WhatsApp, SMS, and email from the same system, not just by email. You can trigger automatic WhatsApp messages when something specific happens — an appointment booked, a sale closed, several days without a reply — and the full conversation stays logged inside the CRM, together with the rest of the customer history.',
          'Sí. La automatización de CRM en Apturio funciona sobre WhatsApp, SMS y email desde el mismo sistema, no solo por correo electrónico. Puedes activar mensajes automáticos de WhatsApp cuando ocurre algo específico, una cita agendada, una venta cerrada, una falta de respuesta de varios días, y la conversación completa queda registrada dentro del CRM, junto con el resto del historial del cliente.',
        ),
      },
      {
        question: t(lang, 'Can I check whether a CRM automation is actually working?', '¿Puedo revisar si una automatización de CRM realmente está funcionando?'),
        answer: t(
          lang,
          'Yes. Every automation keeps a detailed log of each time it ran, including what triggered it, what action fired, and the result. This lets you check whether an automated workflow is working as expected, spot errors, or adjust the process if something goes wrong, without depending on someone reporting it to you manually.',
          'Sí. Cada automatización guarda un registro detallado de cada vez que se ejecutó, incluyendo qué la activó, qué acción se disparó y el resultado. Esto te permite revisar si un flujo de trabajo automatizado está funcionando como esperabas, detectar errores o ajustar el proceso si algo no sale bien, sin depender de que alguien te lo reporte manualmente.',
        ),
      },
    ],
  },
  strategyForm(lang),
]

const seedAutomatizacionesCrm = async (): Promise<void> => {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'pages',
    locale: 'en',
    where: { slug: { equals: 'automatizaciones-crm' } },
    limit: 1,
  })

  const pageId = existing.docs[0]?.id

  const enData = {
    title: 'CRM Automation',
    slug: 'automatizaciones-crm',
    layout: automatizacionesCrmLayout('en'),
    _status: 'draft',
    meta: {
      title: 'CRM Automation with AI for Your Business',
      description:
        'Automate messages, reminders, and follow-ups with no code. Your CRM works for you, even while you sleep. Book your demo.',
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
      title: 'Automatización CRM',
      slug: 'automatizaciones-crm',
      layout: automatizacionesCrmLayout('es'),
      _status: 'draft',
      meta: {
        title: 'Automatización de CRM con IA para tu negocio',
        description:
          'Automatiza mensajes, recordatorios y seguimientos sin escribir una línea de código. Tu CRM trabaja por ti, incluso mientras duermes. Agenda tu demo.',
      },
    } as never,
  })

  payload.logger.info(`[seed-automatizaciones-crm] page id=${created.id} (en+es, slug=automatizaciones-crm)`)
}

await seedAutomatizacionesCrm()

if (typeof process !== 'undefined') {
  process.exit(0)
}
