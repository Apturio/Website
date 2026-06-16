// No rich result in Google Search as of May 2026. Retained for AI crawler citability (ChatGPT, Perplexity, Claude).
import type { AppLocale } from '@/lib/site'
import type { FAQPage, WithContext } from 'schema-dts'

/**
 * One FAQ entry. `answer` is the raw CMS textarea which may embed link tokens like
 * `[/pay-per-use]` / `[/add-ons]` — these are resolved to the SAME visible anchor
 * label the accordion renders so the emitted JSON-LD matches the rendered FAQ
 * (Pitfall 1 content-match, T-15-08).
 */
export interface FaqItem {
  question: string
  answer: string
}

/** Cap mainEntity to keep payload lean (PITFALLS Performance Traps). */
const MAX_ITEMS = 18

/**
 * Resolve the `[/path]` link-token markup the FaqBlock answers carry to plain text
 * that matches the visible rendered answer. The two known tokens (`[/pay-per-use]`,
 * `[/add-ons]`) are SUBSTITUTED with the same locale-aware anchor label the visible
 * accordion (`FAQ.tsx`) inserts — `"detailed pricing breakdown"` (EN) /
 * `"desglose detallado de precios"` (ES) — so schema text == rendered text. Any
 * unknown `[/...]` token is stripped as a fallback. Collapses leftover double
 * spaces and trims.
 */
function cleanAnswer(answer: string, locale: AppLocale): string {
  const label = locale === 'es' ? 'desglose detallado de precios' : 'detailed pricing breakdown'
  return answer
    .replace(/\[\/(?:pay-per-use|add-ons)\]/g, label)
    .replace(/\[\/[^\]]*\]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

/**
 * FAQPage emitting Question/Answer pairs for pages carrying a FaqBlock. Pure builder.
 *
 * `inLanguage` is required (Pitfall 7). Tokens are resolved to their locale-aware
 * visible label and the list is capped at the first {@link MAX_ITEMS} entries.
 */
export function buildFaqPage(questions: FaqItem[], locale: AppLocale): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale,
    mainEntity: questions.slice(0, MAX_ITEMS).map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: cleanAnswer(item.answer, locale),
      },
    })),
  }
}
