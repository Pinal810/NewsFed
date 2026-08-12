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

export function normalizeArticleUrl(value?: string): string {
  if (!value) return ''
  const trimmed = value.trim()
  if (!trimmed) return ''

  try {
    const url = new URL(trimmed)
    url.hash = ''
    url.search = ''
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '')
    const pathname = url.pathname.replace(/\/+$/, '') || '/'
    return `${url.protocol}//${hostname}${pathname}`.toLowerCase()
  } catch {
    return trimmed.toLowerCase()
  }
}

export function buildArticleIdentifier(article: Pick<Article, 'provider' | 'id' | 'url' | 'source'>): string {
  const provider = article.provider
  const canonicalUrl = normalizeArticleUrl(article.url)
  const sourceId = article.source?.id?.trim()
  const rawId = article.id?.trim()

  const candidate = canonicalUrl || sourceId || rawId || 'untitled'
  return `${provider}:${encodeURIComponent(candidate)}`
}

export function parseArticleIdentifier(value: string): { provider: NewsProviderName; raw: string; url?: string } {
  const [providerPart, ...rest] = value.split(':')
  const provider = providerPart as NewsProviderName
  const raw = decodeURIComponent(rest.join(':'))

  return {
    provider,
    raw,
    url: raw.startsWith('http://') || raw.startsWith('https://') ? raw : undefined,
  }
}
