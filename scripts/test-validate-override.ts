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

// --- Blocked @type VALUES at any depth (WR-01: bypass via @type, not property name) ---
// These nodes carry NO blocked property name (aggregateRating/review), so they would
// slip past a purely key-based check — they must be rejected by @type value.
assert.equal(
  typeof validateJsonLdOverride({
    '@type': 'Product',
    mainEntity: { '@type': 'AggregateRating', ratingValue: 5, reviewCount: 99 },
  }),
  'string',
  'nested @type AggregateRating should be rejected',
)
assert.equal(
  typeof validateJsonLdOverride({ '@type': 'Review', reviewRating: { '@type': 'Rating' } }),
  'string',
  'top-level @type Review should be rejected',
)
assert.equal(
  typeof validateJsonLdOverride({
    '@type': 'Service',
    items: [{ name: 'ok' }, { '@type': ['Thing', 'Reviews'] }],
  }),
  'string',
  '@type array containing Reviews inside an array element should be rejected',
)
// Case-insensitive: lowercased @type value must still be caught.
assert.equal(
  typeof validateJsonLdOverride({ '@type': 'Product', mainEntity: { '@type': 'aggregaterating' } }),
  'string',
  'lowercased @type aggregaterating should be rejected (case-insensitive)',
)

// --- Valid override passes ---
assert.equal(
  validateJsonLdOverride({ '@type': 'Service', name: 'Custom Service' }),
  true,
  'a clean override with @type should pass',
)
// A legit node with a benign @type and nested objects is still accepted.
assert.equal(
  validateJsonLdOverride({
    '@type': 'Product',
    name: 'Plan A',
    brand: { '@type': 'Organization', name: 'Apturio' },
  }),
  true,
  'a clean Product with a nested Organization should pass',
)

console.log('PASS: validateJsonLdOverride — all assertions green')
