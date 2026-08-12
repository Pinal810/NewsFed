import { useMemo } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import type { ArticleCategory } from '../types/article-category'
import {
  DEFAULT_ARTICLE_SORT,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  normalizeSourceValue,
  providerNameFromSource,
  serializeSourceValue,
  type ArticleSort,
  type NewsQuery,
} from '../types/news-query'

const VALID_CATEGORIES = new Set<ArticleCategory>(['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology', 'world', 'politics', 'other'])
const VALID_SORTS = new Set<ArticleSort>(['newest', 'oldest', 'relevance'])

function trimToUndefined(value: string | null | undefined): string | undefined {
  if (value == null) return undefined
  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}

function parsePositiveInteger(value: string | null | undefined, fallback: number): number {
  if (value == null) return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback
}

function parseDate(value: string | null | undefined): string | undefined {
  const trimmed = trimToUndefined(value)
  if (!trimmed) return undefined
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return undefined
  return trimmed
}

function parseCategory(value: string | null | undefined): ArticleCategory | undefined {
  const normalized = trimToUndefined(value)
  if (!normalized) return undefined
  return VALID_CATEGORIES.has(normalized as ArticleCategory) ? (normalized as ArticleCategory) : undefined
}

export function parseArticleListQuery(searchParams: URLSearchParams): NewsQuery {
  const q = trimToUndefined(searchParams.get('q'))
  const category = parseCategory(searchParams.get('category'))
  const source = normalizeSourceValue(searchParams.get('source') ?? undefined)
  const author = trimToUndefined(searchParams.get('author'))
  const from = parseDate(searchParams.get('from'))
  const to = parseDate(searchParams.get('to'))
  const sortParam = trimToUndefined(searchParams.get('sort'))?.toLowerCase()
  const sort = sortParam && VALID_SORTS.has(sortParam as ArticleSort) ? (sortParam as ArticleSort) : DEFAULT_ARTICLE_SORT
  const page = parsePositiveInteger(searchParams.get('page'), DEFAULT_PAGE)
  const pageSize = parsePositiveInteger(searchParams.get('pageSize'), DEFAULT_PAGE_SIZE)

  const query: NewsQuery = {
    q,
    category,
    source,
    author,
    from,
    to,
    sort,
    page,
    pageSize,
  }

  if (query.category === undefined && searchParams.get('category')) {
    query.category = undefined
  }

  return query
}

export function serializeArticleListQuery(query: Partial<NewsQuery> = {}): URLSearchParams {
  const params = new URLSearchParams()

  if (query.q) {
    params.set('q', query.q.trim())
  }

  if (query.category) {
    params.set('category', query.category)
  }

  if (query.source) {
    const sourceValue = serializeSourceValue(query.source)
    if (sourceValue) params.set('source', sourceValue)
  }

  if (query.author) {
    params.set('author', query.author.trim())
  }

  if (query.from) {
    params.set('from', query.from)
  }

  if (query.to) {
    params.set('to', query.to)
  }

  if (query.sort && query.sort !== DEFAULT_ARTICLE_SORT) {
    params.set('sort', query.sort)
  } else if (query.sort) {
    params.set('sort', DEFAULT_ARTICLE_SORT)
  }

  if (query.page && query.page > 1) {
    params.set('page', String(query.page))
  }

  if (query.pageSize && query.pageSize !== DEFAULT_PAGE_SIZE) {
    params.set('pageSize', String(query.pageSize))
  }

  params.sort()
  return params
}

export function useArticleListQuery() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams<{ category?: ArticleCategory }>()

  const query = useMemo<NewsQuery>(() => {
    const parsed = parseArticleListQuery(searchParams)
    const category = params.category ? parseCategory(params.category) ?? parsed.category : parsed.category
    return {
      ...parsed,
      category,
      provider: providerNameFromSource(parsed.source),
    }
  }, [params.category, searchParams])

  const setQuery = (partial: Partial<NewsQuery>) => {
    const nextQuery: NewsQuery = {
      ...query,
      ...partial,
    }

    const nextParams = serializeArticleListQuery(nextQuery)

    const nextCategory = partial.category ?? query.category
    if (partial.category !== undefined || (partial.category === undefined && location.pathname.startsWith('/category/'))) {
      if (nextCategory) {
        navigate(`/category/${nextCategory}${nextParams.size > 0 ? `?${nextParams.toString()}` : ''}`, { replace: true })
        return
      }

      const newPath = location.pathname === '/search' ? '/search' : '/'
      navigate(`${newPath}${nextParams.size > 0 ? `?${nextParams.toString()}` : ''}`, { replace: true })
      return
    }

    setSearchParams(nextParams, { replace: true })
  }

  const navigateToCategory = (category?: ArticleCategory) => {
    const nextParams = serializeArticleListQuery({ ...query, category })
    if (category) {
      navigate(`/category/${category}${nextParams.size > 0 ? `?${nextParams.toString()}` : ''}`, { replace: true })
      return
    }

    navigate(`/${nextParams.size > 0 ? `?${nextParams.toString()}` : ''}`, { replace: true })
  }

  return { query, setQuery, navigateToCategory, location }
}

export default useArticleListQuery
