import type { Article } from '../domain/models/article'
import type { NewsQuery } from '../types/news-query'
import type { NewsProviderName } from '../types/news-provider-name'

/**
 * Common interface for news providers.
 * Implementations should adapt provider-specific responses to `Article`.
 */
export interface NewsProvider {
  readonly providerName: NewsProviderName

  fetchArticles(query: NewsQuery): Promise<Article[]>

  /**
   * Optional helper to map a raw provider item to the common `Article`.
   * Implementations may expose this for testing or reuse.
   */
  mapToArticle?(raw: unknown): Article
}
