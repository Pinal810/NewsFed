import React, { useMemo, useState } from 'react'
import { Header } from '../components/Header'
import SearchBar from '../components/SearchBar'
import ArticleGrid from '../components/ArticleGrid'
import LoadingState from '../components/states/LoadingState'
import EmptyState from '../components/states/EmptyState'
import CategoryFilter from '../components/CategoryFilter'
import SourceFilter from '../components/SourceFilter'
import SortSelect from '../components/SortSelect'
import useNews from '../hooks/useNews'
import { useArticleListQuery } from '../hooks/useArticleListQuery'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import usePreferences from '../hooks/usePreferences'
import { writeArticleCache } from '../services/article-cache'
import { rankArticlesForPreferences } from '../services/preferences/preferences-ranking'
import { buildArticleIdentifier } from '../domain/models/article'
import type { ArticleCategory } from '../types/article-category'
import type { ArticleSort, NewsSourceFilterValue } from '../types/news-query'

export const ArticleListPage: React.FC = () => {
  const { query, setQuery, navigateToCategory, location } = useArticleListQuery()
  const [searchInput, setSearchInput] = useState(query.q ?? '')
  const debouncedSearch = useDebouncedValue(searchInput, 400)

  const effectiveQuery = useMemo(() => ({ ...query, q: debouncedSearch }), [query, debouncedSearch])
  const { articles, loading } = useNews(effectiveQuery)
  const { preferences } = usePreferences()
  const rankedArticles = useMemo(() => rankArticlesForPreferences(articles, preferences), [articles, preferences])

  React.useEffect(() => {
    writeArticleCache(articles)
  }, [articles])

  React.useEffect(() => {
    if (debouncedSearch !== query.q) {
      setQuery({ q: debouncedSearch, page: 1 })
    }
  }, [debouncedSearch, query.q, setQuery])

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchInput(query.q ?? '')
  }, [query.q])

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

  const loadMore = () => {
    setQuery({ page: (query.page ?? 1) + 1 })
  }

  return (
    <div>
      <Header />
      <main style={{ maxWidth: 1116, margin: '20px auto', padding: '0 16px' }}>
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
        </div>

        {/* <PreferencesPanel preferences={preferences} availableAuthors={authorOptions} onSave={savePreferences} onReset={resetPreferences} /> */}

        {loading && <LoadingState />}
        {/* {error && <ErrorState message={error} onRetry={refresh} />} */}
        {!loading &&  rankedArticles.length === 0 && <EmptyState message="No articles match your filters." />}
        {!loading &&  rankedArticles.length > 0 && (
          <ArticleGrid articles={rankedArticles} detailUrlBuilder={(article) => `/article/${encodeURIComponent(buildArticleIdentifier(article))}`} />
        )}

        {!loading &&  rankedArticles.length > 0 && (
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

export default ArticleListPage
