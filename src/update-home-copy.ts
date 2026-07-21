/**
 * One-off: update Home page copy (EN + ES) to match the July content doc.
 * Only touches hero / problem / benefits / faq blocks — logos, testimonials,
 * pricing, and cta blocks are left untouched (doc gives no matching copy for
 * them; logos/testimonials already hold real seeded content, and the closing
 * CTA banner is generic site-wide copy not covered by the doc).
 * Run with: payload run src/update-home-copy.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

type Lang = 'en' | 'es'
type Block = Record<string, unknown> & { blockType?: string }

const t = (lang: Lang, en: string, es: string) => (lang === 'es' ? es : en)

const heroBlock = (lang: Lang): Block => ({
  blockType: 'hero',
  badge: undefined,
  title: t(
    lang,
    'The AI CRM that helps you sell more without doing it all yourself',
    'El CRM con IA que te ayuda a vender más sin hacerlo todo tú',
  ),
  description: t(
    lang,
    'Reply to messages, book appointments, and close sales from one place. A CRM ready to run, the AI works 24/7, and you stay in control of the business.',
    'Responde mensajes, agenda citas y cierra ventas desde un solo lugar. Un CRM listo para funcionar, la IA trabaja 24/7 y tú mantienes el control del negocio.',
  ),
  ctaPrimaryLabel: t(lang, 'See pricing', 'Ver precios'),
  ctaPrimaryHref: '#pricing',
  ctaSecondaryLabel: t(lang, 'Book a free trial', 'Agendar prueba gratuita'),
  ctaSecondaryHref: '#strategy',
})

const problemBlock = (lang: Lang): Block => ({
  blockType: 'problem',
  heading: t(
    lang,
    "The problem isn't a lack of customers, it's that they get lost along the way",
    'El problema no es que falten clientes, es que se pierden en el camino',
  ),
  subtitle: undefined,
  items: [
    {
      icon: 'Clock',
      title: t(lang, 'Leads come in, but nobody follows up', 'Leads sin seguimiento'),
      description: t(lang, 'Leads come in, but nobody follows up on them.', 'Los leads entran, pero nadie les da seguimiento.'),
    },
    {
      icon: 'Activity',
      title: t(lang, 'Your team replies, but you have no visibility', 'Tu equipo responde, pero tú no ves qué pasa'),
      description: t(lang, 'Your team replies, but you have no visibility into what happens.', 'Tu equipo responde, pero tú no ves qué pasa.'),
    },
    {
      icon: 'Layers',
      title: t(lang, 'Booked on WhatsApp, confirmed on Instagram, and something always gets lost', 'Se agenda por WhatsApp, se confirma por Instagram… y algo siempre se pierde'),
      description: t(lang, 'Booked on WhatsApp, confirmed on Instagram, and something always gets lost.', 'Se agenda por WhatsApp, se confirma por Instagram… y algo siempre se pierde.'),
    },
    {
      icon: 'Bot',
      title: t(lang, 'You spend hours on manual tasks AI could handle', 'Gastas horas en tareas manuales que la IA podría hacer'),
      description: t(lang, 'You spend hours on manual tasks AI could handle.', 'Gastas horas en tareas manuales que la IA podría hacer.'),
    },
  ],
})

const benefitsBlock = (lang: Lang): Block => ({
  blockType: 'benefits',
  heading: t(lang, 'Everything a CRM does for you', 'Todo lo que un CRM hace por ti'),
  subtitle: t(
    lang,
    'One system to serve, sell, and follow up on WhatsApp and Instagram, without depending on a thousand separate tools.',
    'Un solo sistema para atender, vender y dar seguimiento en WhatsApp e Instagram, sin depender de mil herramientas sueltas.',
  ),
  items: [
    {
      title: t(lang, '24/7 AI Salesperson', 'Vendedor con IA 24/7'),
      description: t(lang, 'Responds, qualifies, and follows up on every lead, even when you are not around.', 'Responde, califica y da seguimiento a cada lead, aunque no estés.'),
    },
    {
      title: t(lang, 'Unified CRM', 'CRM unificado'),
      description: t(lang, 'WhatsApp, Instagram, and the web in a single panel.', 'WhatsApp, Instagram y web en un solo panel.'),
    },
    {
      title: t(lang, 'Automatic booking', 'Agendadora automática'),
      description: t(lang, 'Books and confirms appointments with no manual work.', 'Reserva y confirma citas sin intervención manual.'),
    },
    {
      title: t(lang, 'Chatbot for WhatsApp and Instagram', 'Chatbot para WhatsApp e Instagram'),
      description: t(lang, 'Serves your customers where they already are.', 'Atiende a tus clientes donde ya están.'),
    },
    {
      title: t(lang, 'Automatic reminders', 'Recordatorios automáticos'),
      description: t(lang, 'Fewer no-shows, more appointments kept.', 'Menos inasistencias, más citas cumplidas.'),
    },
    {
      title: t(lang, 'Turnkey implementation', 'Implementación llave en mano'),
      description: t(lang, 'We leave it running for you, ready to use.', 'Lo dejamos funcionando por ti, listo para usar.'),
    },
    {
      title: t(lang, 'Engineering support', 'Soporte de ingeniería'),
      description: t(lang, 'A real team behind you when you need it.', 'Un equipo real detrás cuando lo necesitas.'),
    },
  ],
})

const faqBlock = (lang: Lang): Block => ({
  blockType: 'faq',
  heading: t(lang, 'Frequently asked questions', 'Preguntas frecuentes'),
  items: [
    {
      question: t(lang, 'How long does an AI CRM implementation take?', '¿Cuánto tarda la implementación de un CRM con IA?'),
      answer: t(
        lang,
        'The implementation takes around 30 days. Our Ready-to-Sell sprint is designed to get you running in that timeframe — a high-intensity collaboration where our engineers execute your turnkey setup within an assigned 20-hour window. The only requirement to hit the timeline is delivering all the necessary access and assets on time.',
        'La implementación tarda alrededor de 30 días. Nuestro sprint Ready-to-Sell está diseñado para dejarte operando en ese plazo, es una colaboración de alta intensidad en la que nuestros ingenieros ejecutan tu configuración llave en mano dentro de una ventana asignada de 20 horas. El único requisito para cumplir el cronograma es que entregues a tiempo todos los accesos y activos necesarios.',
      ),
    },
    {
      question: t(lang, 'Does the CRM work with WhatsApp and Instagram?', '¿Funciona el CRM con WhatsApp e Instagram?'),
      answer: t(
        lang,
        'Yes. Apturio connects directly with WhatsApp and Instagram, so you can serve, reply, and book on the channels your customers already write to you on, all from one place.',
        'Sí. Apturio se conecta directamente con WhatsApp e Instagram, para que atiendas, respondas y agendes en los canales donde tus clientes ya te escriben, todo desde un solo lugar.',
      ),
    },
    {
      question: t(lang, 'Do I need technical skills?', '¿Necesito habilidades técnicas?'),
      answer: t(
        lang,
        "Not at all. We handle all the engineering setup, AI training, and CRM configuration for you. You just log in and sell.",
        'Para nada. Nosotros nos encargamos de toda la configuración de ingeniería, el entrenamiento de la IA y la configuración del CRM por ti. Tú solo entras y vendes.',
      ),
    },
    {
      question: t(lang, 'Can I integrate my current tools?', '¿Puedo integrar mis herramientas actuales?'),
      answer: t(
        lang,
        "Yes. Apturio is built to be the unified brain of your operation — it connects to the tools you already use through open APIs, so your whole marketing and sales stack works in one system.",
        'Sí. Apturio está construido para ser el cerebro unificado de tu operación, se conecta con las herramientas que ya usas a través de APIs abiertas, para que todo tu stack de marketing y ventas trabaje en un mismo sistema.',
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
      question: t(lang, 'What happens after the CRM setup?', '¿Qué sucede después de la configuración del CRM?'),
      answer: t(
        lang,
        "You get priority support and continuous AI updates so your engine never stops evolving. If you need additional custom builds or ongoing strategic support, we offer flexible hour packages tailored to your growth. You're never on your own.",
        'Recibes soporte prioritario y actualizaciones continuas de IA para que tu motor nunca deje de evolucionar. Si necesitas implementaciones personalizadas adicionales o apoyo estratégico continuo, ofrecemos paquetes de horas flexibles adaptados a tu crecimiento. Nunca estarás solo.',
      ),
    },
    {
      question: t(lang, 'Are there long-term contracts?', '¿Hay contratos a largo plazo?'),
      answer: t(
        lang,
        'No, none. We believe in results, not lock-in — you work on a monthly subscription you can cancel anytime. We keep you because the system works, not because a contract forces you to.',
        'No, ninguno. Creemos en los resultados, no en las ataduras, trabajas con una suscripción mensual que puedes cancelar cuando quieras. Nos quedamos contigo porque el sistema funciona, no porque un contrato te obligue.',
      ),
    },
    {
      question: t(lang, 'What countries is Apturio available in?', '¿En qué países está disponible Apturio?'),
      answer: t(
        lang,
        'Apturio works in any country, because it runs 100% in the cloud. Today we already serve businesses in Argentina, Mexico, Venezuela, Spain, and Canada, and we keep adding new markets. Wherever you are, we implement your AI CRM remotely.',
        'Apturio funciona en cualquier país, porque opera 100% en la nube. Hoy ya damos servicio a negocios en Argentina, México, Venezuela, España y Canadá, y sumamos nuevos mercados constantemente. Estés donde estés, implementamos tu CRM con IA de forma remota.',
      ),
    },
    {
      question: t(lang, 'Are there pay-per-use fees?', '¿Existen tarifas de pago por uso (Pay-Per-Use)?'),
      answer: t(
        lang,
        'Yes, certain advanced features like AI usage, premium workflow actions, and telecom services (SMS, calls, emails) are billed on a pay-per-use basis directly through the platform. These rates are subject to change, so please review the detailed pricing breakdown.',
        'Sí, ciertas funciones avanzadas como el uso de IA, acciones de flujos de trabajo premium y servicios de telecomunicaciones (SMS, llamadas, correos electrónicos) se facturan en base a pago por uso directamente a través de la plataforma. Estas tarifas están sujetas a cambios. Por favor revisa el desglose detallado de precios.',
      ),
    },
    {
      question: t(lang, 'Do you offer add-ons?', '¿Ofrecen complementos (Add-Ons)?'),
      answer: t(
        lang,
        'Yes! While our core plans give you everything you need to run your sales machine, we offer optional add-ons like dedicated phone systems, advanced prospecting tools, automated ad managers, and WordPress hosting. These are priced separately and subject to change. Please review the detailed pricing breakdown.',
        '¡Sí! Aunque nuestros planes principales te dan todo lo que necesitas para operar tu máquina de ventas, ofrecemos complementos opcionales como Sistemas Telefónicos dedicados, Herramientas de Prospección avanzadas, Gestores de Anuncios automatizados y alojamiento WordPress. Estos tienen precios separados y están sujetos a cambios. Por favor revisa el desglose detallado de precios.',
      ),
    },
  ],
})

/** Replace only hero/problem/benefits/faq in an existing layout, keep the rest untouched. */
const patchLayout = (layout: Block[], lang: Lang): Block[] =>
  layout.map((block) => {
    switch (block.blockType) {
      case 'hero':
        return { ...block, ...heroBlock(lang) }
      case 'problem':
        return { ...block, ...problemBlock(lang) }
      case 'benefits':
        return { ...block, ...benefitsBlock(lang) }
      case 'faq':
        return { ...block, ...faqBlock(lang) }
      default:
        return block
    }
  })

const updateHomeCopy = async (): Promise<void> => {
  const payload = await getPayload({ config })

  const enPage = await payload.findByID({ collection: 'pages', id: 46, locale: 'en' })
  const esPage = await payload.findByID({ collection: 'pages', id: 46, locale: 'es' })

  const enLayout = patchLayout((enPage.layout ?? []) as Block[], 'en')
  const esLayout = patchLayout((esPage.layout ?? []) as Block[], 'es')

  await payload.update({
    collection: 'pages',
    id: 46,
    locale: 'en',
    data: { layout: enLayout } as never,
  })
  await payload.update({
    collection: 'pages',
    id: 46,
    locale: 'es',
    data: { layout: esLayout } as never,
  })

  payload.logger.info('[update-home-copy] Home hero/problem/benefits/faq updated (en+es)')
}

await updateHomeCopy()

if (typeof process !== 'undefined') {
  process.exit(0)
}
