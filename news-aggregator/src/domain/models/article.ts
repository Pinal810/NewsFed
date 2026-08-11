import type { ArticleCategory } from '../../types/article-category'
import type { NewsSource } from '../../types/news-source'
import type { NewsProviderName } from '../../types/news-provider-name'

export interface Article {
  id: string
  title: string
  description?: string
  content?: string
  url: string
  imageUrl?: string
  publishedAt: string // ISO string
  author?: string
  source: NewsSource
  category?: ArticleCategory
  provider: NewsProviderName
  // raw provider response when available (keeps UI decoupled)
  raw?: unknown
}
