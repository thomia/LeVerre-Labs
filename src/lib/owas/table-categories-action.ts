/**
 * Table officielle OWAS des catégories d'action (252 combinaisons).
 * ================================================================
 *
 * Source : Karhu O., Kansi P., Kuorinka I. (1977), « Correcting working
 * postures in industry: a practical method for analysis », Applied
 * Ergonomics 8(4):199-201.
 *
 * Transcrite depuis Yılmaz M. (2023), IJPTE 2(1):103-112, « Table 3.
 * Common impact action code in OWAS », qui reproduit la table d'origine,
 * puis recoupée cellule par cellule avec la table de référence Ergonautas.
 *
 * ⚠️ À FAIRE VALIDER PAR L'ERGONOME avant mise en production.
 *    Bien que recoupée sur plusieurs sources concordantes, cette table
 *    alimente un score professionnel de prévention : l'exactitude prime.
 *    Aucune cellule n'a été interpolée ni « devinée » ; en cas de doute
 *    ultérieur, comparer ligne par ligne au tableau imprimé d'origine.
 *
 * Lecture : TABLE_AC[dos][bras] est une matrice 7×3 où
 *   - l'index de ligne (0-6) correspond au code Jambes 1→7,
 *   - l'index de colonne (0-2) correspond au code Charge 1→3.
 */

import type {
  CodeDos,
  CodeBras,
  CodeJambes,
  CodeCharge,
  CategorieAction,
} from './types'

type LigneJambes = readonly [CategorieAction, CategorieAction, CategorieAction]
type MatricePosture = readonly [
  LigneJambes, // jambes 1
  LigneJambes, // jambes 2
  LigneJambes, // jambes 3
  LigneJambes, // jambes 4
  LigneJambes, // jambes 5
  LigneJambes, // jambes 6
  LigneJambes, // jambes 7
]

const TABLE_AC: Record<CodeDos, Record<CodeBras, MatricePosture>> = {
  // ---- DOS 1 : droit ----
  1: {
    1: [[1, 1, 1], [1, 1, 1], [1, 1, 1], [2, 2, 2], [2, 2, 2], [1, 1, 1], [1, 1, 1]],
    2: [[1, 1, 1], [1, 1, 1], [1, 1, 1], [2, 2, 2], [2, 2, 2], [1, 1, 1], [1, 1, 1]],
    3: [[1, 1, 1], [1, 1, 1], [1, 1, 1], [2, 2, 3], [2, 2, 3], [1, 1, 1], [1, 1, 2]],
  },
  // ---- DOS 2 : penché en avant ----
  2: {
    1: [[2, 2, 3], [2, 2, 3], [2, 2, 3], [3, 3, 3], [3, 3, 3], [2, 2, 2], [2, 3, 3]],
    2: [[2, 2, 3], [2, 2, 3], [2, 3, 3], [3, 4, 4], [3, 4, 4], [3, 3, 4], [2, 3, 4]],
    3: [[3, 3, 4], [2, 2, 3], [3, 3, 3], [3, 4, 4], [4, 4, 4], [4, 4, 4], [2, 3, 4]],
  },
  // ---- DOS 3 : en torsion ----
  3: {
    1: [[1, 1, 1], [1, 1, 1], [1, 1, 2], [3, 3, 3], [4, 4, 4], [1, 1, 1], [1, 1, 1]],
    2: [[2, 2, 3], [1, 1, 1], [1, 1, 2], [4, 4, 4], [4, 4, 4], [3, 3, 3], [1, 1, 1]],
    3: [[2, 2, 3], [1, 1, 1], [2, 3, 3], [4, 4, 4], [4, 4, 4], [4, 4, 4], [1, 1, 1]],
  },
  // ---- DOS 4 : penché et en torsion ----
  4: {
    1: [[2, 3, 3], [2, 2, 3], [2, 2, 3], [4, 4, 4], [4, 4, 4], [4, 4, 4], [2, 3, 4]],
    2: [[3, 3, 4], [2, 3, 4], [3, 3, 4], [4, 4, 4], [4, 4, 4], [4, 4, 4], [2, 3, 4]],
    3: [[4, 4, 4], [2, 3, 4], [3, 3, 4], [4, 4, 4], [4, 4, 4], [4, 4, 4], [2, 3, 4]],
  },
}

/**
 * Retourne la catégorie d'action OWAS (1-4) pour une combinaison donnée.
 * Les codes sont 1-based (conformément à la convention OWAS officielle).
 */
export function getCategorieAction(
  dos: CodeDos,
  bras: CodeBras,
  jambes: CodeJambes,
  charge: CodeCharge,
): CategorieAction {
  return TABLE_AC[dos][bras][jambes - 1][charge - 1]
}

/**
 * Contrôle d'intégrité : vérifie que la table contient bien 252 entrées
 * valides (catégories 1-4). Utile en test/dev pour détecter une coquille
 * de transcription. Retourne le nombre d'entrées vérifiées.
 */
export function verifierIntegriteTable(): number {
  const tousDos: CodeDos[] = [1, 2, 3, 4]
  const tousBras: CodeBras[] = [1, 2, 3]
  let total = 0

  for (const dos of tousDos) {
    for (const bras of tousBras) {
      const matrice = TABLE_AC[dos][bras]
      if (matrice.length !== 7) throw new Error(`OWAS: dos ${dos} bras ${bras} ≠ 7 jambes`)
      for (const ligne of matrice) {
        if (ligne.length !== 3) throw new Error(`OWAS: ligne charge ≠ 3 (dos ${dos} bras ${bras})`)
        for (const ac of ligne) {
          if (ac < 1 || ac > 4) throw new Error(`OWAS: catégorie d'action invalide (${ac})`)
          total++
        }
      }
    }
  }

  if (total !== 252) throw new Error(`OWAS: ${total} combinaisons au lieu de 252`)
  return total
}
