import type { Article } from '../domain/models/article'
import type { NewsQuery } from '../types/news-query'
import type { NewsProvider } from './news-provider'
import { NewsApiProvider } from './providers/newsapi-provider'
import { GuardianProvider } from './providers/guardian-provider'
import { NewYorkTimesProvider } from './providers/nyt-provider'

export type AggregatorOptions = {
  newsApiKey: string
  guardianKey: string
  nytKey: string
}

export class NewsAggregatorService {
  private providers: NewsProvider[]

  constructor(options: AggregatorOptions) {
    this.providers = [
      new NewsApiProvider(options.newsApiKey),
      new GuardianProvider(options.guardianKey),
      new NewYorkTimesProvider(options.nytKey),
    ]
  }

  async fetchAll(query: NewsQuery): Promise<Article[]> {
    const settled = await Promise.allSettled(this.providers.map((p) => p.fetchArticles(query)))

    const articles: Article[] = []
    for (const r of settled) {
      if (r.status === 'fulfilled') {
        articles.push(...r.value)
      } else {
        // keep going if one provider fails; optionally log the error
        // console.error('Provider fetch failed', r.reason)
      }
    }

    // dedupe by URL
    const map = new Map<string, Article>()
    for (const a of articles) {
      if (!map.has(a.url)) map.set(a.url, a)
    }

    const deduped = Array.from(map.values())

    // sort by publishedAt descending
    deduped.sort((a, b) => {
      const ta = Date.parse(a.publishedAt || '') || 0
      const tb = Date.parse(b.publishedAt || '') || 0
      return tb - ta
    })

    return deduped
  }
}
