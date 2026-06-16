/**
 * Serializes a JSON-LD object for inlining inside a `<script type="application/ld+json">`
 * tag via `dangerouslySetInnerHTML`.
 *
 * CMS-sourced strings (Payload editor content) will flow into schema objects in Phase 15.
 * A naked `JSON.stringify` would let a value containing `</script>` break out of the
 * wrapping script tag and inject markup (XSS). The four unicode escapes below neutralize
 * that vector: `<` and `>` prevent tag breakout, `&` prevents HTML entity tricks, and `'`
 * hardens against attribute-context injection. All four are load-bearing — do not drop any.
 */
export function safeSerialize(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003C') // prevents </script> injection from CMS-sourced strings
    .replace(/>/g, '\\u003E')
    .replace(/&/g, '\\u0026')
    .replace(/'/g, '\\u0027')
}
