import React from 'react'

type Props = {
  title?: string
}

export const Header: React.FC<Props> = ({ title = 'News Aggregator' }) => {
  return (
    <header style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1126, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1>{title}</h1>
        <nav aria-label="Main navigation">
          <a href="#" style={{ marginRight: 12, color: 'var(--text)'}}>Home</a>
          <a href="#" style={{ color: 'var(--text)'}}>About</a>
        </nav>
      </div>
    </header>
  )
}

export default Header
