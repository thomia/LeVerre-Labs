/**
 * Types pour les questionnaires de la formation.
 *
 * On reprend le format utilisé dans le modal d'analyse existant
 * (`src/components/analyse-video/analysis-modal.tsx`), simplifié pour
 * le contexte multi-participants.
 */

import type { ElementId } from '@/lib/supabase/types'

export type QuestionType = 'single' | 'multiple' | 'scale'

export interface QuestionOption {
  label: string
  /** Points attribués si cette option est sélectionnée (invisibles pour l'utilisateur). */
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
  /** Pondération multiplicative appliquée aux points (1 = neutre). */
  weight: number
  /** Score maximum théorique de cette question (utilisé pour normaliser). */
  maxPoints: number
  minValue?: number
  maxValue?: number
  minLabel?: string
  maxLabel?: string
  options?: QuestionOption[]
}

/**
 * Valeur d'une réponse :
 *  - number pour type 'single' ou 'scale' (= points de l'option choisie / valeur curseur)
 *  - number[] pour type 'multiple' (= tableau des points cumulés)
 */
export type AnswerValue = number | number[]

export type AnswersMap = Record<string, AnswerValue>

/**
 * Définition complète d'un élément : questions + fonction de scoring.
 * Permet d'ajouter de nouveaux éléments sans toucher au composant questionnaire.
 */
export interface ElementDefinition {
  id: ElementId
  name: string
  emoji: string
  description: string
  questions: Question[]
  /**
   * Calcule le score final de l'élément (0-100) à partir des réponses.
   * Chaque élément a sa propre formule (voir analysis-modal.tsx).
   */
  computeScore: (answers: AnswersMap) => number
}
