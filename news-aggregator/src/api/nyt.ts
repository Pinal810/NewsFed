import type { NewsQuery } from '../types/news-query'
import { createAxiosInstance } from './axios'
import type { NytResponse } from './nyt.types'

// We'll use the Article Search API endpoint for flexible querying
export async function fetchNytArticles(apiKey: string, query: NewsQuery): Promise<NytResponse> {
  const client = createAxiosInstance({ baseURL: 'https://api.nytimes.com/svc/search/v2' })

  const params: Record<string, string | number> = { 'api-key': apiKey }
  if (query.q) params.q = query.q
  if (query.page) params.page = query.page
  if (query.from) params.begin_date = query.from.replace(/-/g, '')
  if (query.to) params.end_date = query.to.replace(/-/g, '')

  const res = await client.get<NytResponse>('/articlesearch.json', { params })
  return res.data
}
