import React from 'react'
import type { ArticleCategory } from '../types/article-category'

type Props = {
  value?: ArticleCategory
  onChange: (v?: ArticleCategory) => void
}

const CATEGORIES: ArticleCategory[] = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology', 'world', 'politics', 'other']

export const CategoryFilter: React.FC<Props> = ({ value, onChange }) => (
  <div>
    <label htmlFor="category-select" style={{ marginRight: 8 }}>Category</label>
    <select id="category-select" value={value ?? ''} onChange={(e) => onChange((e.target.value as ArticleCategory) || undefined)}>
      <option value="">All</option>
      {CATEGORIES.map((c) => (
        <option key={c} value={c}>{c}</option>
      ))}
    </select>
  </div>
)

export default CategoryFilter
