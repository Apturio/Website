/**
 * Links the Clinics and Academies landings in the navigation global. Both pages are published and
 * listed in the sitemap, but their menu items had no href and stayed "coming soon", so no page on the
 * site linked to them (Search Console: "Discovered - currently not indexed", no referring URLs).
 *
 *   npx payload run scripts/link-vertical-landings.ts            # dry run
 *   APPLY=1 npx payload run scripts/link-vertical-landings.ts    # write (backup first)
 *
 * The navigation helper still shows "coming soon" for any locale where the page has no content,
 * so English visitors do not get a link to a 404.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { getPayload } from 'payload'
import config from '@payload-config'

const APPLY = process.env.APPLY === '1'
const TARGETS: Record<string, string> = {
  clinics: '/crm-para-clinicas',
  clinicas: '/crm-para-clinicas',
  academies: '/crm-para-academias',
  academias: '/crm-para-academias',
}
const norm = (s: unknown) =>
  String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

const payload = await getPayload({ config })
console.log(`host: ${new URL(process.env.DATABASE_URI ?? '').host}  mode: ${APPLY ? 'APPLY' : 'dry run'}`)

const backup: Record<string, unknown> = {}
for (const locale of ['en', 'es'] as const) {
  const nav = (await payload.findGlobal({ slug: 'navigation', locale, depth: 0, overrideAccess: true })) as Record<string, any>
  backup[locale] = JSON.parse(JSON.stringify(nav))
  let changed = 0
  const visit = (items: any[] | undefined) => {
    for (const it of items ?? []) {
      const href = TARGETS[norm(it.label)]
      if (href && (!it.href || it.status !== 'live')) {
        console.log(`  [${locale}] ${it.label}: href ${it.href} -> ${href}, status ${it.status} -> live`)
        it.href = href
        it.status = 'live'
        changed++
      }
      visit(it.children)
    }
  }
  for (const m of nav.megaMenus ?? []) for (const c of m.columns ?? []) visit(c.items)
  for (const c of nav.footerColumns ?? []) {
    visit(c.items)
    visit(c.subgroupItems)
  }
  visit(nav.directLinks)
  console.log(`[${locale}] items to change: ${changed}`)
  if (APPLY && changed) {
    mkdirSync('seo-audit', { recursive: true })
    await payload.updateGlobal({ slug: 'navigation', locale, data: nav as never, overrideAccess: true })
    console.log(`[${locale}] updated`)
  }
}
if (APPLY) {
  const file = `seo-audit/navigation-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  writeFileSync(file, JSON.stringify(backup, null, 2))
  console.log(`backup: ${file}`)
}
process.exit(0)
