/**
 * Deterministic slugify used by the Posts/Pages/Categories/Authors `beforeValidate`
 * auto-slug hook and by the seed script. Keeps a stable, URL-safe form for both EN
 * and ES titles (strips accents).
 */
export function slugify(input: string): string {
  return input
    .replace(/ñ/g, 'n')
    .replace(/Ñ/g, 'N')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritical marks (á -> a)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // non-alphanumerics -> hyphen
    .replace(/-{2,}/g, '-') // collapse repeats
    .replace(/^-+|-+$/g, '') // trim leading/trailing hyphens
}
