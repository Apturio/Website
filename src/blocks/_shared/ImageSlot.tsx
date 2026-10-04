import type { Media } from '@/payload-types'
import { OptImage } from '@/components/OptImage'

/**
 * Presentational stand-in for the prototype's <image-slot> custom element.
 * When a Media upload is provided it renders the image; otherwise it shows the
 * placeholder label exactly like the design's empty drop zones.
 */
export function ImageSlot({
  image,
  placeholder,
  className,
}: {
  image?: number | Media | null
  placeholder?: string | null
  className?: string
}) {
  const media = typeof image === 'object' && image ? image : null
  const url = media?.url ?? null
  return (
    <div
      className={`img-slot${url ? ' has-img' : ''}${className ? ` ${className}` : ''}`}
      data-placeholder={placeholder ?? 'Image'}
    >
      {url ? <OptImage src={url} alt={media?.alt ?? ''} intrinsicWidth={media?.width} sizes="(max-width: 768px) 100vw, 720px" /> : null}
    </div>
  )
}
