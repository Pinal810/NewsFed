import React from 'react'
import type { NewsSourceFilterValue } from '../types/news-query'

type Props = { value?: NewsSourceFilterValue; onChange: (v?: NewsSourceFilterValue) => void }

const SOURCES: NewsSourceFilterValue[] = ['newsapi', 'guardian']

export const SourceFilter: React.FC<Props> = ({ value, onChange }) => (
  <label className="field" htmlFor="source-select">
    <span className="field__label">Source</span>
    <select id="source-select" className="field__select" value={value ?? ''} onChange={(e) => onChange((e.target.value as NewsSourceFilterValue) || undefined)}>
      <option value="">All</option>
      {SOURCES.map((source) => (
        <option key={source} value={source}>
          {source}
        </option>
      ))}
    </select>
  </label>
)

export default SourceFilter
