/**
 * Point d'entrée du moteur OWAS.
 *
 *   import { calculerScorePosture, getCategorieAction } from '@/lib/owas'
 */

export * from './types'
export * from './constantes'
export { getCategorieAction, verifierIntegriteTable } from './table-categories-action'
export {
  categorieFrequenceDos,
  categorieFrequenceBras,
  categorieFrequenceJambes,
} from './table-frequence'
export {
  codeOwas,
  categorieActionPosture,
  frequencesDos,
  frequencesBras,
  frequencesJambes,
  categoriesSegments,
  pireCategoriePosture,
  repartitionCategoriesPostures,
  repartitionCharge,
} from './analyse'
export type { CategoriesSegments, FrequencePosition } from './analyse'
export { lancerAutotests } from './auto-test'
export type { ResultatTest } from './auto-test'
