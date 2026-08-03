"use client"

/**
 * Vue formateur : écran central projeté pendant la session.
 * Affiche :
 *   - Le code de session (grand format) + QR code pour rejoindre
 *   - La mosaïque des participants (mise à jour en temps réel)
 *   - Les contrôles pour lancer les questionnaires élément par élément
 *   - Modal "focus" au clic sur une carte (modèle en grand)
 */

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Users, Clock } from 'lucide-react'
import { QRCodeDisplay } from './affichage-qr-code'
import { ParticipantCard } from './carte-participant'
import { ParticipantFocusModal } from './modale-focus-participant'
import { FormateurControls } from './panneau-de-controle'
import { GraphiqueFilRouge } from './graphique-fil-rouge'
import { PopupActions } from './popup-actions'
import { useParticipants, type LiveParticipant } from '@/hooks/use-participants'
import { useSession } from '@/hooks/use-session'
import { LineChart, ClipboardList } from 'lucide-react'

interface FormateurDashboardProps {
  code: string
}

export function FormateurDashboard({ code }: FormateurDashboardProps) {
  const { participants, isLoading } = useParticipants(code)
  const { session } = useSession(code)
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [isGraphOpen, setIsGraphOpen] = useState(false)
  const [isActionsOpen, setIsActionsOpen] = useState(false)

  // ---- Horloge de simulation (mosaïque + modale focus) --------------------
  // Le remplissage des verres est déterministe : fonction du temps écoulé. On
  // dérive ce temps de `simulation_started_at` (diffusé à toute la session).
  //   - lecture  : le temps avance (tick).
  //   - pause    : « Stopper la simulation » remet ce champ à null MAIS la
  //                session reste `active` → on FIGE le temps écoulé (pour pouvoir
  //                l'expliquer, y compris dans la modale focus).
  //   - fin/reset: session `ended`/`waiting` → retour construction (verre vide).
  const sessionSimStart = session?.simulation_started_at ?? null
  const sessionStatus = session?.status ?? null
  const [startedAtMs, setStartedAtMs] = useState<number | null>(null)
  const [frozenElapsedMs, setFrozenElapsedMs] = useState<number | null>(null)
  const [nowMs, setNowMs] = useState(() => Date.now())
  const startedAtRef = useRef<number | null>(null)

  useEffect(() => {
    if (sessionSimStart) {
      const started = Date.parse(sessionSimStart)
      startedAtRef.current = started
      setStartedAtMs(started)
      setFrozenElapsedMs(null)
    } else if (sessionStatus === 'active' && startedAtRef.current !== null) {
      // Pause : la simulation a été stoppée sans terminer la session → on fige.
      setFrozenElapsedMs(Date.now() - startedAtRef.current)
    } else {
      // Fin / reset / pas encore lancée → construction.
      setStartedAtMs(null)
      setFrozenElapsedMs(null)
      startedAtRef.current = null
    }
  }, [sessionSimStart, sessionStatus])

  const isPlaying = sessionSimStart !== null && frozenElapsedMs === null
  useEffect(() => {
    if (!isPlaying) return
    const id = setInterval(() => setNowMs(Date.now()), 100)
    return () => clearInterval(id)
  }, [isPlaying])

  const simulationElapsedMs =
    frozenElapsedMs !== null
      ? frozenElapsedMs
      : isPlaying && startedAtMs !== null
        ? nowMs - startedAtMs
        : null

  // On retrouve toujours le participant à jour dans la liste live (et pas une
  // copie figée) → le modal reflète les scores temps réel.
  const focusedParticipant: LiveParticipant | null =
    participants.find((p) => p.id === focusedId) ?? null

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 p-6 pb-32 pt-24 text-white">
      {/* Header : code + QR + stats */}
      <div className="mx-auto mb-8 flex max-w-6xl flex-col items-start gap-6 rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <p className="mb-1 text-sm uppercase tracking-wider text-slate-400">
            Code de session
          </p>
          <h1 className="font-mono text-5xl font-bold tracking-widest text-blue-400">
            {code}
          </h1>
          <p className="mt-3 max-w-md text-sm text-slate-400">
            Les participants scannent le QR code pour rejoindre la session.
          </p>

          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <Users className="h-4 w-4 text-blue-400" />
              <span>
                {participants.length} participant
                {participants.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="h-4 w-4 text-amber-400" />
              <span>En attente</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsGraphOpen(true)}
              disabled={participants.length === 0}
              className="flex items-center gap-2 rounded-lg bg-blue-600/80 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <LineChart className="h-4 w-4" />
              Récap graphique
            </button>
            <button
              onClick={() => setIsActionsOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-emerald-600/80 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              <ClipboardList className="h-4 w-4" />
              Actions et recommandations
            </button>
          </div>
        </div>

        <QRCodeDisplay code={code} size={200} />
      </div>

      {/* Mosaïque participants */}
      <div className="mx-auto max-w-6xl">
        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : participants.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/30 p-12 text-center">
            <div className="mb-4 text-6xl">👥</div>
            <h2 className="mb-2 text-xl font-semibold">
              En attente des participants
            </h2>
            <p className="max-w-md text-sm text-slate-400">
              Invite tes participants à scanner le QR code.
              Ils apparaîtront ici au fur et à mesure qu&apos;ils rejoignent la
              session.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <AnimatePresence>
              {participants.map((p) => (
                <ParticipantCard
                  key={p.id}
                  participant={p}
                  onSelect={(participant) => setFocusedId(participant.id)}
                  simulationElapsedMs={simulationElapsedMs}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal "focus" : clic sur une carte → modèle en grand */}
      <ParticipantFocusModal
        participant={focusedParticipant}
        onClose={() => setFocusedId(null)}
        simulationElapsedMs={simulationElapsedMs}
      />

      {/* Récap graphique de l'indicateur (fil rouge) */}
      <GraphiqueFilRouge
        participants={participants}
        isOpen={isGraphOpen}
        onClose={() => setIsGraphOpen(false)}
      />

      {/* Pop-up actions et recommandations, remplie en commun avec le groupe */}
      <PopupActions
        sessionCode={code}
        isOpen={isActionsOpen}
        onClose={() => setIsActionsOpen(false)}
      />

      {/* Contrôles formateur (barre fixe en bas) */}
      <FormateurControls
        code={code}
        session={session}
        timerDurationSeconds={session?.timer_duration ?? 120}
      />
    </div>
  )
}
