import type { NytResponse } from '../api/nyt.types'
import type { Article } from '../domain/models/article'

export function mapNytToArticles(resp: NytResponse): Article[] {
  return resp.response.docs.map((d) => ({
    id: d._id,
    title: d.headline?.main ?? d.abstract ?? d.snippet ?? '',
    description: d.abstract ?? d.lead_paragraph ?? undefined,
    content: d.lead_paragraph ?? undefined,
    url: d.web_url,
    imageUrl: d.multimedia?.length ? `https://www.nytimes.com/${d.multimedia[0].url}` : undefined,
    publishedAt: d.pub_date ?? '',
    author: d.byline?.original ?? undefined,
    source: { id: d.source ?? 'nyt', name: d.source ?? 'New York Times', provider: 'nyt' },
    category: undefined,
    provider: 'nyt',
    raw: d,
  }))
}
