// The stylesheet is a constant — no DB access, no per-request work.
export const dynamic = 'force-static'

// First-path-segment locale predicate (origin- and slug-independent): yields
// 'en' for both https://apturio.com/en and https://apturio.com/en/blog/x,
// and 'es' for the es URLs, without misclassifying a slug that merely
// contains the letters "en".
const LOCALE_PREDICATE =
  "substring-before(concat(substring-after(substring-after(sitemap:loc,'://'),'/'),'/'),'/')"

const XSL = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html>
      <head>
        <meta charset="UTF-8"/>
        <title>Sitemap - Apturio</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&amp;family=Outfit:wght@400;500;600;700;800;900&amp;display=swap');

          body {
            background: #000000;
            color: #ffffff;
            font-family: 'Inter', sans-serif;
            margin: 0;
          }

          .header {
            padding: 48px 16px 24px;
            border-bottom: 2px solid hsl(238 100% 74%);
          }

          .header img {
            height: 40px;
            width: auto;
          }

          h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 36px;
            font-weight: 600;
            color: hsl(238 100% 74%);
            margin: 24px 0 0;
          }

          section {
            padding: 0 16px 48px;
          }

          section h2 {
            font-family: 'Outfit', sans-serif;
            font-size: 24px;
            font-weight: 600;
            color: hsl(238 100% 74%);
            margin-top: 48px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            text-align: left;
            padding: 8px 16px;
            border-bottom: 1px solid hsl(0 0% 15%);
          }

          td {
            font-size: 14px;
            font-weight: 400;
            padding: 8px 16px;
            border-bottom: 1px solid hsl(0 0% 15%);
          }

          td.url {
            overflow-wrap: anywhere;
          }

          td.url a {
            color: #ffffff;
            text-decoration: none;
          }

          td.url a:hover {
            color: hsl(238 100% 74%);
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="https://vibe.filesafe.space/1775831502235366632/attachments/965b91f8-1e00-4fc8-acf4-8021d0d6fdcd.png" alt="Apturio"/>
          <h1>Sitemap</h1>
        </div>
        <xsl:if test="sitemap:urlset/sitemap:url[${LOCALE_PREDICATE}='en']">
          <section>
            <h2>English</h2>
            <table>
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Ultima modificacion</th>
                  <th>Prioridad</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url[${LOCALE_PREDICATE}='en']">
                  <tr>
                    <td class="url"><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                    <td><xsl:value-of select="sitemap:lastmod"/></td>
                    <td><xsl:value-of select="sitemap:priority"/></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </section>
        </xsl:if>
        <xsl:if test="sitemap:urlset/sitemap:url[${LOCALE_PREDICATE}='es']">
          <section>
            <h2>Espanol</h2>
            <table>
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Ultima modificacion</th>
                  <th>Prioridad</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url[${LOCALE_PREDICATE}='es']">
                  <tr>
                    <td class="url"><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                    <td><xsl:value-of select="sitemap:lastmod"/></td>
                    <td><xsl:value-of select="sitemap:priority"/></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </section>
        </xsl:if>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
`

export function GET() {
  return new Response(XSL, {
    headers: {
      'Content-Type': 'text/xsl; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
