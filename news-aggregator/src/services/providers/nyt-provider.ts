import type { NewsProvider } from '../news-provider'
import type { Article } from '../../domain/models/article'
import type { NewsQuery } from '../../types/news-query'
import { fetchNytArticles } from '../../api/nyt'
import { mapNytToArticles } from '../../adapters/nyt-adapter'

export const createNewYorkTimesProvider = (apiKey: string): NewsProvider => ({
  name: 'nyt',
  providerName: 'nyt',

  async searchArticles(query: NewsQuery, signal?: AbortSignal): Promise<Article[]> {
    const resp = await fetchNytArticles(apiKey, query, signal)
    return mapNytToArticles(resp)
  },

  fetchArticles(query: NewsQuery, signal?: AbortSignal): Promise<Article[]> {
    return this.searchArticles(query, signal)
  },
})