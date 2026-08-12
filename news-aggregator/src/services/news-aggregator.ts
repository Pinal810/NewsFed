import type { Article } from '../domain/models/article'
import type { NewsProviderName } from '../types/news-provider-name'
import { providerNameFromSource, type NewsQuery } from '../types/news-query'
import type { NewsProvider } from './news-provider'
import { createNewsApiProvider } from './providers/newsapi-provider'
import { createGuardianProvider } from './providers/guardian-provider'
import { createNewYorkTimesProvider } from './providers/nyt-provider'

export type AggregatorOptions = {
  newsApiKey: string
  guardianKey: string
  nytKey: string
}

export type ProviderError = {
  provider: NewsProviderName
  message: string
  cause?: unknown
}

export function normalizeArticleUrl(url?: string): string {
  if (!url) return ''
  const trimmed = url.trim()
  if (!trimmed) return ''

  try {
    const parsed = new URL(trimmed)
    parsed.hash = ''
    parsed.search = ''
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '')
    const pathname = parsed.pathname.replace(/\/+$/, '') || '/'
    return `${parsed.protocol}//${hostname}${pathname}`.toLowerCase()
  } catch {
    return trimmed.toLowerCase()
  }
}

export function normalizeDedupKey(value?: string): string {
  return (value ?? '').trim().replace(/\s+/g, ' ').toLowerCase()
}

export function deduplicateArticles(articles: Article[]): Article[] {
  const seen = new Set<string>()
  const deduplicated: Article[] = []

  for (const article of articles) {
    const keys = [
      article.url ? `url:${normalizeArticleUrl(article.url)}` : undefined,
      article.id ? `id:${article.provider}:${normalizeDedupKey(article.id)}` : undefined,
      article.title && article.source?.name ? `title:${normalizeDedupKey(article.title)}|${normalizeDedupKey(article.source.name)}` : undefined,
    ].filter((value): value is string => Boolean(value))

    if (keys.length > 0 && keys.some((key) => seen.has(key))) {
      continue
    }

    keys.forEach((key) => seen.add(key))
    deduplicated.push(article)
  }

  return deduplicated
}

export function sortAggregatedArticles(articles: Article[], sort?: NewsQuery['sort']): Article[] {
  return [...articles].sort((a, b) => {
    const tsA = Date.parse(a.publishedAt || '') || 0
    const tsB = Date.parse(b.publishedAt || '') || 0

    if (sort === 'oldest') {
      return tsA - tsB
    }

    if (sort === 'relevance') {
      return (b.title?.length ?? 0) - (a.title?.length ?? 0)
    }

    return tsB - tsA
  })
}

export const createNewsAggregatorService = (options: AggregatorOptions) => {
  const providers: NewsProvider[] = [
    createNewsApiProvider(options.newsApiKey),
    createGuardianProvider(options.guardianKey),
    createNewYorkTimesProvider(options.nytKey),
  ]

  const fetchAll = async (query: NewsQuery, signal?: AbortSignal): Promise<{ articles: Article[]; errors: ProviderError[] }> => {
    const providerName = providerNameFromSource(query.source) ?? query.provider
    const providersToCall = providerName ? providers.filter((provider) => (provider.name ?? provider.providerName) === providerName) : providers

    const settled = await Promise.allSettled(
      providersToCall.map(async (provider) => {
        const method = provider.searchArticles ?? provider.fetchArticles
        if (!method) {
          return []
        }

        return method.call(provider, query, signal)
      }),
    )

    const errors: ProviderError[] = []
    const articles: Article[] = []

    for (let index = 0; index < settled.length; index += 1) {
      const result = settled[index]
      const provider = providersToCall[index]

      if (result.status === 'fulfilled') {
        articles.push(...result.value)
        continue
      }

      errors.push({
        provider: provider.name,
        message: result.reason instanceof Error ? result.reason.message : String(result.reason),
        cause: result.reason,
      })
    }

    return {
      articles: sortAggregatedArticles(deduplicateArticles(articles), query.sort),
      errors,
    }
  }

  return { fetchAll }
}
