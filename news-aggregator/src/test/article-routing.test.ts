import { describe, expect, it } from 'vitest'
import { buildArticleIdentifier, parseArticleIdentifier } from '../domain/models/article'
import type { Article } from '../domain/models/article'

describe('article routing identity', () => {
  it('creates stable provider-safe identifiers across providers', () => {
    const newsApiArticle: Article = {
      id: 'newsapi-123',
      title: 'AI update',
      url: 'https://example.com/ai?utm_source=test',
      publishedAt: '2026-08-12T00:00:00.000Z',
      source: { id: 'example', name: 'Example', provider: 'newsapi' },
      provider: 'newsapi',
    }

    const guardianArticle: Article = {
      id: 'guardian-456',
      title: 'Global update',
      url: 'https://www.theguardian.com/world/2026/aug/12/story',
      publishedAt: '2026-08-12T00:00:00.000Z',
      source: { id: 'world', name: 'World', provider: 'theguardian' },
      provider: 'theguardian',
    }

    expect(buildArticleIdentifier(newsApiArticle)).toContain('newsapi:')
    expect(buildArticleIdentifier(guardianArticle)).toContain('theguardian:')
    expect(buildArticleIdentifier(newsApiArticle)).not.toBe(newsApiArticle.id)
  })

  it('parses a generated identifier back to its canonical URL', () => {
    const id = 'newsapi:https%3A%2F%2Fexample.com%2Fai%2F'
    const parsed = parseArticleIdentifier(id)

    expect(parsed.provider).toBe('newsapi')
    expect(parsed.url).toBe('https://example.com/ai/')
  })
})
