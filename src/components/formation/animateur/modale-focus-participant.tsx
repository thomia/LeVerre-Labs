"use client"

/**
 * ParticipantFocusModal
 * Modal plein écran qui apparaît quand le formateur clique sur une carte
 * de la mosaïque. Affiche le mini modèle en grand + les 5 scores détaillés.
 *
 * Pour passer à un autre participant, on ferme et on clique sur une autre
 * carte (pas de flèches de navigation, choix utilisateur du 2026-04-25).
 */

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { LiveParticipant } from '@/hooks/use-participants'
import type { ElementId } from '@/lib/supabase/types'
import { ELEMENT_THEME, ELEMENTS_ORDER } from '@/lib/element-theme'
import { SCENARIOS, estimateIsOverloaded, isSimulationFinished } from '@/lib/simulation'
import { ParticipantMiniModel } from '../participant/mon-mini-modele'

interface ParticipantFocusModalProps {
  participant: LiveParticipant | null
  /** Timestamp de simulation pour synchroniser l'animation du modèle agrandi */
  simulationStartedAt?: string | null
  onClose: () => void
}

export function ParticipantFocusModal({
  participant,
  simulationStartedAt = null,
  onClose,
}: ParticipantFocusModalProps) {
  const scores = (participant?.scores ?? {}) as Partial<Record<ElementId, number>>
  const scenario = participant?.simulation_scenario ?? null
  const scenarioMeta = scenario ? SCENARIOS[scenario] : null

  const isSimRunning =
    simulationStartedAt !== null && !isSimulationFinished(simulationStartedAt)
  const isSimDone =
    simulationStartedAt !== null && isSimulationFinished(simulationStartedAt)
  const speed = isSimRunning && scenarioMeta ? scenarioMeta.speed : null
  const isOverloaded =
    (isSimRunning || isSimDone) && estimateIsOverloaded(scores, scenario)

  return (
    <AnimatePresence>
      {participant && (
        <motion.div
          key="focus-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          // Clic sur le fond sombre = fermer
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.25 }}
            // Empêche le clic interne de fermer le modal
            onClick={(e) => e.stopPropagation()}
            className={`relative flex w-full max-w-3xl flex-col gap-6 rounded-3xl border bg-slate-900/95 p-6 shadow-2xl ${
              isOverloaded ? 'border-red-500/60 ring-2 ring-red-500/40' : 'border-white/10'
            }`}
          >
            {/* En-tête : pseudo + bouton fermer */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {participant.pseudo}
                </h2>
                {scenarioMeta && (
                  <p className="mt-1 text-sm text-slate-400">
                    Scénario : <span className="font-semibold text-blue-300">{scenarioMeta.title}</span>
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition hover:bg-slate-700 hover:text-white"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mini modèle en grand */}
            <div className="flex justify-center">
              <ParticipantMiniModel
                scores={scores}
                height={400}
                simulationSpeed={speed}
                simulationStartedAt={simulationStartedAt}
              />
            </div>

            {/* Détail des 5 scores en grille */}
            <div className="grid grid-cols-5 gap-2">
              {ELEMENTS_ORDER.map((el) => {
                const score = scores[el]
                const isDone = score !== undefined
                const theme = ELEMENT_THEME[el]
                return (
                  <div
                    key={el}
                    className={`flex flex-col items-center justify-center gap-1 rounded-xl border px-2 py-3 ${
                      isDone
                        ? theme.chipClass
                        : 'border-white/5 bg-slate-800/60 text-slate-600'
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {theme.name}
                    </span>
                    <span className="text-2xl font-bold tabular-nums">
                      {isDone ? score : '—'}
                    </span>
                  </div>
                )
              })}
            </div>

            {isOverloaded && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-200">
                ⚠️ Le verre semble dépasser sa capacité — bon cas pour discuter
                des facteurs de risque accumulés.
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
