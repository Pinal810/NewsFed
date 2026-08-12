import React from 'react'

type Props = {
  value: string
  onChange: (v: string) => void
  onSubmit?: () => void
}

export const SearchBar: React.FC<Props> = ({ value, onChange, onSubmit }) => {
  return (
    <form
      className="search-form"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.()
      }}
      role="search"
      aria-label="Search for articles"
    >
      <label className="field" htmlFor="search-input">
        <span className="field__label">Search</span>
        <input
          id="search-input"
          className="field__input"
          type="search"
          placeholder="Search news, topics, people..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </form>
  )
}

export default SearchBar
