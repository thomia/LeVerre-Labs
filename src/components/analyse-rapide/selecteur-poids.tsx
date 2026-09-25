"use client"

/**
 * Les 4 cases d'importance affichées en face de chaque critère.
 *
 * Remplissage cumulatif (comme une note sur 4) : le poids se lit d'un coup
 * d'œil à l'écran, y compris sur une vidéo redimensionnée. Un clic sur la case
 * déjà active écarte le critère du calcul — utile quand un facteur n'est pas
 * observable sur ce moment précis.
 */

import { NIVEAUX_POIDS } from '@/lib/analyse-rapide'

interface SelecteurPoidsProps {
  niveau: number | null
  couleur: string
  onChange: (niveau: number | null) => void
}

export function SelecteurPoids({ niveau, couleur, onChange }: SelecteurPoidsProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-[70px] text-right text-[10px] font-medium uppercase tracking-wide"
        style={{ color: niveau === null ? 'rgba(255,255,255,0.3)' : couleur }}
      >
        {niveau === null ? 'écarté' : NIVEAUX_POIDS[niveau].label}
      </span>

      <div className="flex gap-1">
        {NIVEAUX_POIDS.map((cran, index) => {
          const isRempli = niveau !== null && index <= niveau

          return (
            <button
              key={cran.label}
              type="button"
              aria-label={`${cran.label} — ${cran.description}`}
              title={`${cran.label} (×${cran.poids}) — ${cran.description}`}
              onClick={() => onChange(niveau === index ? null : index)}
              className="h-[18px] w-[18px] rounded-[4px] border transition-all duration-150 hover:scale-110"
              style={{
                backgroundColor: isRempli ? couleur : 'rgba(255,255,255,0.04)',
                borderColor: isRempli ? couleur : 'rgba(255,255,255,0.18)',
                boxShadow: niveau === index ? `0 0 0 2px ${couleur}40` : undefined,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
