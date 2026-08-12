import React from 'react'

export const LoadingState: React.FC = () => (
  <div className="state-card" role="status" aria-live="polite">
    <div className="state-card__title">Loading articles…</div>
    <div className="state-card__body">Please wait while we fetch the latest news.</div>
  </div>
)

export default LoadingState
