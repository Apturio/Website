import { SITE_URL, SITE_NAME } from '@/lib/site'

// Server Component: emits a JSON-LD <script>. No client state — safe to render
// anywhere in the server tree.
function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inline; no user input flows here.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

const LOGO = 'https://vibe.filesafe.space/1775831502235366632/attachments/965b91f8-1e00-4fc8-acf4-8021d0d6fdcd.png'

const SAME_AS = [
  'https://wa.me/15614731298',
  'https://links.apturio.com',
]

/** Organization + SoftwareApplication. Rendered once in the [lang] layout. */
export function OrganizationJsonLd() {
  return (
    <>
      <JsonLdScript
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
          logo: LOGO,
          sameAs: SAME_AS,
        }}
      />
      <JsonLdScript
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: SITE_NAME,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          url: SITE_URL,
          sameAs: SAME_AS,
          offers: {
            '@type': 'Offer',
            price: '199',
            priceCurrency: 'USD',
          },
        }}
      />
    </>
  )
}

interface PricingOffer {
  name: string
  price: string
}

/** Product + Offer list. Rendered on pricing surfaces (home, pay-per-use). */
export function PricingJsonLd({ offers }: { offers: PricingOffer[] }) {
  return (
    <JsonLdScript
      data={{
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
      }}
    />
  )
}
