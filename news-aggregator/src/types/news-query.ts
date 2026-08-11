import type { ArticleCategory } from './article-category'
import type { NewsProviderName } from './news-provider-name'

export type NewsQuery = {
  q?: string
  category?: ArticleCategory
  sourceId?: string
  provider?: NewsProviderName
  from?: string // ISO date
  to?: string // ISO date
  page?: number
  pageSize?: number
}
