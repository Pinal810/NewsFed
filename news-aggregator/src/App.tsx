import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const ArticleListPage = lazy(() => import('./pages/ArticleListPage'))
const ArticlePage = lazy(() => import('./pages/ArticlePage'))
const PreferencesPage = lazy(() => import('./pages/PreferencesPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="site-shell" style={{ padding: '24px 0' }}>
            <div className="state-card">
              <div className="state-card__title">Loading…</div>
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<ArticleListPage />} />
          <Route path="/search" element={<ArticleListPage />} />
          <Route path="/category/:category" element={<ArticleListPage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
