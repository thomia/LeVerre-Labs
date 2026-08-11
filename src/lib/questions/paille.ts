/**
 * Questions de l'élément PAILLE - Stratégies de récupération.
 *
 * Élément POSITIF : score élevé = bonne récupération (le verre se vide vite).
 * Chaque option porte une défaveur (0 = idéal, 100 = pire). Le score est la
 * moyenne quadratique pondérée des défaveurs, puis `100 - A` (voir scoring.ts).
 */

import type { ElementDefinition, Question, AnswersMap } from './types'
import { scoreFromAnsweredQuestions } from './scoring'

const questions: Question[] = [
  {
    id: 'paille_pauses',
    element: 'paille',
    type: 'single',
    question: "L'opérateur peut-il faire des pauses quand il en a besoin ?",
    weight: 2,
    options: [
      { label: 'Peut interrompre l\u2019activité, micro-pauses régulières (jusqu\u2019à 1 min/10 min)', points: 0 },
      { label: 'Pauses prévues généralement respectées', points: 10 },
      { label: 'Uniquement pauses réglementaires (20 min après 6h)', points: 80 },
      { label: 'Pauses régulièrement retardées ou écourtées', points: 100 },
    ],
  },
  {
    id: 'paille_mobilite',
    element: 'paille',
    type: 'single',
    question: "L'opérateur peut-il bouger et changer de position ?",
    weight: 2,
    options: [
      { label: 'Variation réelle de posture/groupe musculaire dans la tâche', points: 0 },
      { label: 'Quelques possibilités limitées', points: 50 },
      { label: 'Aucune variation, geste unique répété', points: 100 },
    ],
  },
  {
    id: 'paille_renforcement',
    element: 'paille',
    type: 'single',
    question: "Réalise-t-il des exercices de renforcement/mobilisation entre les périodes d'activité ?",
    weight: 3,
    options: [
      { label: 'Renforcement ciblé au moins 3x/semaine, régulier depuis des mois', points: 0 },
      { label: 'Renforcement musculaire régulier mais non adapté au travail', points: 60 },
      { label: 'Exercices très rares, seulement si douleur ou prescrits par un pro de santé', points: 90 },
      { label: 'Impossible (pas d\u2019espace, de temps, d\u2019envie)', points: 100 },
    ],
  },
  {
    id: 'paille_hydratation',
    element: 'paille',
    type: 'single',
    question: "L'opérateur peut-il boire de l'eau facilement ?",
    weight: 1,
    options: [
      { label: 'Boit régulièrement, augmente les apports si besoin (≈ 2-2,5 L/j ou plus)', points: 0 },
      { label: 'Boit entre 1,5 et 2,5 L', points: 50 },
      { label: 'Boit moins de 1,5 L sur le poste', points: 100 },
    ],
  },
  {
    id: 'paille_sommeil',
    element: 'paille',
    type: 'single',
    question: 'Le sommeil permet-il de récupérer avant la journée suivante ?',
    weight: 2,
    options: [
      { label: 'Réveil généralement reposé, 7-9h de sommeil', points: 0 },
      { label: 'Récupère bien mais nuits parfois plus courtes', points: 30 },
      { label: 'Fatigue persistante régulière ou nuits souvent trop courtes', points: 60 },
      { label: 'Reprend l\u2019activité encore fatigué, nuits très courtes', points: 100 },
    ],
  },
]

function computeScore(answers: AnswersMap): number {
  return scoreFromAnsweredQuestions(questions, answers, 'positive')
}

export const pailleDefinition: ElementDefinition = {
  id: 'paille',
  name: 'Paille',
  emoji: '🥤',
  description: 'Stratégies de récupération',
  questions,
  direction: 'positive',
  computeScore,
}
