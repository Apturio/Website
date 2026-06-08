import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import { pageMetadata, SITE_URL, type AppLocale } from '@/lib/site'
import type { PricingPlan } from '@/lib/schema/builders/product'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { PageJsonLd } from '@/components/PageJsonLd'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// Pricing data mirrors production apturio.com/pay-per-use. ES rendering only swaps
// the decimal separator ("." -> ","); labels stay in English on both locales.
const SECTIONS: { section: string; head: string[]; rows: string[][] }[] = [
  {
    section: 'Telecom (Phone & SMS)',
    head: ['Service', 'Price'],
    rows: [
      ['Making calls per min (US/CAN)', '$0.0560'],
      ['Receiving calls per min (US/CAN)', '$0.0340'],
      ['Text messages per segment (US/CAN)', '$0.0332'],
    ],
  },
  {
    section: 'Email',
    head: ['Service', 'Price'],
    rows: [
      ['Send Email (per email)', '$0.0030'],
      ['Email Verification (per email)', '$0.0100'],
    ],
  },
  {
    section: 'WhatsApp',
    head: ['Market', 'Marketing', 'Utility'],
    rows: [
      ['Argentina', '$0.068145', '$0.028665'],
      ['Colombia', '$0.013755', '$0.000840'],
      ['Mexico', '$0.033600', '$0.009345'],
      ['Spain', '$0.067830', '$0.022050'],
      ['North America (US/CAN)', '$0.027615', '$0.003780'],
      ['Rest of Latin America', '$0.081585', '$0.012495'],
    ],
  },
  {
    section: 'Workflow - Premium Features',
    head: ['Feature', 'Price'],
    rows: [['Workflow per execution', '$0.0200']],
  },
  {
    section: 'AI Models',
    head: ['Model', 'Input / 1M Tokens', 'Output / 1M Tokens'],
    rows: [
      ['OpenAI - Chat GPT-5', '$1.3125', '$10.5000'],
      ['OpenAI - Chat GPT-5 Mini', '$0.2625', '$2.1000'],
      ['OpenAI - Chat GPT-4.1', '$2.1000', '$8.4000'],
      ['OpenAI - Chat GPT-4.1 Mini', '$0.4200', '$1.6800'],
    ],
  },
  {
    section: 'AI Voice & TTS',
    head: ['Provider / Service', 'Rate per min'],
    rows: [
      ['AI Voice Engine (Per-Minute Charge)', '$0.04500'],
      ['OpenAI (TTS)', '$0.01575'],
      ['Cartesia (TTS)', '$0.01575'],
      ['ElevenLabs V3', '$0.17850'],
      ['ElevenLabs V2.5', '$0.03675'],
    ],
  },
  {
    section: 'External Voice Models',
    head: ['Provider', 'Model', 'Price / 1M Tokens'],
    rows: [
      ['Google', 'Gemini 2.0 Flash', '$0.1050'],
      ['Google', 'Gemini 2.0 Flash Lite', '$0.0788'],
      ['Google', 'Gemini 2.5 Flash', '$0.3150'],
      ['Google', 'Gemini 2.5 Flash Lite', '$0.1050'],
      ['OpenAI', 'GPT 4o Mini', '$0.1575'],
      ['OpenAI', 'GPT 4o', '$2.6250'],
      ['OpenAI', 'GPT 4.1 Nano', '$0.1050'],
      ['OpenAI', 'GPT 4.1 Mini', '$0.4200'],
      ['OpenAI', 'GPT 4.1', '$2.1000'],
      ['OpenAI', 'GPT 5 Nano', '$0.0525'],
      ['OpenAI', 'GPT 5 Mini', '$0.2625'],
      ['OpenAI', 'GPT 5', '$1.3125'],
      ['Anthropic', 'Claude 4.5 Sonnet', '$3.1500'],
      ['Anthropic', 'Claude 4.0 Sonnet', '$3.1500'],
      ['Anthropic', 'Claude 3.7 Sonnet', '$3.1500'],
      ['Anthropic', 'Claude 3.5 Haiku', '$0.8400'],
    ],
  },
  {
    section: 'Agent Studio & AI Tools',
    head: ['Feature', 'Price'],
    rows: [
      ['Web Search (Tavily)', '$0.0105 / search'],
      ['Workflow AI Actions (Decision, Intent, Summarize, Translate)', '$0.01 / execution'],
      ['Content AI - Image Generation', '$0.06615 / image'],
      ['Content AI - Text Generation', '$0.09923 / 1000 words'],
      ['Reviews AI', '$0.0105 / review'],
    ],
  },
  {
    section: 'Multimodal & Specialized Models',
    head: ['Type', 'Model', 'Price'],
    rows: [
      ['Video', 'Gemini Veo3 Fast', '$0.16 / second'],
      ['Video', 'Gemini Veo3', '$0.42 / second'],
      ['Image (Standard)', 'DALL-E 3 (1024x1024)', '$0.04 / image'],
      ['Image (Standard)', 'DALL-E 3 (1024x1536 / 1536x1024)', '$0.08 / image'],
      ['Image (HD)', 'DALL-E 3 HD (1024x1024)', '$0.08 / image'],
      ['Image (HD)', 'DALL-E 3 HD (1024x1536 / 1536x1024)', '$0.13 / image'],
      ['Speech (LLM+TTS)', 'OpenAI gpt-4o-mini-tts', '$12.60 / 1M Token (Audio)'],
    ],
  },
]

export function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const es = lang === 'es'
  return pageMetadata({
    locale: lang as AppLocale,
    path: '/pay-per-use',
    title: es ? 'Precios de Pago por Uso | Apturio' : 'Pay-Per-Use Pricing | Apturio',
    description: es
      ? 'Desglose detallado de nuestros costos variables de pago por uso.'
      : 'Detailed breakdown of our pay-per-use variable pricing.',
  })
}

export default async function PayPerUsePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  setRequestLocale(lang)
  const es = lang === 'es'

  const fmt = (cell: string) => (es ? cell.replace(/\$(\d+)\.(\d+)/g, '$$$1,$2') : cell)

  // Representative variable-usage line items → Product per item (content-match,
  // Pitfall 1: prices come straight from the visible SECTIONS above; unitText reflects
  // the billing unit). Numeric prices use schema.org dot-decimal regardless of ES display.
  const url = `${SITE_URL}/${lang}/pay-per-use`
  const plans: PricingPlan[] = [
    { name: 'Making calls per min (US/CAN)', price: '$0.0560', description: 'Outbound calls (US/CAN)', unitText: 'per minute', pageUrl: url },
    { name: 'Receiving calls per min (US/CAN)', price: '$0.0340', description: 'Inbound calls (US/CAN)', unitText: 'per minute', pageUrl: url },
    { name: 'Text messages per segment (US/CAN)', price: '$0.0332', description: 'SMS per segment (US/CAN)', unitText: 'per segment', pageUrl: url },
    { name: 'Send Email (per email)', price: '$0.0030', description: 'Email send', unitText: 'per email', pageUrl: url },
    { name: 'Email Verification (per email)', price: '$0.0100', description: 'Email verification', unitText: 'per email', pageUrl: url },
    { name: 'Workflow per execution', price: '$0.0200', description: 'Premium workflow execution', unitText: 'per execution', pageUrl: url },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href={`/${lang}`} className="inline-flex items-center text-slate-400 hover:text-white mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {es ? 'Volver al Inicio' : 'Back to Home'}
          </Link>
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Pay-Per-Use Pricing</h1>
            <p className="text-slate-400 text-lg">
              {es
                ? 'Desglose detallado de costos variables (Actualizado Mayo 2026).'
                : 'Detailed breakdown of variable costs (Updated May 2026).'}
            </p>
          </div>

          <div className="space-y-16">
            {SECTIONS.map((s) => (
              <section key={s.section}>
                <h2 className="text-2xl font-bold mb-6 text-white border-b border-border pb-2">{s.section}</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {s.head.map((h, i) => (
                        <TableHead key={i} className={i === s.head.length - 1 ? 'text-right' : ''}>{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {s.rows.map((row, ri) => (
                      <TableRow key={ri}>
                        {row.map((cell, ci) => (
                          <TableCell key={ci} className={ci === row.length - 1 ? 'text-right' : ''}>{fmt(cell)}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <PageJsonLd
        kind="pricing"
        locale={lang as AppLocale}
        url={url}
        title="Pay-Per-Use Pricing"
        plans={plans}
      />
    </div>
  )
}
