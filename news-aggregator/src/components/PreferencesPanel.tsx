import React, { useMemo, useState } from 'react'
import { DEFAULT_USER_PREFERENCES } from '../domain/preferences/user-preferences'
import type { ArticleCategory } from '../types/article-category'
import type { UserPreferences } from '../domain/preferences/user-preferences'

const AVAILABLE_SOURCES = ['newsapi', 'guardian', 'nyt']
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
    <section style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <h3 style={{ margin: 0 }}>Personalized feed</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={handleSave} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--accent)', color: '#fff' }}>
            Save preferences
          </button>
          <button type="button" onClick={handleReset} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', color: 'var(--text)' }}>
            Reset
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 18 }}>
        <div>
          <h4 style={{ margin: '0 0 10px' }}>Sources</h4>
          {AVAILABLE_SOURCES.map((source) => (
            <label key={source} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <input type="checkbox" checked={draft.sources.includes(source)} onChange={() => toggleValue('sources', source)} />
              <span>{source === 'guardian' ? 'Guardian' : source === 'newsapi' ? 'NewsAPI' : 'NYT'}</span>
            </label>
          ))}
        </div>

        <div>
          <h4 style={{ margin: '0 0 10px' }}>Categories</h4>
          {ALL_CATEGORIES.map((category) => (
            <label key={category} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <input type="checkbox" checked={draft.categories.includes(category)} onChange={() => toggleValue('categories', category)} />
              <span>{category}</span>
            </label>
          ))}
        </div>

        <div>
          <h4 style={{ margin: '0 0 10px' }}>Authors</h4>
          {authorOptions.length === 0 ? (
            <p style={{ color: 'var(--text)', margin: 0 }}>No authors available yet.</p>
          ) : (
            authorOptions.map((author) => (
              <label key={author} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <input type="checkbox" checked={draft.authors.includes(author)} onChange={() => toggleValue('authors', author)} />
                <span>{author}</span>
              </label>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default PreferencesPanel
