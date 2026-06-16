/**
 * Wave 2 — service page seed (native localization).
 *
 * Builds the block layouts for the two real product pages (automated-booking /
 * agendamiento-automatizado, unified-crm / crm-unificado) and the four template
 * demo pages (templates/centered|split|dashboard|bold), recreating the delivered
 * prototype copy. Every block type in the Wave-2 library is exercised across
 * these pages. Each page is ONE document with EN + ES localized fields (title,
 * slug, layout, seo); product pages get a distinct ES slug, templates share slug.
 */
import type { Payload } from 'payload'

type Lang = 'en' | 'es'
type Block = Record<string, unknown>

const t = (lang: Lang, en: string, es: string) => (lang === 'es' ? es : en)

/** Mini-pricing plans (the 3 plans, $299 featured with the $2,000 bonus tag). */
const plans = (lang: Lang): Block[] => [
  {
    name: 'CRM Sales Foundation',
    sub: t(lang, 'Essential tools to manage leads and sales.', 'Herramientas esenciales para leads y ventas.'),
    price: '$199',
    period: '/mo',
    featured: false,
    features: [
      { text: t(lang, 'Self-service setup', 'Setup autogestionado') },
      { text: t(lang, 'Core CRM features', 'Funciones CRM principales') },
      { text: t(lang, 'Lead management', 'Gestión de leads') },
      { text: t(lang, 'Email & SMS', 'Email y SMS') },
    ],
    ctaLabel: t(lang, 'Get Started', 'Empezar'),
    ctaHref: '#strategy',
  },
  {
    name: 'AI CRM Sales Engine',
    sub: t(lang, 'The done-for-you foundation for automated sales.', 'La base hecha-para-ti para ventas automatizadas.'),
    price: '$299',
    period: '/mo',
    featured: true,
    bonusTag: t(lang, '$2,000 Bonus Included', 'Bono de $2,000 Incluido'),
    features: [
      { text: t(lang, 'All Foundation features', 'Todo lo de Foundation') },
      { text: t(lang, 'AI Conversational Bot', 'Bot Conversacional IA') },
      { text: t(lang, 'AI Lead Qualification', 'Calificación con IA') },
      { text: t(lang, 'Automated Booking', 'Agendamiento Automático') },
      { text: t(lang, 'FREE $2,000 Setup', 'Setup de $2,000 GRATIS'), hot: true },
    ],
    ctaLabel: t(lang, 'Claim My Engine + $2,000 Bonus', 'Reclamar mi Engine + Bono'),
    ctaHref: '#strategy',
  },
  {
    name: 'AI CRM Growth Machine',
    sub: t(lang, 'Full-scale engineering at zero upfront cost.', 'Ingeniería completa sin costo inicial.'),
    price: '$699',
    period: '/mo',
    featured: false,
    features: [
      { text: t(lang, 'Everything in Sales Engine', 'Todo lo de Sales Engine') },
      { text: t(lang, '$2,000 setup waived', 'Setup de $2,000 exonerado') },
      { text: t(lang, 'Advanced automations', 'Automatizaciones avanzadas') },
      { text: t(lang, 'Elite engineering concierge', 'Concierge Elite') },
    ],
    ctaLabel: t(lang, 'Get My Ready-To-Run Machine', 'Quiero mi Máquina Lista'),
    ctaHref: '#strategy',
  },
]

const miniPricing = (lang: Lang, opts: { eyebrow: string; heading: string; subtitle?: string; single?: boolean }): Block => ({
  blockType: 'miniPricing',
  eyebrow: opts.eyebrow,
  heading: opts.heading,
  subtitle: opts.subtitle,
  single: opts.single ?? false,
  plans: plans(lang),
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

const stickyCta = (lang: Lang): Block => ({
  blockType: 'stickyCta',
  title: t(lang, 'Ready to run your sales machine?', '¿Listo para tu máquina de ventas?'),
  subtitle: t(lang, '$2,000 setup bonus included', 'Bono de setup de $2,000 incluido'),
  ctaLabel: t(lang, 'Claim My Engine', 'Reclamar mi Engine'),
  ctaHref: '#strategy',
})

const logosCloud = (lang: Lang, heading: string): Block => ({
  blockType: 'logos',
  heading,
  logos: [
    { name: 'Sportsmed Academy', src: 'https://vibe.filesafe.space/1775831502235366632/attachments/40dbb601-c692-4abc-b2a9-6b77e3b414ea.png', old: true },
    { name: 'SM Privé', src: 'https://vibe.filesafe.space/1775831502235366632/attachments/112147e9-ed3a-4f3c-92e9-47c6f1c6cf81.png', old: true },
    { name: 'Venxel', src: 'https://vibe.filesafe.space/1775831502235366632/attachments/b5f01474-d965-4589-a2b4-d84fc8860b36.png', old: true },
    { name: 'Aprendo SEO', src: 'https://vibe.filesafe.space/1775831502235366632/attachments/7d0ff8ad-4917-46be-b2a4-501c8f5b0c9b.png', old: true },
    { name: 'Forja Group', src: 'https://vibe.filesafe.space/1775831502235366632/attachments/07fed6fa-f329-4106-b0a6-eaa6156111eb.png', old: false },
    { name: 'Dharma Health', src: 'https://vibe.filesafe.space/1775831502235366632/attachments/b59b13fc-6550-45b1-8e9a-4ae25904dcf7.png', old: false },
  ],
  globalOperations: t(lang, 'Global operations', 'Operaciones globales'),
  countries: [
    { name: t(lang, 'Canada', 'Canadá'), code: 'ca' },
    { name: 'Argentina', code: 'ar' },
    { name: t(lang, 'Mexico', 'México'), code: 'mx' },
    { name: t(lang, 'Spain', 'España'), code: 'es' },
    { name: 'Venezuela', code: 've' },
  ],
})

// ---------------------------------------------------------------------------
// PAGE LAYOUTS
// ---------------------------------------------------------------------------

const automatedBooking = (lang: Lang): Block[] => [
  {
    blockType: 'heroSplit',
    pillIcon: 'calendar-check',
    pillText: t(lang, 'Automated Booking', 'Agendamiento Automático'),
    titleStart: t(lang, 'Fill your calendar', 'Llena tu calendario'),
    titleAccent: t(lang, 'without the back-and-forth.', 'sin idas y vueltas.'),
    accentColor: 'brand',
    subtitle: t(
      lang,
      "Qualified leads book themselves onto the right rep's calendar — instantly, 24/7, with reminders that kill no-shows.",
      'Los leads calificados se agendan solos en el calendario del rep correcto — al instante, 24/7, con recordatorios que eliminan ausencias.',
    ),
    ctaPrimaryLabel: t(lang, 'Get Started', 'Empezar'),
    ctaPrimaryHref: '#pricing',
    ctaSecondaryIcon: 'phone-call',
    ctaSecondaryLabel: t(lang, 'Free Strategy Call', 'Llamada Gratis'),
    ctaSecondaryHref: '#strategy',
    micro: [
      { text: t(lang, 'Calendar & CRM sync', 'Sincronía calendario y CRM') },
      { text: t(lang, 'Smart routing', 'Ruteo inteligente') },
      { text: t(lang, 'Live in 30 days', 'En vivo en 30 días') },
    ],
    placeholder: 'Booking / calendar screenshot',
  },
  {
    blockType: 'metrics',
    items: [
      { value: '0', green: true, label: t(lang, 'Manual scheduling emails', 'Correos de agenda manuales') },
      { value: '24/7', label: t(lang, 'Booking availability', 'Disponibilidad de agenda') },
      { value: '<5 min', green: true, label: t(lang, 'Lead to booked call', 'De lead a llamada agendada') },
      { value: '−40%', label: t(lang, 'Fewer no-shows', 'Menos ausencias') },
    ],
  },
  {
    blockType: 'featureZigzag',
    eyebrow: t(lang, 'How it works', 'Cómo funciona'),
    heading: t(lang, 'From qualified to booked, automatically', 'De calificado a agendado, automáticamente'),
    rows: [
      {
        num: '01',
        title: t(lang, 'The AI qualifies, then offers times', 'La IA califica y ofrece horarios'),
        description: t(
          lang,
          'The moment a lead qualifies, the agent surfaces real-time availability inside the same conversation.',
          'Apenas un lead califica, el agente muestra disponibilidad en tiempo real en la misma conversación.',
        ),
        bullets: [
          { text: t(lang, 'Real-time calendar availability', 'Disponibilidad en tiempo real') },
          { text: t(lang, 'Timezone-aware scheduling', 'Agenda con zona horaria') },
        ],
        placeholder: 'Image',
      },
      {
        num: '02',
        title: t(lang, 'Routed to the right rep', 'Ruteado al rep correcto'),
        description: t(
          lang,
          'Smart rules assign every meeting by territory, product, or round-robin — no overlaps, no gaps.',
          'Reglas inteligentes asignan cada reunión por zona, producto o round-robin — sin choques ni huecos.',
        ),
        bullets: [
          { text: t(lang, 'Territory & round-robin routing', 'Ruteo por zona y round-robin') },
          { text: t(lang, 'Auto-buffer & limits', 'Buffers y límites automáticos') },
        ],
        placeholder: 'Image',
      },
      {
        num: '03',
        title: t(lang, 'Reminders that kill no-shows', 'Recordatorios que eliminan ausencias'),
        description: t(
          lang,
          'Automated email and SMS nudges keep your booked calls booked — and reschedule the rest.',
          'Recordatorios automáticos por email y SMS mantienen tus llamadas — y reprograman el resto.',
        ),
        bullets: [
          { text: t(lang, 'Email + SMS reminders', 'Recordatorios email + SMS') },
          { text: t(lang, 'One-tap reschedule', 'Reprograma con un toque') },
        ],
        placeholder: 'Image',
      },
    ],
  },
  {
    blockType: 'bigQuote',
    glowTop: true,
    quote: t(
      lang,
      'The AI books calls while we sleep. Our calendar is full and nobody on the team touches scheduling anymore.',
      'La IA agenda llamadas mientras dormimos. Nuestro calendario está lleno y nadie del equipo toca la agenda.',
    ),
    authorName: 'Venxel Team',
    authorRole: t(lang, 'Agency Partner', 'Socio de Agencia'),
  },
  miniPricing(lang, {
    eyebrow: t(lang, 'Pricing', 'Precios'),
    heading: t(lang, 'Automated booking comes built-in', 'El agendamiento viene incluido'),
    subtitle: t(
      lang,
      'Included from the Sales Engine plan up — with the $2,000 setup done for you.',
      'Incluido desde el plan Sales Engine — con el setup de $2,000 hecho para ti.',
    ),
  }),
  strategyForm(lang),
  stickyCta(lang),
]

const unifiedCrm = (lang: Lang): Block[] => [
  {
    blockType: 'heroDashboard',
    pillIcon: 'database',
    pillText: t(lang, 'Unified CRM · The "Cerebro"', 'CRM Unificado · El "Cerebro"'),
    titleStart: t(lang, 'Every tool, every contact —', 'Cada herramienta, cada contacto —'),
    titleAccent: t(lang, 'one brain.', 'un cerebro.'),
    accentColor: 'green',
    subtitle: t(
      lang,
      'Stop paying for disconnected tools. The Cerebro unifies your entire stack into one centralized hub with real-time data.',
      'Deja de pagar herramientas desconectadas. El Cerebro unifica todo tu stack en un hub centralizado con datos en tiempo real.',
    ),
    ctaPrimaryLabel: t(lang, 'Get Started', 'Empezar'),
    ctaPrimaryHref: '#pricing',
    ctaSecondaryIcon: 'play',
    ctaSecondaryLabel: t(lang, 'See the Cerebro', 'Ver el Cerebro'),
    ctaSecondaryHref: '#strategy',
    placeholder: 'CRM dashboard screenshot',
  },
  logosCloud(lang, t(lang, 'Connects the tools you already use', 'Conecta las herramientas que ya usas')),
  {
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
  },
  {
    blockType: 'metrics',
    glowTop: true,
    items: [
      { value: '5,000+', label: t(lang, 'Contacts consolidated', 'Contactos consolidados') },
      { value: '1', green: true, label: t(lang, 'Source of truth', 'Fuente de verdad') },
      { value: '0', label: t(lang, 'Disconnected tools', 'Herramientas desconectadas') },
      { value: '$2K', green: true, label: t(lang, 'Setup, done for you', 'Setup, hecho para ti') },
    ],
  },
  {
    blockType: 'timeline',
    eyebrow: t(lang, 'Migration, handled', 'Migración, resuelta'),
    heading: t(lang, "We move you in — you don't lift a finger", 'Te migramos — sin mover un dedo'),
    items: [
      {
        icon: 'search',
        tag: t(lang, 'Audit', 'Auditoría'),
        title: t(lang, 'We map your current stack', 'Mapeamos tu stack actual'),
        description: t(
          lang,
          'Every tool, field and workflow you use today, documented.',
          'Cada herramienta, campo y flujo que usas hoy, documentado.',
        ),
      },
      {
        icon: 'database',
        tag: t(lang, 'Migrate', 'Migración'),
        title: t(lang, 'Clean import into the Cerebro', 'Importación limpia al Cerebro'),
        description: t(
          lang,
          'Contacts, history and automations move over — deduped and structured.',
          'Contactos, historial y automatizaciones se mueven — sin duplicados y estructurados.',
        ),
      },
      {
        icon: 'check',
        tag: t(lang, 'Live', 'En vivo'),
        title: t(lang, 'One hub, fully running', 'Un hub, funcionando'),
        description: t(
          lang,
          'Your team works from a single source of truth from day one.',
          'Tu equipo trabaja desde una sola fuente de verdad desde el día uno.',
        ),
      },
    ],
  },
  miniPricing(lang, {
    eyebrow: t(lang, 'Pricing', 'Precios'),
    heading: t(lang, 'The Cerebro scales with you', 'El Cerebro escala contigo'),
    subtitle: t(
      lang,
      'No hidden fees. Cancel anytime. $2,000 setup included on the Sales Engine plan.',
      'Sin costos ocultos. Cancela cuando quieras. Setup de $2,000 incluido en Sales Engine.',
    ),
  }),
  strategyForm(lang),
  stickyCta(lang),
]

// ---- template demo pages (EN) ----

const sixFeatureCards = (lang: Lang): Block[] => [
  { icon: 'bot', title: t(lang, '24/7 AI Salesman', 'Vendedor IA 24/7'), description: t(lang, 'An intelligent agent that responds and qualifies leads instantly.', 'Un agente que responde y califica leads al instante.') },
  { icon: 'database', title: t(lang, 'Unified CRM', 'CRM Unificado'), description: t(lang, 'All customer data in one centralized hub — the Cerebro.', 'Todos los datos en un solo hub centralizado — el Cerebro.') },
  { icon: 'calendar-check', title: t(lang, 'Automated Booking', 'Agendamiento Automático'), description: t(lang, 'Fill your calendar without manual back-and-forth.', 'Llena tu calendario sin idas y vueltas.') },
  { icon: 'wrench', title: t(lang, 'Expert Engineering', 'Ingeniería Experta'), description: t(lang, 'Our team handles the heavy lifting so you can sell.', 'Nuestro equipo hace el trabajo pesado para que vendas.') },
  { icon: 'bar-chart-3', title: t(lang, 'Real-Time Data', 'Datos en Tiempo Real'), description: t(lang, 'Actionable insight on your pipeline, the moment it changes.', 'Información accionable de tu pipeline, al instante.') },
  { icon: 'zap', title: t(lang, 'Speed-to-Lead', 'Velocidad de Respuesta'), description: t(lang, 'Engineered to respond in under 5 minutes, every time.', 'Diseñado para responder en menos de 5 minutos, siempre.') },
] as unknown as Block[]

const templateCentered = (lang: Lang): Block[] => [
  {
    blockType: 'heroCentered',
    pillIcon: 'sparkles',
    pillText: t(lang, 'Done-for-You Service', 'Servicio Hecho-Para-Ti'),
    titleStart: t(lang, 'The service headline goes here,', 'El titular del servicio va aquí,'),
    titleAccent: t(lang, 'expertly built', 'construido por expertos'),
    titleEnd: t(lang, 'and ready to run.', 'y listo para usar.'),
    accentColor: 'brand',
    subtitle: t(
      lang,
      'A one-line promise that names the outcome and the pain it removes. Placeholder copy you swap per service.',
      'Una promesa de una línea que nombra el resultado y el dolor que elimina. Texto placeholder que cambias por servicio.',
    ),
    ctaPrimaryLabel: t(lang, 'Get Started', 'Empezar'),
    ctaPrimaryHref: '#pricing',
    ctaSecondaryIcon: 'phone-call',
    ctaSecondaryLabel: t(lang, 'Free Strategy Call', 'Llamada Gratis'),
    ctaSecondaryHref: '#strategy',
    micro: [
      { text: t(lang, 'Live in 30 days', 'En vivo en 30 días') },
      { text: t(lang, '$2,000 setup waived', 'Setup de $2,000 exonerado') },
      { text: t(lang, 'Cancel anytime', 'Cancela cuando quieras') },
    ],
  },
  logosCloud(lang, t(lang, 'Trusted by innovative companies worldwide', 'Empresas innovadoras confían en nosotros')),
  {
    blockType: 'featureGrid',
    eyebrow: t(lang, 'The ecosystem', 'El ecosistema'),
    heading: t(lang, 'Everything included in this service', 'Todo lo que incluye este servicio'),
    subtitle: t(
      lang,
      'Stop managing tools. Start managing results with an integrated, done-for-you build.',
      'Deja de gestionar herramientas. Empieza a gestionar resultados con un build integrado y hecho-para-ti.',
    ),
    cards: sixFeatureCards(lang),
  },
  {
    blockType: 'steps',
    eyebrow: t(lang, 'How it works', 'Cómo funciona'),
    heading: t(lang, 'From kickoff to live in 30 days', 'Del arranque a en vivo en 30 días'),
    items: [
      { title: t(lang, 'Strategy call', 'Llamada de estrategia'), description: t(lang, 'We map your pipeline, tools, and goals in a free session.', 'Mapeamos tu pipeline, herramientas y metas en una sesión gratis.') },
      { title: t(lang, '20-hour build', 'Build de 20 horas'), description: t(lang, 'Our engineers configure your custom architecture end to end.', 'Nuestros ingenieros configuran tu arquitectura a medida.') },
      { title: t(lang, 'Go live', 'En vivo'), description: t(lang, 'Your machine runs — qualifying, booking, and scaling 24/7.', 'Tu máquina funciona — califica, agenda y escala 24/7.') },
    ],
  },
  {
    blockType: 'bigQuote',
    quote: t(
      lang,
      'They consolidated my entire database of over 5,000 contacts and gave me real insight into my business.',
      'Consolidaron toda mi base de más de 5,000 contactos y me dieron visión real de mi negocio.',
    ),
    authorName: 'Bella Bellarda',
    authorRole: 'CEO, SM Privé',
  },
  miniPricing(lang, {
    eyebrow: t(lang, 'Pricing', 'Precios'),
    heading: t(lang, 'Simple, transparent pricing', 'Precios simples y transparentes'),
    subtitle: t(lang, 'No hidden fees. Cancel anytime.', 'Sin costos ocultos. Cancela cuando quieras.'),
  }),
  strategyForm(lang),
  stickyCta(lang),
]

const templateSplit = (lang: Lang): Block[] => [
  {
    blockType: 'heroSplit',
    pillIcon: 'layers',
    pillText: t(lang, 'Unified Platform', 'Plataforma Unificada'),
    titleStart: t(lang, 'A bolder headline with the', 'Un titular más audaz con el'),
    titleAccent: t(lang, 'key benefit', 'beneficio clave'),
    titleEnd: t(lang, 'front and center.', 'al frente.'),
    accentColor: 'brand',
    subtitle: t(
      lang,
      "Supporting sentence that quantifies the outcome and removes the buyer's biggest objection.",
      'Frase de apoyo que cuantifica el resultado y elimina la objeción principal.',
    ),
    ctaPrimaryLabel: t(lang, 'Get Started', 'Empezar'),
    ctaPrimaryHref: '#pricing',
    ctaSecondaryLabel: t(lang, 'See how it works', 'Ver cómo funciona'),
    ctaSecondaryHref: '#strategy',
    micro: [
      { text: t(lang, 'No long-term contracts', 'Sin contratos largos') },
      { text: t(lang, 'Live in 30 days', 'En vivo en 30 días') },
    ],
    placeholder: 'Product screenshot',
  },
  {
    blockType: 'metrics',
    items: [
      { value: '<5 min', label: t(lang, 'Average lead response', 'Respuesta promedio') },
      { value: '24/7', green: true, label: t(lang, 'Always-on AI agent', 'Agente IA siempre activo') },
      { value: '30', label: t(lang, 'Days to go live', 'Días para estar en vivo') },
      { value: '$2K', green: true, label: t(lang, 'Setup value, waived', 'Valor de setup, exonerado') },
    ],
  },
  {
    blockType: 'featureZigzag',
    eyebrow: t(lang, 'Capabilities', 'Capacidades'),
    heading: t(lang, 'Built around how you actually sell', 'Construido en torno a cómo vendes'),
    rows: [
      {
        num: '01',
        title: t(lang, 'Capture and qualify, instantly', 'Captura y califica al instante'),
        description: t(lang, 'The AI engages every inbound lead the moment it arrives and scores intent before your team wakes up.', 'La IA atiende cada lead entrante apenas llega y puntúa la intención antes de que tu equipo despierte.'),
        bullets: [
          { text: t(lang, 'Natural, on-brand conversation', 'Conversación natural y de marca') },
          { text: t(lang, 'Automatic enrichment & scoring', 'Enriquecimiento y scoring automático') },
        ],
        placeholder: 'Image',
      },
      {
        num: '02',
        title: t(lang, 'Book meetings on autopilot', 'Agenda reuniones en piloto automático'),
        description: t(lang, 'Qualified leads land directly on the right calendar — no manual back-and-forth, ever.', 'Los leads calificados caen directo en el calendario correcto — sin idas y vueltas.'),
        bullets: [
          { text: t(lang, 'Smart routing by rep & territory', 'Ruteo inteligente por rep y zona') },
          { text: t(lang, 'Reminders that cut no-shows', 'Recordatorios que reducen ausencias') },
        ],
        placeholder: 'Image',
      },
    ],
  },
  {
    blockType: 'tabs',
    eyebrow: t(lang, 'How it works', 'Cómo funciona'),
    heading: t(lang, 'One platform, every stage covered', 'Una plataforma, cada etapa cubierta'),
    tabs: [
      {
        icon: 'zap',
        label: t(lang, 'Capture', 'Captura'),
        title: t(lang, 'Capture every lead', 'Captura cada lead'),
        description: t(lang, 'Forms, ads, DMs and chat all flow into one unified inbox.', 'Formularios, ads, DMs y chat fluyen a una bandeja unificada.'),
        bullets: [
          { text: t(lang, 'Omnichannel intake', 'Entrada omnicanal') },
          { text: t(lang, 'Zero leads lost', 'Cero leads perdidos') },
        ],
        placeholder: 'Screenshot',
      },
      {
        icon: 'filter',
        label: t(lang, 'Qualify', 'Califica'),
        title: t(lang, 'Qualify with AI', 'Califica con IA'),
        description: t(lang, 'The agent asks the right questions and scores fit automatically.', 'El agente hace las preguntas correctas y puntúa el fit automáticamente.'),
        bullets: [{ text: t(lang, 'Custom qualification logic', 'Lógica de calificación a medida') }],
        placeholder: 'Screenshot',
      },
      {
        icon: 'calendar-check',
        label: t(lang, 'Book', 'Agenda'),
        title: t(lang, 'Book automatically', 'Agenda automáticamente'),
        description: t(lang, 'Hot leads schedule themselves onto your calendar in seconds.', 'Los leads calientes se agendan solos en segundos.'),
        bullets: [{ text: t(lang, 'Calendar sync', 'Sincronización de calendario') }],
        placeholder: 'Screenshot',
      },
    ],
  },
  {
    blockType: 'bigQuote',
    quote: t(
      lang,
      'We stopped losing leads overnight. The AI books calls while we sleep — it paid for itself in the first month.',
      'Dejamos de perder leads de un día para otro. La IA agenda llamadas mientras dormimos — se pagó solo el primer mes.',
    ),
    authorName: 'Venxel Team',
    authorRole: t(lang, 'Agency Partner', 'Socio de Agencia'),
  },
  {
    blockType: 'bonusBanner',
    pillText: t(lang, '$2,000 Setup Bonus Included', 'Bono de Setup de $2,000 Incluido'),
    heading: t(lang, 'Get your machine built — free $2,000 setup', 'Construimos tu máquina — setup de $2,000 gratis'),
    body: t(lang, '20 hours of senior engineering, included. Live in 30 days. Capped at 5 Elite builds per month.', '20 horas de ingeniería senior, incluidas. En vivo en 30 días. Solo 5 builds Elite al mes.'),
    ctaPrimaryLabel: t(lang, 'Claim My Engine + $2,000 Bonus', 'Reclamar mi Engine + Bono'),
    ctaPrimaryHref: '#strategy',
    ctaSecondaryLabel: t(lang, 'Free Strategy Call', 'Llamada Gratis'),
    ctaSecondaryHref: '#strategy',
    fine: t(lang, 'Setup subject to client cooperation. Cancel anytime.', 'Setup sujeto a cooperación del cliente. Cancela cuando quieras.'),
  },
  strategyForm(lang),
  stickyCta(lang),
]

const templateDashboard = (lang: Lang): Block[] => [
  {
    blockType: 'heroDashboard',
    pillIcon: 'bar-chart-3',
    pillText: t(lang, 'See it in action', 'Míralo en acción'),
    titleStart: t(lang, 'Your whole pipeline,', 'Todo tu pipeline,'),
    titleAccent: t(lang, 'running itself.', 'funcionando solo.'),
    accentColor: 'green',
    subtitle: t(lang, 'A product-forward headline that lets the dashboard do the selling. Swap the copy per service.', 'Un titular centrado en producto que deja que el dashboard venda. Cambia el texto por servicio.'),
    ctaPrimaryLabel: t(lang, 'Get Started', 'Empezar'),
    ctaPrimaryHref: '#pricing',
    ctaSecondaryIcon: 'play',
    ctaSecondaryLabel: t(lang, 'Watch demo', 'Ver demo'),
    ctaSecondaryHref: '#strategy',
    placeholder: 'Dashboard screenshot',
  },
  logosCloud(lang, t(lang, 'Powering revenue teams across 5 countries', 'Impulsando equipos en 5 países')),
  {
    blockType: 'featureAccordion',
    eyebrow: t(lang, "What's inside", 'Qué incluye'),
    heading: t(lang, 'Every capability, one Cerebro', 'Cada capacidad, un Cerebro'),
    placeholder: 'Feature screenshot',
    items: [
      { icon: 'bot', title: t(lang, '24/7 AI Salesman', 'Vendedor IA 24/7'), body: t(lang, 'An intelligent agent that responds, qualifies and books — instantly, around the clock.', 'Un agente que responde, califica y agenda — al instante, todo el día.') },
      { icon: 'database', title: t(lang, 'Unified CRM', 'CRM Unificado'), body: t(lang, 'Every interaction and contact in one centralized hub that connects your whole stack.', 'Cada interacción y contacto en un hub centralizado que conecta todo tu stack.') },
      { icon: 'calendar-check', title: t(lang, 'Automated Booking', 'Agendamiento Automático'), body: t(lang, 'Qualified leads land on the right calendar with zero manual coordination.', 'Los leads calificados caen en el calendario correcto sin coordinación manual.') },
      { icon: 'bar-chart-3', title: t(lang, 'Real-Time Data', 'Datos en Tiempo Real'), body: t(lang, 'Live dashboards so you never make a pipeline decision blind again.', 'Dashboards en vivo para que nunca decidas a ciegas.') },
    ],
  },
  {
    blockType: 'timeline',
    eyebrow: t(lang, 'The build sprint', 'El sprint de build'),
    heading: t(lang, 'Your 30-day path to live', 'Tu camino de 30 días a producción'),
    items: [
      { icon: 'phone-call', tag: t(lang, 'Day 0', 'Día 0'), title: t(lang, 'Free strategy call', 'Llamada de estrategia gratis'), description: t(lang, 'We map your pipeline, tools and goals — then scope the build.', 'Mapeamos tu pipeline, herramientas y metas — luego definimos el build.') },
      { icon: 'wrench', tag: t(lang, 'Days 1–20', 'Días 1–20'), title: t(lang, '20-hour engineering sprint', 'Sprint de ingeniería de 20 horas'), description: t(lang, 'Our engineers build your custom architecture from the ground up.', 'Nuestros ingenieros construyen tu arquitectura a medida desde cero.') },
      { icon: 'check', tag: t(lang, 'Day 30', 'Día 30'), title: t(lang, 'Go live', 'En vivo'), description: t(lang, 'Your machine runs 24/7 — qualifying, booking and scaling.', 'Tu máquina funciona 24/7 — califica, agenda y escala.') },
    ],
  },
  {
    blockType: 'metrics',
    items: [
      { value: '21×', green: true, label: t(lang, 'More likely to qualify', 'Más probable de calificar') },
      { value: '5,000+', label: t(lang, 'Contacts consolidated', 'Contactos consolidados') },
      { value: '24/7', green: true, label: t(lang, 'Always-on coverage', 'Cobertura siempre activa') },
      { value: '30', label: t(lang, 'Days to live', 'Días a producción') },
    ],
  },
  miniPricing(lang, {
    eyebrow: t(lang, 'Most popular', 'Más popular'),
    heading: t(lang, 'One plan, everything done for you', 'Un plan, todo hecho para ti'),
    subtitle: t(lang, 'The AI CRM Sales Engine includes the full $2,000 done-for-you setup — engineered, not self-serve.', 'El AI CRM Sales Engine incluye el setup completo de $2,000 hecho-para-ti — ingeniería, no autoservicio.'),
    single: true,
  }),
  strategyForm(lang),
  stickyCta(lang),
]

const templateBold = (lang: Lang): Block[] => [
  {
    blockType: 'heroBold',
    pillIcon: 'trending-up',
    pillText: t(lang, 'Built for scale', 'Hecho para escalar'),
    titleStart: t(lang, 'Stop managing tools.', 'Deja de gestionar herramientas.'),
    titleAccent: t(lang, 'Start managing results.', 'Gestiona resultados.'),
    accentColor: 'green',
    subtitle: t(lang, 'An editorial, statement-led hero for the services that need to feel premium and confident.', 'Un hero editorial y contundente para los servicios que deben sentirse premium.'),
    ctaPrimaryLabel: t(lang, 'Get Started', 'Empezar'),
    ctaPrimaryHref: '#pricing',
    ctaSecondaryLabel: t(lang, 'Free Strategy Call', 'Llamada Gratis'),
    ctaSecondaryHref: '#strategy',
    cards: [
      { icon: 'zap', big: '<5 min', label: t(lang, 'Lead response, automated', 'Respuesta automatizada') },
      { icon: 'gift', big: '$2,000', label: t(lang, 'Done-for-you setup, waived', 'Setup hecho-para-ti, exonerado'), green: true },
      { icon: 'rocket', big: '30 days', label: t(lang, 'From kickoff to live', 'Del arranque a en vivo') },
    ],
  },
  {
    blockType: 'featureZigzag',
    rows: [
      {
        num: t(lang, 'The problem', 'El problema'),
        title: t(lang, 'Leads die in the first five minutes', 'Los leads mueren en los primeros cinco minutos'),
        description: t(lang, "Most teams can't respond fast enough, so pipeline leaks before anyone notices.", 'La mayoría no responde a tiempo, y el pipeline se fuga antes de que alguien lo note.'),
        bullets: [
          { text: t(lang, 'No more after-hours leaks', 'Sin fugas fuera de horario') },
          { text: t(lang, 'Every lead worked, always', 'Cada lead atendido, siempre') },
        ],
        placeholder: 'Image',
      },
    ],
  },
  {
    blockType: 'featureGrid',
    splitIntro: true,
    eyebrow: t(lang, 'The solution', 'La solución'),
    heading: t(lang, 'One engineered machine, four moving parts', 'Una máquina, cuatro piezas'),
    subtitle: t(lang, 'Each part is built and configured for you — no setup trap, no DIY headaches.', 'Cada pieza se construye y configura por ti — sin trampa de setup ni dolores de cabeza.'),
    cards: [
      { icon: 'bot', title: t(lang, '24/7 AI Salesman', 'Vendedor IA 24/7'), description: t(lang, 'Responds and qualifies the instant a lead arrives.', 'Responde y califica apenas llega un lead.') },
      { icon: 'database', title: t(lang, 'Unified CRM', 'CRM Unificado'), description: t(lang, 'The Cerebro that connects your entire stack.', 'El Cerebro que conecta todo tu stack.') },
      { icon: 'calendar-check', title: t(lang, 'Automated Booking', 'Agendamiento Automático'), description: t(lang, 'Fills your calendar with zero manual work.', 'Llena tu calendario sin trabajo manual.') },
      { icon: 'wrench', title: t(lang, 'Expert Engineering', 'Ingeniería Experta'), description: t(lang, 'A senior team builds it end to end.', 'Un equipo senior lo construye de extremo a extremo.') },
    ],
  },
  {
    blockType: 'tabs',
    eyebrow: t(lang, 'Use cases', 'Casos de uso'),
    heading: t(lang, 'Made for founders and agencies', 'Para fundadores y agencias'),
    tabs: [
      {
        icon: 'rocket',
        label: t(lang, 'Founders', 'Fundadores'),
        title: t(lang, 'Scale without hiring', 'Escala sin contratar'),
        description: t(lang, 'Add an always-on sales layer instead of more headcount.', 'Suma una capa de ventas siempre activa en vez de más personal.'),
        bullets: [{ text: t(lang, 'Predictable pipeline', 'Pipeline predecible') }],
        placeholder: 'Image',
      },
      {
        icon: 'users',
        label: t(lang, 'Agencies', 'Agencias'),
        title: t(lang, 'Deliver results for clients', 'Entrega resultados a clientes'),
        description: t(lang, 'White-glove automation you can resell with confidence.', 'Automatización white-glove que puedes revender con confianza.'),
        bullets: [{ text: t(lang, 'Multi-client ready', 'Listo para multi-cliente') }],
        placeholder: 'Image',
      },
    ],
  },
  {
    blockType: 'bigQuote',
    quote: t(lang, 'They gave me real insight into my business and consolidated 5,000 contacts.', 'Me dieron visión real de mi negocio y consolidaron 5,000 contactos.'),
    authorName: 'Bella Bellarda',
    authorRole: 'SM Privé',
  },
  {
    blockType: 'bonusBanner',
    pillText: t(lang, '$2,000 Setup Bonus Included', 'Bono de Setup de $2,000 Incluido'),
    heading: t(lang, 'The $2,000 implementation advantage', 'La ventaja de implementación de $2,000'),
    body: t(lang, 'While other CRMs sell you a subscription and wish you luck, we build it for you.', 'Mientras otros CRMs te venden una suscripción y te desean suerte, nosotros lo construimos.'),
    ctaPrimaryLabel: t(lang, 'Claim My Engine + $2,000 Bonus', 'Reclamar mi Engine + Bono'),
    ctaPrimaryHref: '#strategy',
    fine: t(lang, 'Cancel anytime · 5 Elite builds per month.', 'Cancela cuando quieras · 5 builds Elite al mes.'),
  },
  strategyForm(lang),
  stickyCta(lang),
]

// ---------------------------------------------------------------------------
// SEED ENTRY
// ---------------------------------------------------------------------------

interface PageSpec {
  /** EN slug + ES slug. Templates share the same slug across locales. */
  slug: { en: string; es: string }
  title: { en: string; es: string }
  metaTitle: { en: string; es: string }
  metaDescription: { en: string; es: string }
  build: (lang: Lang) => Block[]
}

const PAGES: PageSpec[] = [
  {
    slug: { en: 'automated-booking', es: 'agendamiento-automatizado' },
    title: { en: 'Automated Booking', es: 'Agendamiento Automático' },
    metaTitle: {
      en: 'Automated Booking — Fill your calendar 24/7 | Apturio',
      es: 'Agendamiento Automático — Llena tu calendario 24/7 | Apturio',
    },
    metaDescription: {
      en: 'Qualified leads book themselves onto the right calendar, instantly and 24/7, with reminders that kill no-shows.',
      es: 'Los leads calificados se agendan solos en el calendario correcto, al instante y 24/7, con recordatorios que eliminan ausencias.',
    },
    build: automatedBooking,
  },
  {
    slug: { en: 'unified-crm', es: 'crm-unificado' },
    title: { en: 'Unified CRM', es: 'CRM Unificado' },
    metaTitle: {
      en: 'Unified CRM — One brain for your whole stack | Apturio',
      es: 'CRM Unificado — Un cerebro para todo tu stack | Apturio',
    },
    metaDescription: {
      en: 'The Cerebro unifies your entire stack into one centralized hub with real-time data and a $2,000 done-for-you setup.',
      es: 'El Cerebro unifica todo tu stack en un hub centralizado con datos en tiempo real y un setup de $2,000 hecho para ti.',
    },
    build: unifiedCrm,
  },
  {
    slug: { en: 'templates/centered', es: 'templates/centered' },
    title: { en: 'Service Template — Centered', es: 'Plantilla de Servicio — Centrada' },
    metaTitle: {
      en: 'Service Template — Centered | Apturio',
      es: 'Plantilla de Servicio — Centrada | Apturio',
    },
    metaDescription: {
      en: 'Centered-hero service template composing the Apturio block library.',
      es: 'Plantilla de servicio con hero centrado que compone la librería de bloques de Apturio.',
    },
    build: templateCentered,
  },
  {
    slug: { en: 'templates/split', es: 'templates/split' },
    title: { en: 'Service Template — Split', es: 'Plantilla de Servicio — Split' },
    metaTitle: {
      en: 'Service Template — Split | Apturio',
      es: 'Plantilla de Servicio — Split | Apturio',
    },
    metaDescription: {
      en: 'Split-hero service template composing the Apturio block library.',
      es: 'Plantilla de servicio con hero dividido que compone la librería de bloques de Apturio.',
    },
    build: templateSplit,
  },
  {
    slug: { en: 'templates/dashboard', es: 'templates/dashboard' },
    title: { en: 'Service Template — Dashboard', es: 'Plantilla de Servicio — Dashboard' },
    metaTitle: {
      en: 'Service Template — Dashboard | Apturio',
      es: 'Plantilla de Servicio — Dashboard | Apturio',
    },
    metaDescription: {
      en: 'Dashboard-hero service template composing the Apturio block library.',
      es: 'Plantilla de servicio con hero de dashboard que compone la librería de bloques de Apturio.',
    },
    build: templateDashboard,
  },
  {
    slug: { en: 'templates/bold', es: 'templates/bold' },
    title: { en: 'Service Template — Bold', es: 'Plantilla de Servicio — Bold' },
    metaTitle: {
      en: 'Service Template — Bold | Apturio',
      es: 'Plantilla de Servicio — Bold | Apturio',
    },
    metaDescription: {
      en: 'Bold asymmetric-hero service template composing the Apturio block library.',
      es: 'Plantilla de servicio con hero asimétrico y audaz que compone la librería de bloques de Apturio.',
    },
    build: templateBold,
  },
]

/** Create ONE page document with EN content, then write the ES locale on top. */
const createLocalizedPage = async (payload: Payload, spec: PageSpec): Promise<number | string> => {
  const created = await payload.create({
    collection: 'pages',
    locale: 'en',
    data: {
      title: spec.title.en,
      slug: spec.slug.en,
      layout: spec.build('en'),
      _status: 'published',
      meta: { title: spec.metaTitle.en, description: spec.metaDescription.en },
    } as never,
  })

  await payload.update({
    collection: 'pages',
    id: created.id,
    locale: 'es',
    data: {
      title: spec.title.es,
      slug: spec.slug.es,
      layout: spec.build('es'),
      _status: 'published',
      meta: { title: spec.metaTitle.es, description: spec.metaDescription.es },
    } as never,
  })

  return created.id
}

export const seedServicePages = async (
  payload: Payload,
): Promise<{ created: number; total: number }> => {
  const slugs: string[] = []

  for (const spec of PAGES) {
    await createLocalizedPage(payload, spec)
    slugs.push(`${spec.slug.en} / ${spec.slug.es}`)
  }

  payload.logger.info(`[seed] service pages: created ${slugs.length} docs → ${slugs.join(', ')}`)
  return { created: slugs.length, total: slugs.length }
}
