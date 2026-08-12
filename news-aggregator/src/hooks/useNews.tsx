import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createNewsAggregatorService } from '../services/news-aggregator'
import type { Article } from '../domain/models/article'
import type { NewsQuery } from '../types/news-query'

type State = {
  articles: Article[]
  loading: boolean
  error?: string
}

function sortArticles(articles: Article[], sort?: 'newest' | 'oldest' | 'relevance') {
  return [...articles].sort((a, b) => {
    const ta = Date.parse(a.publishedAt || '') || 0
    const tb = Date.parse(b.publishedAt || '') || 0

    if (sort === 'oldest') return ta - tb
    if (sort === 'relevance') return (b.title?.length ?? 0) - (a.title?.length ?? 0)
    return tb - ta
  })
}

export function useNews(query: NewsQuery) {
  const [state, setState] = useState<State>({ articles: [], loading: false })
  const abortRef = useRef<AbortController | null>(null)
  const requestIdRef = useRef(0)

  const service = useMemo(() => {
    const newsApiKey = import.meta.env.VITE_NEWSAPI_KEY ?? ''
    const guardianKey = import.meta.env.VITE_GUARDIAN_KEY ?? ''
    const nytKey = import.meta.env.VITE_NYT_KEY ?? ''
    return createNewsAggregatorService({ newsApiKey, guardianKey, nytKey })
  }, [])

  const fetch = useCallback(async () => {
    abortRef.current?.abort()
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    const controller = new AbortController()
    abortRef.current = controller

    setState((current) => ({ ...current, loading: true, error: undefined }))

    try {
      const result = await service.fetchAll(query, controller.signal)
      if (requestId !== requestIdRef.current) return

      const articles = sortArticles(result.articles, query.sort)
      const errorMessage = result.errors.length > 0 ? result.errors.map((providerError) => `${providerError.provider}: ${providerError.message}`).join('; ') : undefined
      setState({ articles, loading: false, error: errorMessage })
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      if (requestId !== requestIdRef.current) return
      setState({ articles: [], loading: false, error: (err as Error).message ?? String(err) })
    }
  }, [query, service])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetch()
    return () => {
      abortRef.current?.abort()
    }
  }, [fetch])

  return {
    articles: state.articles,
    loading: state.loading,
    error: state.error,
    refresh: fetch,
  }
}

export default useNews
