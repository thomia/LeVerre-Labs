"use client"

/**
 * Lecture chiffrée de ce que raconte le verre à l'instant T : les 5 scores, le
 * niveau atteint, et le sens dans lequel ça va.
 *
 * Volontairement dense et lisible de loin — c'est la zone qu'on commente face
 * caméra pendant que le verre bouge juste au-dessus.
 */

import { ELEMENT_THEME } from '@/lib/element-theme'
import {
  ORDRE_AFFICHAGE_SCORES,
  couleurNiveau,
  formateDuree,
  type ScoresMoment,
} from '@/lib/analyse-rapide'

interface BandeauScoresProps {
  scores: ScoresMoment
  niveau: number
  /** Taux courant en % de verre par minute de vidéo (négatif = se vide). */
  taux: number
  /** Secondes de vidéo avant débordement, `null` si le verre ne déborde pas. */
  avantDebordement: number | null
  /** Nom du moment traversé, `null` entre deux moments. */
  momentActif: string | null
}

export function BandeauScores({ scores, niveau, taux, avantDebordement, momentActif }: BandeauScoresProps) {
  const couleur = couleurNiveau(niveau)
  const tendance = taux > 0.5 ? 'Se remplit' : taux < -0.5 ? 'Se vide' : 'Stable'

  return (
    <div className="space-y-2 rounded-2xl border border-white/10 bg-slate-950/60 p-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-white/35">
            {momentActif ? `Moment : ${momentActif}` : 'Hors moment — récupération'}
          </p>
          <p className="text-3xl font-bold tabular-nums leading-none" style={{ color: couleur }}>
            {Math.round(niveau)}
            <span className="text-base font-medium text-white/40"> % du verre</span>
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold" style={{ color: couleur }}>
            {tendance}
          </p>
          <p className="text-[11px] tabular-nums text-white/45">
            {taux >= 0 ? '+' : ''}
            {taux.toFixed(1)} %/min de vidéo
          </p>
          <p className="text-[11px] text-white/35">
            {avantDebordement === null
              ? 'Pas de débordement à ce rythme'
              : `Débordement dans ${formateDuree(avantDebordement)}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {ORDRE_AFFICHAGE_SCORES.map((element) => {
          const theme = ELEMENT_THEME[element]

          return (
            <div key={element} className="rounded-lg border border-white/5 bg-white/[0.02] px-1.5 py-1">
              <p
                className="truncate text-[9px] font-medium uppercase tracking-wide"
                style={{ color: theme.color }}
              >
                {theme.name}
              </p>
              <p className="text-lg font-bold tabular-nums leading-tight text-white">{scores[element]}</p>
              <div className="h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-[width] duration-300"
                  style={{ width: `${scores[element]}%`, backgroundColor: theme.color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
