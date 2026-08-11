"use client"

/**
 * Hook : useSimulationClock
 * Dérive le temps de simulation écoulé (en ms) à partir de l'état de session,
 * de façon déterministe et partagée par tous les écrans (mosaïque formateur,
 * modale focus, verres participants).
 *
 * Le formateur pilote la simulation via `sessions.simulation_started_at` :
 *   - lecture    : le champ contient l'instant de (re)lancement → le temps avance.
 *   - pause      : « Stopper » remet le champ à null MAIS garde la session
 *                  `active` → on FIGE le temps écoulé (état conservé, ex. pour
 *                  expliquer un cas ; reprise possible en repartant de là).
 *   - reprise    : on relance avec un timestamp antidaté (= now - temps figé),
 *                  donc le temps repart d'où il s'était arrêté.
 *   - fin/reset  : session `ended`/`waiting` → retour construction (null).
 */

import { useEffect, useRef, useState } from 'react'
import type { LiveSession } from './use-session'

export type SimulationState = 'idle' | 'playing' | 'paused'

export interface SimulationClock {
  /** Temps de simulation écoulé en ms, ou `null` en construction (pas de simu). */
  elapsedMs: number | null
  state: SimulationState
}

export function useSimulationClock(session: LiveSession | null): SimulationClock {
  const simStart = session?.simulation_started_at ?? null
  const status = session?.status ?? null

  const [startedAtMs, setStartedAtMs] = useState<number | null>(null)
  const [frozenElapsedMs, setFrozenElapsedMs] = useState<number | null>(null)
  const [nowMs, setNowMs] = useState(() => Date.now())
  const startedAtRef = useRef<number | null>(null)

  useEffect(() => {
    if (simStart) {
      const started = Date.parse(simStart)
      startedAtRef.current = started
      setStartedAtMs(started)
      setFrozenElapsedMs(null)
    } else if (status === 'active' && startedAtRef.current !== null) {
      // Pause : simulation stoppée sans terminer la session → on fige.
      setFrozenElapsedMs(Date.now() - startedAtRef.current)
    } else {
      // Fin / reset / pas encore lancée → construction.
      setStartedAtMs(null)
      setFrozenElapsedMs(null)
      startedAtRef.current = null
    }
  }, [simStart, status])

  const isPlaying = simStart !== null && frozenElapsedMs === null

  useEffect(() => {
    if (!isPlaying) return
    const id = setInterval(() => setNowMs(Date.now()), 100)
    return () => clearInterval(id)
  }, [isPlaying])

  if (frozenElapsedMs !== null) {
    return { elapsedMs: frozenElapsedMs, state: 'paused' }
  }
  if (isPlaying && startedAtMs !== null) {
    return { elapsedMs: nowMs - startedAtMs, state: 'playing' }
  }
  return { elapsedMs: null, state: 'idle' }
}
