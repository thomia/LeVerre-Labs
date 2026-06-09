'use client'

/**
 * Conteneur visuel reutilise par toutes les vues de la console.
 *
 * Une "carte d'analyse" = un encart avec :
 *   - un titre principal
 *   - un sous-titre (contexte : CTN, annee, indicateur)
 *   - du contenu libre (chart, liste, tableau)
 *   - une note de bas optionnelle (pedagogique, explique le glow)
 *
 * Le style est volontairement sobre (border + bg semi-transparent)
 * pour laisser place aux donnees.
 */

import type { ReactNode } from 'react'

interface CarteAnalyseProps {
  titre: string
  sousTitre?: string
  note?: string
  /** Si true, applique un glow rouge a la carte entiere (= risque physique). */
  glowRouge?: boolean
  /** Element optionnel a droite du titre (badge, bouton, ...). */
  actions?: ReactNode
  children: ReactNode
}

export function CarteAnalyse({
  titre,
  sousTitre,
  note,
  glowRouge = false,
  actions,
  children,
}: CarteAnalyseProps) {
  return (
    <article
      className={`
        flex flex-col rounded-xl border bg-white/[0.02] p-5 sm:p-6
        ${glowRouge ? 'border-[rgb(255,30,90)]/25' : 'border-white/10'}
      `}
      style={
        glowRouge
          ? {
              boxShadow:
                '0 0 32px rgba(255,30,90,0.15), inset 0 0 16px rgba(255,30,90,0.04)',
            }
          : undefined
      }
    >
      <header className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white">{titre}</h3>
          {sousTitre && (
            <p className="mt-0.5 text-xs uppercase tracking-wider text-gray-500">
              {sousTitre}
            </p>
          )}
        </div>
        {actions}
      </header>

      <div className="flex-1">{children}</div>

      {note && (
        <p className="mt-4 border-t border-white/5 pt-3 text-xs text-gray-500">
          {note}
        </p>
      )}
    </article>
  )
}
