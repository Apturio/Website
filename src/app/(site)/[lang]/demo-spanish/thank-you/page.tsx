// noindex page — no page-specific JSON-LD
import type { Metadata } from 'next'
import { CheckCircle2, Bot } from 'lucide-react'
import { setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import { pageMetadata, type AppLocale } from '@/lib/site'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  return pageMetadata({
    locale: lang as AppLocale,
    path: '/demo-spanish/thank-you',
    title: '¡Gracias! - Apturio',
    description: 'Tu demo está en camino.',
    noindex: true,
  })
}

export default async function DemoThankYouPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  setRequestLocale(lang)

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 selection:bg-primary/30">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold font-heading tracking-tight">Apturio</span>
          </div>
        </div>

        <Card className="border-primary/20 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] shadow-primary/10 text-center">
          <CardHeader className="space-y-4 pt-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">¡Tu demo está en camino!</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <p className="text-muted-foreground text-lg">
              Revisa tu bandeja de entrada en los próximos minutos. Te hemos enviado el enlace de acceso directo al correo que proporcionaste.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
