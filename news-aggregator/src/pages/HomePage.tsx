import React from 'react'
import { Header } from '../components/Header'
import SearchBar from '../components/SearchBar'
import ArticleGrid from '../components/ArticleGrid'
import LoadingState from '../components/states/LoadingState'
import ErrorState from '../components/states/ErrorState'
import EmptyState from '../components/states/EmptyState'
import CategoryFilter from '../components/CategoryFilter'
import SourceFilter from '../components/SourceFilter'
import useNews from '../hooks/useNews'

export const HomePage: React.FC = () => {
  const { articles, loading, error, query, setQuery, refresh } = useNews()
  console.log("🚀 ~ HomePage ~ articles:", articles)

  return (
    <div>
      <Header />
      <main style={{ maxWidth: 1126, margin: '20px auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <SearchBar
            value={query.q ?? ''}
            onChange={(v) => setQuery({ ...query, q: v })}
            onSubmit={() => refresh()}
          />
          <div style={{ display: 'flex', gap: 12 }}>
            <CategoryFilter value={query.category} onChange={(v) => setQuery({ ...query, category: v })} />
            <SourceFilter value={query.provider} onChange={(v) => setQuery({ ...query, provider: v })} />
          </div>
        </div>

        {loading && <LoadingState />}
        {error && <ErrorState message={error} onRetry={() => refresh()} />}
        {!loading && !error && articles.length === 0 && <EmptyState />}
        {!loading && !error && articles.length > 0 && <ArticleGrid articles={articles} />}
      </main>
    </div>
  )
}

export default HomePage
