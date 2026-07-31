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

/** Poids total réparti par la pondération (somme des poids par rang). */
export const ROBINET_PONDERATION_TOTAL = 100

/**
 * Pondération prédéfinie NON-LINÉAIRE par rang (du plus au moins important).
 * Le participant classe simplement les 5 aspects par glisser-déposer ; on
 * applique ensuite ces poids selon le rang — il n'a jamais à penser en
 * pourcentages. Somme = 100.
 */
export const ROBINET_RANK_WEIGHTS = [35, 25, 20, 12, 8] as const

/**
 * Curseurs reformulés « aperçu terrain » : le titre parle à la première
 * personne (ce que je vis dans la tâche) et le sous-titre rappelle le repère
 * ergonomique correspondant. `section` conserve le nom technique de l'aspect
 * (repris tel quel dans l'exercice de pondération).
 */
const questions: Question[] = [
  {
    id: 'robinet_charge',
    element: 'robinet',
    type: 'scale',
    section: 'Charge physique',
    question: 'Ce que je porte, pousse ou tire',
    subtitle:
      'Comme le ferait un ergonome en visite : poids réel, prise en main, nombre de fois dans la tâche.',
    description:
      '0 = rien à manipuler / 100 = charges lourdes, prise difficile, répétées',
    weight: 1,
    maxPoints: 100,
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
    question: 'Ce que mon corps doit tenir comme position',
    subtitle:
      'Dos penché, bras levés, position accroupie… les 3 points qu\u2019un ergonome regarde en premier sur le terrain.',
    description:
      '0 = position neutre / 100 = position extrême maintenue longtemps',
    weight: 1,
    maxPoints: 100,
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
    question: 'Le temps réel passé dans l\u2019effort',
    subtitle:
      'Pas le temps total de la tâche, mais le temps où le corps est vraiment sollicité — ce qu\u2019on chronomètre sur le terrain.',
    description: '0 = ponctuel / 100 = quasi continu',
    weight: 1,
    maxPoints: 100,
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
    question: 'Ce que ma tête doit gérer en même temps',
    subtitle:
      'Attention, décisions à prendre, risque d\u2019erreur — le type de charge que mesure le NASA-TLX utilisé en ergonomie.',
    description:
      '0 = automatique / 100 = jongler avec plusieurs choses en même temps',
    weight: 1,
    maxPoints: 100,
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
    question: 'L\u2019ambiance dans laquelle je fais cette tâche',
    subtitle:
      'Pression du temps, soutien de l\u2019équipe, marge de manœuvre — les facteurs psychosociaux qu\u2019identifie l\u2019INRS.',
    description: '0 = climat serein / 100 = tensions fortes, isolement',
    weight: 1,
    maxPoints: 100,
    minValue: 0,
    maxValue: 100,
    minLabel: 'Climat serein',
    maxLabel: 'Tensions, isolement',
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
