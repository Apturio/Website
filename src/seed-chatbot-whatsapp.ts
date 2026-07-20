/**
 * One-off seed: Chatbot WhatsApp pilot page (EN + ES), draft status.
 * URL: apturio.com/es/chatbot-whatsapp
 * Run with: payload run src/seed-chatbot-whatsapp.ts
 * Standalone — does not touch any other collection or page.
 * Content sourced entirely from the doc's Chatbot WhatsApp section — the
 * reference screenshots for this page were used only to pick block types,
 * not for copy (per explicit instruction).
 * Note: MetricsBlock has no heading/subtitle field, so the doc's framing
 * line ("Por qué WhatsApp es el canal que más vende") is not rendered —
 * only the 4 stat values + labels.
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

const chatbotWhatsappLayout = (lang: Lang): Block[] => [
  {
    blockType: 'heroSplit',
    pillIcon: 'message-circle',
    pillText: t(lang, 'WhatsApp Chatbot', 'Chatbot de WhatsApp'),
    titleStart: t(lang, 'AI WhatsApp chatbot: responds, qualifies,', 'Chatbot de WhatsApp con IA: responde, califica'),
    titleAccent: t(lang, 'and books', 'y agenda'),
    titleEnd: t(lang, 'without you lifting a finger', 'sin que muevas un dedo'),
    accentColor: 'green',
    subtitle: t(
      lang,
      'Turn your WhatsApp Business into an active 24/7 sales channel. Our AI chatbot answers every message instantly, filters contacts with real intent, and books appointments for you, without you having to configure it yourself.',
      'Convierte tu WhatsApp Business en un canal de ventas activo 24/7. Nuestro chatbot con IA atiende cada mensaje al instante, filtra a los contactos con intención real y agenda citas por ti, sin que tengas que configurarlo tú mismo.',
    ),
    ctaPrimaryLabel: t(lang, 'See how it works', 'Ver cómo funciona'),
    ctaPrimaryHref: '#pricing',
    ctaSecondaryLabel: t(lang, 'Message us on WhatsApp', 'Escríbenos por WhatsApp'),
    ctaSecondaryHref: 'https://wa.me/15614731298',
    placeholder: t(lang, 'WhatsApp chat mockup', 'Mockup de chat de WhatsApp'),
  },
  {
    blockType: 'featureZigzag',
    eyebrow: t(lang, 'Definition', 'Definición'),
    heading: t(lang, 'What is a WhatsApp chatbot?', '¿Qué es un chatbot de WhatsApp?'),
    rows: [
      {
        num: '01',
        title: t(lang, 'What is a WhatsApp chatbot?', '¿Qué es un chatbot de WhatsApp?'),
        description: t(
          lang,
          'A WhatsApp chatbot is an automated messaging system that runs inside WhatsApp Business, letting a business reply, qualify, and follow up with customers without constant human intervention. It runs 24 hours a day, replies in seconds, and can integrate with a CRM to log every conversation.',
          'Un chatbot de WhatsApp es un sistema de mensajería automatizado que opera dentro de WhatsApp Business y permite a un negocio responder, calificar y dar seguimiento a sus clientes sin intervención humana constante. Funciona las 24 horas, contesta en segundos y puede integrarse con un CRM para registrar cada conversación.',
        ),
        bullets: [
          { text: t(lang, 'Understands message context', 'Entiende el contexto del mensaje') },
          { text: t(lang, 'Hands off to a human when needed', 'Transfiere a un agente humano cuando hace falta') },
        ],
        placeholder: t(lang, 'Image', 'Imagen'),
      },
    ],
  },
  {
    blockType: 'comparisonTable',
    eyebrow: t(lang, 'The difference', 'La diferencia'),
    heading: t(lang, 'WhatsApp chatbot vs. web form', 'Chatbot de WhatsApp vs. formulario web'),
    columns: [
      { label: t(lang, 'Web form', 'Formulario web') },
      { label: t(lang, 'WhatsApp Chatbot', 'Chatbot de WhatsApp'), highlight: true },
    ],
    rows: [
      {
        label: t(lang, 'Open rate', 'Tasa de apertura'),
        values: [
          { text: t(lang, '~20-30% (if by email)', '~20-30% (si va por email)') },
          { text: '98%', highlight: true },
        ],
      },
      {
        label: t(lang, 'Response rate', 'Tasa de respuesta'),
        values: [
          { text: '~3-5%' },
          { text: '45-60%', highlight: true },
        ],
      },
      {
        label: t(lang, 'Time to respond to the lead', 'Tiempo de respuesta al lead'),
        values: [
          { text: t(lang, 'Hours or days', 'Horas o días') },
          { text: t(lang, 'Immediate', 'Inmediato'), highlight: true },
        ],
      },
      {
        label: t(lang, 'User experience', 'Experiencia del usuario'),
        values: [
          { text: t(lang, 'Static, cold form', 'Estática, formulario frío') },
          { text: t(lang, 'Conversational and personal', 'Conversacional y cercana'), highlight: true },
        ],
      },
      {
        label: t(lang, 'Automatic follow-up', 'Seguimiento automático'),
        values: [
          { text: t(lang, 'Requires separate email setup', 'Requiere configurar email aparte') },
          { text: t(lang, 'Built in by default', 'Integrado por defecto'), highlight: true },
        ],
      },
      {
        label: t(lang, 'Abandonment rate', 'Tasa de abandono'),
        values: [
          { text: t(lang, 'High (+70% never finish the form)', 'Alta (+70% no completan el formulario)') },
          { text: t(lang, 'Low', 'Baja'), highlight: true },
        ],
      },
    ],
  },
  {
    blockType: 'featureGrid',
    heading: t(lang, 'What a WhatsApp chatbot can do', 'Qué puede hacer un chatbot de WhatsApp'),
    cards: [
      {
        icon: 'clock',
        title: t(lang, '24/7 automatic replies', 'Respuestas automáticas 24/7'),
        description: t(
          lang,
          'Answers FAQs (hours, pricing, availability) instantly, with no human agent.',
          'Contesta preguntas frecuentes (horarios, precios, disponibilidad) al instante, sin agente humano.',
        ),
      },
      {
        icon: 'filter',
        title: t(lang, 'Lead qualification', 'Calificación de leads'),
        description: t(
          lang,
          'Asks the right questions (budget, timeline, need) and prioritizes contacts with real intent.',
          'Hace las preguntas correctas (presupuesto, plazo, necesidad) y prioriza contactos con intención real.',
        ),
      },
      {
        icon: 'calendar-check',
        title: t(lang, 'Booking and reminders', 'Agendamiento y recordatorios'),
        description: t(
          lang,
          'Offers time slots, confirms appointments, and sends automatic reminders.',
          'Ofrece horarios, confirma citas y envía recordatorios automáticos.',
        ),
      },
      {
        icon: 'database',
        title: t(lang, 'CRM integration', 'Integración con tu CRM'),
        description: t(
          lang,
          'Logs every conversation and triggers follow-up with no manual work.',
          'Registra cada conversación y activa el seguimiento sin trabajo manual.',
        ),
      },
      {
        icon: 'bell',
        title: t(lang, 'Templates & proactive notifications', 'Plantillas y notificaciones proactivas'),
        description: t(
          lang,
          'Sends confirmations, alerts, and follow-ups approved by Meta.',
          'Envía confirmaciones, alertas y seguimientos aprobados por Meta.',
        ),
      },
      {
        icon: 'user-round',
        title: t(lang, 'Hand-off to a human agent', 'Transferencia a agente humano'),
        description: t(
          lang,
          'Escalates the conversation when it detects a complex query or frustration.',
          'Escala la conversación cuando detecta una consulta compleja o frustración.',
        ),
      },
    ],
  },
  {
    blockType: 'featureGrid',
    eyebrow: t(lang, 'Use cases', 'Casos de uso'),
    heading: t(lang, 'How businesses use it, by industry', 'Cómo lo usan los negocios: casos de uso por industria'),
    cards: [
      {
        icon: 'shopping-cart',
        title: 'E-commerce',
        description: t(lang, 'Confirms orders and automatically follows up on shipping.', 'Confirma pedidos y da seguimiento automático al envío.'),
      },
      {
        icon: 'home',
        title: t(lang, 'Real estate', 'Bienes raíces'),
        description: t(lang, 'Qualifies buyers by budget and area, and books visits.', 'Califica compradores por presupuesto y zona, y agenda visitas.'),
      },
      {
        icon: 'stethoscope',
        title: t(lang, 'Health and clinics', 'Salud y clínicas'),
        description: t(lang, 'Books appointments and sends reminders to reduce no-shows.', 'Reserva citas y envía recordatorios para reducir ausencias.'),
      },
      {
        icon: 'utensils',
        title: t(lang, 'Restaurants', 'Restaurantes'),
        description: t(lang, 'Shows the menu, takes orders, and confirms delivery times.', 'Muestra el menú, toma pedidos y confirma tiempos de entrega.'),
      },
      {
        icon: 'graduation-cap',
        title: t(lang, 'Education', 'Educación'),
        description: t(lang, 'Shares program info, sends the enrollment link, and follows up with prospects.', 'Informa programas, envía el link de inscripción y da seguimiento a interesados.'),
      },
      {
        icon: 'landmark',
        title: t(lang, 'Financial services', 'Servicios financieros'),
        description: t(lang, 'Collects basic data, pre-qualifies, and hands off to an advisor.', 'Recolecta datos básicos, pre-califica y transfiere a un asesor.'),
      },
    ],
  },
  {
    blockType: 'metrics',
    items: [
      { value: '98%', label: 'WhatsApp', green: true },
      { value: '85-90%', label: 'SMS' },
      { value: '70-80%', label: t(lang, 'Facebook Messenger', 'Facebook Messenger') },
      { value: '20-25%', label: t(lang, 'Email marketing', 'Email marketing') },
    ],
  },
  {
    blockType: 'bonusBanner',
    heading: t(lang, 'Your WhatsApp chatbot, implemented by us', 'Tu chatbot de WhatsApp, implementado por nosotros'),
    body: t(
      lang,
      "We don't hand you a template to configure yourself. We set up your AI WhatsApp chatbot, train it on your business information, and leave it connected and running. You just log in to sell.",
      'No te entregamos una plantilla para que la configures tú. Montamos tu chatbot de WhatsApp con IA, lo entrenamos con la información de tu negocio y lo dejamos conectado y funcionando. Tú solo entras a vender.',
    ),
    ctaPrimaryLabel: t(lang, 'I want my chatbot', 'Quiero mi chatbot'),
    ctaPrimaryHref: '#strategy',
    fine: t(lang, 'Limited Elite implementation spots per month.', 'Cupos limitados de implementación Elite al mes.'),
  },
  {
    blockType: 'faq',
    heading: t(lang, 'Frequently asked questions', 'Preguntas frecuentes'),
    items: [
      {
        question: t(lang, 'Do I need the WhatsApp Business API to have a chatbot?', '¿Necesito la WhatsApp Business API para tener un chatbot?'),
        answer: t(
          lang,
          "Yes. Advanced automations and CRM integration require the official WhatsApp Business API; the regular WhatsApp Business app doesn't support this level of automation.",
          'Sí. Para automatizaciones avanzadas e integración con un CRM se requiere la API oficial de WhatsApp Business; la app normal de WhatsApp Business no permite este nivel de automatización.',
        ),
      },
      {
        question: t(lang, 'Can I use my personal WhatsApp number?', '¿Puedo usar mi número personal de WhatsApp?'),
        answer: t(
          lang,
          'Not directly. The chatbot needs a dedicated number connected to the API. Migrating an existing number is possible, though with some restrictions in the verification process.',
          'No directamente. El chatbot necesita un número dedicado conectado a la API. Es posible migrar un número existente, aunque con algunas restricciones del proceso de verificación.',
        ),
      },
      {
        question: t(lang, 'What are WhatsApp templates?', '¿Qué son las plantillas (templates) de WhatsApp?'),
        answer: t(
          lang,
          'They are messages pre-approved by Meta that a business uses to start a conversation, like appointment confirmations or payment reminders. Once approved, they are sent automatically from the CRM.',
          'Son mensajes preaprobados por Meta que un negocio usa para iniciar una conversación, como confirmaciones de cita o recordatorios de pago. Una vez aprobadas, se envían automáticamente desde el CRM.',
        ),
      },
      {
        question: t(lang, "What happens if the customer doesn't reply within 24 hours?", '¿Qué pasa si el cliente no responde en 24 horas?'),
        answer: t(
          lang,
          "The free conversation window closes and can only be reopened with an approved template — this is WhatsApp's so-called customer service window.",
          'La ventana de conversación libre se cierra y solo se puede reabrir con una plantilla aprobada; es la llamada "ventana de servicio al cliente" de WhatsApp.',
        ),
      },
      {
        question: t(lang, 'How many contacts can the chatbot handle at once?', '¿Cuántos contactos puede atender el chatbot a la vez?'),
        answer: t(
          lang,
          'It scales with no practical limit: an AI WhatsApp chatbot can sustain thousands of simultaneous conversations without losing response quality.',
          'Escala sin límite práctico: un chatbot de WhatsApp con IA puede sostener miles de conversaciones simultáneas sin perder calidad de respuesta.',
        ),
      },
      {
        question: t(lang, 'Does the chatbot replace my sales team?', '¿El chatbot reemplaza a mi equipo de ventas?'),
        answer: t(
          lang,
          'No, it powers it. The bot filters and qualifies; your team only receives leads ready to close, saving time and boosting conversion.',
          'No, lo potencia. El bot filtra y califica; tu equipo solo recibe leads listos para cerrar, ahorrando tiempo y aumentando la conversión.',
        ),
      },
    ],
  },
  strategyForm(lang),
]

const seedChatbotWhatsapp = async (): Promise<void> => {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'pages',
    locale: 'en',
    where: { slug: { equals: 'chatbot-whatsapp' } },
    limit: 1,
  })

  const pageId = existing.docs[0]?.id

  const enData = {
    title: 'WhatsApp Chatbot',
    slug: 'chatbot-whatsapp',
    layout: chatbotWhatsappLayout('en'),
    _status: 'draft',
    meta: {
      title: 'WhatsApp Chatbot with AI: Respond and Sell 24/7 | Apturio',
      description:
        'AI-powered WhatsApp chatbot: responds instantly, qualifies leads, and books appointments 24/7 without adding headcount. Turnkey implementation. Book your demo.',
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
      title: 'Chatbot WhatsApp',
      slug: 'chatbot-whatsapp',
      layout: chatbotWhatsappLayout('es'),
      _status: 'draft',
      meta: {
        title: 'Chatbot WhatsApp con IA: Responde y Vende 24/7 | Apturio',
        description:
          'Chatbot de WhatsApp con IA: responde al instante, califica leads y agenda citas 24/7 sin agregar personal. Implementación llave en mano. Agenda tu demo.',
      },
    } as never,
  })

  payload.logger.info(`[seed-chatbot-whatsapp] page id=${created.id} (en+es, slug=chatbot-whatsapp)`)
}

await seedChatbotWhatsapp()

if (typeof process !== 'undefined') {
  process.exit(0)
}
