"use client"

/**
 * Bloc « mon modèle » de la vue participant : identité, mini modèle live,
 * temps avant débordement et scores obtenus.
 *
 * Deux présentations selon la place disponible :
 *   - **compacte** (mobile pendant un questionnaire) : en-tête sur une ligne,
 *     modèle limité à ~22 % de la hauteur visible, indicateur sur une ligne.
 *     Le questionnaire garde ainsi la majorité de l'écran — c'est là que le
 *     participant agit.
 *   - **étendue** (desktop, ou mobile quand aucun questionnaire n'est en
 *     cours) : modèle en grand, badges des scores et contrôle de simulation.
 *
 * Le bouton « Agrandir » ouvre le modèle en plein écran : sur mobile, c'est le
 * moyen de l'observer en détail sans sacrifier la place des questions.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Maximize2, Play, RotateCcw, Timer, X } from 'lucide-react'
import { useIsDesktop } from '@/hooks/use-is-desktop'
import { useViewportHeight } from '@/hooks/use-viewport-height'
import { ParticipantMiniModel } from './mon-mini-modele'
import { ELEMENT_THEME } from '@/lib/element-theme'
import { formatOverflowSeconds } from '@/lib/indicateur'
import type { ElementId, ParticipantScores } from '@/lib/supabase/types'
import type { SimulationState } from '@/hooks/use-simulation-clock'

interface PanneauMonModeleProps {
  pseudo: string
  tacheReference: string | null
  sessionCode: string
  scores: ParticipantScores
  /** Élément dont le questionnaire est en cours (`null` = aucun). */
  currentElement: ElementId | null
  /** Le participant a terminé le questionnaire de l'élément en cours. */
  currentElementFinished: boolean
  /** Temps avant débordement en secondes (`null` = le verre ne déborde pas). */
  overflowSeconds: number | null
  /** Temps de simulation affiché (`null` = verre en construction). */
  simulationElapsedMs: number | null
  /** Une simulation est diffusée par le formateur (pas de contrôle local). */
  formateurActive: boolean
  simulationState: SimulationState
  localPlaying: boolean
  /** Une simulation perso a déjà tourné : le bouton propose de rejouer. */
  canReplay: boolean
  onLocalPlay: () => void
}

// Hauteur du mini modèle, en fraction de la hauteur visible du navigateur,
// avec des bornes pour rester lisible sur petit écran comme sur tablette.
const HAUTEUR_COMPACTE = { fraction: 0.22, min: 100, max: 180 }
const HAUTEUR_ETENDUE = { fraction: 0.4, min: 180, max: 360 }
const HAUTEUR_PLEIN_ECRAN = { fraction: 0.56, min: 220, max: 520 }
const HAUTEUR_DESKTOP = 420

function hauteurModele(
  hauteurVisible: number | null,
  { fraction, min, max }: { fraction: number; min: number; max: number }
): number {
  if (hauteurVisible === null) return min
  return Math.round(Math.min(max, Math.max(min, hauteurVisible * fraction)))
}

export function PanneauMonModele({
  pseudo,
  tacheReference,
  sessionCode,
  scores,
  currentElement,
  currentElementFinished,
  overflowSeconds,
  simulationElapsedMs,
  formateurActive,
  simulationState,
  localPlaying,
  canReplay,
  onLocalPlay,
}: PanneauMonModeleProps) {
  const isDesktop = useIsDesktop()
  const hauteurVisible = useViewportHeight()
  const [isPleinEcran, setIsPleinEcran] = useState(false)

  const hasAnyScore = Object.keys(scores).length > 0
  const hasRobinet = scores.robinet !== undefined
  // Compact uniquement là où la place manque : mobile + questionnaire en cours.
  const isCompact = !isDesktop && currentElement !== null

  const hauteur = isDesktop
    ? HAUTEUR_DESKTOP
    : hauteurModele(hauteurVisible, isCompact ? HAUTEUR_COMPACTE : HAUTEUR_ETENDUE)

  const modele = (
    <ParticipantMiniModel
      scores={scores}
      height={hauteur}
      simulationElapsedMs={simulationElapsedMs}
    />
  )

  return (
    <>
      {isCompact ? (
        <div className="flex flex-col gap-2">
          <EnTeteCompacte
            pseudo={pseudo}
            sessionCode={sessionCode}
            onAgrandir={() => setIsPleinEcran(true)}
          />
          {modele}
          {hasRobinet && (
            <IndicateurCompact
              overflowSeconds={overflowSeconds}
              simulationElapsedMs={simulationElapsedMs}
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col">
          <EnTeteDetaillee
            pseudo={pseudo}
            tacheReference={tacheReference}
            sessionCode={sessionCode}
          />

          <div className="flex flex-col items-center">
            {modele}
            {!hasAnyScore && (
              <p className="mt-2 text-center text-xs italic text-slate-500">
                Ton modèle se construira au fil de tes réponses
              </p>
            )}
          </div>

          {hasRobinet && (
            <IndicateurDetaille
              overflowSeconds={overflowSeconds}
              simulationElapsedMs={simulationElapsedMs}
              formateurActive={formateurActive}
              simulationState={simulationState}
              localPlaying={localPlaying}
              canReplay={canReplay}
              onLocalPlay={onLocalPlay}
            />
          )}

          <BadgesScores
            scores={scores}
            currentElement={currentElement}
            currentElementFinished={currentElementFinished}
          />
        </div>
      )}

      <AnimatePresence>
        {isPleinEcran && (
          <ModelePleinEcran
            onClose={() => setIsPleinEcran(false)}
            hauteur={hauteurModele(hauteurVisible, HAUTEUR_PLEIN_ECRAN)}
            scores={scores}
            currentElement={currentElement}
            currentElementFinished={currentElementFinished}
            overflowSeconds={overflowSeconds}
            simulationElapsedMs={simulationElapsedMs}
            formateurActive={formateurActive}
            simulationState={simulationState}
            localPlaying={localPlaying}
            canReplay={canReplay}
            onLocalPlay={onLocalPlay}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ---------------------------------------------------------------------------
// Sous-composants
// ---------------------------------------------------------------------------

interface EnTeteCompacteProps {
  pseudo: string
  sessionCode: string
  onAgrandir: () => void
}

function EnTeteCompacte({ pseudo, sessionCode, onAgrandir }: EnTeteCompacteProps) {
  return (
    <div className="flex items-center gap-2">
      <p className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
        {pseudo}
      </p>
      <span className="font-mono text-[11px] text-blue-400">{sessionCode}</span>
      <button
        onClick={onAgrandir}
        className="flex shrink-0 items-center gap-1 rounded-lg border border-white/10 bg-slate-800/80 px-2 py-1 text-[11px] font-medium text-slate-300 transition hover:border-white/30 hover:text-white"
      >
        <Maximize2 className="h-3 w-3" />
        Agrandir
      </button>
    </div>
  )
}

interface EnTeteDetailleeProps {
  pseudo: string
  tacheReference: string | null
  sessionCode: string
}

function EnTeteDetaillee({
  pseudo,
  tacheReference,
  sessionCode,
}: EnTeteDetailleeProps) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-slate-500">
          Connecté
        </p>
        <p className="truncate text-sm font-semibold text-white">{pseudo}</p>
        {tacheReference && (
          <p className="truncate text-xs text-slate-400" title={tacheReference}>
            {tacheReference}
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
  )
}

interface IndicateurProps {
  overflowSeconds: number | null
  simulationElapsedMs: number | null
}

/** Temps restant pendant une simulation, temps total sinon. */
function tempsAffiche(
  overflowSeconds: number | null,
  simulationElapsedMs: number | null
) {
  const isSimActive = simulationElapsedMs !== null
  if (!isSimActive || overflowSeconds === null)
    return { libelle: 'Temps avant débordement', valeur: overflowSeconds }

  const restant = Math.max(0, overflowSeconds - simulationElapsedMs / 1000)
  return { libelle: 'Débordement dans', valeur: restant }
}

function IndicateurCompact({ overflowSeconds, simulationElapsedMs }: IndicateurProps) {
  const { libelle, valeur } = tempsAffiche(overflowSeconds, simulationElapsedMs)

  return (
    <div className="flex items-center justify-center gap-2 rounded-lg border border-blue-400/30 bg-blue-500/10 px-2 py-1.5">
      <Timer className="h-3.5 w-3.5 shrink-0 text-blue-300" />
      <span className="truncate text-[11px] text-blue-100">{libelle}</span>
      <span className="text-sm font-bold tabular-nums text-blue-300">
        {formatOverflowSeconds(valeur)}
      </span>
    </div>
  )
}

interface IndicateurDetailleProps extends IndicateurProps {
  formateurActive: boolean
  simulationState: SimulationState
  localPlaying: boolean
  canReplay: boolean
  onLocalPlay: () => void
}

function IndicateurDetaille({
  overflowSeconds,
  simulationElapsedMs,
  formateurActive,
  simulationState,
  localPlaying,
  canReplay,
  onLocalPlay,
}: IndicateurDetailleProps) {
  const { libelle, valeur } = tempsAffiche(overflowSeconds, simulationElapsedMs)

  return (
    <div className="mt-3 flex flex-col gap-2 rounded-xl border border-blue-400/30 bg-blue-500/10 p-3">
      <div className="flex items-center justify-center gap-2">
        <Timer className="h-4 w-4 shrink-0 text-blue-300" />
        <span className="text-xs text-blue-100">{libelle}</span>
        <span className="text-lg font-bold tabular-nums text-blue-300">
          {formatOverflowSeconds(valeur)}
        </span>
      </div>

      {overflowSeconds === null ? (
        <p className="text-center text-[11px] italic text-slate-400">
          Avec cette récupération, le verre ne déborde pas.
        </p>
      ) : formateurActive ? (
        // Simulation diffusée par le formateur : pas de contrôle local.
        <p className="text-center text-[11px] text-slate-300">
          {simulationState === 'paused'
            ? 'Simulation en pause (formateur).'
            : 'Simulation lancée par le formateur…'}
        </p>
      ) : localPlaying ? (
        <p className="text-center text-[11px] text-slate-300">
          Simulation en cours…
        </p>
      ) : (
        <button
          onClick={onLocalPlay}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-500/80 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
        >
          {canReplay ? (
            <>
              <RotateCcw className="h-4 w-4" />
              Rejouer ma simulation
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Lancer ma simulation
            </>
          )}
        </button>
      )}
    </div>
  )
}

interface BadgesScoresProps {
  scores: ParticipantScores
  currentElement: ElementId | null
  currentElementFinished: boolean
}

/**
 * Badges des scores acquis. Le chip de l'élément en cours reste masqué jusqu'à
 * ce que le participant ait terminé son questionnaire (pas de score partiel).
 */
function BadgesScores({
  scores,
  currentElement,
  currentElementFinished,
}: BadgesScoresProps) {
  const visibles = (Object.entries(scores) as [ElementId, number][]).filter(
    ([el]) => el !== currentElement || currentElementFinished
  )
  if (visibles.length === 0) return null

  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
      {visibles.map(([el, score]) => {
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
  )
}

interface ModelePleinEcranProps extends IndicateurDetailleProps {
  onClose: () => void
  hauteur: number
  scores: ParticipantScores
  currentElement: ElementId | null
  currentElementFinished: boolean
}

function ModelePleinEcran({
  onClose,
  hauteur,
  scores,
  currentElement,
  currentElementFinished,
  ...indicateur
}: ModelePleinEcranProps) {
  const hasRobinet = scores.robinet !== undefined

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-black/90 p-4 backdrop-blur"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="m-auto flex w-full max-w-md flex-col"
      >
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Mon modèle</p>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition hover:bg-slate-700 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ParticipantMiniModel
          scores={scores}
          height={hauteur}
          simulationElapsedMs={indicateur.simulationElapsedMs}
        />

        {hasRobinet && <IndicateurDetaille {...indicateur} />}

        <BadgesScores
          scores={scores}
          currentElement={currentElement}
          currentElementFinished={currentElementFinished}
        />
      </div>
    </motion.div>
  )
}
