import type { NewsQuery } from '../types/news-query'
import { createAxiosInstance } from './axios'
import type { GuardianResponse } from './guardian.types'

export async function fetchGuardianArticles(apiKey: string, query: NewsQuery): Promise<GuardianResponse> {
  const client = createAxiosInstance({ baseURL: 'https://content.guardianapis.com' })

  const params: Record<string, string | number> = { 'api-key': apiKey, 'show-fields': 'headline,byline,thumbnail,body' }
  if (query.q) params.q = query.q
  if (query.page) params.page = query.page
  if (query.pageSize) params['page-size'] = query.pageSize ?? 20
  if (query.from) params.from = query.from
  if (query.to) params.to = query.to

  const res = await client.get<GuardianResponse>('/search', { params })
  return res.data
}
