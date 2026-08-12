import type { ArticleCategory } from '../../types/article-category'

export interface UserPreferences {
  sources: string[]
  categories: ArticleCategory[]
  authors: string[]
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  sources: [],
  categories: [],
  authors: [],
}
