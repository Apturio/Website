/**
 * One-off seed: Instagram Chatbot pilot page (EN + ES), draft status.
 * URL: apturio.com/es/chatbot-instagram
 * Run with: payload run src/seed-chatbot-instagram.ts
 * Standalone — does not touch any other collection or page.
 * Content sourced entirely from the doc's Instagram Chatbot section — the
 * reference screenshots were used only to pick block types, not for copy.
 * Two of the nine screenshots were a duplicate comparison table; only one
 * block was created for it. The generic "$2,000 Implementation Advantage"
 * banner shown in the screenshots was replaced with the page's own real
 * differentiator copy from the doc.
 * Note: MetricsBlock has no heading/subtitle field, so the Instagram-vs-
 * WhatsApp framing line is folded into each metric's label instead.
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

const chatbotInstagramLayout = (lang: Lang): Block[] => [
  {
    blockType: 'heroSplit',
    pillIcon: 'instagram',
    pillText: t(lang, 'AI Instagram Chatbot', 'Chatbot de Instagram con IA'),
    titleStart: t(lang, 'AI Instagram chatbot:', 'Chatbot de Instagram con IA:'),
    titleAccent: t(lang, 'turn your comments, stories, and DMs', 'convierte tus comentarios, stories y DMs'),
    titleEnd: t(lang, 'into customers', 'en clientes'),
    accentColor: 'green',
    subtitle: t(
      lang,
      'Every comment, story reply, or direct message is a sales opportunity. Our AI chatbot responds instantly inside Instagram, qualifies the contact, and passes it to your CRM, without you having to configure it yourself.',
      'Cada comentario, respuesta a una story o mensaje directo es una oportunidad de venta. Nuestro chatbot con IA responde al instante dentro de Instagram, califica al contacto y lo pasa a tu CRM, sin que tengas que configurarlo tú mismo.',
    ),
    ctaPrimaryLabel: t(lang, 'See how it works', 'Ver cómo funciona'),
    ctaPrimaryHref: '#pricing',
    ctaSecondaryLabel: t(lang, 'Message us on WhatsApp', 'Escríbenos por WhatsApp'),
    ctaSecondaryHref: 'https://wa.me/15614731298',
    placeholder: t(lang, 'Instagram post mockup', 'Mockup de post de Instagram'),
  },
  {
    blockType: 'featureZigzag',
    eyebrow: t(lang, 'Definition', 'Definición'),
    heading: t(lang, 'What is an Instagram chatbot?', '¿Qué es un chatbot de Instagram?'),
    rows: [
      {
        num: '01',
        title: t(lang, 'What is an Instagram chatbot?', '¿Qué es un chatbot de Instagram?'),
        description: t(
          lang,
          'An Instagram chatbot is an automated system that runs inside Instagram Direct Messages (DMs), letting a business reply to messages, comments, story mentions, and reactions without constant human intervention. It integrates with a CRM to capture leads and manage every conversation from one place.',
          'Un chatbot de Instagram es un sistema automatizado que opera dentro de los Instagram Direct Messages (DMs) y permite a un negocio responder mensajes, comentarios, menciones en historias y reacciones sin intervención humana constante. Se integra con un CRM para capturar leads y gestionar cada conversación desde un mismo lugar.',
        ),
        bullets: [
          { text: t(lang, 'Replies to DMs, comments, and stories', 'Responde DMs, comentarios y stories') },
          { text: t(lang, 'Turns content into a sales conversation', 'Convierte contenido en conversación de venta') },
        ],
        placeholder: t(lang, 'Image', 'Imagen'),
      },
    ],
  },
  {
    blockType: 'comparisonTable',
    eyebrow: t(lang, 'The difference', 'La diferencia'),
    heading: t(lang, 'Instagram chatbot vs. web form', 'Chatbot de Instagram vs. formulario web'),
    columns: [
      { label: t(lang, 'Web form', 'Formulario web') },
      { label: t(lang, 'Instagram Chatbot', 'Chatbot de Instagram'), highlight: true },
    ],
    rows: [
      {
        label: t(lang, 'Open rate', 'Tasa de apertura'),
        values: [
          { text: t(lang, '~20-30% (if by email)', '~20-30%') },
          { text: '80-90%', highlight: true },
        ],
      },
      {
        label: t(lang, 'Response rate', 'Tasa de respuesta'),
        values: [
          { text: '3-5%' },
          { text: '30-50%', highlight: true },
        ],
      },
      {
        label: t(lang, 'User friction', 'Fricción para el usuario'),
        values: [
          { text: t(lang, 'High (fill fields, submit, wait)', 'Alta (llenar campos, submit, esperar)') },
          { text: t(lang, 'Minimal (just reply to a message)', 'Mínima (solo responder mensajes)'), highlight: true },
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
        label: t(lang, 'Content integration', 'Integración con contenido'),
        values: [
          { text: t(lang, 'None', 'Ninguna') },
          { text: t(lang, 'Posts, stories, and reels', 'Posts, stories y reels'), highlight: true },
        ],
      },
      {
        label: t(lang, 'Abandonment rate', 'Tasa de abandono'),
        values: [
          { text: '+70%' },
          { text: t(lang, 'Low', 'Baja'), highlight: true },
        ],
      },
    ],
  },
  {
    blockType: 'comparisonTable',
    eyebrow: t(lang, 'Instagram vs. WhatsApp', 'Instagram vs. WhatsApp'),
    heading: t(lang, 'Two channels that complement, not compete', 'Dos canales que se complementan, no compiten'),
    subtitle: t(
      lang,
      'Instagram captures and discovers; WhatsApp closes and follows up.',
      'Instagram capta y descubre; WhatsApp cierra y da seguimiento.',
    ),
    columns: [
      { label: t(lang, 'Instagram Chatbot', 'Instagram Chatbot') },
      { label: t(lang, 'WhatsApp Chatbot', 'WhatsApp Chatbot'), highlight: true },
    ],
    rows: [
      {
        label: t(lang, 'Open rate', 'Tasa de apertura'),
        values: [{ text: '80-90%' }, { text: '98%', highlight: true }],
      },
      {
        label: t(lang, 'Response rate', 'Tasa de respuesta'),
        values: [{ text: '30-50%' }, { text: '45-60%', highlight: true }],
      },
      {
        label: t(lang, 'Conversation starter', 'Iniciador de conversación'),
        values: [
          { text: t(lang, 'User (post, story, mention, DM)', 'Usuario (post, story, mención, DM)') },
          { text: t(lang, 'Business (template) or user (DM)', 'Negocio (template) o usuario (DM)'), highlight: true },
        ],
      },
      {
        label: t(lang, 'Conversation window', 'Ventana de conversación'),
        values: [
          { text: t(lang, '7 days', '7 días') },
          { text: t(lang, '24 hours', '24 horas'), highlight: true },
        ],
      },
      {
        label: t(lang, 'New customer discovery', 'Descubrimiento de nuevos clientes'),
        values: [
          { text: t(lang, 'High (public comments, hashtags)', 'Alto (comentarios públicos, hashtags)'), highlight: true },
          { text: t(lang, 'Low (only contacts who write first)', 'Bajo (solo contactos que escriben primero)') },
        ],
      },
      {
        label: t(lang, 'Ideal use', 'Uso ideal'),
        values: [
          { text: t(lang, 'Content-driven acquisition and conversion', 'Captación y conversión desde contenido'), highlight: true },
          { text: t(lang, 'Support, care, and follow-up', 'Atención, soporte y seguimiento') },
        ],
      },
    ],
  },
  {
    blockType: 'featureGrid',
    eyebrow: t(lang, 'Capabilities', 'Capacidades'),
    heading: t(lang, 'What an Instagram chatbot can do', 'Qué puede hacer un chatbot de Instagram'),
    cards: [
      {
        icon: 'message-circle',
        title: t(lang, 'Automatic DM replies', 'Respuesta automática a DMs'),
        description: t(lang, 'Replies to direct messages instantly with scripted flows.', 'Responde mensajes directos al instante con flujos programados.'),
      },
      {
        icon: 'message-square',
        title: t(lang, 'Comment replies', 'Respuesta a comentarios'),
        description: t(lang, 'Detects keywords in comments and sends an automatic DM.', 'Detecta palabras clave en comentarios y envía un DM automático.'),
      },
      {
        icon: 'circle-play',
        title: t(lang, 'Story replies', 'Respuesta a stories'),
        description: t(lang, 'Automatically reacts when someone replies to a story.', 'Reacciona automáticamente cuando alguien responde a una story.'),
      },
      {
        icon: 'filter',
        title: t(lang, 'Lead qualification', 'Calificación de leads'),
        description: t(lang, 'Asks questions to identify qualified prospects.', 'Hace preguntas para identificar prospectos calificados.'),
      },
      {
        icon: 'clipboard-list',
        title: t(lang, 'Data capture', 'Captura de datos'),
        description: t(lang, 'Collects name, email, and phone within the same DM.', 'Recolecta nombre, email y teléfono dentro del mismo DM.'),
      },
      {
        icon: 'database',
        title: t(lang, 'CRM integration', 'Integración con tu CRM'),
        description: t(lang, 'Automatically logs contacts and conversations.', 'Registra automáticamente contactos y conversaciones.'),
      },
    ],
  },
  {
    blockType: 'benefits',
    heading: t(lang, 'How businesses use it, by industry', 'Cómo lo usan los negocios: casos de uso por industria'),
    items: [
      {
        title: t(lang, 'Fashion and apparel', 'Moda y ropa'),
        description: t(
          lang,
          "Direct sales from posts: they comment 'price' and get size, price, and purchase link.",
          "Ventas directas desde posts: comentan 'precio' y reciben talla, precio y link de compra.",
        ),
      },
      {
        title: t(lang, 'Beauty and cosmetics', 'Belleza y cosmética'),
        description: t(lang, 'Books appointments and consultations from a promo story.', 'Agenda citas y consultas desde una story con promoción.'),
      },
      {
        title: t(lang, 'Fitness and trainers', 'Fitness y entrenadores'),
        description: t(lang, 'Sells plans and online programs from reel comments.', 'Vende planes y programas online desde comentarios en reels.'),
      },
      {
        title: t(lang, 'Real estate', 'Bienes raíces'),
        description: t(lang, 'Qualifies buyers by budget and area from a comment.', 'Califica compradores por presupuesto y zona desde un comentario.'),
      },
      {
        title: t(lang, 'Restaurants', 'Restaurantes'),
        description: t(lang, 'Shows the menu and takes reservations from a story reply.', 'Muestra el menú y toma reservas desde la respuesta a una story.'),
      },
      {
        title: t(lang, 'Education', 'Educación'),
        description: t(lang, 'Recruits students and books free demos from an educational post.', 'Capta alumnos y agenda demos gratuitas desde un post educativo.'),
      },
    ],
  },
  {
    blockType: 'steps',
    eyebrow: t(lang, 'How it works', 'Cómo funciona'),
    heading: t(lang, 'From kickoff to live in 30 days', 'Del arranque a en vivo en 30 días'),
    items: [
      {
        title: t(lang, 'Strategy call', 'Llamada de estrategia'),
        description: t(
          lang,
          'We map your pipeline, tools, and goals in a free session.',
          'Mapeamos tu pipeline, herramientas y metas en una sesión gratuita.',
        ),
      },
      {
        title: t(lang, '20-hour build', 'Construcción de 20 horas'),
        description: t(
          lang,
          'Our engineers configure your custom architecture end to end.',
          'Nuestros ingenieros configuran tu arquitectura a medida de extremo a extremo.',
        ),
      },
      {
        title: t(lang, 'Go live', 'En vivo'),
        description: t(
          lang,
          'Your machine runs — qualifying, booking, and scaling 24/7.',
          'Tu máquina funciona — califica, agenda y escala 24/7.',
        ),
      },
    ],
  },
  {
    blockType: 'bonusBanner',
    heading: t(lang, 'Your Instagram chatbot, implemented by us', 'Tu chatbot de Instagram, implementado por nosotros'),
    body: t(
      lang,
      "We don't hand you a template to configure yourself. We set up your AI Instagram chatbot, connect it to your DMs, comments, and stories, and leave it running. You just log in to sell.",
      'No te entregamos una plantilla para que la configures tú. Montamos tu chatbot de Instagram con IA, lo conectamos a tus DMs, comentarios y stories, y lo dejamos funcionando. Tú solo entras a vender.',
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
        question: t(lang, 'Do I need an Instagram Business or Creator account?', '¿Necesito cuenta de Instagram Business o Creator?'),
        answer: t(
          lang,
          'Yes. The chatbot requires a professional account (Business or Creator) connected to a Facebook page.',
          'Sí. El chatbot requiere una cuenta profesional (Business o Creator) conectada a una página de Facebook.',
        ),
      },
      {
        question: t(lang, 'Can the bot reply to all my comments?', '¿Puede el bot responder a todos mis comentarios?'),
        answer: t(
          lang,
          'Yes, it can detect keywords in public comments and send an automatic DM to the user who commented.',
          'Sí, puede detectar palabras clave en comentarios públicos y enviar un DM automático al usuario que comentó.',
        ),
      },
      {
        question: t(lang, "What is Instagram's messaging window?", '¿Cuál es la ventana de mensajería en Instagram?'),
        answer: t(
          lang,
          "7 days from the user's last message, wider than WhatsApp's 24h, ideal for re-marketing.",
          '7 días desde el último mensaje del usuario, más amplia que la de WhatsApp (24h), ideal para hacer re-marketing.',
        ),
      },
      {
        question: t(lang, 'Can the bot message first (outbound)?', '¿El bot puede enviar mensajes primero (outbound)?'),
        answer: t(
          lang,
          'Not directly without the user having started contact first. It can only reply after the user interacts first.',
          'No directamente sin que el usuario haya iniciado el contacto. Solo puede responder después de que el usuario interactúa primero.',
        ),
      },
      {
        question: t(lang, 'Can images and videos be sent in the DM?', '¿Se pueden enviar imágenes y videos en el DM?'),
        answer: t(
          lang,
          'Yes. Instagram supports text, images, GIFs, stickers, quick-reply buttons, and carousels.',
          'Sí. Instagram soporta texto, imágenes, GIFs, stickers, botones de respuesta rápida y carruseles.',
        ),
      },
      {
        question: t(lang, 'Can I connect Instagram and WhatsApp in the same CRM?', '¿Puedo conectar Instagram y WhatsApp en el mismo CRM?'),
        answer: t(
          lang,
          'Yes. Both channels can be integrated and your team manages every conversation from a single inbox.',
          'Sí. Ambos canales pueden integrarse y el equipo gestiona todas las conversaciones desde un solo inbox.',
        ),
      },
      {
        question: t(lang, "Does the chatbot hurt my account's organic reach?", '¿El chatbot daña el alcance orgánico de mi cuenta?'),
        answer: t(
          lang,
          "No. On the contrary, higher engagement (comments and DMs) can positively signal Instagram's algorithm.",
          'No. Al contrario, una mayor interacción (comentarios y DMs) puede señalizar de forma positiva al algoritmo de Instagram.',
        ),
      },
      {
        question: t(lang, 'Do I need the Instagram API for the chatbot?', '¿Necesito la API de Instagram para el chatbot?'),
        answer: t(
          lang,
          'Yes, it uses the Instagram Messaging API, part of the Meta platform, connected through the CRM.',
          'Sí, se usa la Instagram Messaging API, parte de la plataforma de Meta, conectada a través del CRM.',
        ),
      },
    ],
  },
  strategyForm(lang),
]

const seedChatbotInstagram = async (): Promise<void> => {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'pages',
    locale: 'en',
    where: { slug: { equals: 'chatbot-instagram' } },
    limit: 1,
  })

  const pageId = existing.docs[0]?.id

  const enData = {
    title: 'Instagram Chatbot',
    slug: 'chatbot-instagram',
    layout: chatbotInstagramLayout('en'),
    _status: 'draft',
    meta: {
      title: 'AI Instagram Chatbot: Sell From Your DMs | Apturio',
      description:
        'AI Instagram chatbot: turns comments, stories, and DMs into customers, 24/7, with no setup on your end. Turnkey implementation. Book your demo.',
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
      title: 'Instagram Chatbot',
      slug: 'chatbot-instagram',
      layout: chatbotInstagramLayout('es'),
      _status: 'draft',
      meta: {
        title: 'Chatbot de Instagram con IA: Vende desde tus DMs | Apturio',
        description:
          'Chatbot de Instagram con IA: convierte comentarios, stories y DMs en clientes, 24/7 y sin configurarlo tú. Implementación llave en mano. Agenda tu demo.',
      },
    } as never,
  })

  payload.logger.info(`[seed-chatbot-instagram] page id=${created.id} (en+es, slug=chatbot-instagram)`)
}

await seedChatbotInstagram()

if (typeof process !== 'undefined') {
  process.exit(0)
}
