"use client"

/**
 * Frise de la vidéo : les moments découpés + la courbe de remplissage du verre.
 *
 * La courbe est l'élément narratif de l'enregistrement : elle montre d'avance
 * où le verre monte et où il redescend, pendant que la tête de lecture la
 * parcourt. Les moments se redimensionnent par leurs poignées latérales, et un
 * clic dans le vide déplace la lecture.
 */

import { useRef, type PointerEvent as ReactPointerEvent } from 'react'
import {
  DUREE_MIN_MOMENT,
  couleurTaux,
  formateTemps,
  scoresDuMoment,
  tauxParMinute,
  type MomentAnalyse,
} from '@/lib/analyse-rapide'

interface FriseMomentsProps {
  moments: MomentAnalyse[]
  duree: number
  temps: number
  courbe: number[]
  momentSelectionneId: string | null
  /** Début du moment en cours de découpage (clic début fait, clic fin en attente). */
  decoupageEnCours: number | null
  onSeek: (temps: number) => void
  onSelectionner: (id: string) => void
  onAjusterBornes: (id: string, bornes: { debut?: number; fin?: number }) => void
}

export function FriseMoments({
  moments,
  duree,
  temps,
  courbe,
  momentSelectionneId,
  decoupageEnCours,
  onSeek,
  onSelectionner,
  onAjusterBornes,
}: FriseMomentsProps) {
  const pisteRef = useRef<HTMLDivElement>(null)

  function tempsDepuisEvenement(clientX: number): number {
    const piste = pisteRef.current
    if (!piste || duree <= 0) return 0

    const rect = piste.getBoundingClientRect()
    const ratio = (clientX - rect.left) / rect.width
    return Math.max(0, Math.min(duree, ratio * duree))
  }

  function demarreAjustement(
    event: ReactPointerEvent,
    moment: MomentAnalyse,
    borne: 'debut' | 'fin'
  ) {
    event.stopPropagation()
    event.preventDefault()

    const deplace = (mouvement: globalThis.PointerEvent) => {
      const valeur = tempsDepuisEvenement(mouvement.clientX)

      if (borne === 'debut') onAjusterBornes(moment.id, { debut: Math.min(valeur, moment.fin - DUREE_MIN_MOMENT) })
      else onAjusterBornes(moment.id, { fin: Math.max(valeur, moment.debut + DUREE_MIN_MOMENT) })
    }

    const relache = () => {
      document.removeEventListener('pointermove', deplace)
      document.removeEventListener('pointerup', relache)
    }

    document.addEventListener('pointermove', deplace)
    document.addEventListener('pointerup', relache)
  }

  const pourcent = (valeur: number) => `${duree > 0 ? (valeur / duree) * 100 : 0}%`
  const graduations = construitGraduations(duree)

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-2">
      <div
        ref={pisteRef}
        className="relative h-[120px] cursor-pointer select-none overflow-hidden rounded-xl bg-black/40"
        onPointerDown={(event) => onSeek(tempsDepuisEvenement(event.clientX))}
      >
        {/* La courbe occupe la moitié haute, les moments la moitié basse : sans
            cette séparation, une courbe qui reste basse disparaît derrière les
            cartouches des moments. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[64px]">
          <CourbeNiveau courbe={courbe} />
          <span className="absolute right-1 top-0 text-[9px] font-medium text-red-400/50">100 % · débordement</span>
        </div>

        {graduations.map((valeur) => (
          <div key={valeur} className="absolute top-0 bottom-0 border-l border-white/5" style={{ left: pourcent(valeur) }}>
            <span className="absolute top-1 left-1 text-[9px] tabular-nums text-white/25">{formateTemps(valeur)}</span>
          </div>
        ))}

        <div className="absolute inset-x-0 bottom-0 h-[52px]">
          {moments.map((moment) => {
            const isSelectionne = moment.id === momentSelectionneId
            const couleur = couleurTaux(tauxParMinute(scoresDuMoment(moment.notations)))

            return (
              <div
                key={moment.id}
                className="group absolute top-0 bottom-0 overflow-hidden rounded-lg border transition-[box-shadow,border-color] duration-150"
                style={{
                  left: pourcent(moment.debut),
                  width: pourcent(Math.max(moment.fin - moment.debut, 0)),
                  backgroundColor: `${couleur}2e`,
                  borderColor: isSelectionne ? couleur : `${couleur}66`,
                  boxShadow: isSelectionne ? `0 0 0 1px ${couleur}, 0 0 18px ${couleur}40` : undefined,
                }}
                onPointerDown={(event) => {
                  event.stopPropagation()
                  onSelectionner(moment.id)
                }}
              >
                <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: couleur }} />
                <div className="flex h-full flex-col justify-center px-2">
                  <span className="truncate text-[11px] font-semibold leading-tight text-white">{moment.nom}</span>
                  <span className="truncate text-[9px] tabular-nums leading-tight text-white/45">
                    {formateTemps(moment.debut)} → {formateTemps(moment.fin)}
                  </span>
                </div>

                <button
                  type="button"
                  aria-label="Ajuster le début"
                  onPointerDown={(event) => demarreAjustement(event, moment, 'debut')}
                  className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize bg-white/0 transition-colors hover:bg-white/30"
                />
                <button
                  type="button"
                  aria-label="Ajuster la fin"
                  onPointerDown={(event) => demarreAjustement(event, moment, 'fin')}
                  className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize bg-white/0 transition-colors hover:bg-white/30"
                />
              </div>
            )
          })}

          {decoupageEnCours !== null && (
            <div
              className="absolute top-0 bottom-0 animate-pulse rounded-lg border border-[rgb(255,30,90)] bg-[rgb(255,30,90)]/25"
              style={{
                left: pourcent(Math.min(decoupageEnCours, temps)),
                width: pourcent(Math.max(temps - decoupageEnCours, 0)),
              }}
            />
          )}
        </div>

        <div className="pointer-events-none absolute top-0 bottom-0 z-10 w-[2px] bg-white" style={{ left: pourcent(temps) }}>
          <div className="absolute -top-px -left-[5px] h-3 w-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        </div>
      </div>
    </div>
  )
}

function CourbeNiveau({ courbe }: { courbe: number[] }) {
  if (courbe.length < 2) return null

  const pas = 1000 / (courbe.length - 1)
  const points = courbe.map((niveau, index) => `${index * pas},${100 - niveau}`).join(' ')

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1000 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="degrade-niveau" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="60%" stopColor="#facc15" />
          <stop offset="80%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <linearGradient id="remplissage-niveau" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      <polygon points={`0,100 ${points} 1000,100`} fill="url(#remplissage-niveau)" />
      <polyline
        points={points}
        fill="none"
        stroke="url(#degrade-niveau)"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
      <line x1="0" y1="0" x2="1000" y2="0" stroke="#f87171" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/** Graduations lisibles quelle que soit la durée (~8 repères). */
function construitGraduations(duree: number): number[] {
  if (duree <= 0) return []

  const candidats = [5, 10, 15, 30, 60, 120, 300, 600]
  const pas = candidats.find((valeur) => duree / valeur <= 10) ?? 900
  const graduations: number[] = []

  for (let t = pas; t < duree; t += pas) graduations.push(t)

  return graduations
}
