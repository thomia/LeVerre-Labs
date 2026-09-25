"use client"

/**
 * Lecteur vidéo de l'analyse rapide.
 *
 * Les contrôles sont sous l'image et toujours visibles : en capture d'écran,
 * une barre qui apparaît au survol produit des allers-retours parasites et une
 * souris qui traîne sur l'image. Le bouton de découpage est le plus gros
 * élément de la barre — c'est le geste répété tout au long de l'analyse.
 */

import { Pause, Play, Scissors, SkipBack, SkipForward, Square, Volume2, VolumeX } from 'lucide-react'
import { formateDuree, formateTemps } from '@/lib/analyse-rapide'
import type { RefObject } from 'react'

const VITESSES = [0.25, 0.5, 1, 1.5, 2] as const

interface LecteurVideoProps {
  videoRef: RefObject<HTMLVideoElement | null>
  src: string
  isPlaying: boolean
  isMuted: boolean
  temps: number
  duree: number
  vitesse: number
  decoupageEnCours: number | null
  onTogglePlay: () => void
  onToggleMuet: () => void
  onDeplacer: (delta: number) => void
  onVitesse: (vitesse: number) => void
  onBasculeDecoupage: () => void
  onMetadonnees: (duree: number) => void
}

export function LecteurVideo({
  videoRef,
  src,
  isPlaying,
  isMuted,
  temps,
  duree,
  vitesse,
  decoupageEnCours,
  onTogglePlay,
  onToggleMuet,
  onDeplacer,
  onVitesse,
  onBasculeDecoupage,
  onMetadonnees,
}: LecteurVideoProps) {
  const isDecoupage = decoupageEnCours !== null

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black">
        <video
          ref={videoRef}
          src={src}
          className="h-full w-full object-contain"
          onLoadedMetadata={(event) => onMetadonnees(event.currentTarget.duration)}
          onClick={onTogglePlay}
          playsInline
        />

        {isDecoupage && (
          <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-full bg-[rgb(255,30,90)]/90 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            Moment en cours · {formateDuree(Math.max(0, temps - decoupageEnCours))}
          </div>
        )}

        <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium tabular-nums text-white/80 backdrop-blur">
          {formateTemps(temps, true)} / {formateTemps(duree)}
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 p-2">
        <button
          type="button"
          onClick={onTogglePlay}
          title="Lecture / pause (Espace)"
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>

        <button
          type="button"
          onClick={() => onDeplacer(-5)}
          title="Reculer de 5 s (←)"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <SkipBack className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onDeplacer(5)}
          title="Avancer de 5 s (→)"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <SkipForward className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onBasculeDecoupage}
          className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors ${
            isDecoupage
              ? 'animate-pulse bg-[rgb(255,30,90)] text-white hover:bg-[rgb(255,60,120)]'
              : 'bg-white text-slate-950 hover:bg-white/85'
          }`}
          title="Découper un moment (M)"
        >
          {isDecoupage ? <Square className="h-4 w-4" /> : <Scissors className="h-4 w-4" />}
          {isDecoupage ? 'Terminer le moment' : 'Début du moment'}
          <kbd className="rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-medium">M</kbd>
        </button>

        <div className="flex items-center gap-0.5 rounded-xl bg-white/5 p-1">
          {VITESSES.map((valeur) => (
            <button
              key={valeur}
              type="button"
              onClick={() => onVitesse(valeur)}
              className={`rounded-lg px-2 py-1 text-[11px] font-medium tabular-nums transition-colors ${
                vitesse === valeur ? 'bg-white/20 text-white' : 'text-white/45 hover:text-white'
              }`}
              title={`Vitesse de lecture ×${valeur}`}
            >
              ×{valeur}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onToggleMuet}
          title={isMuted ? 'Rétablir le son' : 'Couper le son'}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
