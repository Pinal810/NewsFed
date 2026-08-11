import React from 'react'
import type { Article } from '../domain/models/article'

type Props = {
  article: Article
  detailUrl?: string
}

export const ArticleCard: React.FC<Props> = ({ article, detailUrl }) => {
  return (
    <article style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', textAlign: 'left', background: 'var(--bg)', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: '1 1 auto' }}>
        <div style={{ width: '100%', height: 160, background: '#f3f3f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {article.imageUrl ? (
            <img src={article.imageUrl} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          ) : (
            <div style={{ padding: 16, color: 'var(--text)' }}>No image</div>
          )}
        </div>
        <div style={{ padding: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--text)', marginBottom: 6 }}>{article.source.name}</div>
          <h3 style={{ margin: '0 0 8px', color: 'var(--text-h)' }}>{article.title}</h3>
          <p style={{ margin: 0, color: 'var(--text)', minHeight: 48 }}>{article.description ?? article.content ?? 'No description available.'}</p>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', padding: 12, display: 'grid', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', color: 'var(--text)', fontSize: 12 }}>
          {article.author && <span>{article.author}</span>}
          <time dateTime={article.publishedAt}>{new Date(article.publishedAt).toLocaleString()}</time>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
          {detailUrl ? (
            <a href={detailUrl} style={{ flex: '1 1 auto', padding: '8px 12px', borderRadius: 8, textAlign: 'center', background: '#f3f3f3', color: 'var(--text)', textDecoration: 'none' }}>
              View details
            </a>
          ) : null}
          <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ flex: '1 1 auto', padding: '8px 12px', borderRadius: 8, textAlign: 'center', background: 'var(--accent)', color: '#fff', textDecoration: 'none' }}>
            Read original
          </a>
        </div>
      </div>
    </article>
  )
}

export default ArticleCard
