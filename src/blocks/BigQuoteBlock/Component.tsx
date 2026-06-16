import type { BigQuoteBlock } from '@/payload-types'
import { Icon } from '../_shared/Icon'
import { ImageSlot } from '../_shared/ImageSlot'

export function BigQuoteBlockComponent({ block }: { block: BigQuoteBlock; lang: string }) {
  return (
    <div className="svc">
      <section className={`sec tight${block.glowTop ? ' glow-top' : ''}`}>
        <div className="wrap">
          <div className="big-quote">
            <div className="stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon name="star" key={i} />
              ))}
            </div>
            <blockquote>{block.quote}</blockquote>
            <div className="who">
              <span className="av">
                <ImageSlot image={block.avatar} placeholder="" />
              </span>
              <div style={{ textAlign: 'left' }}>
                <div className="nm">{block.authorName}</div>
                {block.authorRole ? <div className="ro">{block.authorRole}</div> : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
