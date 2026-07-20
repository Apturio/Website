/**
 * One-off seed: Sistema de Reservas pilot page (EN + ES), draft status.
 * URL: apturio.com/es/sistema-reservas
 * Run with: payload run src/seed-sistema-reservas.ts
 * Standalone — does not touch any other collection or page.
 * Content sourced entirely from the doc's Sistema de Reservas section — the
 * reference screenshots were used only to pick block types, not for copy.
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

const sistemaReservasLayout = (lang: Lang): Block[] => [
  {
    blockType: 'heroSplit',
    pillIcon: 'calendar-check',
    pillText: t(lang, 'AI Booking System', 'Sistema de Reservas con IA'),
    titleStart: t(lang, 'Your calendar,', 'Tu agenda,'),
    titleAccent: t(lang, 'fills itself', 'llena sola'),
    accentColor: 'brand',
    subtitle: t(
      lang,
      'Let your customers book appointments, classes, or consultations 24/7 from a link with your brand. Confirmations, reminders, and payment are automated from the first click, with no manual calls or emails.',
      'Deja que tus clientes agenden citas, clases o consultas 24/7 desde un link con tu marca. Confirmaciones, recordatorios y cobro quedan automatizados desde el primer clic, sin llamadas ni correos manuales.',
    ),
    ctaPrimaryLabel: t(lang, 'See how it works', 'Ver cómo funciona'),
    ctaPrimaryHref: '#pricing',
    ctaSecondaryLabel: t(lang, 'Book your demo', 'Agenda tu demo'),
    ctaSecondaryHref: '#strategy',
    placeholder: t(lang, 'Booking calendar mockup', 'Mockup del calendario de reservas'),
  },
  {
    blockType: 'featureZigzag',
    eyebrow: t(lang, 'Definition', 'Definición'),
    heading: t(lang, "What is the CRM's booking system?", 'Qué es el sistema de reservas del CRM'),
    rows: [
      {
        num: '01',
        title: t(lang, "What is the CRM's booking system?", 'Qué es el sistema de reservas del CRM'),
        description: t(
          lang,
          'The booking system is a tool built into the CRM that fully automates scheduling appointments, meetings, classes, and services. Customers book directly from a web page, a personalized link, a sales funnel, or even a chatbot, with no calls, no manual emails, and no friction.',
          'El sistema de reservas es una herramienta integrada dentro del CRM que automatiza por completo el agendamiento de citas, reuniones, clases y servicios. Los clientes reservan directamente desde una página web, un link personalizado, un embudo de ventas o incluso desde un chatbot, sin llamadas, sin correos manuales y sin fricciones.',
        ),
        bullets: [
          { text: t(lang, 'No loose calendar or contact form', 'No es un calendario suelto ni un formulario') },
          { text: t(lang, 'Every booking creates a contact and opportunity', 'Cada reserva crea un contacto y una oportunidad') },
        ],
        placeholder: t(lang, 'Image', 'Imagen'),
      },
    ],
  },
  {
    blockType: 'comparisonTable',
    eyebrow: t(lang, 'The difference', 'La diferencia'),
    heading: t(lang, 'Booking system vs. web form vs. manual method', 'Sistema de reservas vs. formulario web vs. método manual'),
    columns: [
      { label: t(lang, 'Manual method', 'Método manual') },
      { label: t(lang, 'Web form', 'Formulario web') },
      { label: t(lang, 'CRM Booking System', 'Sistema de Reservas CRM'), highlight: true },
    ],
    rows: [
      {
        label: t(lang, 'Availability', 'Disponibilidad'),
        values: [
          { text: t(lang, 'Business hours only', 'Solo horario laboral') },
          { text: t(lang, '24/7, no instant confirmation', '24/7 sin confirmación inmediata') },
          { text: t(lang, '24/7 with instant confirmation', '24/7 con confirmación instantánea'), highlight: true },
        ],
      },
      {
        label: t(lang, 'Automatic confirmation', 'Confirmación automática'),
        values: [
          { text: t(lang, 'No', 'No') },
          { text: t(lang, 'No', 'No') },
          { text: t(lang, 'Yes, by email and SMS', 'Sí, por email y SMS'), highlight: true },
        ],
      },
      {
        label: t(lang, 'Reminders', 'Recordatorios'),
        values: [
          { text: t(lang, 'None or manual', 'No o manuales') },
          { text: t(lang, 'None', 'No') },
          { text: t(lang, 'Automatic (24h, 1h before)', 'Automáticos (24h, 1h antes)'), highlight: true },
        ],
      },
      {
        label: t(lang, 'Prevents double booking', 'Evita doble reserva'),
        values: [
          { text: t(lang, 'No', 'No') },
          { text: t(lang, 'No', 'No') },
          { text: t(lang, 'Yes, blocks the slot instantly', 'Sí, bloquea el slot al instante'), highlight: true },
        ],
      },
      {
        label: t(lang, 'Payment at booking', 'Cobro al reservar'),
        values: [
          { text: t(lang, 'No', 'No') },
          { text: t(lang, 'No', 'No') },
          { text: t(lang, 'Yes, deposit or full payment', 'Sí, depósito o pago total'), highlight: true },
        ],
      },
      {
        label: t(lang, 'CRM integration', 'Integración con CRM'),
        values: [
          { text: t(lang, 'Manual entry', 'Entrada manual') },
          { text: t(lang, 'Requires separate integration', 'Requiere integración aparte') },
          { text: t(lang, '100% native and automatic', '100% nativa y automática'), highlight: true },
        ],
      },
      {
        label: t(lang, 'No-shows', 'No-shows'),
        values: [
          { text: t(lang, 'High without reminders', 'Altos sin recordatorios') },
          { text: t(lang, 'High', 'Altos') },
          { text: t(lang, 'Reduced with automatic reminders', 'Reducidos con recordatorios automáticos'), highlight: true },
        ],
      },
    ],
  },
  {
    blockType: 'featureGrid',
    eyebrow: t(lang, 'Capabilities', 'Capacidades'),
    heading: t(lang, 'What the booking system can do', 'Qué puede hacer el sistema de reservas'),
    cards: [
      {
        icon: 'link',
        title: t(lang, 'Branded booking page', 'Página de reserva con tu marca'),
        description: t(lang, 'Your own link with your design so customers can book 24/7.', 'Link propio con tu diseño para que los clientes agenden 24/7.'),
      },
      {
        icon: 'layout-grid',
        title: t(lang, 'Multiple calendars', 'Calendarios múltiples'),
        description: t(lang, 'One calendar per service, meeting type, or team member.', 'Un calendario por servicio, tipo de reunión o miembro del equipo.'),
      },
      {
        icon: 'shuffle',
        title: t(lang, 'Team round robin', 'Round robin de equipo'),
        description: t(lang, 'Distributes incoming bookings among available reps.', 'Distribuye las citas entrantes entre los asesores disponibles.'),
      },
      {
        icon: 'bell',
        title: t(lang, 'Confirmations and reminders', 'Confirmaciones y recordatorios'),
        description: t(lang, 'Automatic email and SMS when booking and before the appointment.', 'Email y SMS automáticos al agendar y antes de la cita.'),
      },
      {
        icon: 'calendar-sync',
        title: t(lang, 'Google Calendar sync', 'Sincronización con Google Calendar'),
        description: t(lang, "Two-way sync with the team's calendar.", 'Sincronización bidireccional con el calendario del equipo.'),
      },
      {
        icon: 'credit-card',
        title: t(lang, 'Payment at booking', 'Cobro al momento de reservar'),
        description: t(lang, 'Requires a deposit or full payment to confirm the slot.', 'Requiere depósito o pago total para confirmar el slot.'),
      },
      {
        icon: 'filter',
        title: t(lang, 'Pre-qualification form', 'Formulario de pre-calificación'),
        description: t(lang, 'Filters the contact before confirming the appointment.', 'Filtra al contacto antes de confirmar la cita.'),
      },
      {
        icon: 'calendar-clock',
        title: t(lang, 'Cancellation and rebooking', 'Cancelación y re-agendamiento'),
        description: t(lang, 'The customer reschedules with one click, no call needed.', 'El cliente reprograma con un clic, sin llamar al negocio.'),
      },
    ],
  },
  {
    blockType: 'featureGrid',
    eyebrow: t(lang, 'Calendar types', 'Tipos de calendarios'),
    heading: t(lang, 'Available calendar types', 'Tipos de calendarios disponibles'),
    cards: [
      {
        icon: 'user',
        title: t(lang, 'Individual', 'Individual'),
        description: t(lang, 'One team member; the customer picks the available time. Ideal for consultants and coaches.', 'Un solo miembro del equipo; el cliente elige la hora disponible. Ideal para consultores y coaches.'),
      },
      {
        icon: 'shuffle',
        title: t(lang, 'Round robin', 'Round robin'),
        description: t(lang, 'Distributes bookings automatically among several agents. Ideal for sales or support teams.', 'Distribuye las citas entre varios agentes automáticamente. Ideal para equipos de ventas o soporte.'),
      },
      {
        icon: 'users',
        title: t(lang, 'Collective', 'Colectivo'),
        description: t(lang, 'Requires several team members available at once, like an interview panel.', 'Requiere que varios miembros del equipo estén disponibles a la vez, como en un panel de entrevista.'),
      },
      {
        icon: 'presentation',
        title: t(lang, 'Class or group', 'Clase o grupo'),
        description: t(lang, 'Several people book the same time slot with a limited capacity, like a webinar or workshop.', 'Varias personas reservan el mismo horario con cupo limitado, como en un webinar o taller.'),
      },
      {
        icon: 'timer',
        title: t(lang, 'Variable-duration service', 'Servicio con duración variable'),
        description: t(lang, 'The customer picks the service and the duration adjusts itself, common in spas and clinics.', 'El cliente elige el servicio y la duración se ajusta sola, común en spas y clínicas.'),
      },
      {
        icon: 'door-open',
        title: t(lang, 'Resource', 'Recurso'),
        description: t(lang, 'Books spaces or equipment instead of people, like a meeting room or a studio.', 'Reserva espacios o equipos en lugar de personas, como una sala de reuniones o un estudio.'),
      },
    ],
  },
  {
    blockType: 'tabs',
    eyebrow: t(lang, 'Use cases', 'Casos de uso'),
    heading: t(lang, 'How businesses use it, by industry', 'Cómo lo usan los negocios: casos de uso por industria'),
    tabs: [
      {
        icon: 'briefcase',
        label: t(lang, 'Agencies', 'Agencias'),
        title: t(lang, 'Agencies and consultants', 'Agencias y consultores'),
        description: t(lang, 'Free audits and consultations that book themselves from the landing page.', 'Auditorías y consultorías gratuitas que agendan solas desde la landing page.'),
        bullets: [],
        placeholder: 'Image',
      },
      {
        icon: 'graduation-cap',
        label: t(lang, 'Coaches', 'Coaches'),
        title: t(lang, 'Coaches', 'Coaches'),
        description: t(lang, '1:1 sessions and group programs with a required deposit before confirming.', 'Sesiones 1:1 y programas grupales con depósito requerido antes de confirmar.'),
        bullets: [],
        placeholder: 'Image',
      },
      {
        icon: 'stethoscope',
        label: t(lang, 'Health', 'Salud'),
        title: t(lang, 'Health and clinics', 'Salud y clínicas'),
        description: t(lang, 'Medical appointments with prior history and a reminder 24 hours before.', 'Citas médicas con historial previo y recordatorio 24 horas antes.'),
        bullets: [],
        placeholder: 'Image',
      },
      {
        icon: 'home',
        label: t(lang, 'Real estate', 'Bienes raíces'),
        title: t(lang, 'Real estate', 'Bienes raíces'),
        description: t(lang, 'Property visits only for leads who qualify on the pre-form.', 'Visitas a propiedades solo para leads que califican en el formulario previo.'),
        bullets: [],
        placeholder: 'Image',
      },
      {
        icon: 'monitor-play',
        label: t(lang, 'Online education', 'Educación online'),
        title: t(lang, 'Online education', 'Educación online'),
        description: t(lang, 'Trial classes and webinars with automatic sign-up from a demo.', 'Clases de prueba y webinars con inscripción automática desde una demo.'),
        bullets: [],
        placeholder: 'Image',
      },
      {
        icon: 'utensils',
        label: t(lang, 'Restaurants and events', 'Restaurantes y eventos'),
        title: t(lang, 'Restaurants and events', 'Restaurantes y eventos'),
        description: t(lang, 'Table or event bookings with automatic confirmation and reminders.', 'Reservas de mesa o evento con confirmación y recordatorio automáticos.'),
        bullets: [],
        placeholder: 'Image',
      },
    ],
  },
  {
    blockType: 'benefits',
    heading: t(lang, 'Key differentiators', 'Diferenciadores clave'),
    items: [
      {
        title: t(lang, '100% integrated with the CRM', '100% integrado al CRM'),
        description: t(lang, 'Every booking creates a contact, an opportunity, and triggers workflows with no manual work.', 'Cada reserva crea contacto, oportunidad y dispara workflows sin trabajo manual.'),
      },
      {
        title: t(lang, 'Payment at booking', 'Cobro en la reserva'),
        description: t(lang, "Accepts full payment or a deposit connected to the CRM's payment gateway.", 'Acepta pago total o depósito conectado a la pasarela de pagos del CRM.'),
      },
      {
        title: t(lang, 'Built-in pre-qualification', 'Pre-calificación integrada'),
        description: t(lang, "The pre-form filters leads before they reach the team's calendar.", 'El formulario previo filtra leads antes de que lleguen a la agenda del equipo.'),
      },
      {
        title: t(lang, 'Multichannel access', 'Acceso multicanal'),
        description: t(lang, 'The booking link works on web, email, WhatsApp, Instagram, and funnels.', 'El link de reserva funciona en web, email, WhatsApp, Instagram y funnels.'),
      },
      {
        title: t(lang, 'Multichannel reminders', 'Recordatorios multicanal'),
        description: t(lang, 'Email, SMS, and WhatsApp at the intervals you define, with proven fewer no-shows.', 'Email, SMS y WhatsApp en los intervalos que definas, con menos no-shows comprobado.'),
      },
      {
        title: t(lang, 'Smart timezone detection', 'Zona horaria inteligente'),
        description: t(lang, "Detects the customer's timezone and avoids confusion with international clients.", 'Detecta la zona horaria del cliente y evita confusiones con clientes internacionales.'),
      },
    ],
  },
  {
    blockType: 'steps',
    heading: t(lang, 'The full booking flow', 'Flujo completo del sistema de reservas'),
    items: [
      {
        title: t(lang, 'Marketing', 'Marketing'),
        description: t(lang, 'The ad, post, or email leads to the branded booking link or widget.', 'El anuncio, post o email lleva al link o widget de reserva con la marca del negocio.'),
      },
      {
        title: t(lang, 'Pre-qualification', 'Pre-calificación'),
        description: t(lang, 'An optional form filters the contact before showing the calendar.', 'Un formulario opcional filtra al contacto antes de mostrarle la agenda.'),
      },
      {
        title: t(lang, 'Time selection', 'Selección de horario'),
        description: t(lang, 'The customer picks the date, time, and, if applicable, the rep they want to meet with.', 'El cliente elige fecha, hora y, si aplica, el asesor con quien quiere reunirse.'),
      },
      {
        title: t(lang, 'Payment (optional)', 'Pago (opcional)'),
        description: t(lang, 'The system can require a deposit or full payment to confirm the slot.', 'El sistema puede requerir depósito o pago total para confirmar el slot.'),
      },
      {
        title: t(lang, 'Confirmation', 'Confirmación'),
        description: t(lang, 'The customer receives instant confirmation by email and SMS.', 'El cliente recibe confirmación inmediata por email y SMS.'),
      },
      {
        title: t(lang, 'Reminders', 'Recordatorios'),
        description: t(lang, 'Automatic notifications 24 hours and 1 hour before the appointment.', 'Notificaciones automáticas 24 horas y 1 hora antes de la cita.'),
      },
      {
        title: t(lang, 'Follow-up', 'Seguimiento'),
        description: t(lang, 'A post-appointment workflow sends a survey, proposal, or invoice depending on the case.', 'Un workflow post-cita envía encuesta, propuesta o factura según el caso.'),
      },
    ],
  },
  {
    blockType: 'bonusBanner',
    heading: t(lang, 'Your booking system, implemented by us', 'Tu sistema de reservas, implementado por nosotros'),
    body: t(
      lang,
      "We don't hand you a calendar to configure yourself. We set up your calendars, pre-qualification forms, reminders, and follow-up flows, and leave them connected to your CRM. Your team just logs in to handle appointments that are already qualified.",
      'No te entregamos un calendario para que lo configures tú. Montamos tus calendarios, formularios de pre-calificación, recordatorios y flujos de seguimiento, y los dejamos conectados a tu CRM. Tu equipo solo entra a atender citas ya calificadas.',
    ),
    ctaPrimaryLabel: t(lang, 'I want my booking system', 'Quiero mi sistema de reservas'),
    ctaPrimaryHref: '#strategy',
    fine: t(lang, 'Limited Elite implementation spots per month.', 'Cupos limitados de implementación Elite al mes.'),
  },
  {
    blockType: 'faq',
    heading: t(lang, 'Frequently asked questions', 'Preguntas frecuentes'),
    items: [
      {
        question: t(lang, 'Does the customer need to create an account to book?', '¿El cliente necesita crear una cuenta para reservar?'),
        answer: t(
          lang,
          'No. The process is public and only requires basic data like name, email, and phone, with no mandatory sign-up.',
          'No. El proceso es público y solo requiere datos básicos como nombre, email y teléfono, sin registro obligatorio.',
        ),
      },
      {
        question: t(lang, 'Can I limit how many appointments I accept per day?', '¿Puedo limitar cuántas citas acepto por día?'),
        answer: t(
          lang,
          'Yes. You can set daily, weekly, and time-slot limits for each calendar.',
          'Sí. Puedes configurar límites diarios, semanales y por franja horaria para cada calendario.',
        ),
      },
      {
        question: t(lang, 'What happens if a customer cancels?', '¿Qué pasa si un cliente cancela?'),
        answer: t(
          lang,
          'The slot becomes available instantly. You can turn on a team notification and a rebooking flow for the customer.',
          'El slot queda disponible al instante. Puedes activar una notificación al equipo y un flujo de re-agendamiento para el cliente.',
        ),
      },
      {
        question: t(lang, 'Does it work with Zoom, Google Meet, or Teams?', '¿Funciona con Zoom, Google Meet o Teams?'),
        answer: t(
          lang,
          'Yes, it integrates with Google Meet and Zoom. The video call link is generated automatically and included in the confirmation email.',
          'Sí, se integra con Google Meet y Zoom. El link de videollamada se genera solo y se incluye en el email de confirmación.',
        ),
      },
      {
        question: t(lang, 'Can I add prep time between appointments?', '¿Puedo agregar tiempo de preparación entre citas?'),
        answer: t(
          lang,
          'Yes. You can set a buffer time between appointments, for example 15 minutes, so the team can prepare or the calendar doesn\'t get overbooked.',
          'Sí. Puedes configurar un tiempo de colchón entre citas, por ejemplo 15 minutos, para que el equipo se prepare o el calendario no se sature.',
        ),
      },
      {
        question: t(lang, 'Can I have different prices per appointment type?', '¿Puedo tener precios distintos por tipo de cita?'),
        answer: t(
          lang,
          'Yes. Each calendar can have its own price, duration, and pre-qualification form.',
          'Sí. Cada calendario puede tener su propio precio, duración y formulario de pre-calificación.',
        ),
      },
      {
        question: t(lang, 'Can I put the calendar on my website?', '¿Puedo poner el calendario en mi página web?'),
        answer: t(
          lang,
          'Yes. The widget embeds on any page with a simple code, or it can be shared as a direct link.',
          'Sí. El widget se incrusta en cualquier página con un código sencillo, o se comparte como link directo.',
        ),
      },
      {
        question: t(lang, 'Does the system handle bookings for multiple locations?', '¿El sistema maneja reservas para varias ubicaciones?'),
        answer: t(
          lang,
          'Yes. You can create calendars by location or office and assign them to different teams.',
          'Sí. Puedes crear calendarios por ubicación u oficina y asignarlos a distintos equipos.',
        ),
      },
      {
        question: t(lang, 'Can I create waiting lists?', '¿Puedo crear listas de espera?'),
        answer: t(
          lang,
          "Yes. If a time slot is full, interested people join a waiting list and get notified if a spot opens up.",
          'Sí. Si un horario está lleno, los interesados se anotan en una lista de espera y se les notifica si se libera un lugar.',
        ),
      },
      {
        question: t(lang, 'How do I avoid fake or spam bookings?', '¿Cómo evito reservas falsas o de spam?'),
        answer: t(
          lang,
          'The system can require email confirmation, a payment deposit, or a captcha, and can also limit bookings to existing domains or contacts.',
          'El sistema puede requerir confirmación por email, depósito de pago o un captcha, y también limitar reservas a dominios o contactos existentes.',
        ),
      },
    ],
  },
  strategyForm(lang),
]

const seedSistemaReservas = async (): Promise<void> => {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'pages',
    locale: 'en',
    where: { slug: { equals: 'sistema-reservas' } },
    limit: 1,
  })

  const pageId = existing.docs[0]?.id

  const enData = {
    title: 'Booking System',
    slug: 'sistema-reservas',
    layout: sistemaReservasLayout('en'),
    _status: 'draft',
    meta: {
      title: 'AI Booking System for Your CRM | Apturio',
      description:
        "Automate your business's scheduling with a booking system built into your CRM: confirmations, reminders, and payment at booking. Book your demo.",
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
      title: 'Sistema de Reservas',
      slug: 'sistema-reservas',
      layout: sistemaReservasLayout('es'),
      _status: 'draft',
      meta: {
        title: 'Sistema de Reservas con IA para tu CRM | Apturio',
        description:
          'Automatiza el agendamiento de tu negocio con un sistema de reservas integrado a tu CRM: confirmaciones, recordatorios y cobro al reservar. Agenda tu demo.',
      },
    } as never,
  })

  payload.logger.info(`[seed-sistema-reservas] page id=${created.id} (en+es, slug=sistema-reservas)`)
}

await seedSistemaReservas()

if (typeof process !== 'undefined') {
  process.exit(0)
}
