# Estado de archivos — Apturio website

El Google Doc ("Apturio - configuraciones principales y rutas") fue **actualizado
con todo el código** (sección "Files (code)"). Extraído y escrito.
**El proyecto ahora compila y buildea** (`npm run build` ✅, `tsc` limpio).

## ✅ Del doc (código real)

Config / entrada:
- `package.json`, `tailwind.config.ts`, `src/index.css`, `src/main.tsx`, `src/App.tsx`

Context / lib / hooks:
- `src/context/LanguageContext.tsx`
- `src/lib/translations.ts` (EN + ES completo)
- `src/hooks/use-seo.ts`, `use-mobile.tsx`, `use-toast.ts`

Components:
- `Navbar`, `Hero`, `Footer`, `WhatsAppFloat`, `NavLink`
- `Benefits`, `FAQ`, `Pricing`, `PricingTable`, `Testimonials`, `TheProblem`, `TrustedBy`

Pages:
- `NotFound`, `ThankYou`, `StrategyCall`, `Checkout`, `PrivacyPolicy`,
  `TermsOfService`, `DemoFunnel`, `DemoThankYou`, `PayPerUse`, `AddOns`

Public:
- `public/google9548ff2f328feb04.html` (verificación GSC)

## ✅ Boilerplate determinístico (template Vite/Lovable)
- `index.html`, `vite.config.ts`, `vitest.config.ts`, `postcss.config.js`,
  `components.json`, `eslint.config.js`, los 3 `tsconfig*.json`,
  `src/lib/utils.ts`, `src/vite-env.d.ts`, `src/App.css`, `src/test/setup.ts`,
  `public/robots.txt`, `public/favicon.svg`

## ✅ shadcn/ui (50 archivos en `src/components/ui/`)
Regenerados con shadcn CLI. `calendar.tsx` fijado a react-day-picker v8.

## ⚠️ Reconstruidos / placeholders (NO vienen del doc)

- `src/pages/Index.tsx` — **reconstruido** componiendo las secciones del landing
  (Navbar → Hero → TrustedBy → TheProblem → Benefits → Pricing → Testimonials →
  FAQ → Footer). No es la versión original de Apturio; verificar orden/secciones
  contra el sitio real si aparece el original.
- `src/pages/PayPerUse.tsx` — el doc lo trae como **esqueleto resumido**
  (`{/* Repite la misma estructura... */}`), no tiene la tabla de precios completa.
  Pedir versión completa si se necesita.
- `public/sitemap.xml` — placeholder.
- `public/placeholder.svg` — placeholder genérico del template.

## Pendiente menor
- `src/test/example.test.ts` — no estaba en el doc (test de ejemplo, no bloquea).
- Confirmar si algún `ui/*` tenía tweaks custom (los actuales son stock shadcn).
