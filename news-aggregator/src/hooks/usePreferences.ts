import { useCallback, useMemo, useState } from 'react'
import type { UserPreferences } from '../domain/preferences/user-preferences'
import { DEFAULT_USER_PREFERENCES } from '../domain/preferences/user-preferences'
import { createPreferencesStorage, normalizePreferences } from '../services/preferences/preferences-storage'

export function usePreferences() {
  const storage = useMemo(() => createPreferencesStorage(), [])
  const [preferences, setPreferencesState] = useState<UserPreferences>(() => storage.get())

  const setPreferences = useCallback(
    (nextPreferences: UserPreferences) => {
      const normalized = normalizePreferences(nextPreferences)
      setPreferencesState(normalized)
      storage.save(normalized)
    },
    [storage],
  )

  const savePreferences = useCallback(
    (nextPreferences: UserPreferences) => {
      setPreferences(nextPreferences)
    },
    [setPreferences],
  )

  const resetPreferences = useCallback(() => {
    setPreferencesState(DEFAULT_USER_PREFERENCES)
    storage.clear()
  }, [storage])

  return {
    preferences,
    setPreferences,
    savePreferences,
    resetPreferences,
  }
}

export default usePreferences
