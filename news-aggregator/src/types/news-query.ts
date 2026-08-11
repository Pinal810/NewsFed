import type { ArticleCategory } from './article-category'

export type NewsQuery = {
  q?: string
  category?: ArticleCategory
  sourceId?: string
  from?: string // ISO date
  to?: string // ISO date
  page?: number
  pageSize?: number
}
