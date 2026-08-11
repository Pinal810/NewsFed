import type { NewsQuery } from '../types/news-query'
import type { NewsApiResponse } from './newsapi.types'
import { createAxiosInstance } from './axios'

export async function fetchNewsApiArticles(
    apiKey: string,
    query: NewsQuery
): Promise<NewsApiResponse> {
    const baseURL =
        import.meta.env.VITE_NEWSAPI_BASE_URL ?? 'https://newsapi.org/v2'

    const client = createAxiosInstance({
        baseURL,
    })

    const params: Record<string, string | number> = {}

    // NewsAPI.org authentication
    client.defaults.headers.common['X-Api-Key'] = apiKey

    // Search query
    if (query.category) {
        params.q = query.category
    }

    // Search words in title
    if (query.qInTitle || query.q) {
        params.qInTitle = query.qInTitle || query.q || ''
    }

    // Sources
    const sourcesValue = query.sources ?? query.sourceId

    if (sourcesValue) {
        params.sources = sourcesValue
    }

    // Domains
    if (query.domains) {
        params.domains = query.domains
    }

    // Date range
    if (query.from) {
        params.from = query.from
    }

    if (query.to) {
        params.to = query.to
    }

    // Pagination
    if (query.page) {
        params.page = query.page
    }

    if (query.pageSize) {
        params.pageSize = query.pageSize
    }

    const res = await client.get<NewsApiResponse>('/everything', {
        params,
    })

    return res.data
}
