import React from 'react'

type Props = {
  value: string
  onChange: (v: string) => void
  onSubmit?: () => void
}

export const SearchBar: React.FC<Props> = ({ value, onChange, onSubmit }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.()
      }}
      role="search"
      style={{ display: 'flex', gap: 8, alignItems: 'center' }}
    >
      <label htmlFor="search-input" style={{ position: 'absolute', left: -9999 }}>
        Search articles
      </label>
      <input
        id="search-input"
        aria-label="Search articles"
        placeholder="Search news..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', minWidth: 240 }}
      />
      <button type="submit" aria-label="Search" style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--accent)', color: '#fff', border: 'none' }}>
        Search
      </button>
    </form>
  )
}

export default SearchBar
