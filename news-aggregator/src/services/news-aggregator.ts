import type { Article } from '../domain/models/article'
import type { NewsQuery } from '../types/news-query'
import type { NewsProvider } from './news-provider'
import { createNewsApiProvider } from './providers/newsapi-provider'
import { createGuardianProvider } from './providers/guardian-provider'

import { createNewYorkTimesProvider } from './providers/nyt-provider'
export type AggregatorOptions = {
    newsApiKey: string
    guardianKey: string
    nytKey: string
}
export const createNewsAggregatorService = (options: AggregatorOptions,) => {
    const providers: NewsProvider[] = [
        createNewsApiProvider(options.newsApiKey),
        createGuardianProvider(options.guardianKey),
        createNewYorkTimesProvider(options.nytKey),
    ]

    const fetchAll = async (query: NewsQuery): Promise<Article[]> => {
        const providersToCall = query.provider
            ? providers.filter((provider) => provider.providerName === query.provider,)
            : providers
        const settled = await Promise.allSettled(providersToCall.map((provider) => provider.fetchArticles(query)),)
        const articles: Article[] = []

        for (const result of settled) {
            if (result.status === 'fulfilled') {
                articles.push(...result.value)
            }
        }

        const articleMap = new Map<string, Article>()
        for (const article of articles) {
            if (!articleMap.has(article.url)) {
                articleMap.set(article.url, article)
            }
        }

        const sorted = Array.from(articleMap.values())
        return sorted.sort((a, b) => {
            const ta = Date.parse(a.publishedAt || '') || 0
            const tb = Date.parse(b.publishedAt || '') || 0
            if (query.sort === 'oldest') {
                return ta - tb
            }
            return tb - ta
        })
    }

    return {
        fetchAll
    }
}
