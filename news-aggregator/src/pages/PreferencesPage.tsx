import React from 'react'
import { Header } from '../components/Header'
import PreferencesPanel from '../components/PreferencesPanel'
import usePreferences from '../hooks/usePreferences'

type Props = {
  availableAuthors?: string[]
}

export const PreferencesPage: React.FC<Props> = ({ availableAuthors = [] }) => {
  const { preferences, savePreferences, resetPreferences } = usePreferences()

  return (
    <div>
      <Header />
      <main className="page-section">
        <h2 style={{ marginBottom: 20 }}>Preferences</h2>
        <PreferencesPanel preferences={preferences} availableAuthors={availableAuthors} onSave={savePreferences} onReset={resetPreferences} />
      </main>
    </div>
  )
}

export default PreferencesPage
