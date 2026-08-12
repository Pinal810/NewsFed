import React from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedValue } from './useDebouncedValue'
import { parseArticleListQuery, serializeArticleListQuery, useArticleListQuery } from './useArticleListQuery'

const makeWrapper = (initialPath = '/search?category=technology&source=guardian&sort=oldest&from=2026-08-01&to=2026-08-12&q=ai') => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="*" element={<>{children}</>} />
      </Routes>
    </MemoryRouter>
  )

  return Wrapper
}

describe('article list query helpers', () => {
  it('parses URL state safely and normalizes invalid values', () => {
    const parsed = parseArticleListQuery(
      new URLSearchParams('q=ai&category=technology&source=guardian&author=Jane&from=2026-08-01&to=2026-08-12&sort=oldest&page=3')
    )

    expect(parsed).toMatchObject({
      q: 'ai',
      category: 'technology',
      source: 'guardian',
      author: 'Jane',
      from: '2026-08-01',
      to: '2026-08-12',
      sort: 'oldest',
      page: 3,
    })

    expect(parseArticleListQuery(new URLSearchParams('category=banana&sort=unknown&source=invalid&page=0'))).toMatchObject({
      category: undefined,
      source: undefined,
      sort: 'newest',
      page: 1,
    })
  })

  it('serializes query state deterministically', () => {
    const params = serializeArticleListQuery({
      q: 'artificial intelligence',
      category: 'technology',
      source: 'guardian',
      author: 'Jane Doe',
      from: '2026-08-01',
      to: '2026-08-12',
      sort: 'newest',
      page: 2,
    })

    expect(params.toString()).toContain('q=artificial+intelligence')
    expect(params.get('source')).toBe('guardian')
    expect(params.get('page')).toBe('2')
  })
})

describe('useArticleListQuery', () => {
  it('reads settings from the URL and updates them deterministically', async () => {
    const { result } = renderHook(() => useArticleListQuery(), { wrapper: makeWrapper() })

    await waitFor(() => {
      expect(result.current.query).toMatchObject({
        q: 'ai',
        category: 'technology',
        source: 'guardian',
        sort: 'oldest',
      })
    })

    act(() => {
      result.current.setQuery({ q: 'deep learning', source: 'nyt', sort: 'newest', page: 1 })
    })

    await waitFor(() => {
      expect(result.current.query.q).toBe('deep learning')
      expect(result.current.query.source).toBe('nyt')
    })
  })
})

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('debounces updates', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 200), {
      initialProps: { value: 'one' },
    })

    expect(result.current).toBe('one')

    rerender({ value: 'two' })
    expect(result.current).toBe('one')

    act(() => {
      vi.advanceTimersByTime(199)
    })
    expect(result.current).toBe('one')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('two')
  })
})
