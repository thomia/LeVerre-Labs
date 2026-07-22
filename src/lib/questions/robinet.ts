/**
 * Questions de l'élément ROBINET - Charge de travail (version Sensibilisation).
 *
 * 5 curseurs 0-100 sur les grandes familles de contraintes, précédés d'un
 * exercice de pondération (répartir 100 points entre les 5 aspects).
 *
 * Formule : Score_R = MOYENNE PONDÉRÉE des 5 aspects, avec les poids saisis
 * lors de la pondération (clés `robinet_w_*` dans `answers`). Sans pondération,
 * les 5 aspects pèsent également (20 points chacun).
 */

import type { ElementDefinition, Question, AnswersMap } from './types'

/**
 * Correspondance aspect → clé du poids stocké dans `answers`.
 * L'ordre définit aussi l'ordre d'affichage de la pondération.
 */
export const ROBINET_ASPECTS = [
  { questionId: 'robinet_charge', weightKey: 'robinet_w_charge', label: 'Charge physique' },
  { questionId: 'robinet_posture', weightKey: 'robinet_w_posture', label: 'Posture' },
  { questionId: 'robinet_frequence', weightKey: 'robinet_w_frequence', label: 'Fréquence et durée' },
  { questionId: 'robinet_charge_mentale', weightKey: 'robinet_w_cognitif', label: 'Charge mentale' },
  { questionId: 'robinet_rps', weightKey: 'robinet_w_rps', label: 'Risques psychosociaux' },
] as const

export const ROBINET_WEIGHT_KEYS = ROBINET_ASPECTS.map((a) => a.weightKey)

/** Poids total à répartir lors de la pondération. */
export const ROBINET_PONDERATION_TOTAL = 100

const questions: Question[] = [
  {
    id: 'robinet_charge',
    element: 'robinet',
    type: 'scale',
    question: 'Charge physique',
    subtitle: 'Poids manipulés, efforts, port de charges',
    description:
      '0 = aucune charge / 100 = charges très lourdes et fréquentes',
    weight: 1,
    maxPoints: 100,
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
    description:
      '0 = posture neutre et confortable / 100 = postures extrêmes maintenues',
    weight: 1,
    maxPoints: 100,
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
    description:
      '0 = geste ponctuel / 100 = répété en continu une grande partie du temps',
    weight: 1,
    maxPoints: 100,
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
    description:
      '0 = tâche simple et routinière / 100 = très forte sollicitation cognitive',
    weight: 1,
    maxPoints: 100,
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
    description:
      '0 = environnement sain / 100 = tensions fortes, mal-être ressenti',
    weight: 1,
    maxPoints: 100,
    minValue: 0,
    maxValue: 100,
    minLabel: 'Sain',
    maxLabel: 'Très dégradé',
  },
]

function readWeight(answers: AnswersMap, key: string): number | null {
  const raw = answers[key]
  return typeof raw === 'number' ? raw : null
}

function computeScore(answers: AnswersMap): number {
  let weightedSum = 0
  let weightTotal = 0

  for (const aspect of ROBINET_ASPECTS) {
    const raw = answers[aspect.questionId]
    if (raw === undefined) continue
    const value = typeof raw === 'number' ? raw : 0
    // Poids saisi lors de la pondération, sinon poids égal par défaut.
    const weight = readWeight(answers, aspect.weightKey) ?? ROBINET_PONDERATION_TOTAL / ROBINET_ASPECTS.length
    weightedSum += value * weight
    weightTotal += weight
  }

  if (weightTotal === 0) return 0
  return Math.max(0, Math.min(100, Math.round(weightedSum / weightTotal)))
}

export const robinetDefinition: ElementDefinition = {
  id: 'robinet',
  name: 'Robinet',
  emoji: '🚰',
  description: 'Charge de travail',
  questions,
  computeScore,
}
