import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ArticleListPage } from './pages/ArticleListPage'
import { ArticlePage } from './pages/ArticlePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArticleListPage />} />
        <Route path="/search" element={<ArticleListPage />} />
        <Route path="/category/:category" element={<ArticleListPage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
