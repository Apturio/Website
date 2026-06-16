import Link from 'next/link'

import type { Post } from '@/payload-types'
import type { AppLocale } from '@/lib/site'
import { asAuthor, asCategory, asMedia, formatDate, readTimeLabel } from '@/lib/blog'

/**
 * Article card for the index / category / author grids. Server Component.
 * Carries `data-blog-card` + `data-category` so the client CategoryFilter can
 * toggle visibility without making the card itself a Client Component.
 */
export function BlogCard({ post, locale }: { post: Post; locale: AppLocale }) {
  const category = asCategory(post.category)
  const author = asAuthor(post.author)
  const hero = asMedia(post.heroImage)

  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="card"
      data-blog-card
      data-category={category?.slug ?? ''}
    >
      <div className="media">
        {category && (
          <span className="tag tag-chip">
            <span className="d" />
            {category.title}
          </span>
        )}
        {hero?.url ? (
          <img src={hero.url} alt={hero.alt ?? post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className="img-slot" />
        )}
      </div>
      <div className="body">
        <h3>{post.title}</h3>
        {post.excerpt && <p className="excerpt">{post.excerpt}</p>}
        <div className="meta">
          <span className="avatar">
            {asMedia(author?.avatar)?.url ? (
              <img src={asMedia(author?.avatar)!.url!} alt={author?.name ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span className="img-slot circle" />
            )}
          </span>
          {author && <span style={{ color: '#fff', fontWeight: 600 }}>{author.name}</span>}
          <span className="dot" />
          <span>{formatDate(post.publishedAt, locale)}</span>
          <span className="dot" />
          <span>{readTimeLabel(post, locale)}</span>
        </div>
      </div>
    </Link>
  )
}
