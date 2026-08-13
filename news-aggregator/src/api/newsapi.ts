import type { NewsQuery } from '../types/news-query'
import type { NewsApiResponse } from './newsapi.types'
import { createAxiosInstance } from './axios'

export async function fetchNewsApiArticles(
  apiKey: string,
  query: NewsQuery,
  signal?: AbortSignal,
): Promise<NewsApiResponse> {
  const baseURL = import.meta.env.VITE_NEWSAPI_BASE_URL ?? 'https://newsapi.org/v2'

  const client = createAxiosInstance({ baseURL })
  const params: Record<string, string | number> = {}

  client.defaults.headers.common['X-Api-Key'] = apiKey

  const searchTerms = [query.q, query.author].filter(Boolean).join(' ')
  if (searchTerms) {
    params.q = searchTerms
  }

  if (query.category) {
    params.q = query.q ? `${query.q} ${query.category}` : query.category
  }

  if (query.qInTitle || query.q) {
    params.qInTitle = query.qInTitle || query.q || ''
  }

//   const sourceValue = query.sources ?? query.sourceId ?? query.source
//   if (sourceValue) {
    params.sources = 'bbc-news'
//   }

  if (query.domains) {
    params.domains = query.domains
  }
  if (query.author) {
    params.author = query.author
  }

  if (query.from) params.from = query.from
  if (query.to) params.to = query.to
  if (query.page) params.page = query.page
  if (query.pageSize) params.pageSize = query.pageSize

  const res = await client.get<NewsApiResponse>('/everything', {
    params,
    signal,
  })

  return res.data
}
