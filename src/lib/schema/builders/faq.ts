// No rich result in Google Search as of May 2026. Retained for AI crawler citability (ChatGPT, Perplexity, Claude).
import type { AppLocale } from '@/lib/site'
import type { FAQPage, WithContext } from 'schema-dts'

/**
 * One FAQ entry. `answer` is the raw CMS textarea which may embed link tokens like
 * `[/pay-per-use]` / `[/add-ons]` — these are stripped to plain visible text so the
 * emitted JSON-LD matches the rendered FAQ (Pitfall 1 content-match, T-15-08).
 */
export interface FaqItem {
  question: string
  answer: string
}

/** Cap mainEntity to keep payload lean (PITFALLS Performance Traps). */
const MAX_ITEMS = 18

/**
 * Strip the `[/path]` link-token markup the FaqBlock answers carry (e.g.
 * `[/pay-per-use]`, `[/add-ons]`) so the schema text matches the visible rendered
 * answer. Collapses any leftover double spaces produced by the removal.
 */
function cleanAnswer(answer: string): string {
  return answer
    .replace(/\[\/[^\]]*\]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

/**
 * FAQPage emitting Question/Answer pairs for pages carrying a FaqBlock. Pure builder.
 *
 * `inLanguage` is required (Pitfall 7). Tokens are cleaned to plain text and the list
 * is capped at the first {@link MAX_ITEMS} entries.
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
        text: cleanAnswer(item.answer),
      },
    })),
  }
}
