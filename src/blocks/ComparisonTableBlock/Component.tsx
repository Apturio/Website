import type { ComparisonTableBlock } from '@/payload-types'

export function ComparisonTableBlockComponent({ block }: { block: ComparisonTableBlock; lang: string }) {
  const columns = block.columns ?? []
  const rows = block.rows ?? []

  return (
    <div className="svc">
      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            {block.eyebrow ? <span className="eyebrow">{block.eyebrow}</span> : null}
            <h2>{block.heading}</h2>
            {block.subtitle ? <p>{block.subtitle}</p> : null}
          </div>
          <div className="cmp-scroll">
            <table className="cmp-table">
              <thead>
                <tr>
                  <th />
                  {columns.map((col, i) => (
                    <th key={col.id ?? i} className={col.highlight ? 'is-highlight' : undefined}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={row.id ?? ri}>
                    <th scope="row">{row.label}</th>
                    {(row.values ?? []).map((v, vi) => (
                      <td key={v.id ?? vi} className={v.highlight ? 'is-highlight' : undefined}>
                        {v.text}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
