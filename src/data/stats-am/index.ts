/**
 * Point d'entree unique pour les statistiques de sinistralite AT/MP.
 *
 * Importe chaque fichier JSON annuel avec le typage `StatsAnnee`.
 * Si une donnee ne respecte pas le schema (`types.ts`), TypeScript le
 * signalera ici lors du build.
 *
 * Usage cote app :
 *   import { STATS_AM, getAnnee } from '@/data/stats-am'
 *   const stats2024 = getAnnee(2024)
 */

import type { StatsAnnee } from './types'

import data2024 from './2024.json'

/**
 * Toutes les annees disponibles, indexees par annee.
 * Au fur et a mesure des extractions, on ajoute les annees ici.
 */
export const STATS_AM = {
  2024: data2024 as StatsAnnee,
} as const satisfies Record<number, StatsAnnee>

/** Liste des annees disponibles, triees de la plus recente a la plus ancienne. */
export const ANNEES_DISPONIBLES = Object.keys(STATS_AM)
  .map(Number)
  .sort((a, b) => b - a)

/** Recupere les stats d'une annee donnee (ou undefined si absente). */
export function getAnnee(annee: number): StatsAnnee | undefined {
  return STATS_AM[annee as keyof typeof STATS_AM]
}

export type * from './types'
