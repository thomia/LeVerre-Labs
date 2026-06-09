/**
 * Questions de l'élément ROBINET - Charge de travail (version Sensibilisation).
 *
 * Version simplifiée : 4 curseurs 0-100 sur les grandes familles de contraintes.
 * Le détail fin (poids NIOSH, postures par zone, NASA-TLX, RPS Karasek…) reste
 * réservé au mode expert (cf. analyse-video/analysis-modal.tsx).
 *
 * Formule : Score_R = MOYENNE(charge, posture, charge_mentale, rps)
 */

import type { ElementDefinition, Question, AnswersMap } from './types'

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

function computeScore(answers: AnswersMap): number {
  let sum = 0
  let count = 0

  for (const q of questions) {
    const raw = answers[q.id]
    if (raw === undefined) continue
    const value = typeof raw === 'number' ? raw : 0
    sum += value
    count++
  }

  if (count === 0) return 0
  return Math.max(0, Math.min(100, Math.round(sum / count)))
}

export const robinetDefinition: ElementDefinition = {
  id: 'robinet',
  name: 'Robinet',
  emoji: '🚰',
  description: 'Charge de travail',
  questions,
  computeScore,
}
