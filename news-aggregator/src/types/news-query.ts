import type { ArticleCategory } from './article-category'
import type { NewsProviderName } from './news-provider-name'

export type ArticleSort = 'newest' | 'oldest' | 'relevance'
export type NewsSourceFilterValue = 'newsapi' | 'guardian'

export type NewsQuery = {
  q?: string
  qInTitle?: string
  category?: ArticleCategory
  source?: NewsSourceFilterValue
  sourceId?: string
  sources?: string
  domains?: string
  author?: string
  provider?: NewsProviderName
  sort?: ArticleSort
  from?: string // ISO date
  to?: string // ISO date
  page?: number
  pageSize?: number
}

export const DEFAULT_ARTICLE_SORT: ArticleSort = 'newest'
export const DEFAULT_PAGE = 1
export const DEFAULT_PAGE_SIZE = 12

export function normalizeSourceValue(value?: string): NewsSourceFilterValue | undefined {
  if (!value) return undefined
  const normalized = value.trim().toLowerCase()

  if (normalized === 'guardian' || normalized === 'theguardian') return 'guardian'
  if (normalized === 'newsapi') return 'newsapi'

  return undefined
}

export function providerNameFromSource(source?: NewsSourceFilterValue | NewsProviderName): NewsProviderName | undefined {
  if (!source) return undefined
  const normalized = normalizeSourceValue(source) ?? source

  if (normalized === 'newsapi') return 'newsapi'
  if (normalized === 'guardian') return 'theguardian'

  return undefined
}

export function serializeSourceValue(source?: NewsSourceFilterValue | NewsProviderName): string | undefined {
  if (!source) return undefined
  if (source === 'theguardian') return 'guardian'
  return source
}
