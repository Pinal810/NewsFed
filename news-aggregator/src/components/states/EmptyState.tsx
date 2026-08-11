import React from 'react'

type Props = { message?: string }

export const EmptyState: React.FC<Props> = ({ message = 'No articles found.' }) => (
  <div style={{ padding: 32, textAlign: 'center' }}>
    <div style={{ fontSize: 18, marginBottom: 8 }}>{message}</div>
  </div>
)

export default EmptyState
