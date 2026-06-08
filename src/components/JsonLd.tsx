import type { Product, WithContext } from 'schema-dts'

import { SITE_URL, SITE_NAME } from '@/lib/site'
import { JsonLdScript } from '@/components/JsonLdScript'

interface PricingOffer {
  name: string
  price: string
}

/** Product + Offer list. Rendered on pricing surfaces (home, pay-per-use). */
export function PricingJsonLd({ offers }: { offers: PricingOffer[] }) {
  const data: WithContext<Product> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${SITE_NAME} AI CRM`,
    description:
      'Done-for-You AI-Powered Sales Machine: a turnkey AI CRM that qualifies leads, manages your pipeline, and books appointments 24/7.',
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: offers.map((o) => ({
      '@type': 'Offer',
      name: o.name,
      price: o.price.replace(/[^0-9.]/g, ''),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: SITE_URL,
    })),
  }

  return <JsonLdScript data={data} />
}
