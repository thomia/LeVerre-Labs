"use client"

/**
 * ParticipantFocusModal
 * Modal plein écran qui apparaît quand le formateur clique sur une carte
 * de la mosaïque. Affiche le mini modèle en grand, la tâche de référence,
 * l'indicateur "temps avant débordement" et les 5 scores détaillés.
 */

import { motion, AnimatePresence } from 'framer-motion'
import { X, Timer } from 'lucide-react'
import type { LiveParticipant } from '@/hooks/use-participants'
import type { ElementId } from '@/lib/supabase/types'
import { ELEMENT_THEME, ELEMENTS_ORDER } from '@/lib/element-theme'
import { computeOverflowSeconds, formatOverflowSeconds } from '@/lib/indicateur'
import { ParticipantMiniModel } from '../participant/mon-mini-modele'
import { ReponsesTooltip } from './tooltip-reponses'

interface ParticipantFocusModalProps {
  participant: LiveParticipant | null
  onClose: () => void
  /** Timestamp de lancement de la simulation formateur (null = verre figé). */
  simulationStartedAt?: string | null
}

export function ParticipantFocusModal({
  participant,
  onClose,
  simulationStartedAt = null,
}: ParticipantFocusModalProps) {
  const scores = (participant?.scores ?? {}) as Partial<Record<ElementId, number>>
  const overflowSeconds = computeOverflowSeconds(scores)
  const hasRobinet = scores.robinet !== undefined

  return (
    <AnimatePresence>
      {participant && (
        <motion.div
          key="focus-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex w-full max-w-3xl flex-col gap-6 rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl"
          >
            {/* En-tête : pseudo + tâche + bouton fermer */}
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-2xl font-bold text-white">
                  {participant.pseudo}
                </h2>
                {participant.tache_reference && (
                  <p className="mt-1 truncate text-sm text-slate-400">
                    {participant.tache_reference}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition hover:bg-slate-700 hover:text-white"
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
                simulationSpeed={simulationStartedAt ? 1 : null}
                simulationStartedAt={simulationStartedAt}
              />
            </div>

            {/* Indicateur temps avant débordement */}
            {hasRobinet && (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-3 text-blue-100">
                <Timer className="h-5 w-5 text-blue-300" />
                <span className="text-sm">Temps avant débordement :</span>
                <span className="text-xl font-bold tabular-nums text-blue-300">
                  {formatOverflowSeconds(overflowSeconds)}
                </span>
              </div>
            )}

            {/* Détail des 5 scores en grille */}
            <div className="grid grid-cols-5 gap-2">
              {ELEMENTS_ORDER.map((el) => {
                const score = scores[el]
                const isDone = score !== undefined
                const theme = ELEMENT_THEME[el]
                const cell = (
                  <div
                    className={`flex w-full flex-col items-center justify-center gap-1 rounded-xl border px-2 py-3 ${
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
                if (isDone && participant.answers) {
                  return (
                    <ReponsesTooltip
                      key={el}
                      element={el}
                      answers={participant.answers as Record<string, unknown>}
                    >
                      {cell}
                    </ReponsesTooltip>
                  )
                }
                return <div key={el} className="flex">{cell}</div>
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
