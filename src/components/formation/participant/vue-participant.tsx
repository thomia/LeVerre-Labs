"use client"

/**
 * Vue participant après avoir rejoint la session.
 *
 * Layout mobile-first (split continu) :
 *   ┌─────────────────┐
 *   │  Mini modèle    │   <- sticky en haut, toujours visible
 *   │  (live scores)  │
 *   ├─────────────────┤
 *   │  Questionnaire  │   <- scroll sous le modèle
 *   │  (ou attente)   │
 *   └─────────────────┘
 *
 * Desktop (≥ lg) : modèle à gauche, questionnaire à droite (2 colonnes).
 *
 * Les scores viennent de `useMyParticipant` (realtime sur sa propre ligne),
 * donc le modèle se met à jour dès que le participant répond.
 */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hourglass, Flag, Play } from 'lucide-react'
import { useSession } from '@/hooks/use-session'
import { useMyParticipant } from '@/hooks/use-my-participant'
import { useIsDesktop } from '@/hooks/use-is-desktop'
import { ParticipantQuestionnaire } from './questionnaire'
import { ParticipantMiniModel } from './mon-mini-modele'
import { ScenarioSelector } from './choix-scenario'
import { ELEMENT_THEME } from '@/lib/element-theme'
import {
  SCENARIOS,
  SIMULATION_DURATION_MS,
  formatSimulationClock,
  getSimulationProgress,
  isSimulationFinished,
} from '@/lib/simulation'
import type { ElementId } from '@/lib/supabase/types'

interface ParticipantViewProps {
  participantId: string
  pseudo: string
  sessionCode: string
}

export function ParticipantView({
  participantId,
  pseudo,
  sessionCode,
}: ParticipantViewProps) {
  const { session, isLoading: isSessionLoading } = useSession(sessionCode)
  const { data: me } = useMyParticipant(participantId)
  const isDesktop = useIsDesktop()

  // Le modèle doit occuper une place significative de l'écran :
  //   - Mobile : ~280px (reste sticky top, on laisse voir les questions en scrollant)
  //   - Desktop : 420px (colonne gauche élargie à 420px, cf. `lg:w-[440px]`)
  const modelHeight = isDesktop ? 420 : 280

  // Tick local pour faire avancer le chrono pendant la simulation et détecter
  // la fin (10s écoulées). On rerender ~30x/s pendant la simulation puis on
  // s'arrête.
  const simStartedAt = session?.simulation_started_at ?? null
  const [, setNow] = useState(Date.now())
  useEffect(() => {
    if (!simStartedAt) return
    if (isSimulationFinished(simStartedAt)) return
    const id = setInterval(() => setNow(Date.now()), 100)
    return () => clearInterval(id)
  }, [simStartedAt])

  // Le score de l'élément en cours doit n'apparaître sous le modèle qu'une
  // fois que le participant a TERMINÉ son questionnaire (clic "Terminer" pour
  // les sliders, ou écran "Terminé" pour le mode question-par-question).
  // On reset ce flag à chaque changement d'élément.
  const currentElementSession = session?.current_element ?? null
  const [currentElementFinished, setCurrentElementFinished] = useState(false)
  useEffect(() => {
    setCurrentElementFinished(false)
  }, [currentElementSession])

  if (isSessionLoading) {
    return (
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
    )
  }

  const isEnded = session?.status === 'ended'
  const currentElement = session?.current_element ?? null
  const scores = me?.scores ?? {}
  const hasAnyScore = Object.keys(scores).length > 0
  const allElementsDone = Object.keys(scores).length === 5
  const myScenario = me?.simulation_scenario ?? null

  // États de la simulation
  const isSimRunning = simStartedAt !== null && !isSimulationFinished(simStartedAt)
  const isSimDone = simStartedAt !== null && isSimulationFinished(simStartedAt)
  const simProgress = getSimulationProgress(simStartedAt)
  const scenarioMeta = myScenario ? SCENARIOS[myScenario] : null
  // Pendant la simu : speed du scénario. Une fois finie : null (figé).
  const simulationSpeed = isSimRunning && scenarioMeta ? scenarioMeta.speed : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full max-w-5xl flex-col gap-4 lg:flex-row lg:items-start"
    >
      {/* ============================================================
          COLONNE GAUCHE (desktop) / HAUT (mobile) : mini modèle live
      ============================================================ */}
      <aside
        className="sticky top-2 z-10 w-full shrink-0 self-start rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-xl backdrop-blur lg:static lg:top-auto lg:w-[440px]"
      >
        {/* En-tête : pseudo + code session */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Connecté
            </p>
            <p className="truncate text-sm font-semibold text-white">{pseudo}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Session
            </p>
            <p className="font-mono text-xs text-blue-400">{sessionCode}</p>
          </div>
        </div>

        {/* Le mini modèle : verre toujours visible, autres éléments apparaissent
            au fur et à mesure des réponses, et le verre s'anime pendant la simu */}
        <div className="flex flex-col items-center">
          <ParticipantMiniModel
            scores={scores}
            height={modelHeight}
            simulationSpeed={simulationSpeed}
            simulationStartedAt={simStartedAt}
          />
          {!hasAnyScore && !isSimRunning && (
            <p className="mt-2 text-center text-xs italic text-slate-500">
              Ton modèle se construira au fil de tes réponses
            </p>
          )}

          {/* Chrono pendant la simulation (heure simulée + barre de progression) */}
          {(isSimRunning || isSimDone) && scenarioMeta && (
            <div className="mt-3 w-full">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-blue-300 tabular-nums">
                  {formatSimulationClock(scenarioMeta.id, simProgress)}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500">
                  {scenarioMeta.title}
                </span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-[width] duration-100 ease-linear"
                  style={{ width: `${simProgress * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Badges des scores actuels : titre coloré + valeur.
            On masque le chip de l'élément en cours, car sa valeur est déjà
            visible dans le questionnaire (ex. les 4 sliders du Robinet
            affichent leur valeur en temps réel à droite de chaque encart). */}
        {hasAnyScore && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            {(Object.entries(scores) as [ElementId, number][])
              // On masque le chip de l'élément en cours TANT que le participant
              // n'a pas terminé son questionnaire (sinon on verrait le score
              // varier en direct alors qu'il est encore en train de répondre).
              .filter(([el]) => el !== currentElement || currentElementFinished)
              .map(([el, score]) => {
                const theme = ELEMENT_THEME[el]
                if (!theme) return null
                return (
                  <span
                    key={el}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${theme.chipClass}`}
                  >
                    <span>{theme.name}</span>
                    <span className="tabular-nums opacity-90">{score}</span>
                  </span>
                )
              })}
          </div>
        )}
      </aside>

      {/* ============================================================
          COLONNE DROITE (desktop) / BAS (mobile) : zones contextuelles
          ============================================================
          Priorité de l'affichage :
            1. Session terminée → écran fin
            2. Simulation lancée (en cours OU finie) → message contextuel
            3. Questionnaire d'un élément en cours → ParticipantQuestionnaire
            4. Tous les éléments remplis → ScenarioSelector + attente
            5. Sinon → écran d'attente du formateur
      ============================================================ */}
      <section className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl backdrop-blur">
        <AnimatePresence mode="wait">
          {isEnded ? (
            <motion.div
              key="ended"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center"
            >
              <Flag className="h-8 w-8 text-red-300" />
              <p className="text-sm text-slate-200">Session terminée !</p>
              <p className="text-xs text-slate-400">
                Merci pour ta participation. Tu peux fermer cette page.
              </p>
            </motion.div>
          ) : isSimRunning ? (
            <motion.div
              key="sim-running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 p-6 text-center"
            >
              <Play className="h-8 w-8 animate-pulse text-blue-300" />
              <p className="text-sm font-semibold text-blue-100">
                Simulation en cours…
              </p>
              <p className="text-xs text-slate-400">
                Regarde ton verre évoluer pendant {SIMULATION_DURATION_MS / 1000} secondes.
              </p>
            </motion.div>
          ) : isSimDone ? (
            <motion.div
              key="sim-done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 rounded-xl border border-purple-500/30 bg-purple-500/10 p-6 text-center"
            >
              <p className="text-sm font-semibold text-purple-100">
                Simulation terminée
              </p>
              <p className="text-xs text-slate-300">
                Ton verre est figé sur sa position finale. Le formateur va commenter.
              </p>
            </motion.div>
          ) : currentElement ? (
            <motion.div
              key={currentElement}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <ParticipantQuestionnaire
                participantId={participantId}
                element={currentElement}
                onFinished={() => setCurrentElementFinished(true)}
              />
            </motion.div>
          ) : allElementsDone ? (
            <motion.div
              key="scenario"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ScenarioSelector
                participantId={participantId}
                currentScenario={myScenario}
              />
            </motion.div>
          ) : (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-6 text-center"
            >
              <Hourglass className="h-8 w-8 animate-pulse text-amber-400" />
              <p className="text-sm text-slate-200">
                Le formateur va bientôt lancer un questionnaire.
              </p>
              <p className="text-xs text-slate-400">
                Reste sur cette page, tout se passera automatiquement.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </motion.div>
  )
}

