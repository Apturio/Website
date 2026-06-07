import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import { pageMetadata, type AppLocale } from '@/lib/site'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'

export function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: 'seo.thankyou' })
  return pageMetadata({
    locale: lang as AppLocale,
    path: '/thank-you',
    title: t('title'),
    description: t('description'),
    noindex: true,
  })
}

export default async function ThankYouPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang })
  const steps = t.raw('thankyou.steps') as string[]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="container max-w-2xl text-center space-y-8 animate-fade-in-up">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-[#37ca37]/10 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-[#37ca37]" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{t('thankyou.title')}</h1>
            <p className="text-xl text-slate-400">{t('thankyou.subtitle')}</p>
          </div>

          <div className="p-8 rounded-2xl bg-[#111111] border border-white/10 text-left space-y-4 max-w-md mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6366f1] to-[#37ca37]"></div>
            <h3 className="text-lg font-semibold text-white">{t('thankyou.nextSteps')}</h3>
            <ul className="space-y-4 text-slate-400">
              {steps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-[#37ca37] font-bold">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8">
            <Link href={`/${lang}`}>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl">
                {t('thankyou.button')}
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
