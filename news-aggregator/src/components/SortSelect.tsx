import React from 'react'

type Props = {
  value: 'latest' | 'oldest'
  onChange: (value: 'latest' | 'oldest') => void
}

export const SortSelect: React.FC<Props> = ({ value, onChange }) => (
  <div>
    <label htmlFor="sort-select" style={{ marginRight: 8 }}>Sort</label>
    <select id="sort-select" value={value} onChange={(event) => onChange(event.target.value as 'latest' | 'oldest')}>
      <option value="latest">Latest</option>
      <option value="oldest">Oldest</option>
    </select>
  </div>
)

export default SortSelect
