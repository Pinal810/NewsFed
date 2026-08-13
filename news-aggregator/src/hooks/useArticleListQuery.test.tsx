import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedValue } from './useDebouncedValue'
import { parseArticleListQuery, serializeArticleListQuery } from './useArticleListQuery'


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
    expect(params.get('from')).toBe('2026-08-01')
    expect(params.get('to')).toBe('2026-08-12')
  })

  it('preserves date range values in the parsed URL state', () => {
    const parsed = parseArticleListQuery(new URLSearchParams('from=2026-08-01&to=2026-08-12'))

    expect(parsed.from).toBe('2026-08-01')
    expect(parsed.to).toBe('2026-08-12')
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
