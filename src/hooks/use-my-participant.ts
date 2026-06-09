"use client"

/**
 * Hook : useMyParticipant
 * S'abonne en temps réel à la ligne `participants` d'un SEUL participant
 * (celui qui est connecté).
 *
 * Utile côté participant pour afficher son propre mini modèle en live,
 * sans avoir à charger toute la liste de la session.
 */

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ElementId, SimulationScenario } from '@/lib/supabase/types'

export interface MyParticipantState {
  id: string
  pseudo: string
  scores: Partial<Record<ElementId, number>>
  answers: Record<string, unknown>
  simulation_scenario: SimulationScenario | null
}

export function useMyParticipant(participantId: string | null) {
  const [data, setData] = useState<MyParticipantState | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!participantId) {
      setIsLoading(false)
      return
    }

    const supabase = createClient()
    let isMounted = true

    // 1) Fetch initial
    async function loadInitial() {
      const { data: row, error } = await supabase
        .from('participants')
        .select('id, pseudo, scores, answers, simulation_scenario')
        .eq('id', participantId)
        .maybeSingle()

      if (!isMounted) return

      if (error) {
        console.error('[useMyParticipant] Erreur fetch initial:', error)
      } else if (row) {
        setData(row as unknown as MyParticipantState)
      }
      setIsLoading(false)
    }
    loadInitial()

    // 2) Realtime subscription (sur cette ligne précise)
    const channel = supabase
      .channel(`me-${participantId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'participants',
          filter: `id=eq.${participantId}`,
        },
        (payload) => {
          if (!isMounted) return
          setData(payload.new as unknown as MyParticipantState)
        }
      )
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [participantId])

  return { data, isLoading }
}
