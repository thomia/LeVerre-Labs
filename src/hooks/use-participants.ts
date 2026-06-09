"use client"

/**
 * Hook : useParticipants
 * S'abonne en temps réel à la liste des participants d'une session.
 *
 * Mécanique :
 *   1) Au mount, SELECT initial de tous les participants existants
 *   2) Souscription Realtime sur postgres_changes (INSERT/UPDATE/DELETE)
 *   3) Cleanup : suppression du canal au unmount
 */

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ElementId, SimulationScenario } from '@/lib/supabase/types'

export interface LiveParticipant {
  id: string
  pseudo: string
  scores: Partial<Record<ElementId, number>>
  answers: Record<string, unknown>
  simulation_scenario: SimulationScenario | null
  joined_at: string
}

export function useParticipants(sessionCode: string) {
  const [participants, setParticipants] = useState<LiveParticipant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    let isMounted = true

    // 1) État initial
    async function loadInitial() {
      const { data, error } = await supabase
        .from('participants')
        .select('id, pseudo, scores, answers, simulation_scenario, joined_at')
        .eq('session_code', sessionCode)
        .order('joined_at', { ascending: true })

      if (!isMounted) return

      if (error) {
        console.error(
          '[useParticipants] Erreur chargement initial:',
          error,
          JSON.stringify(error, Object.getOwnPropertyNames(error)),
        )
      } else if (data) {
        setParticipants(data as unknown as LiveParticipant[])
      }
      setIsLoading(false)
    }
    loadInitial()

    // 2) Souscription Realtime
    const channel = supabase
      .channel(`participants-${sessionCode}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'participants',
          filter: `session_code=eq.${sessionCode}`,
        },
        (payload) => {
          if (!isMounted) return

          if (payload.eventType === 'INSERT') {
            const newP = payload.new as LiveParticipant
            setParticipants((prev) => {
              if (prev.some((p) => p.id === newP.id)) return prev
              return [...prev, newP]
            })
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as LiveParticipant
            setParticipants((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p))
            )
          } else if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as { id: string }).id
            setParticipants((prev) => prev.filter((p) => p.id !== deletedId))
          }
        }
      )
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [sessionCode])

  return { participants, isLoading }
}
