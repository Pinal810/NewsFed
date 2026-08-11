import { useMemo } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import type { NewsQuery } from '../types/news-query'
import type { ArticleCategory } from '../types/article-category'
import type { NewsProviderName } from '../types/news-provider-name'

const DEFAULT_PAGE_SIZE = 12

export function useArticleListQuery() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams<{ category?: ArticleCategory }>()

  const query = useMemo<NewsQuery>(() => {
    const q = searchParams.get('q') ?? undefined
    const provider = (searchParams.get('provider') as NewsProviderName) || undefined
    const sort = (searchParams.get('sort') as NewsQuery['sort']) || 'latest'
    const page = Number(searchParams.get('page') ?? 1)
    const pageSize = Number(searchParams.get('pageSize') ?? DEFAULT_PAGE_SIZE)

    return {
      q,
      provider,
      category: params.category,
      sort,
      page: Number.isNaN(page) || page < 1 ? 1 : page,
      pageSize: Number.isNaN(pageSize) || pageSize < 1 ? DEFAULT_PAGE_SIZE : pageSize,
    }
  }, [params.category, searchParams])

  const setQuery = (partial: Partial<NewsQuery>) => {
    const nextParams = new URLSearchParams(searchParams)

    if (partial.q !== undefined) {
      if (partial.q) nextParams.set('q', partial.q)
      else nextParams.delete('q')
    }

    if (partial.provider !== undefined) {
      if (partial.provider) nextParams.set('provider', partial.provider)
      else nextParams.delete('provider')
    }

    if (partial.sort !== undefined) {
      if (partial.sort === 'latest') nextParams.delete('sort')
      else nextParams.set('sort', partial.sort)
    }

    if (partial.page !== undefined) {
      if (partial.page === 1) nextParams.delete('page')
      else nextParams.set('page', String(partial.page))
    }

    if (partial.pageSize !== undefined) {
      if (partial.pageSize === DEFAULT_PAGE_SIZE) nextParams.delete('pageSize')
      else nextParams.set('pageSize', String(partial.pageSize))
    }

    setSearchParams(nextParams, { replace: true })
  }

  const navigateToCategory = (category?: ArticleCategory) => {
    if (category) {
      navigate(`/category/${category}${location.search}`)
    } else {
      navigate(`/${location.search}`)
    }
  }

  return { query, setQuery, navigateToCategory, location }
}

export default useArticleListQuery
