import React from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Header } from '../components/Header'
import { buildArticleIdentifier, normalizeArticleUrl, parseArticleIdentifier, type Article } from '../domain/models/article'
import { getCachedArticleById, readArticleCache } from '../services/article-cache'

const formatDate = (rawDate?: string) => {
  if (!rawDate) {
    return 'Date unavailable'
  }

  const date = new Date(rawDate)
  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable'
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(date)
}

function resolveArticleFromRoute(routeId: string | undefined, navigationState?: { article?: Article }): Article | undefined {
  if (!routeId) return navigationState?.article

  const decoded = decodeURIComponent(routeId)
  const parsed = parseArticleIdentifier(decoded)

  if (navigationState?.article) {
    const matchingArticle = buildArticleIdentifier(navigationState.article)
    if (matchingArticle === decoded || normalizeArticleUrl(navigationState.article.url) === normalizeArticleUrl(parsed.url ?? '')) {
      return navigationState.article
    }
  }

  const cached = getCachedArticleById(decoded)
  if (cached) {
    return cached
  }

  const articleByUrl = Object.values(readArticleCache()).find((article) => {
    const articleId = buildArticleIdentifier(article)
    return articleId === decoded || normalizeArticleUrl(article.url) === normalizeArticleUrl(parsed.url ?? '')
  })

  return articleByUrl
}

export const ArticlePage: React.FC = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const article = resolveArticleFromRoute(id, location.state as { article?: Article } | undefined)

  if (!article) {
    return (
      <div>
        <Header />
        <main className="detail-shell">
          <div className="not-found-state">
            <h2 className="not-found-state__title">Article not found</h2>
            <p className="not-found-state__body">This article is unavailable or the link is outdated.</p>
            <div style={{ marginTop: 20 }}>
              <button type="button" className="action-button" onClick={() => navigate(-1)}>
                Go back
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const fullContent = article.content?.trim() || article.description?.trim() || 'No content available.'
  const sourceName = article.source?.name?.trim() || article.source?.id || 'Source'
  const category = article.category ? article.category : undefined

  // Split content by double newlines to create paragraphs, or by single newlines
  const contentParagraphs = fullContent.split(/\n\s*\n/).filter(p => p.trim())

  return (
    <div>
      <Header />
      <main className="detail-shell">
        <article className="detail-article">
          <div className="detail-article__media">
            {article.imageUrl ? (
              <img src={article.imageUrl} alt={article.title ? `Image for ${article.title}` : 'Story image'} loading="lazy" />
            ) : (
              <div className="detail-article__placeholder">Image unavailable</div>
            )}
          </div>

          <div className="detail-article__content">
            <div className="detail-article__meta">
              <span className="detail-article__source">{sourceName}</span>
              {category ? <span>{category}</span> : null}
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            </div>

            <h1 className="detail-article__title">{article.title}</h1>

            <div className="detail-article__meta" style={{ marginBottom: 0 }}>
              {article.author ? <span>{article.author}</span> : null}
            </div>

            <div className="detail-article__body">
              {fullContent.includes('<') ? (
                <div dangerouslySetInnerHTML={{ __html: fullContent }} />
              ) : contentParagraphs.length > 1 ? (
                contentParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph.trim()}</p>
                ))
              ) : (
                <p>{fullContent}</p>
              )}
            </div>

            <div className="detail-actions">
              <Link className="secondary-button" to="/" style={{ width: 'auto' }}>
                Back to news
              </Link>
              {article.url ? (
                <a className="read-original" href={article.url} target="_blank" rel="noopener noreferrer">
                  Read full article
                </a>
              ) : null}
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}

export default ArticlePage
