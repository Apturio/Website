import Link from 'next/link'

import type { InlineCTABannerBlock as InlineCTABannerData } from '@/payload-types'

/**
 * Inline CTA banner — dark conversion card inserted mid-article (custom Lexical
 * `inlineCTABanner` block). Stays dark inside the white reading sheet per design.
 */
export function InlineCTABanner({ data }: { data: InlineCTABannerData }) {
  return (
    <div className="cta-banner" id="cta-mid">
      <div className="in">
        <div className="txt">
          {data.label && (
            <span className="pill-green">
              <span className="dot" />
              {data.label}
            </span>
          )}
          <h3>{data.heading}</h3>
          {data.body && <p>{data.body}</p>}
        </div>
        <div className="act">
          <Link href={data.href} className="btn btn-primary btn-lg btn-pill">
            {data.buttonLabel}
          </Link>
        </div>
      </div>
    </div>
  )
}
