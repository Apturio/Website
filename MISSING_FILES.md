# Archivos faltantes — pendientes de Apturio

El Google Doc ("Apturio - configuraciones principales y rutas") incluía la
**estructura completa de archivos** + el **contenido de solo 8 archivos**.
La sección "Files (code)" del doc estaba **vacía**, así que el resto del código
todavía no lo tenemos.

## ✅ Recreados (contenido real del doc)

- `package.json`
- `tailwind.config.ts`
- `src/index.css`
- `src/main.tsx`
- `src/App.tsx`
- `src/components/Navbar.tsx`
- `src/components/Hero.tsx`
- `src/components/Footer.tsx`

## ✅ Recreados (boilerplate determinístico del template Vite/Lovable)

Estos son archivos estándar del template `vite_react_shadcn_ts`, seguros de regenerar:

- `index.html`
- `vite.config.ts`
- `vitest.config.ts`
- `postcss.config.js`
- `components.json`
- `eslint.config.js`
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- `src/lib/utils.ts`
- `src/vite-env.d.ts`
- `src/App.css`
- `src/test/setup.ts`
- `public/robots.txt`, `public/favicon.svg`

## ❌ FALTA contenido (pedir a Apturio — Samuel)

`App.tsx` importa estos archivos. Sin ellos el proyecto **no compila**.

### context
- `src/context/LanguageContext.tsx` ← provider `useLanguage` (en/es). **CRÍTICO**

### lib
- `src/lib/translations.ts` ← todas las keys `t('...')` usadas en Navbar/Hero/Footer. **CRÍTICO**

### hooks
- ~~`src/hooks/use-mobile.tsx`~~ ✅ regenerado (shadcn)
- `src/hooks/use-seo.ts`  ← FALTA (lógica SEO custom)
- ~~`src/hooks/use-toast.ts`~~ ✅ regenerado

### components
- `src/components/Benefits.tsx`
- `src/components/FAQ.tsx`
- `src/components/NavLink.tsx`
- `src/components/Pricing.tsx`
- `src/components/PricingTable.tsx`
- `src/components/Testimonials.tsx`
- `src/components/TheProblem.tsx`
- `src/components/TrustedBy.tsx`
- `src/components/WhatsAppFloat.tsx`  ← usado en `App.tsx`. **CRÍTICO**

### pages (todas usadas en el router de App.tsx)
- `src/pages/Index.tsx`  **CRÍTICO**
- `src/pages/NotFound.tsx`
- `src/pages/ThankYou.tsx`
- `src/pages/StrategyCall.tsx`
- `src/pages/Checkout.tsx`
- `src/pages/PrivacyPolicy.tsx`
- `src/pages/TermsOfService.tsx`
- `src/pages/DemoFunnel.tsx`
- `src/pages/DemoThankYou.tsx`
- `src/pages/PayPerUse.tsx`
- `src/pages/AddOns.tsx`

### src/components/ui (shadcn — 50 archivos)
✅ **REGENERADOS** con shadcn CLI + deps instaladas. 50 archivos:
- 45 vía `npx shadcn add ...`
- `sidebar.tsx` (+ generó `use-mobile.tsx`)
- `toast.tsx`, `toaster.tsx`, `use-toast.ts` escritos a mano (shadcn los deprecó a favor de sonner, pero `App.tsx` usa `@/components/ui/toaster`)
- `calendar.tsx` ajustado a `react-day-picker` v8 (versión del doc)

> ⚠️ Si Apturio tenía tweaks custom en algún `ui/*`, pedir esas versiones — estos son los stock de shadcn.

### public (contenido real necesario)
- `public/sitemap.xml`  ← el creado es placeholder
- `public/google9548ff2f328feb04.html`  ← archivo de verificación de Google Search Console (contenido exacto necesario)
- `public/placeholder.svg`

### tests
- `src/test/example.test.ts`

### otros
- `README.md` (original del repo Lovable)

## Próximo paso

Pedir a Samuel (sam@samuelflores.me) que pegue el resto del código en el doc
(sección "Files (code)"), priorizando los **CRÍTICOS**: `LanguageContext.tsx`,
`translations.ts`, `Index.tsx`, `WhatsAppFloat.tsx`. Con esos 4 + los ui/* el sitio
ya arranca.
