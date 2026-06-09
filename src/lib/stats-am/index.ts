/**
 * Acces aux donnees de statistiques AT/MP (Assurance Maladie).
 *
 * Les fichiers JSON sont stockes dans `src/data/stats-am/<annee>.json` et
 * suivent le schema defini dans `src/data/stats-am/types.ts`.
 *
 * Cette lib expose :
 *   - `chargerAnnee(annee)`     : charge une annee precise (Server Component)
 *   - `chargerToutesAnnees()`   : charge toutes les annees disponibles
 *   - `ANNEES_DISPONIBLES`      : liste statique (peut servir pour les routes)
 *   - helpers de formatage (formaterNombre, formaterPourcent...)
 *
 * Les fonctions de chargement sont async + utilisent `import()` pour que
 * Next.js puisse mettre les JSON en cache cote serveur.
 */

import type { StatsAnnee, StatsCtn, CtnCode } from '@/data/stats-am/types'

/**
 * Annees pour lesquelles un PDF a ete extrait avec succes.
 * 2022 manque (PDF non publie ou non recupere).
 */
export const ANNEES_DISPONIBLES = [
  2015, 2016, 2017, 2018, 2019, 2020, 2021, 2023, 2024,
] as const

export type AnneeDisponible = (typeof ANNEES_DISPONIBLES)[number]

/**
 * Annee la plus recente disponible (= annee par defaut pour l'affichage).
 */
export const ANNEE_RECENTE: AnneeDisponible =
  ANNEES_DISPONIBLES[ANNEES_DISPONIBLES.length - 1]

/**
 * Charge une annee precise depuis le JSON statique.
 *
 * Utilise `import()` dynamique : Next.js bundle les JSON dans le serveur
 * et les met en cache. Pas de lecture disque a chaque appel.
 */
export async function chargerAnnee(annee: AnneeDisponible): Promise<StatsAnnee> {
  const mod = await import(`@/data/stats-am/${annee}.json`)
  return mod.default as StatsAnnee
}

/**
 * Charge toutes les annees disponibles, triees par ordre chronologique.
 */
export async function chargerToutesAnnees(): Promise<StatsAnnee[]> {
  const tous = await Promise.all(ANNEES_DISPONIBLES.map(chargerAnnee))
  return tous.sort((a, b) => a.annee - b.annee)
}

/**
 * Recupere les stats d'un CTN dans une annee. Si le CTN n'existe pas,
 * retourne `null` (ne devrait pas arriver en pratique car les 10 CTN
 * sont presents dans chaque JSON).
 */
export function getCtn(annee: StatsAnnee, code: CtnCode): StatsCtn | null {
  return annee.ctns.find((c) => c.code === code) ?? null
}

/* ---------- Helpers de formatage ---------- */

/**
 * Formate un grand nombre avec des espaces insecables fines (style fr-FR).
 * Ex : 549614 -> "549 614"
 */
export function formaterNombre(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—'
  return n.toLocaleString('fr-FR')
}

/**
 * Formate un nombre decimal avec virgule (style fr-FR).
 * Ex : 26.4 -> "26,4"
 */
export function formaterDecimal(n: number | null | undefined, decimales = 1): string {
  if (n === null || n === undefined) return '—'
  return n.toLocaleString('fr-FR', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  })
}

/**
 * Formate un pourcentage (0-100) avec le symbole %.
 *
 * Arrondi a 2 decimales MAXIMUM (jamais plus). Pas de zeros inutiles si
 * la valeur est ronde :
 *   - 50     -> "50 %"
 *   - 26.4   -> "26,4 %"
 *   - 26.456 -> "26,46 %"
 *   - 33.333 -> "33,33 %"
 *
 * Le separateur est l'espace insecable (\u00a0) avant le %, conforme
 * aux regles typographiques francaises.
 */
export function formaterPourcent(n: number): string {
  const arrondi = n.toLocaleString('fr-FR', {
    maximumFractionDigits: 2,
  })
  return `${arrondi}\u00a0%`
}

/**
 * Calcule la variation en % entre deux nombres (signe inclus).
 * Ex : variation(110, 100) = +10
 *      variation(90, 100)  = -10
 */
export function variationPourcent(actuel: number, precedent: number): number {
  if (precedent === 0) return 0
  return ((actuel - precedent) / precedent) * 100
}
