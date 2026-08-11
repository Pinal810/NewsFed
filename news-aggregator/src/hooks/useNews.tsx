import { useCallback, useEffect, useMemo, useState } from 'react'
import { createNewsAggregatorService } from '../services/news-aggregator'
import type { Article } from '../domain/models/article'
import type { NewsQuery } from '../types/news-query'

type State = {
  articles: Article[]
  loading: boolean
  error?: string
}

export function useNews(initialQuery: Partial<NewsQuery> = {}) {
  const [query, setQuery] = useState<NewsQuery>({ ...initialQuery })
  const [state, setState] = useState<State>({ articles: [], loading: false })

  const service = useMemo(() => {
    const newsApiKey = import.meta.env.VITE_NEWSAPI_KEY ?? ''
    const guardianKey = import.meta.env.VITE_GUARDIAN_KEY ?? ''
    const nytKey = import.meta.env.VITE_NYT_KEY ?? ''
    return createNewsAggregatorService({ newsApiKey, guardianKey, nytKey, })
  }, [])

  const fetch = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: undefined }))
    try {
      const articles = await service.fetchAll(query)
      setState({ articles, loading: false })
    } catch (err) {
      setState({ articles: [], loading: false, error: (err as Error).message ?? String(err) })
    }
  }, [query, service])

  useEffect(() => {
    fetch()
  }, [fetch])

  return {
    articles: state.articles,
    loading: state.loading,
    error: state.error,
    setQuery,
    query,
    refresh: fetch,
  }
}

export default useNews
