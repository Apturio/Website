import type { Field } from 'payload'

/**
 * Keys that must never appear in an editor-supplied JSON-LD override — at any depth.
 *
 * - aggregateRating / review / reviews: fake ratings trigger a Google manual action
 *   (Apturio has no verified review profile yet; see CONTEXT SCHEMA-15 / Pitfall "manual action").
 * - potentialAction / SearchAction: Sitelinks Searchbox was discontinued by Google (Nov 2024);
 *   emitting it is dead markup and is blocked system-wide for coherence.
 */
const BLOCKED_KEYS = ['aggregateRating', 'review', 'reviews', 'potentialAction', 'SearchAction']

/**
 * @type VALUES that must never appear in an editor-supplied override — at any depth.
 *
 * The key-based block (BLOCKED_KEYS) only catches fake ratings expressed as the
 * PROPERTY `aggregateRating`/`review`. An admin could bypass it by injecting a NODE
 * with `@type: "AggregateRating"` / `"Review"` / `"Reviews"` instead — the exact
 * fake-rating content SCHEMA-15 / Pitfall "manual action" is meant to stop. This
 * closes that bypass. Matched case-insensitively against a string or array @type.
 */
const BLOCKED_TYPES = ['aggregaterating', 'review', 'reviews']

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Depth-first walk over every nested object and every array element.
 * Returns the first blocked key OR blocked `@type` value found at any depth,
 * or null if the node is clean.
 */
function findBlockedKey(node: unknown): string | null {
  if (Array.isArray(node)) {
    for (const item of node) {
      const hit = findBlockedKey(item)
      if (hit) return hit
    }
    return null
  }
  if (isPlainObject(node)) {
    // Block by @type VALUE (string or array of strings), case-insensitive.
    const t = node['@type']
    const types = Array.isArray(t) ? t : [t]
    for (const x of types) {
      if (typeof x === 'string' && BLOCKED_TYPES.includes(x.toLowerCase())) {
        return `@type:${x}`
      }
    }
    // Block by property NAME.
    for (const key of Object.keys(node)) {
      if (BLOCKED_KEYS.includes(key)) return key
      const hit = findBlockedKey(node[key])
      if (hit) return hit
    }
  }
  return null
}

/**
 * Pure validator for the jsonLdOverride field.
 *
 * Payload `validate` contract: return `true` on pass, or a string error message on fail.
 * Kept dependency-free so it runs standalone under `node --experimental-strip-types`.
 */
export function validateJsonLdOverride(value: unknown): true | string {
  // (1) Field is optional — empty values pass.
  if (value === null || value === undefined) return true

  // (2) Must be a plain object (a single JSON-LD node), never an array or primitive.
  if (!isPlainObject(value)) {
    return 'JSON-LD override must be a single JSON object (not an array or primitive).'
  }

  // (3) Must declare an @type so the merge can replace the auto-generated node coherently.
  if (!('@type' in value)) {
    return 'JSON-LD override must include an "@type" property.'
  }

  // (4) Anti-spam backstop: reject blocked keys at any nesting depth.
  const blocked = findBlockedKey(value)
  if (blocked) {
    return `JSON-LD override may not contain "${blocked}". Property names aggregateRating, review, reviews, potentialAction and SearchAction, AND nodes whose "@type" is AggregateRating, Review or Reviews (case-insensitive), are blocked at any depth to prevent fake ratings / dead markup (Google manual action risk).`
  }

  return true
}

export const jsonLdOverrideField: Field = {
  name: 'jsonLdOverride',
  type: 'json',
  validate: validateJsonLdOverride,
  admin: {
    // single-role auth today; if RBAC is added, refine to user?.role === 'admin'
    condition: (_data, _siblingData, { user }) => Boolean(user),
    description:
      'Advanced: a raw JSON-LD object shallow-merged over this page’s auto-generated schema. ' +
      'Override wins on conflicting keys and arrays are REPLACED, not extended. ' +
      'Policy: the override MUST match the visible page content — mismatched or fake markup ' +
      '(ratings, reviews, searchboxes) triggers a Google manual action. ' +
      'aggregateRating, review, reviews, potentialAction and SearchAction are rejected on save at any depth. ' +
      'Must be a single object including an "@type".',
  },
}
