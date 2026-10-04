import type { ImgHTMLAttributes } from 'react'

import imageLoader, { IMAGE_WIDTHS, isOptimizable, toLocalPath } from '@/lib/image-loader'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'loading'> & {
  src: string
  alt: string
  /** Intrinsic width of the original, when known: never request a bigger variant than the file. */
  intrinsicWidth?: number | null
  /** Above-the-fold image (LCP): eager + high fetch priority. Everything else is lazy. */
  priority?: boolean
}

/**
 * Drop-in `<img>` that serves resized WebP through the image loader, with a `srcset`.
 * Keeps the exact markup/CSS contract of a plain `<img>` (no wrapper, no `fill`), so the
 * existing frames (`object-fit: cover`, intrinsic-ratio heroes) render the same.
 */
export function OptImage({ src, alt, sizes = '100vw', intrinsicWidth, priority, ...rest }: Props) {
  if (!isOptimizable(src)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" {...rest} />
  }
  const cap = intrinsicWidth && intrinsicWidth > 0 ? intrinsicWidth : Infinity
  let widths = IMAGE_WIDTHS.filter((w) => w <= cap)
  if (widths.length === 0) widths = [IMAGE_WIDTHS[0]]
  else if (cap < IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1] && !widths.includes(cap as never)) {
    // keep the next size up so a retina screen still has one candidate >= the file
    const next = IMAGE_WIDTHS.find((w) => w > cap)
    if (next) widths = [...widths, next]
  }
  const local = toLocalPath(src)
  const srcSet = widths.map((w) => `${imageLoader({ src: local, width: w })} ${w}w`).join(', ')
  const fallbackWidth = widths.find((w) => w >= 640) ?? widths[widths.length - 1]
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageLoader({ src: local, width: fallbackWidth })}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'auto' : 'async'}
      {...(priority ? { fetchPriority: 'high' as const } : {})}
      {...rest}
    />
  )
}
