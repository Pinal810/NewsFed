import type { NewsProvider } from '../news-provider'
import type { Article } from '../../domain/models/article'
import type { NewsQuery } from '../../types/news-query'
import { fetchNewsApiArticles } from '../../api/newsapi'
import { mapNewsApiToArticles } from '../../adapters/newsapi-adapter'

export class NewsApiProvider implements NewsProvider {
  readonly providerName = 'newsapi'

  constructor(private apiKey: string) {}

  async fetchArticles(query: NewsQuery): Promise<Article[]> {
    const resp = await fetchNewsApiArticles(this.apiKey, query)
    return mapNewsApiToArticles(resp)
  }

  mapToArticle?(raw: unknown) {
    // optional: adapter can be used directly
    return undefined as unknown as Article
  }
}
