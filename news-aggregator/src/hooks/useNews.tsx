import { useCallback, useEffect, useMemo, useState } from 'react'
import { createNewsAggregatorService } from '../services/news-aggregator'
import type { Article } from '../domain/models/article'
import type { NewsQuery } from '../types/news-query'

type State = {
  articles: Article[]
  loading: boolean
  error?: string
}

function sortArticles(articles: Article[], sort?: 'latest' | 'oldest') {
  return [...articles].sort((a, b) => {
    const ta = Date.parse(a.publishedAt || '') || 0
    const tb = Date.parse(b.publishedAt || '') || 0
    return sort === 'oldest' ? ta - tb : tb - ta
  })
}

export function useNews(query: NewsQuery) {
  const [state, setState] = useState<State>({ articles: [], loading: false })

  const service = useMemo(() => {
    const newsApiKey = import.meta.env.VITE_NEWSAPI_KEY ?? ''
    console.log("🚀 ~ useNews ~ newsApiKey:", newsApiKey)
    const guardianKey = import.meta.env.VITE_GUARDIAN_KEY ?? ''
    const nytKey = import.meta.env.VITE_NYT_KEY ?? ''
    return createNewsAggregatorService({ newsApiKey, guardianKey, nytKey })
  }, [])

  const fetch = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: undefined }))
    try {
      const fetched = await service.fetchAll(query)
      setState({ articles: sortArticles(fetched, query.sort), loading: false })
    } catch (err) {
      setState({ articles: [], loading: false, error: (err as Error).message ?? String(err) })
    }
  }, [query, service])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetch()
  }, [fetch])

  return {
    articles: state.articles,
    loading: state.loading,
    error: state.error,
    refresh: fetch,
  }
}

export default useNews
