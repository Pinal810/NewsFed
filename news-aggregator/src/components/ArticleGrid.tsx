import React from 'react'
import { ArticleCard } from './ArticleCard'
import type { Article } from '../domain/models/article'

type Props = {
  articles: Article[]
  detailUrlBuilder?: (article: Article) => string
}

export const ArticleGrid: React.FC<Props> = ({ articles, detailUrlBuilder }) => {
  return (
    <section aria-live="polite" aria-label="News article results" className="article-grid">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} detailUrl={detailUrlBuilder?.(article)} />
      ))}
    </section>
  )
}

export default ArticleGrid
