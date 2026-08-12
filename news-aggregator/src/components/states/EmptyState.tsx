import React from 'react'

type Props = { message?: string }

export const EmptyState: React.FC<Props> = ({ message = 'No articles found.' }) => (
  <div className="empty-state" aria-live="polite">
    <div className="empty-state__title">No results</div>
    <div className="empty-state__body">{message}</div>
  </div>
)

export default EmptyState
