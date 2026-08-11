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
import useNews from '../hooks/useNews'
import { useArticleListQuery } from '../hooks/useArticleListQuery'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import type { ArticleCategory } from '../types/article-category'

export const ArticleListPage: React.FC = () => {
  const { query, setQuery, navigateToCategory, location } = useArticleListQuery()
  const [searchInput, setSearchInput] = useState(query.q ?? '')
  const debouncedSearch = useDebouncedValue(searchInput, 400)

  const effectiveQuery = useMemo(() => ({ ...query, q: debouncedSearch }), [query, debouncedSearch])
  const { articles, loading, error, refresh } = useNews(effectiveQuery)

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

  const onSourceChange = (provider?: 'newsapi' | 'theguardian' | 'nyt') => {
    setQuery({ provider, page: 1 })
  }

  const onSortChange = (sort: 'latest' | 'oldest') => {
    setQuery({ sort, page: 1 })
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
            <SourceFilter value={query.provider} onChange={onSourceChange} />
            <SortSelect value={query.sort ?? 'latest'} onChange={onSortChange} />
          </div>
        </div>

        {loading && <LoadingState />}
        {error && <ErrorState message={error} onRetry={refresh} />}
        {!loading && !error && articles.length === 0 && <EmptyState message="No articles match your filters." />}
        {!loading && !error && articles.length > 0 && (
          <ArticleGrid articles={articles} detailUrlBuilder={(article) => `/article/${encodeURIComponent(article.id)}`} />
        )}

        {!loading && !error && articles.length > 0 && (
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
