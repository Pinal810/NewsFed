import type { NewsProvider } from '../news-provider'
import type { Article } from '../../domain/models/article'
import type { NewsQuery } from '../../types/news-query'
import { fetchNytArticles } from '../../api/nyt'
import { mapNytToArticles } from '../../adapters/nyt-adapter'

export const createNewYorkTimesProvider = (apiKey: string): NewsProvider => ({
  providerName: 'nyt',

  async fetchArticles(query: NewsQuery): Promise<Article[]> {
    const resp = await fetchNytArticles(apiKey, query)
    return mapNytToArticles(resp)
  },
})