"use client"

/**
 * Une ligne de notation : un critère du modèle, son aide-mémoire, son curseur
 * de gravité 0-100 et ses 4 cases d'importance.
 *
 * Trois informations, trois niveaux de lecture :
 *   - `repere`  (gris, petit)  : où regarder dans l'image — le support de la
 *     justification orale pendant l'enregistrement.
 *   - le curseur               : la gravité observée, toujours 0 = rien à
 *     signaler → 100 = le pire.
 *   - `ancrage` (couleur)      : le descripteur correspondant à la position du
 *     curseur, qui s'écrit en clair pour la caméra.
 */

import * as RadixSlider from '@radix-ui/react-slider'
import { ancrageActif, type CritereRapide, type NotationCritere } from '@/lib/analyse-rapide'
import { SelecteurPoids } from './selecteur-poids'

interface LigneCritereProps {
  critere: CritereRapide
  notation: NotationCritere
  couleur: string
  onChange: (notation: NotationCritere) => void
}

export function LigneCritere({ critere, notation, couleur, onChange }: LigneCritereProps) {
  const isMultiplicateur = critere.role === 'multiplicateur'
  const isEcarte = !isMultiplicateur && notation.niveauPoids === null

  return (
    <div
      className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5 transition-colors hover:border-white/10"
      style={{ opacity: isEcarte ? 0.45 : 1 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-white">{critere.label}</span>
            {isMultiplicateur && (
              <span
                className="rounded border px-1.5 py-px text-[9px] font-medium uppercase tracking-wide"
                style={{ color: couleur, borderColor: `${couleur}55`, backgroundColor: `${couleur}14` }}
                title="Ce curseur multiplie le score de l'élément : à 0, l'élément est neutralisé."
              >
                multiplicateur
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[11px] leading-snug text-white/40">{critere.repere}</p>
        </div>

        {isMultiplicateur ? (
          <span className="shrink-0 pt-1 text-[10px] uppercase tracking-wide text-white/30">× sur le score</span>
        ) : (
          <div className="shrink-0 pt-0.5">
            <SelecteurPoids
              niveau={notation.niveauPoids}
              couleur={couleur}
              onChange={(niveauPoids) => onChange({ ...notation, niveauPoids })}
            />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center gap-3">
        <RadixSlider.Root
          value={[notation.gravite]}
          min={0}
          max={100}
          step={1}
          disabled={isEcarte}
          onValueChange={([gravite]) => onChange({ ...notation, gravite: gravite ?? 0 })}
          className="relative flex h-6 flex-1 touch-none select-none items-center"
        >
          <RadixSlider.Track className="relative h-2 grow overflow-hidden rounded-full bg-white/10">
            <RadixSlider.Range className="absolute h-full rounded-full" style={{ backgroundColor: couleur }} />
          </RadixSlider.Track>
          <RadixSlider.Thumb
            className="block h-5 w-5 rounded-full border-2 border-white/80 shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            style={{ backgroundColor: couleur }}
            aria-label={`Gravité — ${critere.label}`}
          />
        </RadixSlider.Root>

        <span className="w-9 text-right text-sm font-bold tabular-nums" style={{ color: couleur }}>
          {notation.gravite}
        </span>
      </div>

      <p className="mt-1 text-[11px] font-medium" style={{ color: `${couleur}cc` }}>
        {ancrageActif(critere, notation.gravite)}
      </p>
    </div>
  )
}
