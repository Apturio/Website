import assert from 'node:assert/strict'

import { validateJsonLdOverride } from '../src/collections/fields/jsonLdOverride.ts'

// --- Optional field: null / undefined pass ---
assert.equal(validateJsonLdOverride(null), true, 'null should pass (field optional)')
assert.equal(validateJsonLdOverride(undefined), true, 'undefined should pass (field optional)')

// --- Must be a plain object, not an array ---
assert.equal(
  typeof validateJsonLdOverride([{ '@type': 'Service' }]),
  'string',
  'array should be rejected with an error string',
)
assert.equal(
  typeof validateJsonLdOverride('not an object'),
  'string',
  'string primitive should be rejected with an error string',
)

// --- Must carry an @type ---
assert.equal(
  typeof validateJsonLdOverride({ name: 'No type here' }),
  'string',
  'object without @type should be rejected',
)

// --- Blocked keys at the top level ---
assert.equal(
  typeof validateJsonLdOverride({ '@type': 'Service', aggregateRating: { ratingValue: 5 } }),
  'string',
  'top-level aggregateRating should be rejected',
)

// --- Blocked keys at ANY nesting depth (nested objects) ---
assert.equal(
  typeof validateJsonLdOverride({
    '@type': 'Service',
    provider: { '@type': 'Organization', review: { '@type': 'Review' } },
  }),
  'string',
  'nested review should be rejected',
)
assert.equal(
  typeof validateJsonLdOverride({
    '@type': 'Service',
    offers: { details: { reviews: [] } },
  }),
  'string',
  'deeply nested reviews should be rejected',
)
assert.equal(
  typeof validateJsonLdOverride({
    '@type': 'WebSite',
    potentialAction: { '@type': 'SearchAction' },
  }),
  'string',
  'potentialAction should be rejected',
)

// --- Blocked keys inside array elements ---
assert.equal(
  typeof validateJsonLdOverride({
    '@type': 'Service',
    items: [{ name: 'ok' }, { '@type': 'Thing', SearchAction: {} }],
  }),
  'string',
  'SearchAction inside an array element should be rejected',
)
assert.equal(
  typeof validateJsonLdOverride({
    '@type': 'Service',
    graph: [{ nested: [{ potentialAction: {} }] }],
  }),
  'string',
  'potentialAction inside nested arrays should be rejected',
)

// --- Valid override passes ---
assert.equal(
  validateJsonLdOverride({ '@type': 'Service', name: 'Custom Service' }),
  true,
  'a clean override with @type should pass',
)

console.log('PASS: validateJsonLdOverride — all assertions green')
