'use client'

/**
 * Barre horizontale "minimaliste" (libelle + valeur a droite + bar fill).
 *
 * Reutilisee dans toutes les listes de repartition (par risque, par
 * siege lesion, par activite physique, etc.).
 *
 * GLOW ROUGE : applique quand `glow=true` (= ligne lie a un risque
 * d'activite physique). La barre passe a la couleur accent
 * rgb(255,30,90) avec un shadow rouge subtil.
 */

import { motion } from 'framer-motion'
import { formaterNombre, formaterPourcent } from '@/lib/stats-am'

interface BarHorizontaleProps {
  libelle: string
  valeur: number
  /** Valeur max de l'echelle (utile pour normaliser plusieurs barres). */
  maxValeur: number
  /** Unite a afficher apres la valeur ("%" ou "" pour les nombres bruts). */
  unite?: '%' | '' | 'jours' | 'cas'
  /** Mettre en evidence en rouge (= risque activite physique). */
  glow?: boolean
  /** Valeur secondaire optionnelle (ex: variation an/an). */
  valeurSecondaire?: string
}

export function BarHorizontale({
  libelle,
  valeur,
  maxValeur,
  unite = '',
  glow = false,
  valeurSecondaire,
}: BarHorizontaleProps) {
  const ratio = maxValeur > 0 ? Math.min(valeur / maxValeur, 1) : 0
  const couleurFill = glow ? 'rgb(255,30,90)' : 'rgba(255,255,255,0.35)'
  const couleurBg = glow ? 'rgba(255,30,90,0.10)' : 'rgba(255,255,255,0.04)'

  return (
    <li className="group">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span
          className={`
            min-w-0 truncate text-sm
            ${glow ? 'text-white' : 'text-gray-300'}
          `}
          title={libelle}
        >
          {libelle}
        </span>
        <span className="flex shrink-0 items-baseline gap-2 text-sm">
          <span className={glow ? 'font-semibold text-white' : 'text-gray-200'}>
            {unite === '%' ? formaterPourcent(valeur) : formaterNombre(valeur)}
            {unite === 'jours' && '\u00a0j'}
            {unite === 'cas' && '\u00a0cas'}
          </span>
          {valeurSecondaire && (
            <span className="text-xs text-gray-500">{valeurSecondaire}</span>
          )}
        </span>
      </div>

      {/* La bar elle-meme : background gris + fill colore selon glow */}
      <div
        className="relative h-1.5 w-full overflow-hidden rounded-full"
        style={{ background: couleurBg }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${ratio * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{
            background: couleurFill,
            boxShadow: glow ? '0 0 12px rgba(255,30,90,0.5)' : undefined,
          }}
        />
      </div>
    </li>
  )
}
