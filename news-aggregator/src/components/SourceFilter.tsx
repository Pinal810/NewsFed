import React from 'react'
import type { NewsSourceFilterValue } from '../types/news-query'

type Props = { value?: NewsSourceFilterValue; onChange: (v?: NewsSourceFilterValue) => void }

const SOURCES: NewsSourceFilterValue[] = ['newsapi', 'guardian', 'nyt']

export const SourceFilter: React.FC<Props> = ({ value, onChange }) => (
  <div>
    <label htmlFor="source-select" style={{ marginRight: 8 }}>Source</label>
    <select id="source-select" value={value ?? ''} onChange={(e) => onChange((e.target.value as NewsSourceFilterValue) || undefined)}>
      <option value="">All</option>
      {SOURCES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  </div>
)

export default SourceFilter
