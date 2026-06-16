import { createElement } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'

import type { Post, CalloutBlock as CalloutBlockData, InlineCTABannerBlock as InlineCTABannerData } from '@/payload-types'
import { slugify } from '@/lib/slugify'
import { lexicalNodeText } from '@/lib/blog'
import { CalloutBlock } from '@/components/blog/blocks/CalloutBlock'
import { InlineCTABanner } from '@/components/blog/blocks/InlineCTABanner'

/**
 * Renders Payload Lexical `content` to JSX with custom converters:
 *  - `heading`: injects `id={slugify(text)}` so the TOC scroll-spy anchors resolve.
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
