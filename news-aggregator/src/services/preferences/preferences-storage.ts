import type { UserPreferences } from '../../domain/preferences/user-preferences'
import { DEFAULT_USER_PREFERENCES } from '../../domain/preferences/user-preferences'

export interface PreferencesStorage {
  get(): UserPreferences
  save(preferences: UserPreferences): void
  clear(): void
}

export const PREFERENCES_STORAGE_KEY = 'news-aggregator.preferences'

function normalizeList(values: unknown): string[] {
  if (!Array.isArray(values)) return []

  return [...new Set(values.filter((value): value is string => typeof value === 'string').map((value) => value.trim()).filter(Boolean).map((value) => value.toLowerCase()))]
}

function normalizeCategories(values: unknown): UserPreferences['categories'] {
  const validCategories = new Set<string>([
    'general',
    'business',
    'entertainment',
    'health',
    'science',
    'sports',
    'technology',
    'world',
    'politics',
    'other',
  ])

  if (!Array.isArray(values)) return []

  return [...new Set(values.filter((value): value is string => typeof value === 'string').map((value) => value.trim().toLowerCase()).filter((value) => validCategories.has(value)) as string[])] as UserPreferences['categories']
}

export function normalizePreferences(raw: unknown): UserPreferences {
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_USER_PREFERENCES
  }

  const candidate = raw as Partial<UserPreferences>

  return {
    sources: normalizeList(candidate.sources),
    categories: normalizeCategories(candidate.categories),
    authors: normalizeList(candidate.authors),
  }
}

export class LocalStoragePreferencesStorage implements PreferencesStorage {
  private readonly storage: Storage | null

  constructor(storage: Storage | null = typeof window === 'undefined' ? null : window.localStorage) {
    this.storage = storage
  }

  get(): UserPreferences {
    if (!this.storage) {
      return DEFAULT_USER_PREFERENCES
    }

    try {
      const raw = this.storage.getItem(PREFERENCES_STORAGE_KEY)
      if (!raw) {
        return DEFAULT_USER_PREFERENCES
      }

      const parsed = JSON.parse(raw) as unknown
      return normalizePreferences(parsed)
    } catch {
      return DEFAULT_USER_PREFERENCES
    }
  }

  save(preferences: UserPreferences): void {
    if (!this.storage) {
      return
    }

    const normalized = normalizePreferences(preferences)
    this.storage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(normalized))
  }

  clear(): void {
    if (!this.storage) {
      return
    }

    this.storage.removeItem(PREFERENCES_STORAGE_KEY)
  }
}

export function createPreferencesStorage(storage?: Storage | null): PreferencesStorage {
  return new LocalStoragePreferencesStorage(storage ?? (typeof window === 'undefined' ? null : window.localStorage))
}
