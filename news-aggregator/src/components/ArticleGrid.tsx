import React from 'react'
import { ArticleCard } from './ArticleCard'
import type { Article } from '../domain/models/article'

type Props = {
  articles: Article[]
}

export const ArticleGrid: React.FC<Props> = ({ articles }) => {
  return (
    <section aria-live="polite" style={{ padding: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  )
}

export default ArticleGrid
