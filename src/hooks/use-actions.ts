"use client"

/**
 * Hook : useActions
 * S'abonne en temps réel aux actions (tableau collaboratif) d'une session, et
 * fournit les opérations d'ajout / modification / déplacement (drag & drop) /
 * suppression.
 */

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Action, ActionColonne, ElementId } from '@/lib/supabase/types'

export interface NewActionInput {
  participantId: string | null
  pseudo: string
  element: ElementId | null
  texte: string
}

export function useActions(sessionCode: string) {
  const [actions, setActions] = useState<Action[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    let isMounted = true

    async function loadInitial() {
      const { data, error } = await supabase
        .from('actions')
        .select('*')
        .eq('session_code', sessionCode)
        .order('created_at', { ascending: true })

      if (!isMounted) return

      if (error) {
        console.error(
          '[useActions] Erreur chargement initial:',
          error,
          JSON.stringify(error, Object.getOwnPropertyNames(error)),
        )
      } else if (data) {
        setActions(data as unknown as Action[])
      }
      setIsLoading(false)
    }
    loadInitial()

    const channel = supabase
      .channel(`actions-${sessionCode}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'actions',
          filter: `session_code=eq.${sessionCode}`,
        },
        (payload) => {
          if (!isMounted) return

          if (payload.eventType === 'INSERT') {
            const created = payload.new as Action
            setActions((prev) =>
              prev.some((a) => a.id === created.id) ? prev : [...prev, created]
            )
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Action
            setActions((prev) =>
              prev.map((a) => (a.id === updated.id ? updated : a))
            )
          } else if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as { id: string }).id
            setActions((prev) => prev.filter((a) => a.id !== deletedId))
          }
        }
      )
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [sessionCode])

  const addAction = useCallback(
    async (input: NewActionInput) => {
      const supabase = createClient()
      const { error } = await supabase.from('actions').insert({
        session_code: sessionCode,
        participant_id: input.participantId,
        pseudo: input.pseudo,
        element: input.element,
        texte: input.texte,
      })
      if (error) {
        console.error('[useActions] Erreur ajout:', error)
        return { ok: false as const, error: error.message }
      }
      return { ok: true as const }
    },
    [sessionCode]
  )

  /** Modifie le texte et/ou l'élément rattaché d'une action existante. */
  const editAction = useCallback(
    async (id: string, updates: { texte: string; element: ElementId | null }) => {
      const supabase = createClient()
      setActions((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
      )
      const { error } = await supabase.from('actions').update(updates).eq('id', id)
      if (error) {
        console.error('[useActions] Erreur modification:', error)
        return { ok: false as const, error: error.message }
      }
      return { ok: true as const }
    },
    []
  )

  /** Déplace une action vers une autre colonne (drag & drop). */
  const moveAction = useCallback(async (id: string, colonne: ActionColonne) => {
    const supabase = createClient()
    // Mise à jour optimiste : le drag & drop doit paraître instantané.
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, colonne } : a)))
    const { error } = await supabase.from('actions').update({ colonne }).eq('id', id)
    if (error) {
      console.error('[useActions] Erreur déplacement:', error)
      return { ok: false as const, error: error.message }
    }
    return { ok: true as const }
  }, [])

  const deleteAction = useCallback(async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('actions').delete().eq('id', id)
    if (error) {
      console.error('[useActions] Erreur suppression:', error)
      return { ok: false as const, error: error.message }
    }
    return { ok: true as const }
  }, [])

  return { actions, isLoading, addAction, editAction, moveAction, deleteAction }
}
