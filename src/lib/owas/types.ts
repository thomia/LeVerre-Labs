/**
 * Types du moteur OWAS (Ovako Working posture Analysing System).
 * =============================================================
 *
 * Méthode d'échantillonnage postural de Karhu, Kansi & Kuorinka (1977).
 * Chaque posture observée est codée sur 4 dimensions :
 *   - Dos    (4 catégories)
 *   - Bras   (3 catégories)
 *   - Jambes (7 catégories)
 *   - Charge (3 catégories de poids)
 *
 * La combinaison des 4 codes (4 × 3 × 7 × 3 = 252) donne une catégorie
 * d'action AC1 à AC4 indiquant l'urgence d'intervention.
 *
 * NB : l'extension Tête/Cou (LeVerre Labs) est volontairement absente de
 * cette v1 — elle sera ajoutée plus tard comme indicateur complémentaire,
 * jamais fusionnée dans la table officielle à 4 dimensions.
 */

export type CodeDos = 1 | 2 | 3 | 4
export type CodeBras = 1 | 2 | 3
export type CodeJambes = 1 | 2 | 3 | 4 | 5 | 6 | 7
export type CodeCharge = 1 | 2 | 3

/** Catégorie d'action OWAS : 1 (aucune action) → 4 (action immédiate). */
export type CategorieAction = 1 | 2 | 3 | 4

/** Codification complète d'une posture observée (une photo). */
export interface CodificationOwas {
  dos: CodeDos
  bras: CodeBras
  jambes: CodeJambes
  charge: CodeCharge
}
