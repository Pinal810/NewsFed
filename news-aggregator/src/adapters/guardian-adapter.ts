import type { GuardianResponse } from '../api/guardian.types'
import type { Article } from '../domain/models/article'

export function mapGuardianToArticles(resp: GuardianResponse): Article[] {
  return resp.response.results.map((r) => ({
    id: r.id,
    title: r.webTitle,
    description: r.fields?.headline ?? undefined,
    content: r.fields?.body ?? undefined,
    url: r.webUrl,
    imageUrl: r.fields?.thumbnail ?? undefined,
    publishedAt: r.webPublicationDate ?? '',
    author: r.fields?.byline ?? undefined,
    source: { id: r.sectionId ?? r.id, name: r.sectionName ?? r.webTitle, provider: 'theguardian' },
    category: undefined,
    provider: 'theguardian',
    raw: r,
  }))
}
