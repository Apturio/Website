# CMS and content follow-ups (not fixable from code)

Found during the 2026-10-13 SEO audit. These live in CMS data, so they need an editor
(or a data script) rather than a code change.

| # | Where | What | Why it matters |
|---|---|---|---|
| 1 | `/es/precios` hero | H1 reads "Planes de CRM con IA **CRM con IA** para cada tipo de negocio": the accent part repeats the end of the first part. | Looks like a typo in the headline of a money page. |
| 2 | Home (ES and EN) | Link to `/es/crm-para-bienes-raices` returns 404 and the page is not in the sitemap. Publish the page again or remove the link. | Broken internal link from the home page. |
| 3 | `/es/crm-para-clinicas`, `/es/crm-para-esteticas`, `/es/crm-para-academias` | Form labels were never written in Spanish, so Payload serves the English text. The component now maps the stock strings, but write the Spanish labels in the block so they are owned by the CMS. | Mixed-language page. |
| 4 | Author "Carlos Ramon Burgues Capasso" | Only the name is set. Add role, short bio (ES/EN), photo and LinkedIn when available. | E-E-A-T and Person schema. |
| 5 | Footer | "Sobre nosotros" and "Contacto" are "Próximamente". An About page naming the founders (Alfonso Leal, Samuel Flores) and a contact page are the strongest missing trust signals. | E-E-A-T, Organization founder markup. |
| 6 | Social profiles | `x.com/apturio` returns 404. Create the account or share the real handle. G2, Capterra, Google Business Profile and Crunchbase do not exist yet. | Organization `sameAs` has 3 verified profiles. |
| 7 | WhatsApp | The floating button uses `wa.me/12633855332`, everything else uses `+1 561 473 1298`. Confirm which number is correct. | Leads reaching the wrong inbox. |
| 8 | Claims | "hasta 60% menos no-shows", "21x más probable", "$2,000 bonus" have no source or named customer. Add a source or a case study, or soften the claim. | Trust and AI-citation readiness. |
| 9 | Blog | Only one post exists in English. 20 Spanish posts have no EN version. | EN blog is nearly empty. |
| 10 | URL slugs | EN pages with Spanish slugs (`/precios`, `/chatbot-whatsapp`, `/sistema-reservas`, ...). Rename with 301s if English slugs are wanted. | Language signal, not urgent. |
