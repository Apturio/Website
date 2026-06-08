import type { FeatureZigzagBlock } from '@/payload-types'
import { Icon } from '../_shared/Icon'
import { ImageSlot } from '../_shared/ImageSlot'

export function FeatureZigzagBlockComponent({ block }: { block: FeatureZigzagBlock; lang: string }) {
  return (
    <div className="svc">
      <section className="sec">
        <div className="wrap">
          {(block.eyebrow || block.heading) && (
            <div className="sec-head">
              {block.eyebrow ? <span className="eyebrow">{block.eyebrow}</span> : null}
              {block.heading ? <h2>{block.heading}</h2> : null}
            </div>
          )}
          <div className="zig">
            {(block.rows ?? []).map((r, i) => (
              <div className="zig-row" key={r.id ?? i}>
                <div className="zig-media">
                  <ImageSlot image={r.image} placeholder={r.placeholder} />
                </div>
                <div className="zig-body">
                  {r.num ? <span className="num">{r.num}</span> : null}
                  <h3>{r.title}</h3>
                  <p>{r.description}</p>
                  {r.bullets && r.bullets.length > 0 ? (
                    <ul>
                      {r.bullets.map((b, j) => (
                        <li key={j}>
                          <Icon name="check" />
                          <span>{b.text}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
