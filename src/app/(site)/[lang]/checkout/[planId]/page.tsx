import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, ArrowLeft, ShieldCheck } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import { pageMetadata, type AppLocale } from '@/lib/site'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const PLAN_IDS = ['foundation', 'engine', 'growth'] as const
type PlanId = (typeof PLAN_IDS)[number]

export function generateStaticParams() {
  return routing.locales.flatMap((lang) =>
    PLAN_IDS.map((planId) => ({ lang, planId })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: 'seo.checkout' })
  return pageMetadata({
    locale: lang as AppLocale,
    path: '/checkout',
    title: t('title'),
    description: t('description'),
    noindex: true,
  })
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ lang: string; planId: string }>
}) {
  const { lang, planId } = await params
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang })
  const es = lang === 'es'

  const plans: Record<PlanId, {
    name: string
    price: string
    features: string[]
    setupFee: string
    checkoutUrl: string
  }> = {
    foundation: {
      name: t('pricing.plans.foundation.name'),
      price: '$199',
      features: t.raw('pricing.plans.foundation.features') as string[],
      setupFee: '$0',
      checkoutUrl: es
        ? 'https://links.apturio.com/payment-link/69e8b657557558e89e521e88'
        : 'https://links.apturio.com/payment-link/69e2176b7dd3512d92076d84',
    },
    engine: {
      name: t('pricing.plans.engine.name'),
      price: '$299',
      features: t.raw('pricing.plans.engine.features') as string[],
      setupFee: t('checkout.waived'),
      checkoutUrl: es
        ? 'https://links.apturio.com/payment-link/69e8b6e0557558e89e521e95'
        : 'https://links.apturio.com/payment-link/69ae32b51e61216a847af5d0',
    },
    growth: {
      name: t('pricing.plans.growth.name'),
      price: '$699',
      features: t.raw('pricing.plans.growth.features') as string[],
      setupFee: t('checkout.waived'),
      checkoutUrl: es
        ? 'https://links.apturio.com/payment-link/69e8b750557558e89e521eb2'
        : 'https://links.apturio.com/payment-link/69e4c8a97dd3512d9207747b',
    },
  }

  const plan = plans[(planId as PlanId)] ?? plans.engine

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link href={`/${lang}#pricing`} className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('checkout.back')}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{t('checkout.title')}</h1>
                <p className="text-slate-400">{t('checkout.subtitle').replace('{planName}', plan.name)}</p>
              </div>

              <div className="space-y-6">
                <iframe
                  src={plan.checkoutUrl}
                  className="w-full min-h-[800px] border-0 rounded-[20px] bg-white/5"
                  title={`Checkout for ${plan.name}`}
                />
                <div className="flex items-center justify-center gap-2 text-sm text-slate-400 mt-4">
                  <ShieldCheck className="h-4 w-4 text-[#37ca37]" />
                  {t('checkout.secure')}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-card border border-border rounded-[20px] p-8 sticky top-32">
                <h3 className="text-xl font-bold text-white mb-6">{t('checkout.summary')}</h3>

                <div className="flex justify-between items-start mb-6 pb-6 border-b border-border">
                  <div>
                    <div className="font-bold text-white text-lg">{plan.name}</div>
                    <div className="text-sm text-slate-400 mt-1">{t('checkout.billedMonthly')}</div>
                  </div>
                  <div className="text-2xl font-bold text-white">{plan.price}</div>
                </div>

                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">{t('checkout.subtotal')}</span>
                    <span className="text-white">{plan.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">{t('checkout.implementationFee')}</span>
                    <span className="text-[#37ca37] font-bold">{plan.setupFee}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-white font-bold">{t('checkout.totalDue')}</span>
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">{t('checkout.included')}</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-400">
                        <Check className="h-5 w-5 shrink-0 text-[#37ca37]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
