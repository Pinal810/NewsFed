import type { Article } from '../domain/models/article'
import { buildArticleIdentifier } from '../domain/models/article'

const ARTICLE_CACHE_KEY = 'news-aggregator.article-cache.v1'

export function readArticleCache(): Record<string, Article> {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const raw = window.sessionStorage.getItem(ARTICLE_CACHE_KEY)
    if (!raw) {
      return {}
    }

    const parsed = JSON.parse(raw) as Record<string, unknown>
    return Object.fromEntries(
      Object.entries(parsed).filter(([, value]) => Boolean(value) && typeof value === 'object'),
    ) as Record<string, Article>
  } catch {
    return {}
  }
}

export function writeArticleCache(articles: Article[]): Record<string, Article> {
  if (typeof window === 'undefined') {
    return {}
  }

  const cache = readArticleCache()

  for (const article of articles) {
    const articleId = buildArticleIdentifier(article)
    cache[articleId] = article
  }

  try {
    window.sessionStorage.setItem(ARTICLE_CACHE_KEY, JSON.stringify(cache))
  } catch {
    // Ignore quota/storage issues rather than crashing the app.
  }

  return cache
}

export function getCachedArticleById(articleId: string): Article | undefined {
  const cache = readArticleCache()
  return cache[articleId]
}
