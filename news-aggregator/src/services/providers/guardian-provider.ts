import type { NewsProvider } from '../news-provider'
import type { Article } from '../../domain/models/article'
import type { NewsQuery } from '../../types/news-query'
import { fetchGuardianArticles } from '../../api/guardian'
import { mapGuardianToArticles } from '../../adapters/guardian-adapter'

export const createGuardianProvider = (apiKey: string): NewsProvider => ({
  name: 'theguardian',
  providerName: 'theguardian',

  async searchArticles(query: NewsQuery, signal?: AbortSignal): Promise<Article[]> {
    const resp = await fetchGuardianArticles(apiKey, query, signal)
    return mapGuardianToArticles(resp)
  },

  fetchArticles(query: NewsQuery, signal?: AbortSignal): Promise<Article[]> {
    return this.searchArticles(query, signal)
  },
})
