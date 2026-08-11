import React from 'react'
import type { NewsProviderName } from '../types/news-provider-name'

type Props = { value?: NewsProviderName; onChange: (v?: NewsProviderName) => void }

const SOURCES: NewsProviderName[] = ['newsapi', 'theguardian', 'nyt']

export const SourceFilter: React.FC<Props> = ({ value, onChange }) => (
  <div>
    <label htmlFor="source-select" style={{ marginRight: 8 }}>Source</label>
    <select id="source-select" value={value ?? ''} onChange={(e) => onChange((e.target.value as NewsProviderName) || undefined)}>
      <option value="">All</option>
      {SOURCES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  </div>
)

export default SourceFilter
