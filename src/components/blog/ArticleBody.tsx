import { createElement } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'

import type { Post, Media, CalloutBlock as CalloutBlockData, InlineCTABannerBlock as InlineCTABannerData } from '@/payload-types'
import { slugify } from '@/lib/slugify'
import { lexicalNodeText } from '@/lib/blog'
import { CalloutBlock } from '@/components/blog/blocks/CalloutBlock'
import { InlineCTABanner } from '@/components/blog/blocks/InlineCTABanner'

/**
 * Renders Payload Lexical `content` to JSX with custom converters:
 *  - `heading`: injects `id={slugify(text)}` so the TOC scroll-spy anchors resolve.
 *  - `upload`: figure whose frame takes the image's own aspect ratio (no crop).
 *  - `table` / `tablerow` / `tablecell`: brand-styled, horizontally scrollable,
 *    `scope`-annotated tables (the default converters hardcode inline borders
 *    and emit `th` without `scope`).
 *  - blocks `callout` / `inlineCTABanner`: the two custom editorial blocks.
 * Server Component (RichText is RSC-safe — no hooks / "use client").
 */
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  heading: ({ node, nodesToJSX }) => {
    const tag = (node.tag as string) || 'h2'
    const children = nodesToJSX({ nodes: node.children })
    if (tag === 'h2' || tag === 'h3') {
      const id = slugify(lexicalNodeText(node as { children?: unknown[] }))
      return createElement(tag, { id }, children)
    }
    return createElement(tag, null, children)
  },
  // Images size themselves from the uploaded file's intrinsic width/height, so
  // the frame follows the image (portrait, square, panorama) instead of forcing
  // every upload into one fixed box.
  upload: ({ node }) => {
    const doc = node.value as Media | string | number | null
    if (!doc || typeof doc !== 'object' || !doc.url) return null

    const alt = (node.fields as { alt?: string } | undefined)?.alt ?? doc.alt ?? ''

    if (!doc.mimeType?.startsWith('image')) {
      return (
        <a href={doc.url} rel="noopener noreferrer">
          {doc.filename}
        </a>
      )
    }

    return (
      // No fixed frame: width/height are the file's own dimensions and CSS
      // (max-width/max-height, height:auto) shrinks it while keeping the ratio.
      <figure className="prose-figure">
        <img src={doc.url} alt={alt} width={doc.width ?? undefined} height={doc.height ?? undefined} />
        {doc.caption ? <figcaption>{doc.caption}</figcaption> : null}
      </figure>
    )
  },
  table: ({ node, nodesToJSX }) => (
    // tabIndex + role=region: a table wider than the column stays reachable by
    // keyboard-only users (WCAG 2.1.1), and the label names the scroll region.
    <div className="table-scroll" role="region" tabIndex={0} aria-label="Table">
      <table className="prose-table">
        <tbody>{nodesToJSX({ nodes: node.children })}</tbody>
      </table>
    </div>
  ),
  tablerow: ({ node, nodesToJSX }) => <tr>{nodesToJSX({ nodes: node.children })}</tr>,
  tablecell: ({ node, nodesToJSX }) => {
    const cell = node as unknown as {
      headerState?: number
      colSpan?: number
      rowSpan?: number
      backgroundColor?: string
    }
    const isHeader = (cell.headerState ?? 0) > 0
    const children = nodesToJSX({ nodes: node.children })
    const props = {
      colSpan: cell.colSpan && cell.colSpan > 1 ? cell.colSpan : undefined,
      rowSpan: cell.rowSpan && cell.rowSpan > 1 ? cell.rowSpan : undefined,
      style: cell.backgroundColor ? { backgroundColor: cell.backgroundColor } : undefined,
      // headerState 1 = column header (row above data), 2 = row header.
      ...(isHeader ? { scope: cell.headerState === 2 ? 'row' : 'col' } : {}),
    }
    return createElement(isHeader ? 'th' : 'td', props, children)
  },
  blocks: {
    callout: ({ node }: { node: { fields: CalloutBlockData } }) => <CalloutBlock data={node.fields} />,
    inlineCTABanner: ({ node }: { node: { fields: InlineCTABannerData } }) => (
      <InlineCTABanner data={node.fields} />
    ),
  },
})

export function ArticleBody({ content }: { content: Post['content'] }) {
  if (!content) return null
  return (
    <article className="prose">
      <RichText data={content} converters={converters} disableContainer />
    </article>
  )
}
