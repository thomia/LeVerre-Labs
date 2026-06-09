"use client"

/**
 * Hook : useFormateurControl
 * Fournit au formateur des actions typées pour contrôler sa session.
 * Le mot de passe est récupéré depuis sessionStorage (déposé lors du login).
 */

import { useCallback, useState } from 'react'
import type { ElementId } from '@/lib/supabase/types'

const STORAGE_KEY = 'formateur_password'

export function saveFormateurPassword(password: string) {
  try {
    sessionStorage.setItem(STORAGE_KEY, password)
  } catch {
    /* ignore (mode privé, etc.) */
  }
}

export function clearFormateurPassword() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

function getFormateurPassword(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function useFormateurControl(sessionCode: string) {
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const call = useCallback(
    async (
      action:
        | 'start_element'
        | 'stop_element'
        | 'start_simulation'
        | 'stop_simulation'
        | 'end_session'
        | 'reset',
      extras: { element?: ElementId; timerDurationSeconds?: number } = {}
    ) => {
      const password = getFormateurPassword()
      if (!password) {
        setError("Mot de passe formateur introuvable. Retourne sur /formation.")
        return { ok: false as const, error: 'no-password' }
      }

      setIsSending(true)
      setError(null)

      try {
        const response = await fetch(`/api/formation/${sessionCode}/control`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password, action, ...extras }),
        })

        const data = await response.json()
        if (!response.ok) {
          setError(data.error ?? 'Erreur inconnue')
          return { ok: false as const, error: data.error }
        }
        return { ok: true as const }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erreur réseau'
        setError(msg)
        return { ok: false as const, error: msg }
      } finally {
        setIsSending(false)
      }
    },
    [sessionCode]
  )

  return {
    isSending,
    error,
    startElement: (element: ElementId, timerDurationSeconds?: number) =>
      call('start_element', { element, timerDurationSeconds }),
    stopElement: () => call('stop_element'),
    startSimulation: () => call('start_simulation'),
    stopSimulation: () => call('stop_simulation'),
    endSession: () => call('end_session'),
    resetSession: () => call('reset'),
  }
}
