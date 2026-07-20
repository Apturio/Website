import type { Block } from 'payload'

/** StrategyFormBlock — strategy-call capture (.strat / .strat-form). Static stub. */
export const StrategyFormBlock: Block = {
  slug: 'strategyForm',
  interfaceName: 'StrategyFormBlock',
  labels: { singular: 'Strategy Form', plural: 'Strategy Forms' },
  imageURL: '/block-previews/strategyForm.png',
  imageAltText: 'Strategy Form block preview',
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'Free Strategy Call' },
    { name: 'heading', type: 'text', required: true, defaultValue: 'Book your free strategy call' },
    {
      name: 'body',
      type: 'textarea',
      defaultValue:
        'Tell us where you are. An Apturio engineer will map your turnkey setup — no commitment.',
    },
    {
      name: 'bullets',
      type: 'array',
      labels: { singular: 'Bullet', plural: 'Bullets' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'labels',
      type: 'group',
      admin: { description: 'Form field labels and placeholders (seed per-locale).' },
      fields: [
        { name: 'name', type: 'text', defaultValue: 'Full name' },
        { name: 'namePlaceholder', type: 'text', defaultValue: 'Jane Founder' },
        { name: 'company', type: 'text', defaultValue: 'Company' },
        { name: 'companyPlaceholder', type: 'text', defaultValue: 'Acme Inc.' },
        { name: 'email', type: 'text', defaultValue: 'Work email' },
        { name: 'emailPlaceholder', type: 'text', defaultValue: 'you@company.com' },
        { name: 'leads', type: 'text', defaultValue: 'Monthly leads' },
        { name: 'submit', type: 'text', defaultValue: 'Request my call' },
        { name: 'fine', type: 'text', defaultValue: 'No commitment · We reply within 1 business day.' },
        { name: 'success', type: 'text', defaultValue: "Thanks — we'll be in touch within 1 business day." },
      ],
    },
    {
      name: 'leadOptions',
      type: 'array',
      labels: { singular: 'Lead option', plural: 'Lead options' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
  ],
}
