import type { NewsProvider } from '../news-provider'
import type { Article } from '../../domain/models/article'
import type { NewsQuery } from '../../types/news-query'
import { fetchNytArticles } from '../../api/nyt'
import { mapNytToArticles } from '../../adapters/nyt-adapter'

export class NewYorkTimesProvider implements NewsProvider {
  readonly providerName = 'nyt'

  constructor(private apiKey: string) {}

  async fetchArticles(query: NewsQuery): Promise<Article[]> {
    const resp = await fetchNytArticles(this.apiKey, query)
    return mapNytToArticles(resp)
  }
}
