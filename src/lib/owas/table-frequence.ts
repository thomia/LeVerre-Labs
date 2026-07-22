/**
 * Table OWAS des catégories de risque par fréquence relative (Tabla 7).
 * =====================================================================
 *
 * Source : Ergonautas (Université Polytechnique de Valence), fiche OWAS,
 *   « Tabla 7 : Categorías de Riesgo de las posiciones del cuerpo según su
 *   frecuencia relativa », d'après Karhu et al. (1977).
 *   https://www.ergonautas.upv.es/metodos/owas/owas-ayuda.php
 *
 * Principe (étapes 7-8 de la méthode) : après codification de toutes les
 * postures d'une séance, on calcule pour CHAQUE segment (dos, bras, jambes)
 * la fréquence relative de chacune de ses positions (% du total des
 * postures observées). Cette fréquence, croisée avec la position, donne la
 * catégorie de risque (1-4) du segment via cette table.
 *
 * Valeurs vérifiées au caractère près contre la source Ergonautas.
 *
 * Colonnes = bandes de fréquence cumulées :
 *   index 0 → ≤10%, 1 → ≤20%, … 9 → ≤100%.
 */

import type { CodeDos, CodeBras, CodeJambes, CategorieAction } from './types'

const FREQUENCE_DOS: Record<CodeDos, readonly CategorieAction[]> = {
  1: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // droit
  2: [1, 1, 1, 2, 2, 2, 2, 2, 3, 3], // penché
  3: [1, 1, 2, 2, 2, 3, 3, 3, 3, 3], // torsion
  4: [1, 2, 2, 3, 3, 3, 3, 4, 4, 4], // penché + torsion
}

const FREQUENCE_BRAS: Record<CodeBras, readonly CategorieAction[]> = {
  1: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // deux bras bas
  2: [1, 1, 1, 2, 2, 2, 2, 2, 3, 3], // un bras élevé
  3: [1, 1, 2, 2, 2, 2, 2, 3, 3, 3], // deux bras élevés
}

const FREQUENCE_JAMBES: Record<CodeJambes, readonly CategorieAction[]> = {
  1: [1, 1, 1, 1, 1, 1, 1, 1, 1, 2], // assis
  2: [1, 1, 1, 1, 1, 1, 1, 1, 2, 2], // debout deux jambes tendues
  3: [1, 1, 1, 2, 2, 2, 2, 2, 3, 3], // debout une jambe tendue
  4: [1, 2, 2, 3, 3, 3, 3, 4, 4, 4], // deux genoux fléchis
  5: [1, 2, 2, 3, 3, 3, 3, 4, 4, 4], // un genou fléchi
  6: [1, 1, 2, 2, 2, 3, 3, 3, 3, 3], // à genoux
  7: [1, 1, 1, 1, 1, 1, 1, 1, 2, 2], // en marche
}

/**
 * Index de colonne (0-9) pour une fréquence relative en % (0-100].
 * ≤10% → 0, ≤20% → 1, … ≤100% → 9.
 */
function indexColonne(frequencePct: number): number {
  if (frequencePct <= 0) return 0
  return Math.min(9, Math.ceil(frequencePct / 10) - 1)
}

export function categorieFrequenceDos(dos: CodeDos, frequencePct: number): CategorieAction {
  return FREQUENCE_DOS[dos][indexColonne(frequencePct)]
}

export function categorieFrequenceBras(bras: CodeBras, frequencePct: number): CategorieAction {
  return FREQUENCE_BRAS[bras][indexColonne(frequencePct)]
}

export function categorieFrequenceJambes(jambes: CodeJambes, frequencePct: number): CategorieAction {
  return FREQUENCE_JAMBES[jambes][indexColonne(frequencePct)]
}
