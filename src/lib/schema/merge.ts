import type { Thing, WithContext } from 'schema-dts'

/**
 * Shallow-spreads an editor-supplied JSON-LD override over the auto-generated PRIMARY node.
 *
 * Merge semantics (locked decision): override wins, and **arrays are replaced, not merged** —
 * a single shallow spread `{ ...auto, ...override }`. A `@type` present in the override fully
 * replaces the auto `@type` (e.g. an override can turn a `WebPage` into a more specific node).
 *
 * The override is a validated plain object carrying `@type`: the Payload `validate` hook on
 * the `jsonLdOverride` field (Plan 16-01) guarantees the shape and rejects blocked anti-spam
 * keys, so this transform stays pure — no validation, no I/O, no serialization here.
 * Serialization happens later, only inside `JsonLdScript`/`safeSerialize` (the single XSS
 * choke point).
 *
 * If `override` is falsy or not an object, `auto` is returned unchanged.
 */
export function applyJsonLdOverride(
  auto: WithContext<Thing>,
  override: unknown,
): WithContext<Thing> {
  if (!override || typeof override !== 'object') return auto
  return {
    ...(auto as Record<string, unknown>),
    ...(override as Record<string, unknown>),
  } as WithContext<Thing>
}
