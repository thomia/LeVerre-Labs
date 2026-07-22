/**
 * Auto-tests du moteur OWAS.
 * ==========================
 *
 * Permet de vérifier sans dépendance externe que :
 *   - la table des 252 combinaisons est complète et bien formée ;
 *   - des postures de référence donnent la bonne catégorie d'action ;
 *   - l'agrégation par fréquence (Tabla 7) se comporte correctement.
 *
 * Les cas de référence proviennent de la table officielle Ergonautas et
 * d'exemples documentés (dont ceux des supports OWAS partagés).
 */

import type { CodificationOwas, CategorieAction } from './types'
import { verifierIntegriteTable } from './table-categories-action'
import {
  categorieActionPosture,
  categoriesSegments,
  pireCategoriePosture,
} from './analyse'

export interface ResultatTest {
  nom: string
  attendu: string
  obtenu: string
  ok: boolean
}

function casPosture(
  nom: string,
  codif: CodificationOwas,
  attendu: CategorieAction,
): ResultatTest {
  const obtenu = categorieActionPosture(codif)
  return {
    nom,
    attendu: `AC${attendu}`,
    obtenu: `AC${obtenu}`,
    ok: obtenu === attendu,
  }
}

export function lancerAutotests(): ResultatTest[] {
  const tests: ResultatTest[] = []

  // 1. Intégrité de la table des 252 combinaisons
  try {
    const total = verifierIntegriteTable()
    tests.push({
      nom: 'Table des 252 combinaisons complète',
      attendu: '252 entrées valides',
      obtenu: `${total} entrées`,
      ok: total === 252,
    })
  } catch (e) {
    tests.push({
      nom: 'Table des 252 combinaisons complète',
      attendu: '252 entrées valides',
      obtenu: e instanceof Error ? e.message : 'erreur',
      ok: false,
    })
  }

  // 2. Postures de référence (Tabla 6)
  tests.push(casPosture('Posture neutre 1-1-1-1', { dos: 1, bras: 1, jambes: 1, charge: 1 }, 1))
  tests.push(casPosture('Dos penché 2-1-1-1', { dos: 2, bras: 1, jambes: 1, charge: 1 }, 2))
  tests.push(casPosture('Dos torsion + jambe fléchie 3-1-5-1', { dos: 3, bras: 1, jambes: 5, charge: 1 }, 4))
  tests.push(casPosture('Charge lourde seule 1-1-1-3', { dos: 1, bras: 1, jambes: 1, charge: 3 }, 1))
  tests.push(casPosture('Genoux fléchis 1-1-4-1', { dos: 1, bras: 1, jambes: 4, charge: 1 }, 2))
  tests.push(casPosture('Extrême 4-3-4-3', { dos: 4, bras: 3, jambes: 4, charge: 3 }, 4))
  // Exemples des supports OWAS partagés
  tests.push(casPosture('Ex. P5 « ajuste » 1-1-2-1', { dos: 1, bras: 1, jambes: 2, charge: 1 }, 1))
  tests.push(casPosture('Ex. P6 « colocar » 2-3-5-1', { dos: 2, bras: 3, jambes: 5, charge: 1 }, 4))

  // 3. Agrégation par fréquence (Tabla 7)
  // 10 postures dos droit (100%) → dos AC1
  const seanceDosDroit: CodificationOwas[] = Array.from({ length: 10 }, () => ({
    dos: 1, bras: 1, jambes: 2, charge: 1,
  }))
  const segDroit = categoriesSegments(seanceDosDroit)
  tests.push({
    nom: 'Séance 100% dos droit → dos AC1',
    attendu: 'AC1',
    obtenu: `AC${segDroit.dos}`,
    ok: segDroit.dos === 1,
  })

  // Dos « penché + torsion » présent à 50% → colonne ≤50% = AC3
  const seancePencheTorsion: CodificationOwas[] = [
    ...Array.from({ length: 5 }, () => ({ dos: 4, bras: 1, jambes: 2, charge: 1 } as CodificationOwas)),
    ...Array.from({ length: 5 }, () => ({ dos: 1, bras: 1, jambes: 2, charge: 1 } as CodificationOwas)),
  ]
  const segPT = categoriesSegments(seancePencheTorsion)
  tests.push({
    nom: 'Dos penché+torsion à 50% → dos AC3',
    attendu: 'AC3',
    obtenu: `AC${segPT.dos}`,
    ok: segPT.dos === 3,
  })
  tests.push({
    nom: 'Pire catégorie posturale de la séance ci-dessus',
    attendu: 'AC3',
    obtenu: `AC${pireCategoriePosture(seancePencheTorsion)}`,
    ok: pireCategoriePosture(seancePencheTorsion) === 3,
  })

  return tests
}
