import type { NewsProvider } from '../news-provider'
import type { Article } from '../../domain/models/article'
import type { NewsQuery } from '../../types/news-query'
import { fetchGuardianArticles } from '../../api/guardian'
import { mapGuardianToArticles } from '../../adapters/guardian-adapter'

export class GuardianProvider implements NewsProvider {
  readonly providerName = 'theguardian'

  constructor(private apiKey: string) {}

  async fetchArticles(query: NewsQuery): Promise<Article[]> {
    const resp = await fetchGuardianArticles(this.apiKey, query)
    return mapGuardianToArticles(resp)
  }
}
