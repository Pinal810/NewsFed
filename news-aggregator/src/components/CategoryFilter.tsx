import React from 'react'
import type { ArticleCategory } from '../types/article-category'

type Props = {
  value?: ArticleCategory
  onChange: (v?: ArticleCategory) => void
}

const CATEGORIES: ArticleCategory[] = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology', 'world', 'politics', 'other']

export const CategoryFilter: React.FC<Props> = ({ value, onChange }) => (
  <label className="field" htmlFor="category-select">
    <span className="field__label">Category</span>
    <select id="category-select" className="field__select" value={value ?? ''} onChange={(e) => onChange((e.target.value as ArticleCategory) || undefined)}>
      <option value="">All</option>
      {CATEGORIES.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  </label>
)

export default CategoryFilter
