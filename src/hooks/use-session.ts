"use client"

/**
 * Hook : useSession
 * S'abonne en temps réel à l'état d'une session (status, current_element, timer).
 * Utilisé côté participant pour savoir quand un questionnaire est lancé.
 */

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ElementId, SessionStatus } from '@/lib/supabase/types'

export interface LiveSession {
  code: string
  status: SessionStatus
  current_element: ElementId | null
  timer_end_at: string | null
  timer_duration: number
  simulation_started_at: string | null
}

export function useSession(sessionCode: string) {
  const [session, setSession] = useState<LiveSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    let isMounted = true

    async function loadInitial() {
      const { data, error } = await supabase
        .from('sessions')
        .select('code, status, current_element, timer_end_at, timer_duration, simulation_started_at')
        .eq('code', sessionCode)
        .maybeSingle()

      if (!isMounted) return

      if (error) {
        // Log complet : la structure de l'erreur peut varier (PostgrestError,
        // réseau, RLS…). On stringifie tout pour voir la vraie cause.
        console.error(
          '[useSession] Erreur chargement initial:',
          error,
          JSON.stringify(error, Object.getOwnPropertyNames(error)),
        )
      } else if (data) {
        setSession(data as unknown as LiveSession)
      }
      setIsLoading(false)
    }
    loadInitial()

    const channel = supabase
      .channel(`session-${sessionCode}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `code=eq.${sessionCode}`,
        },
        (payload) => {
          if (!isMounted) return
          setSession(payload.new as LiveSession)
        }
      )
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [sessionCode])

  return { session, isLoading }
}
