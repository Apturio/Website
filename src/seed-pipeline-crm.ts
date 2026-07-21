/**
 * One-off seed: Pipeline CRM pilot page (EN + ES), draft status.
 * Run with: payload run src/seed-pipeline-crm.ts
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

const pipelineCrmLayout = (lang: Lang): Block[] => [
  {
    blockType: 'heroBold',
    pillIcon: 'workflow',
    pillText: t(lang, 'Sales pipeline CRM', 'CRM con pipeline de ventas'),
    titleStart: t(lang, 'A sales pipeline CRM', 'CRM con pipeline de ventas'),
    titleAccent: t(lang, 'that sorts out your funnel', 'que ordena tu embudo'),
    accentColor: 'green',
    subtitle: t(
      lang,
      "The problem isn't that you don't sell — it's that you don't know what stage each customer is in. See every opportunity, move it between stages, and let AI flag what needs attention.",
      'El problema no es que no vendas, es que no sabes en qué etapa está cada cliente. Visualiza cada oportunidad, muévela entre etapas y deja que la IA te avise qué necesita atención.',
    ),
    ctaPrimaryLabel: t(lang, 'See pricing', 'Ver precios'),
    ctaPrimaryHref: '#pricing',
    ctaSecondaryLabel: t(lang, 'Book a free trial', 'Agendar prueba gratuita'),
    ctaSecondaryHref: '#strategy',
    cards: [
      {
        icon: 'layout-list',
        big: t(lang, '4 stages', '4 etapas'),
        label: t(lang, 'Lead → Qualified → Proposal → Won', 'Lead → Calificado → Propuesta → Ganado'),
      },
      {
        icon: 'clock',
        big: t(lang, '3–15 days', '3-15 días'),
        label: t(lang, 'Configurable auto re-engagement', 'Reactivación automática configurable'),
        green: true,
      },
      {
        icon: 'target',
        big: '100%',
        label: t(lang, 'Full context on every opportunity', 'Contexto completo en cada oportunidad'),
      },
    ],
  },
  {
    blockType: 'featureAccordion',
    eyebrow: t(lang, 'What it does', 'Qué hace'),
    heading: t(lang, 'What a pipeline CRM does for you', 'Qué hace un CRM con pipeline por ti'),
    placeholder: t(lang, 'Feature screenshot', 'Captura del producto'),
    items: [
      {
        icon: 'layout-grid',
        title: t(lang, 'Custom pipelines', 'Pipelines personalizados'),
        body: t(
          lang,
          "We define stages the way your business actually sells, not a generic template. If you already have a process, we replicate it; if it's your first time, we start with a proven structure (Lead → Qualified → Proposal → Won) you can adjust later without losing data.",
          'Definimos las etapas según cómo vende tu negocio, no según un molde genérico. Si ya tienes un proceso, lo replicamos igual; si es tu primera vez, arrancamos con una estructura probada (Lead → Calificado → Propuesta → Ganado) que después puedes ajustar sin perder ningún dato.',
        ),
      },
      {
        icon: 'file-text',
        title: t(lang, 'Full-context deals', 'Oportunidades con contexto completo'),
        body: t(
          lang,
          'Every deal shows at a glance what you used to hunt for in three different places: value, expected close date, contact, and which rep owns it. No more "who was handling this client?"',
          'Cada deal muestra de un vistazo lo que antes tenías que buscar en tres lugares distintos: cuánto vale, cuándo debería cerrar, quién es el contacto y quién de tu equipo lo está llevando. Nada de "¿quién estaba atendiendo a este cliente?".',
        ),
      },
      {
        icon: 'x-circle',
        title: t(lang, 'Loss reasons', 'Razones de pérdida'),
        body: t(
          lang,
          "When you mark a deal lost, you log the real reason (price, response time, not the right fit, etc). Over time that stops being a pile of scattered failures and becomes the data that tells you what's actually blocking your closes.",
          'Cuando marcas un deal como perdido, puedes registrar el motivo real (precio, tiempo de respuesta, no era el cliente ideal, etc.). Con el tiempo eso deja de ser una lista de fracasos sueltos y se convierte en el dato que te dice qué está frenando tus cierres.',
        ),
      },
      {
        icon: 'link-2',
        title: t(lang, 'Connected to your whole CRM', 'Conectado a todo tu CRM'),
        body: t(
          lang,
          "It's not an isolated module. Every opportunity carries its conversation history, triggers reminders, and stays linked to the calendar and automated workflows — if a deal moves stage, the system can send an email or SMS on its own, with nobody writing it by hand.",
          'No es un módulo aislado. Cada oportunidad arrastra su historial de conversación, activa recordatorios y sigue conectada al calendario y a los workflows automáticos — si el deal avanza de etapa, el sistema puede enviar un email o un SMS solo, sin que nadie lo escriba a mano.',
        ),
      },
    ],
  },
  {
    blockType: 'timeline',
    eyebrow: t(lang, 'How it works', 'Cómo funciona'),
    heading: t(lang, 'How your AI pipeline works', 'Cómo funciona tu pipeline con IA'),
    items: [
      {
        icon: 'bot',
        tag: t(lang, 'Step 1', 'Paso 1'),
        title: t(lang, 'Every lead qualifies itself', 'Cada lead se califica solo'),
        description: t(
          lang,
          "It comes in through WhatsApp, Instagram, or a form, and within minutes you already know whether it's worth pursuing — no one has to interview it by hand.",
          'Entra por WhatsApp, Instagram o formulario, y en minutos ya sabes si vale la pena o no, sin que nadie lo entreviste a mano.',
        ),
      },
      {
        icon: 'move-right',
        tag: t(lang, 'Step 2', 'Paso 2'),
        title: t(lang, 'The deal moves without you pushing it', 'El deal avanza sin que lo empujes'),
        description: t(
          lang,
          "Based on the prospect's replies (or an AI voice call), the opportunity moves stage automatically.",
          'Según las respuestas del prospecto (o una llamada con IA de voz), la oportunidad se mueve de etapa automáticamente.',
        ),
      },
      {
        icon: 'zap',
        tag: t(lang, 'Step 3', 'Paso 3'),
        title: t(lang, 'Every stage triggers the right action', 'Cada etapa dispara la acción correcta'),
        description: t(
          lang,
          'Proposal sent, reminder, re-engagement if there is no activity, onboarding if won — the pipeline responds on its own to every change.',
          'Propuesta enviada, recordatorio, reactivación si no hay actividad, onboarding si se ganó, el pipeline responde solo a cada cambio.',
        ),
      },
      {
        icon: 'bar-chart-3',
        tag: t(lang, 'Step 4', 'Paso 4'),
        title: t(lang, 'You know what to prioritize, no guessing', 'Sabes qué priorizar sin adivinar'),
        description: t(
          lang,
          'See where your deals get stuck, which ones are at risk, and which to close first this week.',
          'Ves en qué etapa se traban tus ventas, qué deals están en riesgo y cuáles conviene cerrar primero esta semana.',
        ),
      },
    ],
  },
  {
    blockType: 'featureZigzag',
    eyebrow: t(lang, 'Why use it', 'Por qué usarlo'),
    heading: t(lang, 'Why use a pipeline CRM?', '¿Por qué usar un Pipeline CRM?'),
    rows: [
      {
        num: '01',
        title: t(lang, 'Reliable revenue forecasting', 'Pronóstico de ingresos confiable'),
        description: t(
          lang,
          'Every pipeline stage has an associated value, so at any moment you know how much you will bill this month or quarter without guessing. That lets you plan resources and budget ahead of time, instead of finding out at month-end whether you hit the goal.',
          'Cada etapa del pipeline tiene un valor asociado, así que en cualquier momento sabes cuánto vas a facturar este mes o trimestre sin adivinar. Eso te permite planificar recursos y presupuesto con anticipación, en lugar de descubrir a fin de mes si llegaste a la meta o no.',
        ),
        placeholder: t(lang, 'Image', 'Imagen'),
      },
      {
        num: '02',
        title: t(lang, 'Real sales team management', 'Gestión real de tu equipo de ventas'),
        description: t(
          lang,
          "You can assign each opportunity to a specific rep and see who's closing and who needs support. Instead of trusting what each person tells you, you see your team's real performance inside the same system.",
          'Puedes asignar cada oportunidad a un vendedor específico y ver quién está cerrando y quién necesita apoyo. En vez de confiar en lo que cada uno te cuenta, ves el rendimiento real de tu equipo dentro del mismo sistema.',
        ),
        placeholder: t(lang, 'Image', 'Imagen'),
      },
      {
        num: '03',
        title: t(lang, 'Complete customer history', 'Historial completo de cada cliente'),
        description: t(
          lang,
          'Notes, calls, messages, and stage changes stay logged on the opportunity. Anyone on your team can pick up a conversation with full context, without depending on the original rep remembering "where things were left off."',
          'Notas, llamadas, mensajes y cambios de etapa quedan guardados en la oportunidad. Cualquier persona de tu equipo puede retomar una conversación con contexto completo, sin depender de que el vendedor original recuerde "en qué habían quedado".',
        ),
        placeholder: t(lang, 'Image', 'Imagen'),
      },
      {
        num: '04',
        title: t(lang, 'A process that grows with your business', 'Un proceso que crece con tu negocio'),
        description: t(
          lang,
          'The pipeline handles ten deals or five hundred with the same clarity. When you add new reps, they step into an already-defined process, so your business scales without the chaos scaling with it.',
          'El pipeline maneja diez deals o quinientos con la misma claridad. Cuando sumas vendedores nuevos, entran a un proceso ya definido, así tu negocio escala sin que el caos escale con él.',
        ),
        placeholder: t(lang, 'Image', 'Imagen'),
      },
    ],
  },
  {
    blockType: 'integrations',
    heading: t(lang, 'Integrate your pipeline with the apps you already use', 'Integra tu pipeline con las apps que ya usas'),
    subtitle: t(
      lang,
      "Apturio doesn't replace your stack, it connects to it. Every category of your operation stays linked to the pipeline, with no manual work.",
      'Apturio no reemplaza tu stack, se conecta con él. Cada categoría de tu operación queda unida al pipeline, sin trabajo manual.',
    ),
    items: [
      {
        name: t(lang, 'Messaging', 'Mensajería'),
        description: t(
          lang,
          'WhatsApp, Instagram DM, Facebook Messenger, Gmail, and SMS — every conversation links to an opportunity automatically.',
          'WhatsApp, Instagram DM, Facebook Messenger, Gmail y SMS, cada conversación se liga a una oportunidad automáticamente.',
        ),
      },
      {
        name: t(lang, 'Lead capture', 'Captación de leads'),
        description: t(
          lang,
          'Facebook Lead Ads, Google Ads, web forms and landing pages — every lead lands directly on a pipeline stage, no manual entry.',
          'Facebook Lead Ads, Google Ads, formularios web y landing pages, cada lead entra directo a una etapa del pipeline, sin cargarlo a mano.',
        ),
      },
      {
        name: t(lang, 'Calendar & meetings', 'Calendario y reuniones'),
        description: t(
          lang,
          'Two-way synced Google Calendar — schedule and confirm appointments from the same opportunity.',
          'Google Calendar con sincronización en dos vías, agenda y confirma citas desde la misma oportunidad.',
        ),
      },
      {
        name: t(lang, 'Payments & billing', 'Pagos y facturación'),
        description: t(
          lang,
          'Stripe and automatic billing — when a deal is marked Won, the charge is generated with no extra steps.',
          'Stripe y facturación automática, cuando un deal se marca como Ganado, se genera el cobro sin pasos extra.',
        ),
      },
      {
        name: t(lang, 'Documents & signatures', 'Documentos y firmas'),
        description: t(
          lang,
          'Send proposals, contracts, and digital signatures from the deal — when the client signs, the opportunity moves stage on its own.',
          'Envía propuestas, contratos y firmas digitales desde el deal, cuando el cliente firma, la oportunidad avanza de etapa sola.',
        ),
      },
      {
        name: t(lang, 'Unlimited automation', 'Automatización sin límites'),
        description: t(
          lang,
          "Zapier, Make, webhooks, and an open API — if you use a tool that isn't on this list, you can probably connect it anyway.",
          'Zapier, Make, webhooks y API abierta, si usas una herramienta que no está en esta lista, probablemente puedas conectarla igual.',
        ),
      },
    ],
  },
  {
    blockType: 'faq',
    heading: t(lang, 'Frequently asked questions', 'Preguntas frecuentes'),
    items: [
      {
        question: t(lang, 'Can I customize my pipeline stages?', '¿Puedo personalizar las etapas de mi pipeline?'),
        answer: t(
          lang,
          'Yes, completely. You can create, rename, and reorder stages to reflect your real sales process, not a generic template. You can change them anytime without losing your opportunity history.',
          'Sí, completamente. Puedes crear, renombrar y reordenar las etapas para que reflejen tu proceso real de venta, no un molde genérico. Puedes modificarlas en cualquier momento, sin perder el historial de tus oportunidades.',
        ),
      },
      {
        question: t(lang, 'Does the pipeline connect with WhatsApp and Instagram?', '¿El pipeline se conecta con WhatsApp e Instagram?'),
        answer: t(
          lang,
          'Yes, directly. From the same deal you can send WhatsApp messages and receive replies without switching screens, plus trigger automatic messages when the opportunity changes stage. On Instagram, DMs and Lead Ads leads turn into CRM conversations automatically. All communication stays logged on the opportunity, nothing gets lost.',
          'Sí, directamente. Desde el mismo deal puedes enviar mensajes de WhatsApp y recibir las respuestas sin cambiar de pantalla, además de activar mensajes automáticos cuando la oportunidad cambia de etapa. En Instagram, los DMs y los leads de Lead Ads se convierten en conversaciones dentro del CRM automáticamente. Toda la comunicación queda registrada en la oportunidad, sin que se pierda nada.',
        ),
      },
      {
        question: t(lang, 'Can I have more than one pipeline?', '¿Puedo tener más de un pipeline?'),
        answer: t(
          lang,
          'Yes, with no limit. You can split your business into several pipelines — for example, one for new sales and another for renewals or different service lines — and each keeps its own stages, reports, and automations independently.',
          'Sí, sin límite. Puedes separar tu negocio en varios pipelines, por ejemplo, uno para ventas nuevas y otro para renovaciones o distintas líneas de servicio, y cada uno mantiene sus propias etapas, reportes y automatizaciones de forma independiente.',
        ),
      },
      {
        question: t(lang, "What happens if a deal doesn't move for several days?", '¿Qué pasa si un deal no avanza en varios días?'),
        answer: t(
          lang,
          'The system warns you before it turns into a lost opportunity. You can set up rep notifications, automatic re-engagement messages by email or WhatsApp, and even create a follow-up task, all based on however many days of inactivity you set as the limit (3, 7, 15 days — whatever fits your sales cycle).',
          'El sistema te avisa antes de que se convierta en una oportunidad perdida. Puedes configurar notificaciones al vendedor, mensajes automáticos de reactivación por email o WhatsApp, y hasta la creación de una tarea de seguimiento, todo según cuántos días de inactividad definas como límite (3, 7, 15 días, lo que se ajuste a tu ciclo de venta).',
        ),
      },
      {
        question: t(lang, 'Can I see why my opportunities are lost?', '¿Puedo ver por qué se pierden mis oportunidades?'),
        answer: t(
          lang,
          'Yes. Every time you mark a deal as lost, the system asks you to select a reason — price, timing, competition, no response, or others you define yourself. With that data you can identify your main reason for losses and which stage loses the most opportunities, so you can adjust your pitch or sales process.',
          'Sí. Cada vez que marcas un deal como perdido, el sistema te pide seleccionar una razón, precio, timing, competencia, falta de respuesta, entre otras que tú mismo definas. Con esos datos puedes identificar cuál es tu principal motivo de pérdida y en qué etapa se caen más oportunidades, para ajustar tu propuesta o tu proceso de venta.',
        ),
      },
      {
        question: t(lang, 'Do I need to migrate my data manually?', '¿Necesito migrar mis datos manualmente?'),
        answer: t(
          lang,
          "Not necessarily. You can import your current contacts and opportunities via CSV, connect your previous tool by API or Zapier, or let our team help you migrate them as part of the implementation. And from day one, new leads enter the pipeline on their own without you having to load anything by hand.",
          'No necesariamente. Puedes importar tus contactos y oportunidades actuales por CSV, conectar tu herramienta anterior por API o Zapier, o dejar que nuestro equipo te ayude a migrarlos como parte de la implementación. Y desde el primer día, los nuevos leads entran solos al pipeline sin que tengas que cargar nada a mano.',
        ),
      },
    ],
  },
  strategyForm(lang),
]

const seedPipelineCrm = async (): Promise<void> => {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'pages',
    locale: 'en',
    where: { slug: { equals: 'pipeline-crm' } },
    limit: 1,
  })

  const pageId = existing.docs[0]?.id

  const created = pageId
    ? await payload.update({
        collection: 'pages',
        id: pageId,
        locale: 'en',
        data: {
          title: 'Pipeline CRM',
          slug: 'pipeline-crm',
          layout: pipelineCrmLayout('en'),
          _status: 'draft',
          meta: {
            title: 'CRM with Sales Pipeline | Apturio',
            description:
              'Organize every sales opportunity in a visual pipeline. Automate stages, follow-up, and closes with AI. Implemented for you. Book your demo.',
          },
        } as never,
      })
    : await payload.create({
        collection: 'pages',
        locale: 'en',
        data: {
          title: 'Pipeline CRM',
          slug: 'pipeline-crm',
          layout: pipelineCrmLayout('en'),
          _status: 'draft',
          meta: {
            title: 'CRM with Sales Pipeline | Apturio',
            description:
              'Organize every sales opportunity in a visual pipeline. Automate stages, follow-up, and closes with AI. Implemented for you. Book your demo.',
          },
        } as never,
      })

  await payload.update({
    collection: 'pages',
    id: created.id,
    locale: 'es',
    data: {
      title: 'Pipeline CRM',
      slug: 'pipeline-crm',
      layout: pipelineCrmLayout('es'),
      _status: 'draft',
      meta: {
        title: 'CRM con Pipeline de Ventas e IA | Apturio',
        description:
          'Organiza cada oportunidad de venta en un pipeline visual. Automatiza etapas, seguimiento y cierres con IA. Implementado por ti. Agenda tu demo.',
      },
    } as never,
  })

  payload.logger.info(`[seed-pipeline-crm] created draft page id=${created.id} (en+es, slug=pipeline-crm)`)
}

await seedPipelineCrm()

if (typeof process !== 'undefined') {
  process.exit(0)
}
