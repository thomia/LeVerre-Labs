/**
 * Types pour les questionnaires de la formation.
 *
 * Chaque option porte une « défaveur » (0 = réponse idéale, 100 = pire
 * réponse) et chaque question un poids d'importance. Le score d'un élément est
 * calculé par le moteur unifié `scoring.ts` (moyenne quadratique pondérée).
 */

import type { ElementId } from '@/lib/supabase/types'
import type { ElementDirection } from './scoring'

export type QuestionType = 'single' | 'multiple' | 'scale'

export interface QuestionOption {
  label: string
  /**
   * Défaveur de l'option (0 = idéale, 100 = pire). Cas particulier de l'Orage :
   * la fréquence est un multiplicateur 0-1. Valeur invisible pour l'utilisateur.
   */
  points: number
  description?: string
}

export interface Question {
  id: string
  element: ElementId
  type: QuestionType
  section?: string
  question: string
  subtitle?: string
  description?: string
  /** Poids d'importance de la question (wᵢ). 1 par défaut si non précisé. */
  weight?: number
  minValue?: number
  maxValue?: number
  minLabel?: string
  maxLabel?: string
  options?: QuestionOption[]
}

/**
 * Valeur d'une réponse :
 *  - number pour type 'single' ou 'scale' (= points de l'option / valeur curseur)
 *  - number[] pour type 'multiple' (= tableau des points cumulés)
 */
export type AnswerValue = number | number[]

export type AnswersMap = Record<string, AnswerValue>

/**
 * Définition complète d'un élément : questions + sens + fonction de scoring.
 * Toutes les définitions s'appuient sur le moteur unifié `scoring.ts`.
 */
export interface ElementDefinition {
  id: ElementId
  name: string
  emoji: string
  description: string
  questions: Question[]
  /** Sens d'interprétation du score final (voir `scoring.ts`). */
  direction: ElementDirection
  /**
   * Calcule le score final de l'élément (0-100) à partir des réponses.
   * Repose sur la moyenne quadratique pondérée (voir `scoring.ts`).
   */
  computeScore: (answers: AnswersMap) => number
}
