import React from 'react'
import type { Article } from '../domain/models/article'

type Props = {
  article: Article
}

export const ArticleCard: React.FC<Props> = ({ article }) => {
  return (
    <article style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', textAlign: 'left', background: 'var(--bg)' }}>
      <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
        <div style={{ width: '100%', height: 160, background: '#f3f3f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {article.imageUrl ? (
            // eslint-disable-next-line jsx-a11y/img-redundant-alt
            <img src={article.imageUrl} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          ) : (
            <div style={{ padding: 16, color: 'var(--text)' }}>No image</div>
          )}
        </div>
        <div style={{ padding: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--text)', marginBottom: 6 }}>{article.source.name}</div>
          <h3 style={{ margin: '0 0 8px', color: 'var(--text-h)' }}>{article.title}</h3>
          <p style={{ margin: 0, color: 'var(--text)' }}>{article.description ?? article.content ?? ''}</p>
          <div style={{ marginTop: 8, display: 'flex', gap: 8, fontSize: 12, color: 'var(--text)' }}>
            {article.author && <span>{article.author}</span>}
            <time dateTime={article.publishedAt}>{new Date(article.publishedAt).toLocaleString()}</time>
          </div>
        </div>
      </a>
    </article>
  )
}

export default ArticleCard
