import React, { useMemo, useState } from 'react'
import { DEFAULT_USER_PREFERENCES } from '../domain/preferences/user-preferences'
import type { ArticleCategory } from '../types/article-category'
import type { UserPreferences } from '../domain/preferences/user-preferences'

const AVAILABLE_SOURCES = ['newsapi', 'guardian']
const ALL_CATEGORIES: ArticleCategory[] = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology', 'world', 'politics', 'other']

type Props = {
  preferences: UserPreferences
  availableAuthors: string[]
  onSave: (preferences: UserPreferences) => void
  onReset: () => void
}

export const PreferencesPanel: React.FC<Props> = ({ preferences, availableAuthors, onSave, onReset }) => {
  const [draft, setDraft] = useState<UserPreferences>(preferences)

  const authorOptions = useMemo(() => [...new Set(availableAuthors)], [availableAuthors])

  const toggleValue = <T extends string>(field: 'sources' | 'categories' | 'authors', value: T) => {
    setDraft((current) => {
      const values = current[field] as T[]
      const next = values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
      return { ...current, [field]: next }
    })
  }

  const handleSave = () => {
    onSave(draft)
  }

  const handleReset = () => {
    setDraft(DEFAULT_USER_PREFERENCES)
    onReset()
  }

  return (
    <section className="preferences-panel" aria-label="Article personalization settings">
      <div className="preferences-panel__header">
        <h3 className="preferences-panel__title">Personalized feed</h3>
        <div className="preferences-panel__buttons">
          <button type="button" className="action-button" onClick={handleSave}>
            Save preferences
          </button>
          <button type="button" className="secondary-button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      <div className="preferences-grid">
        <div className="preference-group">
          <h4>Sources</h4>
          <div className="preference-list">
            {AVAILABLE_SOURCES.map((source) => (
              <label key={source} className="preference-option">
                <input type="checkbox" checked={draft.sources.includes(source)} onChange={() => toggleValue('sources', source)} />
                <span>{source === 'guardian' ? 'Guardian' : 'NewsAPI'}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="preference-group">
          <h4>Categories</h4>
          <div className="preference-list">
            {ALL_CATEGORIES.map((category) => (
              <label key={category} className="preference-option">
                <input type="checkbox" checked={draft.categories.includes(category)} onChange={() => toggleValue('categories', category)} />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="preference-group">
          <h4>Authors</h4>
          <div className="preference-list">
            {authorOptions.length === 0 ? (
              <p>No authors available yet.</p>
            ) : (
              authorOptions.map((author) => (
                <label key={author} className="preference-option">
                  <input type="checkbox" checked={draft.authors.includes(author)} onChange={() => toggleValue('authors', author)} />
                  <span>{author}</span>
                </label>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PreferencesPanel
