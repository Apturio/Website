import type { MetricsBlock } from '@/payload-types'

export function MetricsBlockComponent({ block }: { block: MetricsBlock; lang: string }) {
  return (
    <div className="svc">
      <section className={`sec tight${block.glowTop ? ' glow-top' : ''}`}>
        <div className="wrap">
          <div className="metrics">
            {(block.items ?? []).map((m, i) => (
              <div className="metric" key={m.id ?? i}>
                <div className={`big${m.green ? ' green' : ''}`}>{m.value}</div>
                <div className="lbl">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
