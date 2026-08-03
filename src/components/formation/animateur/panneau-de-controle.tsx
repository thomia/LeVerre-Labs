"use client"

/**
 * Barre de contrôle formateur (bas de l'écran).
 * Permet de lancer un questionnaire par élément, arrêter, terminer / relancer
 * la session.
 */

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Square, Flag, RotateCcw, Play } from 'lucide-react'
import { useFormateurControl } from '@/hooks/use-formateur-control'
import type { LiveSession } from '@/hooks/use-session'
import type { SimulationState } from '@/hooks/use-simulation-clock'
import type { ElementId } from '@/lib/supabase/types'
import { ELEMENT_THEME, ELEMENTS_ORDER } from '@/lib/element-theme'

interface FormateurControlsProps {
  code: string
  session: LiveSession | null
  timerDurationSeconds: number
  /** État de la simulation partagée (idle / playing / paused). */
  simulationState: SimulationState
  /** Temps de simulation écoulé (ms) — sert à reprendre après une pause. */
  simulationElapsedMs: number | null
}

// Classes spécifiques à la barre de contrôle formateur (état "en cours")
const ACTIVE_BTN_CLASS: Record<ElementId, string> = {
  verre: 'bg-gray-600/60 text-white ring-2 ring-gray-300',
  robinet: 'bg-blue-600/60 text-white ring-2 ring-blue-300',
  bulle: 'bg-purple-600/60 text-white ring-2 ring-purple-300',
  orage: 'bg-amber-600/60 text-white ring-2 ring-amber-300',
  paille: 'bg-green-600/60 text-white ring-2 ring-green-300',
}

function useCountdown(timerEndAt: string | null) {
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    if (!timerEndAt) {
      setRemaining(null)
      return
    }

    const endTs = new Date(timerEndAt).getTime()
    function tick() {
      const ms = endTs - Date.now()
      setRemaining(Math.max(0, Math.ceil(ms / 1000)))
    }
    tick()
    const id = setInterval(tick, 500)
    return () => clearInterval(id)
  }, [timerEndAt])

  return remaining
}

export function FormateurControls({
  code,
  session,
  timerDurationSeconds,
  simulationState,
  simulationElapsedMs,
}: FormateurControlsProps) {
  const {
    startElement,
    stopElement,
    endSession,
    resetSession,
    startSimulation,
    stopSimulation,
    resumeSimulation,
    isSending,
    error,
  } = useFormateurControl(code)

  const countdown = useCountdown(session?.timer_end_at ?? null)
  const currentElement = session?.current_element ?? null
  const isEnded = session?.status === 'ended'

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-slate-950/95 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        {/* Bandeau d'état */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {currentElement ? (
              <motion.div
                key={currentElement}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-base font-semibold ${ELEMENT_THEME[currentElement].chipClass}`}
              >
                <span className="uppercase tracking-wide">
                  {ELEMENT_THEME[currentElement].name}
                </span>
                <span className="text-sm opacity-80">en cours</span>
                {countdown !== null && (
                  <span className="ml-2 rounded bg-black/40 px-2.5 py-0.5 font-mono text-sm">
                    {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
                  </span>
                )}
              </motion.div>
            ) : isEnded ? (
              <span className="rounded-full bg-red-600/20 px-4 py-1.5 text-base font-medium text-red-200 ring-1 ring-red-500/40">
                Session terminée
              </span>
            ) : (
              <span className="rounded-full bg-slate-700/40 px-4 py-1.5 text-base text-slate-300">
                En attente
              </span>
            )}
          </div>

          {error && <span className="text-sm text-red-300">{error}</span>}
        </div>

        {/* Boutons d'éléments : titre uppercase coloré, badge allumé si en cours */}
        <div className="flex flex-wrap items-center gap-3">
          {ELEMENTS_ORDER.map((id) => {
            const theme = ELEMENT_THEME[id]
            const isCurrent = currentElement === id
            return (
              <button
                key={id}
                onClick={() => startElement(id, timerDurationSeconds)}
                disabled={isSending || isEnded}
                className={`flex items-center gap-2 rounded-lg px-5 py-3 text-base font-bold uppercase tracking-wide transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  isCurrent
                    ? ACTIVE_BTN_CLASS[id]
                    : `bg-slate-800 ${theme.titleClass} hover:bg-slate-700`
                }`}
              >
                {theme.name}
              </button>
            )
          })}

          <div className="mx-2 h-8 w-px bg-white/10" />

          <button
            onClick={stopElement}
            disabled={isSending || !currentElement}
            title="Arrêter l'élément en cours"
            className="flex items-center gap-2 rounded-lg bg-slate-800 px-5 py-3 text-base text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Square className="h-5 w-5" />
            <span className="hidden sm:inline">Arrêter l&apos;élément</span>
          </button>

          <div className="mx-2 h-8 w-px bg-white/10" />

          {/* Simulation diffusée : anime TOUS les verres de la session (écrans
              participants + mosaïque formateur). Lecture / pause / reprise. */}
          {simulationState === 'playing' ? (
            <button
              onClick={stopSimulation}
              disabled={isSending}
              title="Mettre la simulation en pause (état conservé)"
              className="flex items-center gap-2 rounded-lg bg-cyan-600/80 px-5 py-3 text-base font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Square className="h-5 w-5" />
              <span className="hidden sm:inline">Stopper la simulation</span>
            </button>
          ) : simulationState === 'paused' ? (
            <>
              <button
                onClick={() => resumeSimulation(simulationElapsedMs ?? 0)}
                disabled={isSending || isEnded}
                title="Reprendre la simulation là où elle a été mise en pause"
                className="flex items-center gap-2 rounded-lg bg-cyan-600/80 px-5 py-3 text-base font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Play className="h-5 w-5" />
                <span className="hidden sm:inline">Reprendre</span>
              </button>
              <button
                onClick={startSimulation}
                disabled={isSending || isEnded}
                title="Recommencer la simulation depuis le début"
                className="flex items-center gap-2 rounded-lg bg-slate-800 px-5 py-3 text-base text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw className="h-5 w-5" />
                <span className="hidden sm:inline">Recommencer</span>
              </button>
            </>
          ) : (
            <button
              onClick={startSimulation}
              disabled={isSending || isEnded}
              title="Lancer la simulation sur tous les verres de la session"
              className="flex items-center gap-2 rounded-lg bg-cyan-600/80 px-5 py-3 text-base font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Play className="h-5 w-5" />
              <span className="hidden sm:inline">Simulation</span>
            </button>
          )}

          <div className="mx-2 h-8 w-px bg-white/10" />

          <button
            onClick={endSession}
            disabled={isSending || isEnded}
            title="Terminer la session (écran récap)"
            className="flex items-center gap-2 rounded-lg bg-red-600/80 px-5 py-3 text-base font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Flag className="h-5 w-5" />
            <span className="hidden sm:inline">Terminer la session</span>
          </button>

          {isEnded && (
            <button
              onClick={resetSession}
              disabled={isSending}
              title="Réinitialiser la session"
              className="flex items-center gap-2 rounded-lg bg-slate-800 px-5 py-3 text-base text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw className="h-5 w-5" />
              <span className="hidden sm:inline">Relancer</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
