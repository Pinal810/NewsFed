import type { NewsQuery } from '../types/news-query'
import type { NewsApiResponse, NewsApiArticle } from './newsapi.types'
import { createAxiosInstance } from './axios'

export async function fetchNewsApiArticles(apiKey: string, query: NewsQuery): Promise<NewsApiResponse> {
  const client = createAxiosInstance({ baseURL: 'https://newsapi.org/v2', headers: { 'X-Api-Key': apiKey } })

  const params: Record<string, string | number> = {}
  if (query.q) params.q = query.q
  if (query.category) params.category = query.category
  if (query.from) params.from = query.from
  if (query.to) params.to = query.to
  if (query.page) params.page = query.page
  if (query.pageSize) params.pageSize = query.pageSize

  const res = await client.get<NewsApiResponse>('/everything', { params })
  return res.data
}
