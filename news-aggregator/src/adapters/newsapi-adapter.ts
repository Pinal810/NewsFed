import type { NewsApiResponse } from '../api/newsapi.types'
import type { Article } from '../domain/models/article'

export function mapNewsApiToArticles(resp: NewsApiResponse): Article[] {
  return resp.articles.map((a) => ({
    id: `${a.source.id ?? a.url}`,
    title: a.title,
    description: a.description ?? undefined,
    content: a.content ?? undefined,
    url: a.url,
    imageUrl: a.urlToImage ?? undefined,
    publishedAt: a.publishedAt,
    author: a.author ?? undefined,
    source: { id: a.source.id ?? a.source.name, name: a.source.name, provider: 'newsapi' },
    category: undefined,
    provider: 'newsapi',
    raw: a,
  }))
}
