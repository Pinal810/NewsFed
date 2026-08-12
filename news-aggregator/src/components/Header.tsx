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
         <h1><Link to="/">{title}</Link> </h1>
        </div>
        <nav aria-label="Main navigation" className="site-nav">
          <Link to="/search">Search</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
