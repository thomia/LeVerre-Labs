"use client"

/**
 * Vue participant après avoir rejoint la session.
 *
 * Layout mobile-first (split continu) :
 *   ┌─────────────────┐
 *   │  Mini modèle    │   <- sticky en haut, toujours visible
 *   │  + indicateur   │
 *   ├─────────────────┤
 *   │  Questionnaire  │   <- scroll sous le modèle
 *   │  (ou attente)   │
 *   └─────────────────┘
 *
 * Desktop (≥ lg) : modèle à gauche, questionnaire à droite (2 colonnes).
 *
 * Les scores viennent de `useMyParticipant` (realtime sur sa propre ligne),
 * donc le modèle et l'indicateur se mettent à jour dès que le participant répond.
 */

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hourglass, Flag, Timer, CheckCircle2, Play, RotateCcw } from 'lucide-react'
import { useSession } from '@/hooks/use-session'
import { useMyParticipant } from '@/hooks/use-my-participant'
import { useIsDesktop } from '@/hooks/use-is-desktop'
import { ParticipantQuestionnaire } from './questionnaire'
import { ParticipantMiniModel } from './mon-mini-modele'
import { ELEMENT_THEME } from '@/lib/element-theme'
import { computeOverflowSeconds, formatOverflowSeconds } from '@/lib/indicateur'
import type { ElementId, ParticipantScores } from '@/lib/supabase/types'

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

  const modelHeight = isDesktop ? 420 : 280

  const scores = (me?.scores ?? {}) as ParticipantScores
  // Indicateur temps avant débordement : calculable dès que le Robinet est
  // renseigné (avant, aucun remplissage possible).
  const hasRobinet = scores.robinet !== undefined
  const overflowSeconds = computeOverflowSeconds(scores)

  // Le score de l'élément en cours n'apparaît sous le modèle qu'une fois que le
  // participant a TERMINÉ son questionnaire. On reset ce flag à chaque élément.
  const currentElementSession = session?.current_element ?? null
  const [currentElementFinished, setCurrentElementFinished] = useState(false)
  useEffect(() => {
    setCurrentElementFinished(false)
  }, [currentElementSession])

  // Lecture animée de la simulation : le verre se remplit en temps réel et
  // arrive plein pile au terme du compteur (= temps avant débordement).
  const [isPlaying, setIsPlaying] = useState(false)
  const [playStartedAt, setPlayStartedAt] = useState<string | null>(null)
  const [, setNowTick] = useState(0)
  // Référence de l'indicateur au moment du lancement : si le participant
  // modifie un élément pendant la simulation (le temps avant débordement change),
  // on l'arrête pour éviter une incohérence entre l'animation et le chiffre.
  const playBaselineRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isPlaying) return
    const id = setInterval(() => {
      setNowTick((t) => t + 1)
      if (playStartedAt && overflowSeconds !== null) {
        const elapsed = (Date.now() - new Date(playStartedAt).getTime()) / 1000
        if (elapsed >= overflowSeconds) setIsPlaying(false)
      }
    }, 100)
    return () => clearInterval(id)
  }, [isPlaying, playStartedAt, overflowSeconds])

  useEffect(() => {
    if (isPlaying && playBaselineRef.current !== null && overflowSeconds !== playBaselineRef.current) {
      setIsPlaying(false)
      setPlayStartedAt(null)
      playBaselineRef.current = null
    }
  }, [overflowSeconds, isPlaying])

  if (isSessionLoading) {
    return (
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
    )
  }

  const isEnded = session?.status === 'ended'
  const currentElement = session?.current_element ?? null
  const hasAnyScore = Object.keys(scores).length > 0
  const allElementsDone = Object.keys(scores).length === 5

  // Temps écoulé / restant pour la lecture animée.
  const elapsedPlay =
    isPlaying && playStartedAt
      ? (Date.now() - new Date(playStartedAt).getTime()) / 1000
      : 0
  const remainingPlay =
    overflowSeconds !== null ? Math.max(0, overflowSeconds - elapsedPlay) : null
  const hasFinishedPlay = !isPlaying && playStartedAt !== null

  function handlePlay() {
    if (overflowSeconds === null) return
    playBaselineRef.current = overflowSeconds
    setPlayStartedAt(new Date().toISOString())
    setIsPlaying(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full max-w-5xl flex-col gap-4 lg:flex-row lg:items-start"
    >
      {/* ============================================================
          COLONNE GAUCHE (desktop) / HAUT (mobile) : mini modèle live
      ============================================================ */}
      <aside className="sticky top-2 z-10 w-full shrink-0 self-start rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-xl backdrop-blur lg:static lg:top-auto lg:w-[440px]">
        {/* En-tête : pseudo + tâche + code session */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Connecté
            </p>
            <p className="truncate text-sm font-semibold text-white">{pseudo}</p>
            {me?.tache_reference && (
              <p className="truncate text-xs text-slate-400" title={me.tache_reference}>
                {me.tache_reference}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Session
            </p>
            <p className="font-mono text-xs text-blue-400">{sessionCode}</p>
          </div>
        </div>

        {/* Le mini modèle : verre toujours visible, autres éléments apparaissent
            au fur et à mesure des réponses */}
        <div className="flex flex-col items-center">
          <ParticipantMiniModel
            scores={scores}
            height={modelHeight}
            simulationSpeed={isPlaying ? 1 : null}
            simulationStartedAt={playStartedAt}
          />
          {!hasAnyScore && (
            <p className="mt-2 text-center text-xs italic text-slate-500">
              Ton modèle se construira au fil de tes réponses
            </p>
          )}
        </div>

        {/* Indicateur temps avant débordement + simulation animée */}
        {hasRobinet && (
          <div className="mt-3 flex flex-col gap-2 rounded-xl border border-blue-400/30 bg-blue-500/10 p-3">
            <div className="flex items-center justify-center gap-2">
              <Timer className="h-4 w-4 shrink-0 text-blue-300" />
              <span className="text-xs text-blue-100">
                {isPlaying ? 'Débordement dans' : 'Temps avant débordement'}
              </span>
              <span className="text-lg font-bold tabular-nums text-blue-300">
                {isPlaying
                  ? formatOverflowSeconds(remainingPlay)
                  : formatOverflowSeconds(overflowSeconds)}
              </span>
            </div>

            {overflowSeconds === null ? (
              <p className="text-center text-[11px] italic text-slate-400">
                Avec cette récupération, le verre ne déborde pas.
              </p>
            ) : isPlaying ? (
              <p className="text-center text-[11px] text-slate-300">
                Simulation en cours…
              </p>
            ) : hasFinishedPlay ? (
              <button
                onClick={handlePlay}
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-500/80 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
              >
                <RotateCcw className="h-4 w-4" />
                Rejouer la simulation
              </button>
            ) : (
              <button
                onClick={handlePlay}
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-500/80 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
              >
                <Play className="h-4 w-4" />
                Lancer la simulation
              </button>
            )}
          </div>
        )}

        {/* Badges des scores actuels : titre coloré + valeur.
            On masque le chip de l'élément en cours tant que le participant n'a
            pas terminé son questionnaire. */}
        {hasAnyScore && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            {(Object.entries(scores) as [ElementId, number][])
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
          Priorité de l'affichage :
            1. Session terminée → écran fin
            2. Questionnaire d'un élément en cours → ParticipantQuestionnaire
            3. Tous les éléments remplis → message "analyses terminées"
            4. Sinon → écran d'attente du formateur
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
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center"
            >
              <CheckCircle2 className="h-8 w-8 text-green-400" />
              <p className="text-sm font-semibold text-green-100">
                Analyses terminées !
              </p>
              <p className="text-xs text-slate-300">
                Ton indicateur est prêt. Le formateur va commenter les résultats
                ensemble.
              </p>
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
