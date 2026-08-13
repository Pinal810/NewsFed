import { describe, expect, it } from 'vitest'
import type { Article } from '../domain/models/article'
import { deduplicateArticles } from '../services/news-aggregator'

describe('aggregator helpers', () => {
  it('deduplicates articles by canonical URL and then provider id and title', () => {
    const articles: Article[] = [
      {
        id: 'a-1',
        title: 'AI Breakthrough',
        url: 'https://example.com/news?utm=1',
        publishedAt: '2026-08-12T00:00:00.000Z',
        source: { id: 'example', name: 'Example', provider: 'newsapi' },
        provider: 'newsapi',
      },
      {
        id: 'b-2',
        title: 'AI Breakthrough',
        url: 'https://example.com/news',
        publishedAt: '2026-08-12T01:00:00.000Z',
        source: { id: 'other', name: 'Other', provider: 'theguardian' },
        provider: 'theguardian',
      },
    ]

    expect(deduplicateArticles(articles)).toHaveLength(2)
  })
})
