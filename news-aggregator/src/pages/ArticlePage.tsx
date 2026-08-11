import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import type { Article } from '../domain/models/article'

export const ArticlePage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const article = location.state?.article as Article | undefined

  if (!article) {
    return (
      <div>
        <Header />
        <main style={{ maxWidth: 1126, margin: '20px auto', padding: '0 16px' }}>
          <div style={{ padding: 32, textAlign: 'center' }}>
            <h2>Article not found</h2>
            <p>Open an article from the list to view details.</p>
            <button style={{ padding: '10px 18px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff' }} onClick={() => navigate(-1)}>
              Go back
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div>
      <Header />
      <main style={{ maxWidth: 860, margin: '20px auto', padding: '0 16px' }}>
        <article>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, color: 'var(--text)' }}>{article.source.name}</div>
            <h1 style={{ margin: '12px 0' }}>{article.title}</h1>
            <div style={{ display: 'flex', gap: 12, color: 'var(--text)', fontSize: 14 }}>
              {article.author && <span>{article.author}</span>}
              <time dateTime={article.publishedAt}>{new Date(article.publishedAt).toLocaleString()}</time>
            </div>
          </div>

          {article.imageUrl ? (
            <img src={article.imageUrl} alt={article.title} style={{ width: '100%', borderRadius: 12, objectFit: 'cover', maxHeight: 420 }} />
          ) : (
            <div style={{ width: '100%', height: 260, borderRadius: 12, background: '#f3f3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)' }}>
              No image available
            </div>
          )}

          <div style={{ padding: '24px 0' }}>
            <p style={{ lineHeight: 1.75, color: 'var(--text)' }}>{article.description ?? article.content ?? 'No additional description available.'}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 20, color: 'var(--accent)' }}>
              Read original article
            </a>
          </div>
        </article>
      </main>
    </div>
  )
}

export default ArticlePage
