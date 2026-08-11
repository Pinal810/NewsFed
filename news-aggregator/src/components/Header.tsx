import React from 'react'
import { Link } from 'react-router-dom'

type Props = {
  title?: string
}

export const Header: React.FC<Props> = ({ title = 'News Aggregator' }) => {
  return (
    <header style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1126, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <h1>{title}</h1>
        <nav aria-label="Main navigation" style={{ display: 'flex', gap: 12 }}>
          <Link to="/" style={{ color: 'var(--text)' }}>Home</Link>
          <Link to="/search" style={{ color: 'var(--text)' }}>Search</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
