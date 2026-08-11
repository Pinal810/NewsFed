import React from 'react'

export const LoadingState: React.FC = () => (
  <div style={{ padding: 32, textAlign: 'center' }} role="status" aria-live="polite">
    <div style={{ fontSize: 18, marginBottom: 8 }}>Loading articles…</div>
    <div style={{ color: 'var(--text)' }}>Please wait while we fetch the latest news.</div>
  </div>
)

export default LoadingState
