/**
 * Moteur de calcul des scores — méthodologie unifiée LeVerre Labs.
 *
 * Le score d'un élément (0-100) est une MOYENNE QUADRATIQUE PONDÉRÉE des
 * « défaveurs » xᵢ de ses réponses (0 = idéal, 100 = pire), avec un poids wᵢ
 * par question :
 *
 *     A = √( Σ wᵢ·xᵢ² / Σ wᵢ )
 *
 * L'exposant 2 (moyenne quadratique) fait ressortir les facteurs les plus
 * défavorables au lieu de les noyer dans une moyenne simple.
 *
 * Le calcul est identique pour les 5 éléments ; seule l'INTERPRÉTATION finale
 * diffère :
 *   - négatif (Robinet, Bulle, Orage) : score = A         (haut = défavorable)
 *   - positif (Verre, Paille)         : score = 100 - A    (haut = favorable)
 */

import type { AnswersMap } from './types'

/** Exposant de la moyenne de puissance. 2 → moyenne quadratique. */
export const SCORING_EXPONENT = 2

/**
 * Sens d'un élément :
 *   - 'negative' : un score élevé traduit une situation défavorable.
 *   - 'positive' : un score élevé traduit une situation favorable.
 */
export type ElementDirection = 'negative' | 'positive'

export interface WeightedValue {
  /** Défaveur de la réponse (0 = idéal, 100 = pire). */
  value: number
  /** Poids de la question (importance relative). */
  weight: number
}

/**
 * Moyenne quadratique pondérée : A = √(Σ wᵢ·xᵢ² / Σ wᵢ).
 * Retourne 0 quand aucun poids n'est pris en compte (aucune réponse).
 */
export function weightedQuadraticMean(items: WeightedValue[]): number {
  let weightedSquares = 0
  let weightTotal = 0

  for (const { value, weight } of items) {
    if (weight <= 0) continue
    weightedSquares += weight * value ** SCORING_EXPONENT
    weightTotal += weight
  }

  if (weightTotal === 0) return 0
  return (weightedSquares / weightTotal) ** (1 / SCORING_EXPONENT)
}

/** Borne une valeur dans [0, 100] et arrondit à l'entier. */
export function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)))
}

/**
 * Applique le sens de l'élément à un niveau de défaveur A (0-100) puis borne
 * le résultat. Positif → 100 - A ; négatif → A.
 */
export function applyDirection(a: number, direction: ElementDirection): number {
  return clampScore(direction === 'positive' ? 100 - a : a)
}

/**
 * Score générique pour un élément dont chaque question à choix contribue une
 * seule défaveur (Verre, Bulle, Paille). Seules les questions répondues sont
 * prises en compte, ce qui permet un score progressif au fil des réponses.
 */
export function scoreFromAnsweredQuestions(
  questions: { id: string; weight?: number }[],
  answers: AnswersMap,
  direction: ElementDirection
): number {
  const items: WeightedValue[] = []

  for (const question of questions) {
    const raw = answers[question.id]
    if (typeof raw !== 'number') continue
    items.push({ value: raw, weight: question.weight ?? 1 })
  }

  return applyDirection(weightedQuadraticMean(items), direction)
}
