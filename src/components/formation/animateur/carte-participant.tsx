"use client"

/**
 * Carte d'un participant dans la mosaïque formateur.
 * Affiche :
 *   - Le mini verre (modèle visuel live, synchronisé aux scores temps réel)
 *   - Le pseudo
 *   - La progression (nb éléments complétés / 5) + emojis des éléments faits
 *
 * Cliquable : un clic ouvre le mode "focus" (modèle en grand) géré par le parent.
 *
 * En mode simulation (`simulationStartedAt` non-null) :
 *   - Le verre s'anime à la vitesse correspondant au scénario choisi par le participant
 *   - Si le verre est estimé en débordement, un ring rouge subtil apparaît
 */

import { motion } from 'framer-motion'
import type { LiveParticipant } from '@/hooks/use-participants'
import type { ElementId } from '@/lib/supabase/types'
import { ELEMENT_THEME, ELEMENTS_ORDER } from '@/lib/element-theme'
import { SCENARIOS, estimateIsOverloaded, isSimulationFinished } from '@/lib/simulation'
import { ParticipantMiniModel } from '../participant/mon-mini-modele'

interface ParticipantCardProps {
  participant: LiveParticipant
  /** Timestamp ISO de démarrage de la simulation (null = pas démarrée) */
  simulationStartedAt?: string | null
  /** Handler appelé au clic sur la carte → ouvre le mode focus côté parent */
  onSelect?: (participant: LiveParticipant) => void
}

export function ParticipantCard({
  participant,
  simulationStartedAt = null,
  onSelect,
}: ParticipantCardProps) {
  const scores = participant.scores as Partial<Record<ElementId, number>>
  const completedElements = Object.keys(scores) as ElementId[]
  const progressPercent = (completedElements.length / 5) * 100
  const scenario = participant.simulation_scenario
  const scenarioMeta = scenario ? SCENARIOS[scenario] : null

  const isSimRunning =
    simulationStartedAt !== null && !isSimulationFinished(simulationStartedAt)
  const isSimDone =
    simulationStartedAt !== null && isSimulationFinished(simulationStartedAt)
  // Vitesse passée au mini modèle pendant la simu, null sinon (verre figé)
  const speed = isSimRunning && scenarioMeta ? scenarioMeta.speed : null

  // Effet visuel léger : ring rouge si on estime que le verre déborde,
  // appliqué uniquement pendant et après la simulation.
  const isOverloaded =
    (isSimRunning || isSimDone) && estimateIsOverloaded(scores, scenario)

  return (
    <motion.button
      layout
      type="button"
      onClick={() => onSelect?.(participant)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.25 }}
      className={`flex flex-col items-center rounded-2xl border bg-slate-900/60 p-4 text-left shadow-lg backdrop-blur transition hover:border-white/30 hover:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-blue-400/60 ${
        isOverloaded
          ? `border-red-500/60 ring-2 ring-red-500/40 ${isSimRunning ? 'animate-pulse' : ''}`
          : 'border-white/10'
      }`}
    >
      {/* Modèle complet live, animé pendant la simulation */}
      <div className="mb-3 w-full">
        <ParticipantMiniModel
          scores={scores}
          height={150}
          simulationSpeed={speed}
          simulationStartedAt={simulationStartedAt}
        />
      </div>

      <h3 className="mb-1 max-w-full truncate text-sm font-semibold text-white">
        {participant.pseudo}
      </h3>

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
          return (
            <div
              key={el}
              title={`${theme.name}${isDone ? ` : ${score}` : ''}`}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-md border px-1 py-1 transition ${
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
        })}
      </div>

      {/* Indicateur de scénario choisi (subtil, en bas) */}
      {scenarioMeta && (
        <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-500">
          {scenarioMeta.title}
        </p>
      )}
    </motion.button>
  )
}
