import type { ArticleCategory } from './article-category'
import type { NewsProviderName } from './news-provider-name'

export type NewsQuery = {
  q?: string
  qInTitle?: string
  category?: ArticleCategory
  sourceId?: string
  sources?: string
  domains?: string
  provider?: NewsProviderName
  sort?: 'latest' | 'oldest'
  from?: string // ISO date
  to?: string // ISO date
  page?: number
  pageSize?: number
}
