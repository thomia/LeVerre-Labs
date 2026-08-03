"use client"

/**
 * Carte d'un participant dans la mosaïque formateur.
 * Affiche :
 *   - Le mini verre (modèle visuel live, synchronisé aux scores temps réel)
 *   - Le pseudo + la tâche de référence
 *   - La progression (nb éléments complétés / 5)
 *   - Les 5 scores par élément
 *   - L'indicateur "temps avant débordement" (dès que le Robinet est renseigné)
 *
 * Cliquable : un clic ouvre le mode "focus" (modèle en grand) géré par le parent.
 */

import { motion } from 'framer-motion'
import type { LiveParticipant } from '@/hooks/use-participants'
import type { ElementId } from '@/lib/supabase/types'
import { ELEMENT_THEME, ELEMENTS_ORDER } from '@/lib/element-theme'
import { computeOverflowSeconds, formatOverflowSeconds } from '@/lib/indicateur'
import { ParticipantMiniModel } from '../participant/mon-mini-modele'
import { ReponsesTooltip } from './tooltip-reponses'

interface ParticipantCardProps {
  participant: LiveParticipant
  /** Handler appelé au clic sur la carte → ouvre le mode focus côté parent */
  onSelect?: (participant: LiveParticipant) => void
  /**
   * Temps de simulation écoulé (ms) diffusé par le formateur. Non-null → le
   * verre affiche son remplissage à cet instant (animé si le temps avance, figé
   * s'il est en pause) ; null → verre en construction.
   */
  simulationElapsedMs?: number | null
}

export function ParticipantCard({
  participant,
  onSelect,
  simulationElapsedMs = null,
}: ParticipantCardProps) {
  const scores = participant.scores as Partial<Record<ElementId, number>>
  const completedElements = Object.keys(scores) as ElementId[]
  const progressPercent = (completedElements.length / 5) * 100
  const hasRobinet = scores.robinet !== undefined
  const overflowSeconds = computeOverflowSeconds(scores)

  return (
    <motion.button
      layout
      type="button"
      onClick={() => onSelect?.(participant)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-left shadow-lg backdrop-blur transition hover:border-white/30 hover:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
    >
      {/* Modèle complet live : figé (construction) ou remplissage déterministe
          quand le formateur lance la simulation sur toute la mosaïque. */}
      <div className="mb-3 w-full">
        <ParticipantMiniModel
          scores={scores}
          height={150}
          simulationElapsedMs={simulationElapsedMs}
        />
      </div>

      <h3 className="mb-0.5 max-w-full truncate text-sm font-semibold text-white">
        {participant.pseudo}
      </h3>

      {participant.tache_reference && (
        <p
          className="mb-1 max-w-full truncate text-[11px] text-slate-400"
          title={participant.tache_reference}
        >
          {participant.tache_reference}
        </p>
      )}

      {/* Barre de progression */}
      <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Grille des scores par élément : chip coloré + valeur (ou tiret si absent) */}
      <div className="grid w-full grid-cols-5 gap-1">
        {ELEMENTS_ORDER.map((el) => {
          const score = scores[el]
          const isDone = score !== undefined
          const theme = ELEMENT_THEME[el]
          const cell = (
            <div
              title={`${theme.name}${isDone ? ` : ${score}` : ''}`}
              className={`flex w-full flex-col items-center justify-center gap-0.5 rounded-md border px-1 py-1 transition ${
                isDone
                  ? theme.chipClass
                  : 'border-white/5 bg-slate-800/60 text-slate-600'
              }`}
            >
              <span className="text-[9px] font-bold uppercase leading-none tracking-wide">
                {theme.name.slice(0, 3)}
              </span>
              <span className="text-sm font-bold tabular-nums leading-none">
                {isDone ? score : '—'}
              </span>
            </div>
          )
          if (isDone) {
            return (
              <ReponsesTooltip key={el} element={el} answers={participant.answers}>
                {cell}
              </ReponsesTooltip>
            )
          }
          return <div key={el} className="flex">{cell}</div>
        })}
      </div>

      {/* Indicateur temps avant débordement (dès que le Robinet est renseigné) */}
      {hasRobinet && (
        <p className="mt-2 text-[11px] text-slate-400">
          Débordement :{' '}
          <span className="font-bold tabular-nums text-blue-300">
            {formatOverflowSeconds(overflowSeconds)}
          </span>
        </p>
      )}
    </motion.button>
  )
}
