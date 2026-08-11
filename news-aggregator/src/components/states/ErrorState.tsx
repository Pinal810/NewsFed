import React from 'react'

type Props = { message?: string; onRetry?: () => void }

export const ErrorState: React.FC<Props> = ({ message, onRetry }) => (
  <div style={{ padding: 32, textAlign: 'center' }} role="alert">
    <div style={{ fontSize: 18, marginBottom: 8, color: 'var(--text-h)' }}>Something went wrong</div>
    <div style={{ color: 'var(--text)', marginBottom: 12 }}>{message ?? 'Unable to load articles.'}</div>
    {onRetry && (
      <button onClick={onRetry} style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--accent)', color: '#fff', border: 'none' }}>
        Retry
      </button>
    )}
  </div>
)

export default ErrorState
