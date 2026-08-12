import React from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../components/Header'

export const NotFoundPage: React.FC = () => (
  <div>
    <Header />
    <main className="detail-shell">
      <div className="not-found-state">
        <h1 className="not-found-state__title">Page not found</h1>
        <p className="not-found-state__body">The page you requested does not exist.</p>
        <div style={{ marginTop: 20 }}>
          <Link className="action-button" to="/">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  </div>
)

export default NotFoundPage
