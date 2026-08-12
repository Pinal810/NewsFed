import React from 'react'
import { Link } from 'react-router-dom'
import type { Article } from '../domain/models/article'

type Props = {
  article: Article
  detailUrl?: string
}

const fallbackImageText = 'Image unavailable'

const formatArticleDate = (rawDate?: string) => {
  if (!rawDate) {
    return 'Date unavailable'
  }

  const date = new Date(rawDate)
  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export const ArticleCard: React.FC<Props> = ({ article, detailUrl }) => {
  const [imageError, setImageError] = React.useState(false)

  const description = article.description?.trim() || article.content?.trim() || 'No description available.'
  const category = article.category?.trim() || undefined
  const sourceName = article.source?.name?.trim() || article.source?.id || 'Source'
  const authorName = article.author?.trim() || 'Unknown author'
  const imageAltText = article.title ? `Image for ${article.title}` : 'Story illustration'

  return (
    <article className="article-card" aria-label={article.title}>
      <div className="article-card__media">
        {article.imageUrl && !imageError ? (
          <img
            className="article-card__image"
            src={article.imageUrl}
            alt={imageAltText}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="article-card__placeholder">{fallbackImageText}</div>
        )}
      </div>

      <div className="article-card__body">
        <div className="article-card__meta">
          <span className="article-card__source">{sourceName}</span>
          {category ? <span>{category}</span> : null}
        </div>

        <h3 className="article-card__title">{article.title}</h3>
        <p className="article-card__description">{description}</p>
      </div>

      <div className="article-card__footer">
        <div className="article-card__details">
          {authorName ? <span>{authorName}</span> : null}
          <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
        </div>

        <div className="article-card__actions">
          {detailUrl ? (
            <Link className="inline-link" to={detailUrl} state={{ article }}>
              View details
            </Link>
          ) : null}
          <a className="read-original" href={article.url} target="_blank" rel="noopener noreferrer">
            Read original
          </a>
        </div>
      </div>
    </article>
  )
}

export default ArticleCard
