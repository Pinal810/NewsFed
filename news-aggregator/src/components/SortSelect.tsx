import React from 'react'
import type { ArticleSort } from '../types/news-query'

type Props = {
  value: ArticleSort
  onChange: (value: ArticleSort) => void
}

export const SortSelect: React.FC<Props> = ({ value, onChange }) => (
  <label className="field" htmlFor="sort-select">
    <span className="field__label">Sort</span>
    <select id="sort-select" className="field__select" value={value} onChange={(event) => onChange(event.target.value as ArticleSort)}>
      <option value="newest">Newest</option>
      <option value="oldest">Oldest</option>
      <option value="relevance">Relevance</option>
    </select>
  </label>
)

export default SortSelect
