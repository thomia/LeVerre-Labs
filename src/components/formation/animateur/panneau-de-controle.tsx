"use client"

/**
 * Barre de contrôle formateur (bas de l'écran).
 * Permet de lancer un questionnaire par élément, arrêter, terminer la session.
 */

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Square, Flag, RotateCcw, Play, RefreshCw } from 'lucide-react'
import { useFormateurControl } from '@/hooks/use-formateur-control'
import type { LiveSession } from '@/hooks/use-session'
import type { ElementId } from '@/lib/supabase/types'
import { ELEMENT_THEME, ELEMENTS_ORDER } from '@/lib/element-theme'
import { isSimulationFinished } from '@/lib/simulation'

interface FormateurControlsProps {
  code: string
  session: LiveSession | null
  timerDurationSeconds: number
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

export function FormateurControls({ code, session, timerDurationSeconds }: FormateurControlsProps) {
  const {
    startElement,
    stopElement,
    startSimulation,
    stopSimulation,
    endSession,
    resetSession,
    isSending,
    error,
  } = useFormateurControl(code)

  const countdown = useCountdown(session?.timer_end_at ?? null)
  const currentElement = session?.current_element ?? null
  const isEnded = session?.status === 'ended'
  const simStartedAt = session?.simulation_started_at ?? null
  // Tick local pour mettre à jour l'état du bouton simu (en cours / finie)
  const [, setTick] = useState(0)
  useEffect(() => {
    if (!simStartedAt) return
    if (isSimulationFinished(simStartedAt)) return
    const id = setInterval(() => setTick((t) => t + 1), 200)
    return () => clearInterval(id)
  }, [simStartedAt])

  const isSimRunning = simStartedAt !== null && !isSimulationFinished(simStartedAt)
  const isSimDone = simStartedAt !== null && isSimulationFinished(simStartedAt)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-slate-950/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3">
        {/* Bandeau d'état */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {currentElement ? (
              <motion.div
                key={currentElement}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${ELEMENT_THEME[currentElement].chipClass}`}
              >
                <span className="uppercase tracking-wide">
                  {ELEMENT_THEME[currentElement].name}
                </span>
                <span className="text-xs opacity-80">en cours</span>
                {countdown !== null && (
                  <span className="ml-2 rounded bg-black/40 px-2 py-0.5 font-mono text-xs">
                    {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
                  </span>
                )}
              </motion.div>
            ) : isEnded ? (
              <span className="rounded-full bg-red-600/20 px-3 py-1 text-sm font-medium text-red-200 ring-1 ring-red-500/40">
                Session terminée
              </span>
            ) : isSimRunning ? (
              <span className="flex items-center gap-2 rounded-full bg-blue-600/20 px-3 py-1 text-sm font-medium text-blue-200 ring-1 ring-blue-500/40">
                <Play className="h-3.5 w-3.5 animate-pulse" />
                Simulation en cours
              </span>
            ) : isSimDone ? (
              <span className="rounded-full bg-purple-600/20 px-3 py-1 text-sm font-medium text-purple-200 ring-1 ring-purple-500/40">
                Simulation terminée
              </span>
            ) : (
              <span className="rounded-full bg-slate-700/40 px-3 py-1 text-sm text-slate-300">
                En attente
              </span>
            )}
          </div>

          {error && (
            <span className="text-xs text-red-300">{error}</span>
          )}
        </div>

        {/* Boutons d'éléments : titre uppercase coloré, badge allumé si en cours */}
        <div className="flex flex-wrap items-center gap-2">
          {ELEMENTS_ORDER.map((id) => {
            const theme = ELEMENT_THEME[id]
            const isCurrent = currentElement === id
            return (
              <button
                key={id}
                onClick={() => startElement(id, timerDurationSeconds)}
                disabled={isSending || isEnded}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold uppercase tracking-wide transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  isCurrent
                    ? ACTIVE_BTN_CLASS[id]
                    : `bg-slate-800 ${theme.titleClass} hover:bg-slate-700`
                }`}
              >
                {theme.name}
              </button>
            )
          })}

          <div className="mx-2 h-6 w-px bg-white/10" />

          <button
            onClick={stopElement}
            disabled={isSending || !currentElement}
            title="Arrêter l'élément en cours"
            className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Square className="h-4 w-4" />
            <span className="hidden sm:inline">Arrêter</span>
          </button>

          <div className="mx-2 h-6 w-px bg-white/10" />

          {/* Boutons de simulation */}
          {!isSimDone ? (
            <button
              onClick={startSimulation}
              disabled={isSending || isEnded || isSimRunning}
              title="Lancer la simulation des verres pour tous les participants"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                isSimRunning
                  ? 'bg-blue-600/40 text-blue-100 ring-2 ring-blue-300'
                  : 'bg-blue-600/80 text-white hover:bg-blue-500'
              }`}
            >
              <Play className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isSimRunning ? 'Simulation en cours…' : 'Lancer la simulation'}
              </span>
            </button>
          ) : (
            <button
              onClick={stopSimulation}
              disabled={isSending}
              title="Permet de relancer une simulation"
              className="flex items-center gap-2 rounded-lg bg-purple-600/60 px-3 py-2 text-sm text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Réinitialiser la simu</span>
            </button>
          )}

          <button
            onClick={endSession}
            disabled={isSending || isEnded}
            title="Terminer la session (écran récap)"
            className="flex items-center gap-2 rounded-lg bg-red-600/80 px-3 py-2 text-sm text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Flag className="h-4 w-4" />
            <span className="hidden sm:inline">Terminer</span>
          </button>

          {isEnded && (
            <button
              onClick={resetSession}
              disabled={isSending}
              title="Réinitialiser la session"
              className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Relancer</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
