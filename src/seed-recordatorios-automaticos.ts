/**
 * One-off seed: Recordatorios Automáticos pilot page (EN + ES), draft status.
 * URL: apturio.com/es/recordatorios-automaticos
 * Run with: payload run src/seed-recordatorios-automaticos.ts
 * Standalone — does not touch any other collection or page.
 * Content sourced entirely from the doc's Recordatorios Automáticos section —
 * the reference screenshots were used only to pick block types, not for copy.
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

const recordatoriosLayout = (lang: Lang): Block[] => [
  {
    blockType: 'heroBold',
    pillIcon: 'bell',
    pillText: t(lang, 'Automatic Reminders', 'Recordatorios Automáticos'),
    titleStart: t(lang, 'Automatic reminders that arrive on their own,', 'Recordatorios automáticos que llegan solos,'),
    titleAccent: t(lang, 'on the right channel, at the right time', 'al canal correcto, en el momento correcto'),
    accentColor: 'green',
    subtitle: t(
      lang,
      'Appointments, payments, renewals, and sales follow-ups scheduled once and sent by WhatsApp, SMS, or email without your team lifting a finger. Fewer no-shows, fewer late payments, fewer forgotten leads.',
      'Citas, pagos, renovaciones y seguimientos de venta programados una sola vez y enviados por WhatsApp, SMS o email sin que tu equipo mueva un dedo. Menos no-shows, menos pagos atrasados, menos leads olvidados.',
    ),
    ctaPrimaryLabel: t(lang, 'See how it works', 'Ver cómo funciona'),
    ctaPrimaryHref: '#pricing',
    ctaSecondaryLabel: t(lang, 'Book your demo', 'Agenda tu demo'),
    ctaSecondaryHref: '#strategy',
    cards: [
      { icon: 'bell-ring', big: '24/7', label: t(lang, 'Reminders sent on schedule, always', 'Recordatorios enviados a tiempo, siempre') },
      { icon: 'message-square', big: '3', label: t(lang, 'Channels: WhatsApp, SMS, email', 'Canales: WhatsApp, SMS, email'), green: true },
      { icon: 'trending-down', big: t(lang, 'Fewer', 'Menos'), label: t(lang, 'No-shows and late payments', 'No-shows y pagos atrasados') },
    ],
  },
  {
    blockType: 'featureZigzag',
    eyebrow: t(lang, 'Definition', 'Definición'),
    heading: t(lang, 'What are automatic reminders?', 'Qué son los recordatorios automáticos'),
    rows: [
      {
        num: '01',
        title: t(lang, 'What are automatic reminders?', 'Qué son los recordatorios automáticos'),
        description: t(
          lang,
          "Automatic reminders are scheduled messages the CRM sends with no human intervention, at the exact moment, to the right contact, and through the right channel. They go beyond a simple appointment reminder: they cover payments, sales follow-ups, renewals, birthdays, abandoned carts, internal team tasks, and any relevant business event.",
          'Los recordatorios automáticos son mensajes programados que el CRM envía sin intervención humana, en el momento exacto, al contacto correcto y por el canal adecuado. Van más allá de un simple recordatorio de cita: cubren pagos, seguimientos de venta, renovaciones, cumpleaños, carritos abandonados, tareas internas del equipo y cualquier evento relevante del negocio.',
        ),
        bullets: [
          { text: t(lang, 'Triggered by a real CRM event', 'Se dispara por un evento real del CRM') },
          { text: t(lang, 'Every send logged on the contact', 'Cada envío queda en el historial del contacto') },
        ],
        placeholder: t(lang, 'Image', 'Imagen'),
      },
    ],
  },
  {
    blockType: 'comparisonTable',
    eyebrow: t(lang, 'The difference', 'La diferencia'),
    heading: t(lang, 'Automatic reminders vs. manual method', 'Recordatorios automáticos vs. método manual'),
    columns: [
      { label: t(lang, 'Manual reminder', 'Recordatorio manual') },
      { label: t(lang, 'Automatic CRM reminder', 'Recordatorio automático CRM'), highlight: true },
    ],
    rows: [
      {
        label: t(lang, 'Consistency', 'Consistencia'),
        values: [
          { text: t(lang, 'Depends on someone remembering', 'Depende de que alguien lo recuerde') },
          { text: t(lang, '100% consistent, always sent', '100% consistente, siempre se envía'), highlight: true },
        ],
      },
      {
        label: t(lang, 'Schedule', 'Horario'),
        values: [
          { text: t(lang, 'Business hours only', 'Solo en horario laboral') },
          { text: t(lang, '24/7, including weekends', '24/7, incluso fines de semana'), highlight: true },
        ],
      },
      {
        label: t(lang, 'Scale', 'Escala'),
        values: [
          { text: t(lang, 'A few reminders per day', 'Pocos recordatorios por día') },
          { text: t(lang, 'Thousands of simultaneous reminders', 'Miles de recordatorios simultáneos'), highlight: true },
        ],
      },
      {
        label: t(lang, 'Cost per reminder', 'Costo por recordatorio'),
        values: [
          { text: t(lang, "High, the team's time", 'Alto, tiempo del equipo') },
          { text: t(lang, 'Nearly zero once configured', 'Prácticamente cero una vez configurado'), highlight: true },
        ],
      },
      {
        label: t(lang, 'Multichannel', 'Multicanal'),
        values: [
          { text: t(lang, 'Usually just one', 'Generalmente solo uno') },
          { text: t(lang, 'Email, SMS, and WhatsApp in one sequence', 'Email, SMS y WhatsApp en una secuencia'), highlight: true },
        ],
      },
      {
        label: t(lang, 'Conditional logic', 'Lógica condicional'),
        values: [
          { text: t(lang, "Doesn't exist", 'No existe') },
          { text: t(lang, 'Changes the next step based on the reply', 'Cambia el siguiente paso según la respuesta'), highlight: true },
        ],
      },
      {
        label: t(lang, 'Human error', 'Error humano'),
        values: [
          { text: t(lang, 'High, missed dates and slip-ups', 'Alto, olvidos y fechas erradas') },
          { text: t(lang, 'Eliminated, based on exact triggers', 'Eliminado, basado en triggers exactos'), highlight: true },
        ],
      },
      {
        label: t(lang, 'CRM record', 'Registro en el CRM'),
        values: [
          { text: t(lang, 'Not always', 'No siempre') },
          { text: t(lang, 'Every send stays in the history', 'Cada envío queda en el historial'), highlight: true },
        ],
      },
    ],
  },
  {
    blockType: 'comparisonTable',
    eyebrow: t(lang, 'By channel', 'Por canal'),
    heading: t(lang, 'Reminders by channel', 'Recordatorios por canal'),
    subtitle: t(
      lang,
      'Each channel plays a different role within the same reminder sequence.',
      'Cada canal cumple un rol distinto dentro de una misma secuencia de recordatorios.',
    ),
    columns: [
      { label: t(lang, 'Open rate', 'Apertura') },
      { label: t(lang, 'Response rate', 'Respuesta') },
      { label: t(lang, 'Ideal for', 'Ideal para') },
    ],
    rows: [
      {
        label: 'WhatsApp',
        values: [
          { text: '98%', highlight: true },
          { text: '45-60%', highlight: true },
          { text: t(lang, 'Urgent reminders, appointments, payments', 'Recordatorios urgentes, citas, pagos') },
        ],
      },
      {
        label: t(lang, 'Email', 'Email'),
        values: [
          { text: '20-35%' },
          { text: '3-8%' },
          { text: t(lang, 'Detailed info, invoices, contracts', 'Información detallada, facturas, contratos') },
        ],
      },
      {
        label: 'SMS',
        values: [
          { text: '85-98%' },
          { text: '20-30%' },
          { text: t(lang, 'Short, urgent reminders', 'Recordatorios cortos y urgentes') },
        ],
      },
      {
        label: t(lang, 'Instagram DM', 'Instagram DM'),
        values: [
          { text: '80-90%' },
          { text: '30-45%' },
          { text: t(lang, 'Re-engaging cold social leads', 'Reactivación de leads fríos sociales') },
        ],
      },
      {
        label: t(lang, 'Combined multichannel', 'Multicanal combinado'),
        values: [
          { text: '+95%', highlight: true },
          { text: '60-75%', highlight: true },
          { text: t(lang, 'Maximum reach and conversion', 'Máxima cobertura y conversión') },
        ],
      },
    ],
  },
  {
    blockType: 'featureGrid',
    eyebrow: t(lang, 'Capabilities', 'Capacidades'),
    heading: t(lang, 'What automatic reminders can do', 'Qué pueden hacer los recordatorios automáticos'),
    cards: [
      {
        icon: 'calendar-clock',
        title: t(lang, 'Appointment reminder', 'Recordatorio de cita'),
        description: t(lang, 'Notifies before a scheduled meeting or appointment, with the join link ready.', 'Notifica antes de una reunión o cita agendada, con el link listo para unirse.'),
      },
      {
        icon: 'credit-card',
        title: t(lang, 'Payment reminder', 'Recordatorio de pago'),
        description: t(lang, "Alerts before or after an invoice's due date.", 'Alerta antes o después del vencimiento de una factura.'),
      },
      {
        icon: 'search',
        title: t(lang, 'Lead follow-up', 'Seguimiento de lead'),
        description: t(lang, "Triggers only if a prospect doesn't reply within X hours.", 'Se activa solo si un prospecto no responde en X horas.'),
      },
      {
        icon: 'refresh-cw',
        title: t(lang, 'Renewal reminder', 'Recordatorio de renovación'),
        description: t(lang, 'Warns before a contract or subscription expires.', 'Avisa antes de que venza un contrato o una suscripción.'),
      },
      {
        icon: 'flame',
        title: t(lang, 'Cold lead re-engagement', 'Reactivación de lead frío'),
        description: t(lang, 'Re-approaches inactive prospects after several days with no interaction.', 'Retoma el contacto con prospectos inactivos tras varios días sin interacción.'),
      },
      {
        icon: 'heart',
        title: t(lang, 'Post-service follow-up', 'Seguimiento post-servicio'),
        description: t(lang, 'Asks about doubts or requests a review after an appointment or purchase.', 'Pregunta por dudas o pide una reseña después de una cita o compra.'),
      },
      {
        icon: 'bell',
        title: t(lang, 'Internal task alert', 'Alerta de tarea interna'),
        description: t(lang, 'Notifies the team when a task or a lead goes unattended.', 'Notifica al equipo cuando una tarea o un lead queda sin atender.'),
      },
      {
        icon: 'alert-triangle',
        title: t(lang, 'Stalled pipeline alert', 'Alerta de pipeline estancado'),
        description: t(lang, "Warns the rep if an opportunity hasn't moved in several days.", 'Avisa al vendedor si una oportunidad lleva varios días sin movimiento.'),
      },
    ],
  },
  {
    blockType: 'benefits',
    heading: t(lang, 'Key differentiators', 'Diferenciadores clave'),
    items: [
      {
        title: t(lang, 'Smart conditional logic', 'Lógica condicional inteligente'),
        description: t(lang, 'Adapts the next step depending on whether the contact opened, replied, or ignored the message.', 'Adapta el siguiente paso según si el contacto abrió, respondió o ignoró el mensaje.'),
      },
      {
        title: t(lang, 'Multichannel in a single sequence', 'Multicanal en una sola secuencia'),
        description: t(lang, "Email, and if it's not opened, SMS, and if there's no reply, WhatsApp — all in one flow.", 'Email, y si no abre, SMS, y si no responde, WhatsApp, todo en un mismo flujo.'),
      },
      {
        title: t(lang, 'Dynamic variables', 'Variables dinámicas'),
        description: t(lang, 'Uses CRM data like name, date, service, or amount to personalize each message.', 'Usa datos del CRM como nombre, fecha, servicio o monto para personalizar cada mensaje.'),
      },
      {
        title: t(lang, 'Based on CRM events', 'Basado en eventos del CRM'),
        description: t(lang, 'Triggers on any action: an appointment booked, a payment created, a stage changed.', 'Se activa por cualquier acción: cita agendada, pago creado o etapa cambiada.'),
      },
      {
        title: t(lang, 'No contact limit', 'Sin límite de contactos'),
        description: t(lang, 'The same setup works for 1 or for 100,000 contacts.', 'La misma configuración sirve para 1 o para 100 mil contactos.'),
      },
      {
        title: t(lang, 'Smart timezone detection', 'Zona horaria inteligente'),
        description: t(lang, "Sends the reminder in the contact's timezone, not the business's.", 'Envía el recordatorio en el huso horario del contacto, no del negocio.'),
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
        description: t(lang, 'Report delivery notice followed by a service renewal reminder.', 'Aviso de entrega de informe seguido de recordatorio de renovación del servicio.'),
        bullets: [],
        placeholder: 'Image',
      },
      {
        icon: 'stethoscope',
        label: t(lang, 'Health', 'Salud'),
        title: t(lang, 'Health and clinics', 'Salud y clínicas'),
        description: t(lang, 'Confirmation sequence, reminder 24h before, and post-appointment survey.', 'Secuencia de confirmación, recordatorio 24h antes y encuesta post-cita.'),
        bullets: [],
        placeholder: 'Image',
      },
      {
        icon: 'shopping-cart',
        label: 'E-commerce',
        title: 'E-commerce',
        description: t(lang, 'Abandoned cart reminder with a coupon in the second message.', 'Recordatorio de carrito abandonado con cupón en el segundo mensaje.'),
        bullets: [],
        placeholder: 'Image',
      },
      {
        icon: 'home',
        label: t(lang, 'Real estate', 'Bienes raíces'),
        title: t(lang, 'Real estate', 'Bienes raíces'),
        description: t(lang, "Initial contact within the first hour and re-engagement after 7 days with no reply.", 'Contacto inicial en la primera hora y reactivación a los 7 días sin respuesta.'),
        bullets: [],
        placeholder: 'Image',
      },
      {
        icon: 'monitor-play',
        label: t(lang, 'Online education', 'Educación online'),
        title: t(lang, 'Online education', 'Educación online'),
        description: t(lang, 'Enrollment reminders, webinar access, and follow-up after class.', 'Recordatorios de inscripción, acceso al webinar y seguimiento post-clase.'),
        bullets: [],
        placeholder: 'Image',
      },
      {
        icon: 'landmark',
        label: t(lang, 'Financial services', 'Servicios financieros'),
        title: t(lang, 'Financial services', 'Servicios financieros'),
        description: t(lang, 'Staggered payment alerts before and after a policy comes due.', 'Avisos escalonados de pago antes y después del vencimiento de una póliza.'),
        bullets: [],
        placeholder: 'Image',
      },
    ],
  },
  {
    blockType: 'comparisonTable',
    eyebrow: t(lang, 'Example sequence', 'Secuencia de ejemplo'),
    heading: t(lang, 'A winning follow-up sequence', 'Secuencia ganadora de ejemplo'),
    subtitle: t(
      lang,
      'A real follow-up sequence for a lead who requests info and goes quiet:',
      'Un ejemplo real de secuencia de seguimiento para un lead que pide información y no responde:',
    ),
    columns: [
      { label: t(lang, 'Channel', 'Canal') },
      { label: t(lang, 'Message', 'Mensaje') },
    ],
    rows: [
      {
        label: t(lang, 'Day 0', 'Día 0'),
        values: [
          { text: t(lang, 'Email + WhatsApp', 'Email + WhatsApp') },
          { text: t(lang, 'Instant welcome when they request info.', 'Bienvenida y saludo inmediato al solicitar información.') },
        ],
      },
      {
        label: t(lang, 'Day 1', 'Día 1'),
        values: [
          { text: 'SMS' },
          { text: t(lang, 'Asks if they had a chance to review the info sent.', 'Pregunta si pudo revisar la información enviada.') },
        ],
      },
      {
        label: t(lang, 'Day 3', 'Día 3'),
        values: [
          { text: t(lang, 'Email', 'Email') },
          { text: t(lang, 'Success story from a customer with a similar problem.', 'Caso de éxito de un cliente con un problema similar.') },
        ],
      },
      {
        label: t(lang, 'Day 7', 'Día 7'),
        values: [
          { text: 'WhatsApp' },
          { text: t(lang, 'Offers a free audit or consultation with a booking link.', 'Oferta de auditoría o consulta gratuita con link de reserva.') },
        ],
      },
      {
        label: t(lang, 'Day 14', 'Día 14'),
        values: [
          { text: 'SMS' },
          { text: t(lang, "Last chance to take the offer this week.", 'Última oportunidad para tomar la oferta esta semana.') },
        ],
      },
      {
        label: t(lang, 'Day 30', 'Día 30'),
        values: [
          { text: t(lang, 'Email', 'Email') },
          { text: t(lang, 'Value content, no hard sell, to stay in touch.', 'Contenido de valor, sin venta directa, para mantener el contacto.') },
        ],
      },
      {
        label: t(lang, 'Day 60', 'Día 60'),
        values: [
          { text: 'WhatsApp' },
          { text: t(lang, 'Simple re-engagement to check if the interest is still there.', 'Reactivación simple para saber si el interés sigue vigente.') },
        ],
      },
    ],
  },
  {
    blockType: 'bonusBanner',
    heading: t(lang, 'Your automatic reminders, implemented by us', 'Tus recordatorios automáticos, implementados por nosotros'),
    body: t(
      lang,
      "We don't hand you a workflow builder to figure out yourself. We design your reminder sequences by channel, configure the conditional logic, and leave them connected to your CRM. Your team just reviews the results.",
      'No te entregamos un constructor de workflows para que lo armes tú. Diseñamos tus secuencias de recordatorio por canal, configuramos la lógica condicional y las dejamos conectadas a tu CRM. Tu equipo solo revisa los resultados.',
    ),
    ctaPrimaryLabel: t(lang, 'I want my reminders', 'Quiero mis recordatorios'),
    ctaPrimaryHref: '#strategy',
    fine: t(lang, 'Limited Elite implementation spots per month.', 'Cupos limitados de implementación Elite al mes.'),
  },
  {
    blockType: 'faq',
    heading: t(lang, 'Frequently asked questions', 'Preguntas frecuentes'),
    items: [
      {
        question: t(lang, 'Can I stop a reminder if the customer already replied?', '¿Puedo detener un recordatorio si el cliente ya respondió?'),
        answer: t(
          lang,
          'Yes. Workflows have exit conditions: if the customer replies or books, the sequence stops on its own.',
          'Sí. Los workflows tienen condiciones de salida: si el cliente responde o agenda, la secuencia se detiene sola.',
        ),
      },
      {
        question: t(lang, 'How many reminders can I schedule in a sequence?', '¿Cuántos recordatorios puedo programar en una secuencia?'),
        answer: t(
          lang,
          'No limit. You can create sequences of 2 steps or more than 30, with days, hours, or minutes between each one.',
          'Sin límite. Puedes crear secuencias de 2 pasos o de más de 30, con días, horas o minutos entre cada uno.',
        ),
      },
      {
        question: t(lang, "Can they be personalized with the customer's name?", '¿Se pueden personalizar con el nombre del cliente?'),
        answer: t(
          lang,
          'Yes, with variables like the name, the appointment date, or the invoice amount to personalize each message.',
          'Sí, con variables como el nombre, la fecha de la cita o el monto de la factura para personalizar cada mensaje.',
        ),
      },
      {
        question: t(lang, 'Can I send reminders to a segmented list?', '¿Puedo enviar recordatorios a una lista segmentada?'),
        answer: t(
          lang,
          'Yes. You can filter by tag, pipeline stage, last contact date, or lead source.',
          'Sí. Puedes filtrar por etiqueta, etapa del pipeline, fecha de último contacto o fuente del lead.',
        ),
      },
      {
        question: t(lang, "What happens if the phone number isn't valid?", '¿Qué pasa si el número de teléfono no es válido?'),
        answer: t(
          lang,
          'The system flags the error and continues with the next channel or step, without stopping the whole sequence.',
          'El sistema marca el error y continúa con el siguiente canal o paso, sin detener toda la secuencia.',
        ),
      },
      {
        question: t(lang, 'Can I limit sending to business hours?', '¿Puedo limitar el envío a horario laboral?'),
        answer: t(
          lang,
          'Yes. You can restrict sending to business hours or allow it to run 24 hours, depending on the type of reminder.',
          'Sí. Puedes restringir el envío a horas hábiles o permitir que corra las 24 horas, según el tipo de recordatorio.',
        ),
      },
      {
        question: t(lang, 'Does it work for internal team reminders?', '¿Funciona para recordatorios internos del equipo?'),
        answer: t(
          lang,
          'Yes. You can notify a team member by email or SMS when a task is due or a lead goes unattended.',
          'Sí. Puedes notificar por email o SMS a un miembro del equipo cuando una tarea vence o un lead queda sin atender.',
        ),
      },
      {
        question: t(lang, 'Can I measure which reminders work best?', '¿Puedo medir cuáles recordatorios funcionan mejor?'),
        answer: t(
          lang,
          'Yes. The CRM shows open rate, clicks, replies, and conversion for each step of the sequence.',
          'Sí. El CRM muestra tasa de apertura, clics, respuestas y conversión por cada paso de la secuencia.',
        ),
      },
      {
        question: t(lang, 'Can I have different reminders per customer type?', '¿Puedo tener recordatorios distintos por tipo de cliente?'),
        answer: t(
          lang,
          'Yes. Use tags or custom fields to differentiate a new customer from a returning one, or a basic plan from a premium one.',
          'Sí. Usa etiquetas o campos personalizados para diferenciar cliente nuevo de recurrente, o plan básico de premium.',
        ),
      },
    ],
  },
  strategyForm(lang),
]

const seedRecordatorios = async (): Promise<void> => {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'pages',
    locale: 'en',
    where: { slug: { equals: 'recordatorios-automaticos' } },
    limit: 1,
  })

  const pageId = existing.docs[0]?.id

  const enData = {
    title: 'Automatic Reminders',
    slug: 'recordatorios-automaticos',
    layout: recordatoriosLayout('en'),
    _status: 'draft',
    meta: {
      title: 'Automatic Reminders with AI | Apturio',
      description:
        'Automate your appointment, payment, and follow-up reminders with multichannel sequences over WhatsApp, SMS, and email. Reduce no-shows. Book your free demo.',
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
      title: 'Recordatorios Automáticos',
      slug: 'recordatorios-automaticos',
      layout: recordatoriosLayout('es'),
      _status: 'draft',
      meta: {
        title: 'Recordatorios Automáticos con IA | Apturio',
        description:
          'Automatiza tus recordatorios de citas, pagos y seguimientos con secuencias multicanal por WhatsApp, SMS y email. Reduce no-shows. Agenda tu demo gratis.',
      },
    } as never,
  })

  payload.logger.info(`[seed-recordatorios-automaticos] page id=${created.id} (en+es, slug=recordatorios-automaticos)`)
}

await seedRecordatorios()

if (typeof process !== 'undefined') {
  process.exit(0)
}
