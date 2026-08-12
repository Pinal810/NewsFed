import React from 'react'

type Props = { message?: string; onRetry?: () => void }

export const ErrorState: React.FC<Props> = ({ message, onRetry }) => (
  <div className="state-card" role="alert">
    <div className="state-card__title">Something went wrong</div>
    <div className="state-card__body" style={{ marginBottom: 16 }}>
      {message ?? 'Unable to load articles.'}
    </div>
    {onRetry && (
      <button type="button" className="action-button" onClick={onRetry}>
        Retry
      </button>
    )}
  </div>
)

export default ErrorState
