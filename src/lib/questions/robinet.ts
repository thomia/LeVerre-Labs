/**
 * Questions de l'élément ROBINET - Charge de travail (version Sensibilisation).
 *
 * Élément NÉGATIF : score élevé = charge importante.
 *
 * Deux étapes côté participant :
 *   1. Il CLASSE les 5 aspects par importance → chaque rang donne un poids wᵢ
 *      (1er = 3, puis 2,5 / 2 / 1,5 / 1). Stockés dans `answers` (`robinet_w_*`).
 *   2. Il place un curseur 0-100 par aspect → ce sont les défaveurs xᵢ.
 *
 * Score_R = moyenne quadratique pondérée des curseurs avec ces poids
 * (voir scoring.ts). Sans classement, tous les aspects pèsent également.
 */

import type { ElementDefinition, Question, AnswersMap } from './types'
import { applyDirection, weightedQuadraticMean } from './scoring'

/**
 * Correspondance aspect → clé du poids stocké dans `answers`.
 * L'ordre définit aussi l'ordre d'affichage par défaut du classement.
 */
export const ROBINET_ASPECTS = [
  { questionId: 'robinet_charge', weightKey: 'robinet_w_charge', label: 'Charge physique' },
  { questionId: 'robinet_posture', weightKey: 'robinet_w_posture', label: 'Posture' },
  { questionId: 'robinet_frequence', weightKey: 'robinet_w_frequence', label: 'Fréquence et durée' },
  { questionId: 'robinet_charge_mentale', weightKey: 'robinet_w_cognitif', label: 'Charge mentale' },
  { questionId: 'robinet_rps', weightKey: 'robinet_w_rps', label: 'Risques psychosociaux' },
] as const

export const ROBINET_WEIGHT_KEYS = ROBINET_ASPECTS.map((a) => a.weightKey)

/**
 * Poids attribués selon le rang du classement (du plus au moins important).
 * `RANK_WEIGHTS[0]` = poids du 1er aspect classé, etc.
 */
export const RANK_WEIGHTS = [3, 2.5, 2, 1.5, 1] as const

/** Poids neutre utilisé tant que le participant n'a pas classé les aspects. */
export const DEFAULT_ASPECT_WEIGHT = 2

const questions: Question[] = [
  {
    id: 'robinet_charge',
    element: 'robinet',
    type: 'scale',
    question: 'Charge physique',
    subtitle: 'Poids manipulés, efforts, port de charges',
    description: '0 = aucune charge / 100 = charges très lourdes et fréquentes',
    minValue: 0,
    maxValue: 100,
    minLabel: 'Aucune',
    maxLabel: 'Très lourde',
  },
  {
    id: 'robinet_posture',
    element: 'robinet',
    type: 'scale',
    question: 'Posture',
    subtitle: 'Contraintes articulaires (dos, épaules, poignets…)',
    description: '0 = posture neutre et confortable / 100 = postures extrêmes maintenues',
    minValue: 0,
    maxValue: 100,
    minLabel: 'Confortable',
    maxLabel: 'Très contraignante',
  },
  {
    id: 'robinet_frequence',
    element: 'robinet',
    type: 'scale',
    question: 'Fréquence et durée',
    subtitle: 'Répétition des gestes, temps passé en contrainte',
    description: '0 = geste ponctuel / 100 = répété en continu une grande partie du temps',
    minValue: 0,
    maxValue: 100,
    minLabel: 'Ponctuel',
    maxLabel: 'Permanent',
  },
  {
    id: 'robinet_charge_mentale',
    element: 'robinet',
    type: 'scale',
    question: 'Charge mentale',
    subtitle: 'Concentration, attention, prise de décisions',
    description: '0 = tâche simple et routinière / 100 = très forte sollicitation cognitive',
    minValue: 0,
    maxValue: 100,
    minLabel: 'Faible',
    maxLabel: 'Très forte',
  },
  {
    id: 'robinet_rps',
    element: 'robinet',
    type: 'scale',
    question: 'Risques psychosociaux',
    subtitle: 'Pression, relations, reconnaissance, autonomie',
    description: '0 = environnement sain / 100 = tensions fortes, mal-être ressenti',
    minValue: 0,
    maxValue: 100,
    minLabel: 'Sain',
    maxLabel: 'Très dégradé',
  },
]

function readNumber(answers: AnswersMap, key: string): number | null {
  const raw = answers[key]
  return typeof raw === 'number' ? raw : null
}

function computeScore(answers: AnswersMap): number {
  const items = []

  for (const aspect of ROBINET_ASPECTS) {
    const value = readNumber(answers, aspect.questionId)
    if (value === null) continue
    const weight = readNumber(answers, aspect.weightKey) ?? DEFAULT_ASPECT_WEIGHT
    items.push({ value, weight })
  }

  return applyDirection(weightedQuadraticMean(items), 'negative')
}

export const robinetDefinition: ElementDefinition = {
  id: 'robinet',
  name: 'Robinet',
  emoji: '🚰',
  description: 'Charge de travail',
  questions,
  direction: 'negative',
  computeScore,
}
