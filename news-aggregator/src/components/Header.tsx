import React from 'react'
import { Link } from 'react-router-dom'

type Props = {
  title?: string
}

export const Header: React.FC<Props> = ({ title = 'News Aggregator' }) => {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__brand">
          <span className="site-header__eyebrow">Daily Brief</span>
          <h1>{title}</h1>
        </div>
        <nav aria-label="Main navigation" className="site-nav">
          <Link to="/">Home</Link>
          <Link to="/search">Search</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
