import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import { pageMetadata, type AppLocale } from '@/lib/site'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const ADD_ONS = [
  { name: 'Whatsapp Connector', price: '$29.99' },
  { name: 'WordPress', price: '$14.99' },
  { name: 'AI Employee (Unlimited AI)*', price: '$200.00' },
  { name: 'Workflow Pro - Pricing Tiers - Starter', price: '$20.00' },
  { name: 'Workflow Pro - Pricing Tiers - Growth', price: '$50.00' },
  { name: 'Workflow Pro - Pricing Tiers - Scale', price: '$100.00' },
  { name: 'Dedicated IP', price: '$150.00' },
  { name: 'Ad Manager', price: '$97.00' },
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
    path: '/add-ons',
    title: es ? 'Precios de Complementos (Add-Ons) | Apturio' : 'Add-Ons Pricing | Apturio',
    description: es
      ? 'Desglose detallado de nuestros complementos premium y precios mensuales.'
      : 'Detailed breakdown of our premium add-ons and monthly pricing.',
  })
}

export default async function AddOnsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  setRequestLocale(lang)
  const es = lang === 'es'

  const formatPrice = (price: string) => (es ? price.replace('.', ',') : price)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href={`/${lang}`} className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {es ? 'Volver al Inicio' : 'Back to Home'}
          </Link>
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading text-white">
              {es ? 'Precios de Complementos (Add-Ons)' : 'Add-Ons Pricing'}
            </h1>
            <p className="text-slate-400 text-lg">
              {es
                ? 'Desglose detallado de nuestros complementos premium (Actualizado Mayo 2026).'
                : 'Detailed breakdown of our premium add-ons (Updated May 2026).'}
            </p>
            <p className="text-xs text-slate-500 mt-4 italic">
              {es ? 'Nota: Todos los precios son por mes y están sujetos a cambios.' : 'Note: All prices are per month and subject to change.'}
            </p>
          </div>

          <div className="space-y-16">
            <section>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-slate-300">{es ? 'Complemento (Add-On)' : 'Add-On'}</TableHead>
                    <TableHead className="text-right text-slate-300">{es ? 'Precio por mes' : 'Price per month'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ADD_ONS.map((addon, index) => (
                    <TableRow key={index} className="border-border/50 hover:bg-white/5">
                      <TableCell className="text-slate-400">{addon.name}</TableCell>
                      <TableCell className="text-right text-white font-medium">{formatPrice(addon.price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </section>
            <div className="mt-8">
              <p className="text-xs text-slate-500 italic">
                * {es
                  ? 'El uso de Empleados IA (IA Ilimitada) está sujeto a una política de uso justo (fair usage policy).'
                  : 'AI Employee (Unlimited AI) is subject to a fair usage policy.'}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
