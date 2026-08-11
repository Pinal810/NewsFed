import type { NewsProvider } from '../news-provider'
import type { Article } from '../../domain/models/article'
import type { NewsQuery } from '../../types/news-query'
import { fetchGuardianArticles } from '../../api/guardian'
import { mapGuardianToArticles } from '../../adapters/guardian-adapter'

export const createGuardianProvider = (apiKey: string): NewsProvider => ({
  providerName: 'theguardian',

  async fetchArticles(query: NewsQuery): Promise<Article[]> {
    const resp = await fetchGuardianArticles(apiKey, query)

    return mapGuardianToArticles(resp)
  },
})
