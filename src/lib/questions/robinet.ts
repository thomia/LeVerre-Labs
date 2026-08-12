/**
 * Questions de l'élément ROBINET - Charge de travail (version Sensibilisation).
 *
 * Élément NÉGATIF : score élevé = charge importante.
 *
 * Deux étapes côté participant :
 *   1. Il CLASSE les 5 aspects par importance (glisser-déposer) → chaque rang
 *      donne un poids wᵢ (`ROBINET_RANK_WEIGHTS`). Stockés dans `answers`
 *      (`robinet_w_*`). Le participant ne voit jamais les poids.
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
 * `ROBINET_RANK_WEIGHTS[0]` = poids du 1er aspect classé (le plus important),
 * etc. Seuls les rapports comptent (la moyenne quadratique renormalise par la
 * somme des poids).
 */
export const ROBINET_RANK_WEIGHTS = [3, 2.5, 2, 1.5, 1] as const

/** Poids neutre utilisé tant que le participant n'a pas classé les aspects. */
export const DEFAULT_ASPECT_WEIGHT = 2

/**
 * Curseurs reformulés « aperçu terrain » : le titre parle à la première
 * personne (ce que je vis dans la tâche) et le sous-titre rappelle le repère
 * ergonomique correspondant. `section` conserve le nom technique de l'aspect
 * (repris tel quel dans l'exercice de classement).
 */
const questions: Question[] = [
  {
    id: 'robinet_charge',
    element: 'robinet',
    type: 'scale',
    section: 'Charge physique',
    question: 'Ce que vous portez, poussez ou tirez',
    subtitle:
      'Comme le ferait un ergonome en visite : poids réel, prise en main, nombre de fois dans la tâche.',
    description: '0 = rien à manipuler / 100 = charges lourdes, prise difficile, répétées',
    minValue: 0,
    maxValue: 100,
    minLabel: 'Rien à manipuler',
    maxLabel: 'Lourd et répété',
  },
  {
    id: 'robinet_posture',
    element: 'robinet',
    type: 'scale',
    section: 'Posture',
    question: 'Ce que votre corps doit tenir comme position',
    subtitle:
      'Dos penché, bras levés, position accroupie… les 3 points qu\u2019un ergonome regarde en premier sur le terrain.',
    description: '0 = position neutre / 100 = position extrême maintenue longtemps',
    minValue: 0,
    maxValue: 100,
    minLabel: 'Position neutre',
    maxLabel: 'Position extrême',
  },
  {
    id: 'robinet_frequence',
    element: 'robinet',
    type: 'scale',
    section: 'Fréquence et durée',
    question: 'Le temps réel que vous passez dans l\u2019effort',
    subtitle:
      'Pas le temps total de la tâche, mais le temps où le corps est vraiment sollicité — ce qu\u2019on chronomètre sur le terrain.',
    description: '0 = ponctuel / 100 = quasi continu',
    minValue: 0,
    maxValue: 100,
    minLabel: 'Ponctuel',
    maxLabel: 'Quasi continu',
  },
  {
    id: 'robinet_charge_mentale',
    element: 'robinet',
    type: 'scale',
    section: 'Charge mentale',
    question: 'Ce que votre tête doit gérer en même temps',
    subtitle:
      'Attention, décisions à prendre, risque d\u2019erreur — le type de charge que mesure le NASA-TLX utilisé en ergonomie.',
    description: '0 = automatique / 100 = jongler avec plusieurs choses en même temps',
    minValue: 0,
    maxValue: 100,
    minLabel: 'Automatique',
    maxLabel: 'Jongler en permanence',
  },
  {
    id: 'robinet_rps',
    element: 'robinet',
    type: 'scale',
    section: 'Risques psychosociaux',
    question: 'L\u2019ambiance dans laquelle vous faites cette tâche',
    subtitle:
      'Pression du temps, soutien de l\u2019équipe, marge de manœuvre — les facteurs psychosociaux qu\u2019identifie l\u2019INRS.',
    description: '0 = climat serein / 100 = tensions fortes, isolement',
    minValue: 0,
    maxValue: 100,
    minLabel: 'Climat serein',
    maxLabel: 'Tensions, isolement',
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
