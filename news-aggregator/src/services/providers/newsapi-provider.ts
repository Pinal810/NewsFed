import type { NewsProvider } from '../news-provider'
import type { Article } from '../../domain/models/article'
import type { NewsQuery } from '../../types/news-query'
import { fetchNewsApiArticles } from '../../api/newsapi'
import { mapNewsApiToArticles } from '../../adapters/newsapi-adapter'

export const createNewsApiProvider = (apiKey: string): NewsProvider => ({
  providerName: 'newsapi',

  async fetchArticles(query: NewsQuery): Promise<Article[]> {
    const resp = await fetchNewsApiArticles(apiKey, query)

    return mapNewsApiToArticles(resp)
  },
})
