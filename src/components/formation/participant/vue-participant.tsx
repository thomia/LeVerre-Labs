"use client"

/**
 * Vue participant après avoir rejoint la session.
 *
 * Layout mobile-first (split continu) :
 *   ┌─────────────────┐
 *   │  Mini modèle    │   <- compact pendant un questionnaire
 *   │  + indicateur   │
 *   ├─────────────────┤
 *   │  Questionnaire  │   <- garde la majorité de l'écran
 *   │  (ou attente)   │
 *   └─────────────────┘
 *
 * Desktop (≥ lg) : modèle à gauche, questionnaire à droite (2 colonnes).
 *
 * Sur mobile, le bloc modèle n'est volontairement PAS sticky : collé en haut,
 * il confisquait la moitié de l'écran et le participant répondait dans une
 * fenêtre de quelques dizaines de pixels. Il défile donc avec la page, et le
 * bouton « Agrandir » permet d'observer le modèle en plein écran à la demande.
 *
 * Les scores viennent de `useMyParticipant` (realtime sur sa propre ligne),
 * donc le modèle et l'indicateur se mettent à jour dès que le participant répond.
 */

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hourglass, Flag, CheckCircle2 } from 'lucide-react'
import { useSession } from '@/hooks/use-session'
import { useMyParticipant } from '@/hooks/use-my-participant'
import { useSimulationClock } from '@/hooks/use-simulation-clock'
import { ParticipantQuestionnaire } from './questionnaire'
import { PanneauMonModele } from './panneau-mon-modele'
import { computeOverflowSeconds } from '@/lib/indicateur'
import type { ParticipantScores } from '@/lib/supabase/types'

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

  const scores = (me?.scores ?? {}) as ParticipantScores
  const overflowSeconds = computeOverflowSeconds(scores)

  // Le score de l'élément en cours n'apparaît sous le modèle qu'une fois que le
  // participant a TERMINÉ son questionnaire. On reset ce flag à chaque élément.
  const currentElementSession = session?.current_element ?? null
  const [currentElementFinished, setCurrentElementFinished] = useState(false)
  useEffect(() => {
    setCurrentElementFinished(false)
  }, [currentElementSession])

  // Simulation diffusée par le formateur (état partagé, déterministe) : lecture,
  // pause (figée) et reprise sont pilotées depuis la barre formateur. Le verre
  // se remplit en fonction du temps écoulé, synchronisé pour toute la session.
  const { elapsedMs: formateurElapsedMs, state: simulationState } =
    useSimulationClock(session)
  const formateurActive = simulationState !== 'idle'

  // Simulation PERSO du participant : il peut « jouer » avec son propre modèle
  // en autonomie (local, invisible sur le dashboard formateur). Prioritaire :
  // dès que le formateur lance une simulation, c'est la sienne qui s'affiche.
  const [localStart, setLocalStart] = useState<number | null>(null)
  const [localFrozen, setLocalFrozen] = useState<number | null>(null)
  const [localNow, setLocalNow] = useState(() => Date.now())
  const localPlaying = localStart !== null && localFrozen === null

  useEffect(() => {
    if (!localPlaying) return
    const id = setInterval(() => {
      setLocalNow(Date.now())
      if (localStart !== null && overflowSeconds !== null) {
        const elapsed = (Date.now() - localStart) / 1000
        // Arrivé au débordement : on fige le verre plein.
        if (elapsed >= overflowSeconds) setLocalFrozen(overflowSeconds * 1000)
      }
    }, 100)
    return () => clearInterval(id)
  }, [localPlaying, localStart, overflowSeconds])

  // La simulation du formateur prend le dessus sur la simulation perso.
  useEffect(() => {
    if (formateurActive) {
      setLocalStart(null)
      setLocalFrozen(null)
    }
  }, [formateurActive])

  // Si le participant modifie une réponse (le temps avant débordement change),
  // on remet sa simulation perso à zéro : sinon l'animation en cours serait
  // incohérente avec le nouveau niveau de remplissage.
  const overflowRef = useRef<number | null>(overflowSeconds)
  useEffect(() => {
    if (overflowRef.current !== overflowSeconds) {
      setLocalStart(null)
      setLocalFrozen(null)
    }
    overflowRef.current = overflowSeconds
  }, [overflowSeconds])

  const localElapsedMs =
    localFrozen !== null
      ? localFrozen
      : localPlaying && localStart !== null
        ? localNow - localStart
        : null

  // Temps effectivement affiché : simulation formateur si active, sinon perso.
  const simulationElapsedMs = formateurActive ? formateurElapsedMs : localElapsedMs

  function handleLocalPlay() {
    if (overflowSeconds === null) return
    setLocalFrozen(null)
    setLocalStart(Date.now())
  }

  if (isSessionLoading) {
    return (
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
    )
  }

  const isEnded = session?.status === 'ended'
  const currentElement = session?.current_element ?? null
  const allElementsDone = Object.keys(scores).length === 5

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full max-w-5xl flex-col gap-3 sm:gap-4 lg:flex-row lg:items-start"
    >
      {/* ============================================================
          COLONNE GAUCHE (desktop) / HAUT (mobile) : mini modèle live
      ============================================================ */}
      <aside className="w-full shrink-0 self-start rounded-2xl border border-white/10 bg-slate-900/80 p-3 shadow-xl backdrop-blur sm:p-4 lg:w-[440px]">
        <PanneauMonModele
          pseudo={pseudo}
          tacheReference={me?.tache_reference ?? null}
          sessionCode={sessionCode}
          scores={scores}
          currentElement={currentElement}
          currentElementFinished={currentElementFinished}
          overflowSeconds={overflowSeconds}
          simulationElapsedMs={simulationElapsedMs}
          formateurActive={formateurActive}
          simulationState={simulationState}
          localPlaying={localPlaying}
          canReplay={localElapsedMs !== null}
          onLocalPlay={handleLocalPlay}
        />
      </aside>

      {/* ============================================================
          COLONNE DROITE (desktop) / BAS (mobile) : zones contextuelles
          Priorité de l'affichage :
            1. Session terminée → écran fin
            2. Questionnaire d'un élément en cours → ParticipantQuestionnaire
            3. Tous les éléments remplis → message "analyses terminées"
            4. Sinon → écran d'attente du formateur
      ============================================================ */}
      <section className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-2xl backdrop-blur sm:p-5">
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
