# Apturio — Website

Sitio de Apturio recreado desde el código que el equipo compartió en Google Docs.

Stack: **Vite + React 18 + TypeScript + Tailwind + shadcn/ui + React Router**
(template `vite_react_shadcn_ts`, originado en Lovable).

## Estado

Reconstrucción parcial. El doc fuente solo traía 8 archivos con contenido + el árbol
completo de nombres. Ver [`MISSING_FILES.md`](./MISSING_FILES.md) para lo que falta
y cómo completarlo.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:8080
npm run build
npm run preview
npm run lint
npm run test
```

> ⚠️ No compila todavía: faltan archivos críticos (`LanguageContext.tsx`,
> `translations.ts`, `Index.tsx`, `WhatsAppFloat.tsx`, `src/components/ui/*`).
> Ver `MISSING_FILES.md`.

## Rutas (de `src/App.tsx`)

| Ruta | Página |
|------|--------|
| `/` | Index |
| `/thank-you` | ThankYou |
| `/strategy-call` | StrategyCall |
| `/checkout/:planId` | Checkout |
| `/privacy-policy` | PrivacyPolicy |
| `/terms-of-service` | TermsOfService |
| `/pay-per-use` | PayPerUse |
| `/add-ons` | AddOns |
| `/demo-spanish` | DemoFunnel |
| `/demo-spanish/thank-you` | DemoThankYou |
| `*` | NotFound |

## i18n

Soporta `en` / `es` vía `LanguageContext`. En producción cambia de dominio:
`apturio.com` (en) ↔ `es.apturio.com` (es).
