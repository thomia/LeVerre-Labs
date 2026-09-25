"use client"

/**
 * Les 5 éléments et leur score, en une seule barre.
 *
 * Volontairement unique dans l'écran : c'est à la fois le tableau de bord
 * pendant la relecture et la navigation par onglets pendant la notation.
 * Afficher les scores à deux endroits obligerait l'œil à faire l'aller-retour
 * et doublerait la zone à commenter à l'oral.
 */

import { ELEMENT_THEME } from '@/lib/element-theme'
import type { ElementId } from '@/lib/supabase/types'
import { ORDRE_AFFICHAGE_SCORES, type ScoresMoment } from '@/lib/analyse-rapide'

interface BarreElementsProps {
  scores: ScoresMoment
  /** Élément mis en avant, `null` hors notation. */
  elementActif: ElementId | null
  /** Absent hors notation : la barre devient un simple affichage. */
  onSelectionner?: (element: ElementId) => void
}

export function BarreElements({ scores, elementActif, onSelectionner }: BarreElementsProps) {
  return (
    <div className="grid shrink-0 grid-cols-5 gap-1.5">
      {ORDRE_AFFICHAGE_SCORES.map((element) => {
        const theme = ELEMENT_THEME[element]
        const isActif = element === elementActif
        const Balise = onSelectionner ? 'button' : 'div'

        return (
          <Balise
            key={element}
            {...(onSelectionner
              ? { type: 'button' as const, onClick: () => onSelectionner(element) }
              : {})}
            className="rounded-xl border px-2 py-1.5 text-left transition-all duration-150"
            style={{
              borderColor: isActif ? theme.color : 'rgba(255,255,255,0.08)',
              backgroundColor: isActif ? `${theme.color}1f` : 'rgba(255,255,255,0.02)',
            }}
          >
            <span
              className="block truncate text-[10px] font-medium uppercase tracking-wide"
              style={{ color: isActif ? theme.color : 'rgba(255,255,255,0.45)' }}
            >
              {theme.name}
            </span>
            <span
              className="block text-xl font-bold tabular-nums leading-tight"
              style={{ color: isActif ? theme.color : 'rgba(255,255,255,0.85)' }}
            >
              {scores[element]}
            </span>
            <span className="mt-0.5 block h-1 overflow-hidden rounded-full bg-white/10">
              <span
                className="block h-full rounded-full transition-[width] duration-300"
                style={{ width: `${scores[element]}%`, backgroundColor: theme.color }}
              />
            </span>
          </Balise>
        )
      })}
    </div>
  )
}
