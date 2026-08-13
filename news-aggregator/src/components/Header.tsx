import React from 'react'
import { useNavigate} from 'react-router-dom'

type Props = {
  title?: string
}

export const Header: React.FC<Props> = ({ title = 'News Aggregator' }) => {
  const navigate = useNavigate()
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__brand">
         <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            {title}
          </h1>
        </div>
      </div>
    </header>
  )
}

export default Header
