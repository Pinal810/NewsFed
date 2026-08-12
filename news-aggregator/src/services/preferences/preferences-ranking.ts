import type { Article } from '../../domain/models/article'
import type { UserPreferences } from '../../domain/preferences/user-preferences'

const SOURCE_MATCH_SCORE = 3
const CATEGORY_MATCH_SCORE = 2
const AUTHOR_MATCH_SCORE = 4

function normalizePreferenceValue(value?: string): string {
  return (value ?? '').trim().toLowerCase()
}

export function scoreArticleForPreferences(article: Article, preferences: UserPreferences): number {
  let score = 0

  if (preferences.sources.length > 0) {
    const sourceNames = new Set([
      normalizePreferenceValue(article.provider),
      normalizePreferenceValue(article.source?.provider),
      normalizePreferenceValue(article.source?.id),
      normalizePreferenceValue(article.source?.name),
    ])

    const preferredSources = new Set(preferences.sources.map(normalizePreferenceValue))
    if ([...sourceNames].some((sourceName) => preferredSources.has(sourceName))) {
      score += SOURCE_MATCH_SCORE
    }
  }

  if (preferences.categories.length > 0) {
    const articleCategory = normalizePreferenceValue(article.category)
    if (preferences.categories.map(normalizePreferenceValue).includes(articleCategory)) {
      score += CATEGORY_MATCH_SCORE
    }
  }

  if (preferences.authors.length > 0) {
    const authorName = normalizePreferenceValue(article.author)
    if (preferences.authors.map(normalizePreferenceValue).includes(authorName)) {
      score += AUTHOR_MATCH_SCORE
    }
  }

  return score
}

export function rankArticlesForPreferences(articles: Article[], preferences: UserPreferences): Article[] {
  return [...articles]
    .map((article) => ({ article, score: scoreArticleForPreferences(article, preferences) }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score
      }

      const leftTime = Date.parse(left.article.publishedAt || '') || 0
      const rightTime = Date.parse(right.article.publishedAt || '') || 0
      return rightTime - leftTime
    })
    .map(({ article }) => article)
}
