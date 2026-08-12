import React from 'react'
import type { ArticleSort } from '../types/news-query'

type Props = {
  value: ArticleSort
  onChange: (value: ArticleSort) => void
}

export const SortSelect: React.FC<Props> = ({ value, onChange }) => (
  <div>
    <label htmlFor="sort-select" style={{ marginRight: 8 }}>Sort</label>
    <select id="sort-select" value={value} onChange={(event) => onChange(event.target.value as ArticleSort)}>
      <option value="newest">Newest</option>
      <option value="oldest">Oldest</option>
      <option value="relevance">Relevance</option>
    </select>
  </div>
)

export default SortSelect
