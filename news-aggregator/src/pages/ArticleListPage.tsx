import React, { useMemo, useState } from 'react'
import { Header } from '../components/Header'
import SearchBar from '../components/SearchBar'
import ArticleGrid from '../components/ArticleGrid'
import LoadingState from '../components/states/LoadingState'
import ErrorState from '../components/states/ErrorState'
import EmptyState from '../components/states/EmptyState'
import CategoryFilter from '../components/CategoryFilter'
import SourceFilter from '../components/SourceFilter'
import SortSelect from '../components/SortSelect'
import PreferencesPanel from '../components/PreferencesPanel'
import useNews from '../hooks/useNews'
import { useArticleListQuery } from '../hooks/useArticleListQuery'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import usePreferences from '../hooks/usePreferences'
import { rankArticlesForPreferences } from '../services/preferences/preferences-ranking'
import type { ArticleCategory } from '../types/article-category'
import type { ArticleSort, NewsSourceFilterValue } from '../types/news-query'

const getDateRangePreset = (from?: string, to?: string) => {
  if (!from && !to) return 'all'
  if (from && to) return 'custom'
  return 'custom'
}

export const ArticleListPage: React.FC = () => {
  const { query, setQuery, navigateToCategory, location } = useArticleListQuery()
  const [searchInput, setSearchInput] = useState(query.q ?? '')
  const debouncedSearch = useDebouncedValue(searchInput, 400)
  const [datePreset, setDatePreset] = useState<'all' | 'today' | '7d' | '30d' | 'custom'>('all')

  const effectiveQuery = useMemo(() => ({ ...query, q: debouncedSearch }), [query, debouncedSearch])
  const { articles, loading, error, refresh } = useNews(effectiveQuery)
  const { preferences, savePreferences, resetPreferences } = usePreferences()
  const rankedArticles = useMemo(() => rankArticlesForPreferences(articles, preferences), [articles, preferences])
  const authorOptions = useMemo(
    () => [...new Set(articles.flatMap((article) => (article.author ? [article.author] : [])))],
    [articles],
  )

  React.useEffect(() => {
    if (debouncedSearch !== query.q) {
      setQuery({ q: debouncedSearch, page: 1 })
    }
  }, [debouncedSearch, query.q, setQuery])

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchInput(query.q ?? '')
  }, [query.q])

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDatePreset(getDateRangePreset(query.from, query.to))
  }, [query.from, query.to])

  const title = useMemo(() => {
    if (query.category) {
      return `${query.category} News`
    }
    if (location.pathname === '/search') {
      return 'Search Results'
    }
    return 'Latest News'
  }, [location.pathname, query.category])

  const onCategoryChange = (category?: ArticleCategory) => {
    if (category) {
      navigateToCategory(category)
    } else {
      navigateToCategory(undefined)
      setQuery({ category: undefined, page: 1 })
    }
  }

  const onSourceChange = (source?: NewsSourceFilterValue) => {
    setQuery({ source, page: 1 })
  }

  const onSortChange = (sort: ArticleSort) => {
    setQuery({ sort, page: 1 })
  }

  const onAuthorChange = (author: string) => {
    setQuery({ author: author.trim() || undefined, page: 1 })
  }

  const onDatePresetChange = (preset: 'all' | 'today' | '7d' | '30d' | 'custom') => {
    const today = new Date()
    const to = new Date(today)
    const from = new Date(today)

    if (preset === 'today') {
      setQuery({ from: toISOStringDate(from), to: toISOStringDate(to), page: 1 })
      return
    }

    if (preset === '7d') {
      from.setDate(to.getDate() - 6)
      setQuery({ from: toISOStringDate(from), to: toISOStringDate(to), page: 1 })
      return
    }

    if (preset === '30d') {
      from.setDate(to.getDate() - 29)
      setQuery({ from: toISOStringDate(from), to: toISOStringDate(to), page: 1 })
      return
    }

    setQuery({ from: undefined, to: undefined, page: 1 })
  }

  const loadMore = () => {
    setQuery({ page: (query.page ?? 1) + 1 })
  }

  return (
    <div>
      <Header />
      <main style={{ maxWidth: 1126, margin: '20px auto', padding: '0 16px' }}>
        <h2 style={{ marginTop: 0, marginBottom: 18, fontSize: 28, color: 'var(--text-h)' }}>{title}</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', marginBottom: 20 }}>
          <SearchBar value={searchInput} onChange={setSearchInput} onSubmit={() => setQuery({ q: searchInput, page: 1 })} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <CategoryFilter value={query.category} onChange={onCategoryChange} />
            <SourceFilter value={query.source} onChange={onSourceChange} />
            <SortSelect value={query.sort ?? 'newest'} onChange={onSortChange} />
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20, alignItems: 'center' }}>
          <label>
            <span style={{ marginRight: 8 }}>Author</span>
            <input value={query.author ?? ''} onChange={(event) => onAuthorChange(event.target.value)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)' }} />
          </label>
          <label>
            <span style={{ marginRight: 8 }}>Preset</span>
            <select value={datePreset} onChange={(event) => onDatePresetChange(event.target.value as 'all' | 'today' | '7d' | '30d' | 'custom')}>
              <option value="all">All time</option>
              <option value="today">Today</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="custom">Custom</option>
            </select>
          </label>
          <label>
            <span style={{ marginRight: 8 }}>From</span>
            <input type="date" value={query.from ?? ''} onChange={(event) => setQuery({ from: event.target.value || undefined, page: 1 })} />
          </label>
          <label>
            <span style={{ marginRight: 8 }}>To</span>
            <input type="date" value={query.to ?? ''} onChange={(event) => setQuery({ to: event.target.value || undefined, page: 1 })} />
          </label>
        </div>

        <PreferencesPanel preferences={preferences} availableAuthors={authorOptions} onSave={savePreferences} onReset={resetPreferences} />

        {loading && <LoadingState />}
        {error && <ErrorState message={error} onRetry={refresh} />}
        {!loading && !error && rankedArticles.length === 0 && <EmptyState message="No articles match your filters." />}
        {!loading && !error && rankedArticles.length > 0 && (
          <ArticleGrid articles={rankedArticles} detailUrlBuilder={(article) => `/article/${encodeURIComponent(article.id)}`} />
        )}

        {!loading && !error && rankedArticles.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button onClick={loadMore} style={{ padding: '10px 18px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff' }}>
              Load more
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

function toISOStringDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

export default ArticleListPage
