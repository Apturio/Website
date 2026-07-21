/**
 * One-off seed: Chatbot con IA pilot page (EN + ES), draft status.
 * URL: apturio.com/es/chatbot-ia
 * Run with: payload run src/seed-chatbot-ia.ts
 * Standalone — does not touch any other collection or page.
 *
 * Block choice note: the 8 reference screenshots for this page were generic
 * copy already reused verbatim on other pages (Bold hero, Dashboard accordion,
 * Unified CRM migration timeline, etc). Per explicit confirmation, this seed
 * keeps that block STRUCTURE but fills each with real Chatbot IA doc content;
 * only the testimonial (a real, already-seeded client quote) and the build
 * timeline (generic, applies to any service) are reused verbatim.
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

const chatbotIaLayout = (lang: Lang): Block[] => [
  {
    blockType: 'heroBold',
    pillIcon: 'message-square',
    pillText: t(lang, 'AI chatbot', 'Chatbot con IA'),
    titleStart: t(lang, 'Your AI chatbot that', 'Tu chatbot con IA'),
    titleAccent: t(lang, 'responds, qualifies, and books for you', 'que responde, califica y agenda por ti'),
    accentColor: 'green',
    subtitle: t(
      lang,
      'It answers every WhatsApp and Instagram message instantly, 24 hours a day, even when your team is offline. And we leave it running for you.',
      'Atiende cada mensaje de WhatsApp e Instagram al instante, las 24 horas, aunque tu equipo no esté conectado. Y lo dejamos funcionando por ti.',
    ),
    ctaPrimaryLabel: t(lang, 'Book a demo', 'Agendar demo'),
    ctaPrimaryHref: '#strategy',
    ctaSecondaryLabel: t(lang, 'Message us on WhatsApp', 'Escríbenos por WhatsApp'),
    ctaSecondaryHref: 'https://wa.me/15614731298',
    cards: [
      { icon: 'zap', big: '24/7', label: t(lang, 'Answers every message instantly', 'Atiende cada mensaje al instante') },
      { icon: 'message-circle', big: t(lang, '2 channels', '2 canales'), label: t(lang, 'WhatsApp and Instagram in one bot', 'WhatsApp e Instagram en un solo bot'), green: true },
      { icon: 'target', big: '100%', label: t(lang, 'Every conversation logged in your CRM', 'Cada conversación registrada en tu CRM') },
    ],
  },
  {
    blockType: 'featureGrid',
    eyebrow: t(lang, 'The problem', 'El problema'),
    heading: t(lang, 'Every unanswered message is a sale going cold', 'Cada mensaje sin responder a tiempo es una venta que se enfría'),
    subtitle: t(
      lang,
      "Your customers write when they can, not on your schedule. If nobody replies within minutes, they go to whoever did.",
      'Tus clientes escriben cuando pueden, no en tu horario. Si nadie responde en minutos, se van con el que sí contestó.',
    ),
    cards: [
      {
        icon: 'moon',
        title: t(lang, 'After-hours messages', 'Mensajes fuera de horario'),
        description: t(lang, 'They come in at night or on weekends and nobody answers.', 'Llegan de noche o en fin de semana y nadie atiende.'),
      },
      {
        icon: 'repeat',
        title: t(lang, 'Overwhelmed team', 'Equipo saturado'),
        description: t(lang, 'They repeat the same answers all day long.', 'Repite las mismas respuestas todo el día.'),
      },
      {
        icon: 'user-x',
        title: t(lang, "Leads that never return", 'Leads que no vuelven'),
        description: t(lang, 'They ask once, get no reply, and disappear.', 'Preguntan una vez y, sin respuesta, desaparecen.'),
      },
      {
        icon: 'eye-off',
        title: t(lang, 'Follow-up blind spots', 'Seguimiento a ciegas'),
        description: t(lang, "You don't know how many conversations went unclosed.", 'No sabes cuántas conversaciones quedaron sin cerrar.'),
      },
    ],
  },
  {
    blockType: 'featureAccordion',
    eyebrow: t(lang, 'Capabilities', 'Capacidades'),
    heading: t(lang, 'What an AI chatbot does', 'Qué hace un chatbot con IA'),
    placeholder: t(lang, 'Feature screenshot', 'Captura del producto'),
    items: [
      {
        icon: 'zap',
        title: t(lang, 'Answers instantly, 24/7', 'Responde al instante, 24/7'),
        body: t(
          lang,
          "It replies in seconds at any hour, with no wait — answering FAQs like hours, pricing, and availability with no human agent needed.",
          'Contesta en segundos a cualquier hora, sin esperas — resuelve preguntas frecuentes como horarios, precios y disponibilidad sin necesidad de un agente humano.',
        ),
      },
      {
        icon: 'filter',
        title: t(lang, 'Qualifies every lead', 'Califica cada lead'),
        body: t(
          lang,
          'It asks the right questions — budget, timeline, need — and only passes you contacts with real intent, instead of every inbound message.',
          'Hace las preguntas correctas, presupuesto, plazo, necesidad, y solo te pasa contactos con intención real, en vez de cada mensaje entrante.',
        ),
      },
      {
        icon: 'share-2',
        title: t(lang, 'Connects to WhatsApp and Instagram', 'Se conecta a WhatsApp e Instagram'),
        body: t(
          lang,
          'It talks with customers where they already write to you — WhatsApp Business API for chats and reminders, plus Instagram DMs, comments, and story replies turned into conversations.',
          'Conversa con tus clientes donde ya te escriben, WhatsApp Business API para chats y recordatorios, más DMs, comentarios y respuestas a stories de Instagram convertidos en conversaciones.',
        ),
      },
      {
        icon: 'calendar-check',
        title: t(lang, 'Books and logs everything in your CRM', 'Agenda y registra todo en tu CRM'),
        body: t(
          lang,
          "It offers time slots and confirms appointments without you lifting a finger, and every conversation stays saved in the CRM to trigger follow-up automatically.",
          'Ofrece horarios y confirma citas sin que muevas un dedo, y cada conversación queda guardada en el CRM para activar el seguimiento automáticamente.',
        ),
      },
    ],
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
          'We map your channels, tone and goals — then scope the build.',
          'Mapeamos tus canales, tono y metas — luego definimos el build.',
        ),
      },
      {
        icon: 'wrench',
        tag: t(lang, 'Days 1–20', 'Días 1–20'),
        title: t(lang, '20-hour engineering sprint', 'Sprint de ingeniería de 20 horas'),
        description: t(
          lang,
          'Our engineers train and configure your chatbot end to end.',
          'Nuestros ingenieros entrenan y configuran tu chatbot de extremo a extremo.',
        ),
      },
      {
        icon: 'check',
        tag: t(lang, 'Day 30', 'Día 30'),
        title: t(lang, 'Go live', 'En vivo'),
        description: t(
          lang,
          'Your chatbot runs 24/7 on WhatsApp and Instagram — answering, qualifying and booking.',
          'Tu chatbot funciona 24/7 en WhatsApp e Instagram — responde, califica y agenda.',
        ),
      },
    ],
  },
  {
    blockType: 'featureGrid',
    splitIntro: true,
    eyebrow: t(lang, 'The ecosystem', 'El ecosistema'),
    heading: t(lang, 'Everything your chatbot does for you', 'Todo lo que hace tu chatbot por ti'),
    subtitle: t(
      lang,
      "Every message answered, every lead qualified, every appointment booked — without adding headcount.",
      'Cada mensaje atendido, cada lead calificado, cada cita agendada, sin sumar personal.',
    ),
    cards: [
      {
        icon: 'zap',
        title: t(lang, 'Instant replies', 'Responde al instante'),
        description: t(lang, 'Answers in seconds at any hour, no waiting.', 'Contesta en segundos a cualquier hora, sin esperas.'),
      },
      {
        icon: 'filter',
        title: t(lang, 'Lead qualification', 'Califica leads'),
        description: t(lang, 'Asks the right questions and passes you only real intent.', 'Hace las preguntas correctas y te pasa solo contactos con intención real.'),
      },
      {
        icon: 'calendar-check',
        title: t(lang, 'Books for you', 'Agenda por ti'),
        description: t(lang, 'Offers time slots and confirms appointments on its own.', 'Ofrece horarios y confirma citas sin que muevas un dedo.'),
      },
      {
        icon: 'user-round',
        title: t(lang, 'Natural conversation', 'Conversa natural'),
        description: t(lang, 'Replies like a person, not a fixed-response bot.', 'Responde como una persona, no como un bot de respuestas fijas.'),
      },
      {
        icon: 'database',
        title: t(lang, 'Logs to your CRM', 'Registra en el CRM'),
        description: t(lang, 'Every conversation is saved and triggers follow-up.', 'Cada conversación queda guardada y activa el seguimiento.'),
      },
      {
        icon: 'share-2',
        title: t(lang, 'WhatsApp and Instagram', 'WhatsApp e Instagram'),
        description: t(lang, 'Works on the channels your customers already write to you on.', 'Atiende en los canales donde tus clientes ya te escriben.'),
      },
    ],
  },
  {
    blockType: 'featureZigzag',
    eyebrow: t(lang, 'The differentiator', 'El diferenciador'),
    heading: t(lang, 'Why Apturio is different', 'Por qué Apturio es distinto'),
    rows: [
      {
        num: '01',
        title: t(lang, "You don't configure it — we implement it for you", 'No lo configuras tú: lo implementamos por ti'),
        description: t(
          lang,
          "We set up the chatbot, train it on your business information, and leave it connected to your WhatsApp and Instagram. You just start receiving customers who are already taken care of. This is what separates Apturio from tools where you have to configure everything yourself.",
          'Montamos el chatbot, lo entrenamos con la información de tu negocio y lo dejamos conectado a tu WhatsApp e Instagram. Tú solo empiezas a recibir clientes ya atendidos. Este es el punto que separa a Apturio de las herramientas donde tienes que configurarlo todo tú.',
        ),
        bullets: [
          { text: t(lang, 'Trained on your business', 'Entrenado con tu negocio') },
          { text: t(lang, 'Connected and running', 'Conectado y funcionando') },
        ],
        placeholder: 'Image',
      },
    ],
  },
  {
    blockType: 'tabs',
    eyebrow: t(lang, 'Use cases', 'Casos de uso'),
    heading: t(lang, 'How businesses like yours use it', 'Cómo lo usan negocios como el tuyo'),
    tabs: [
      {
        icon: 'stethoscope',
        label: t(lang, 'Clinics', 'Clínicas'),
        title: t(lang, 'Clinics and medical offices', 'Clínicas y consultorios'),
        description: t(lang, 'Books appointments and filters urgent cases without overloading reception.', 'Agenda citas y filtra urgencias sin saturar la recepción.'),
        bullets: [],
        placeholder: 'Image',
      },
      {
        icon: 'sparkles',
        label: t(lang, 'Med-spa', 'Estética'),
        title: t(lang, 'Aesthetics and med-spa', 'Estética y med-spa'),
        description: t(lang, 'Turns every Instagram DM into a booked appointment.', 'Convierte cada DM de Instagram en una cita.'),
        bullets: [],
        placeholder: 'Image',
      },
      {
        icon: 'home',
        label: t(lang, 'Real estate', 'Inmobiliarias'),
        title: t(lang, 'Real estate', 'Inmobiliarias'),
        description: t(lang, 'Qualifies interested buyers and books visits instantly.', 'Califica interesados y agenda visitas al instante.'),
        bullets: [],
        placeholder: 'Image',
      },
      {
        icon: 'graduation-cap',
        label: t(lang, 'Coaches', 'Coaches'),
        title: t(lang, 'Coaches and courses', 'Coaches y cursos'),
        description: t(lang, 'Answers every inquiry and fills your programs.', 'Atiende cada consulta y llena tus programas.'),
        bullets: [],
        placeholder: 'Image',
      },
    ],
  },
  {
    blockType: 'bigQuote',
    quote: t(
      lang,
      'They gave me real insight into my business and consolidated 5,000 contacts.',
      'Me dieron visión real de mi negocio y consolidaron 5,000 contactos.',
    ),
    authorName: 'Bella Bellarda',
    authorRole: 'SM Privé',
  },
  {
    blockType: 'faq',
    heading: t(lang, 'Frequently asked questions', 'Preguntas frecuentes'),
    items: [
      {
        question: t(lang, 'What is an AI chatbot and how does it work?', '¿Qué es un chatbot con IA y cómo funciona?'),
        answer: t(
          lang,
          'It is an automated messaging system that runs inside WhatsApp and Instagram, letting your business reply, qualify, and follow up with customers without constant human intervention. It runs 24 hours a day, answers in seconds, and integrates with a CRM to log every conversation.',
          'Es un sistema de mensajería automatizado que opera dentro de WhatsApp e Instagram y permite a tu negocio responder, calificar y dar seguimiento a los clientes sin intervención humana constante. Funciona las 24 horas, contesta en segundos y se integra con un CRM para registrar cada conversación.',
        ),
      },
      {
        question: t(lang, 'Does the chatbot connect with WhatsApp and Instagram?', '¿El chatbot se conecta con WhatsApp e Instagram?'),
        answer: t(
          lang,
          'Yes. It runs on the WhatsApp Business API and the Instagram Messaging API, so it can reply to chats, DMs, comments, and story replies from the same system.',
          'Sí. Funciona sobre la WhatsApp Business API y la Instagram Messaging API, así puede responder chats, DMs, comentarios y respuestas a stories desde el mismo sistema.',
        ),
      },
      {
        question: t(lang, 'Does the AI sound like a robot?', '¿La IA suena como un robot?'),
        answer: t(
          lang,
          'No. We use advanced natural language processing (NLP) so your AI assistant sounds human and professional, and stays true to your brand tone in every conversation.',
          'No. Usamos procesamiento de lenguaje natural (NLP) avanzado para que tu asistente de IA suene humano y profesional, y se mantenga fiel al tono de tu marca en cada conversación.',
        ),
      },
      {
        question: t(lang, 'Do I need technical skills to use it?', '¿Necesito conocimientos técnicos para usarlo?'),
        answer: t(
          lang,
          'Not at all. We handle all the engineering setup, AI training, and chatbot configuration for you. You just log in and start selling.',
          'Para nada. Nosotros nos encargamos de toda la configuración de ingeniería, el entrenamiento de la IA y la configuración del chatbot por ti. Tú solo entras y vendes.',
        ),
      },
      {
        question: t(lang, 'Do you configure it or do I?', '¿Ustedes lo configuran o lo hago yo?'),
        answer: t(
          lang,
          "We configure everything. We set up the chatbot, train it on your business information, and leave it connected to your WhatsApp and Instagram. You just start receiving customers who are already taken care of.",
          'Nosotros lo configuramos todo. Montamos el chatbot, lo entrenamos con la información de tu negocio y lo dejamos conectado a tu WhatsApp e Instagram. Tú solo empiezas a recibir clientes ya atendidos.',
        ),
      },
      {
        question: t(lang, 'Can it book appointments and add them to my calendar?', '¿Puede agendar citas y pasarlas a mi calendario?'),
        answer: t(
          lang,
          'Yes. It offers available time slots and confirms appointments on its own, and syncs two-way with Google Calendar so your team calendar stays up to date.',
          'Sí. Ofrece horarios disponibles y confirma citas sin que muevas un dedo, y sincroniza en dos vías con Google Calendar para que el calendario de tu equipo se mantenga actualizado.',
        ),
      },
      {
        question: t(lang, "What happens when the bot doesn't know how to answer something?", '¿Qué pasa cuando el bot no sabe responder algo?'),
        answer: t(
          lang,
          'It hands the conversation off to a human agent when it detects a complex question or that the customer needs one, so nobody is left without a resolution.',
          'Transfiere la conversación a un agente humano cuando detecta una consulta compleja o que el cliente lo necesita, para que nadie quede sin resolver su duda.',
        ),
      },
    ],
  },
  strategyForm(lang),
]

const seedChatbotIa = async (): Promise<void> => {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'pages',
    locale: 'en',
    where: { slug: { equals: 'chatbot-ia' } },
    limit: 1,
  })

  const pageId = existing.docs[0]?.id

  const enData = {
    title: 'AI Chatbot',
    slug: 'chatbot-ia',
    layout: chatbotIaLayout('en'),
    _status: 'draft',
    meta: {
      title: 'AI Chatbot for WhatsApp and Instagram | Apturio',
      description:
        'An AI chatbot that answers, qualifies, and books for you on WhatsApp and Instagram, 24/7. We implement it for you. Book your demo.',
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
      title: 'Chatbot con IA',
      slug: 'chatbot-ia',
      layout: chatbotIaLayout('es'),
      _status: 'draft',
      meta: {
        title: 'Chatbot con IA para WhatsApp e Instagram | Apturio',
        description:
          'Un chatbot con IA que atiende, califica y agenda por ti en WhatsApp e Instagram, 24/7. Lo implementamos por ti. Agenda tu demo.',
      },
    } as never,
  })

  payload.logger.info(`[seed-chatbot-ia] page id=${created.id} (en+es, slug=chatbot-ia)`)
}

await seedChatbotIa()

if (typeof process !== 'undefined') {
  process.exit(0)
}
