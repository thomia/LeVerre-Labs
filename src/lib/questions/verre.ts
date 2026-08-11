/**
 * Questions de l'élément VERRE - Capacité de résistance individuelle.
 *
 * Élément POSITIF : score élevé = verre large (bonne résistance).
 * Chaque option porte une défaveur (0 = idéal, 100 = pire). Le score est la
 * moyenne quadratique pondérée des défaveurs, puis `100 - A` (voir scoring.ts).
 *
 * Questions à la 2e personne (vouvoiement), formulées courtes : c'est la
 * première interaction du participant avec l'outil.
 */

import type { ElementDefinition, Question, AnswersMap } from './types'
import { scoreFromAnsweredQuestions } from './scoring'

const questions: Question[] = [
  {
    id: 'verre_age',
    element: 'verre',
    type: 'single',
    question: 'Quel est votre âge ?',
    weight: 2,
    options: [
      { label: 'Moins de 30 ans', points: 0 },
      { label: '30 à 49 ans', points: 40 },
      { label: '50 à 64 ans', points: 60 },
      { label: 'Plus de 65 ans', points: 100 },
    ],
  },
  {
    id: 'verre_antecedents',
    element: 'verre',
    type: 'single',
    question: 'Avez-vous des antécédents (TMS, blessures) ?',
    weight: 3,
    options: [
      { label: 'Aucun', points: 0 },
      { label: 'Une blessure guérie, sans gêne', points: 40 },
      { label: 'Des épisodes ou douleurs récurrentes', points: 70 },
      { label: 'Une douleur actuelle ou un traitement en cours', points: 100 },
    ],
  },
  {
    id: 'verre_condition_physique',
    element: 'verre',
    type: 'single',
    question: 'Faites-vous de l\u2019activité physique ?',
    weight: 2,
    options: [
      { label: 'Plus de 2h30 par semaine', points: 0 },
      { label: 'Plus de 1h30 par semaine', points: 10 },
      { label: 'Environ 1h par semaine', points: 40 },
      { label: 'Pas toutes les semaines', points: 70 },
      { label: 'Jamais, je suis sédentaire', points: 100 },
    ],
  },
  {
    id: 'verre_nutrition',
    element: 'verre',
    type: 'single',
    question: 'Comment mangez-vous ?',
    weight: 1,
    options: [
      { label: 'Équilibré : fruits, légumes, protéines', points: 0 },
      { label: 'Plutôt correct la plupart des jours', points: 20 },
      { label: 'Déséquilibré, souvent des plats transformés', points: 50 },
      { label: 'Très transformé, peu de fruits et légumes', points: 100 },
    ],
  },
  {
    id: 'verre_sommeil',
    element: 'verre',
    type: 'single',
    question: 'Comment dormez-vous ?',
    weight: 1,
    options: [
      { label: 'Bien, je me réveille reposé(e)', points: 0 },
      { label: 'Correct, réveils parfois fatigués', points: 40 },
      { label: 'Souvent perturbé, fatigue en journée', points: 75 },
      { label: 'Insuffisant, fatigue importante', points: 100 },
    ],
  },
  {
    id: 'verre_tabagisme',
    element: 'verre',
    type: 'single',
    question: 'Fumez-vous ?',
    weight: 1,
    options: [
      { label: 'Non, pas de nicotine', points: 0 },
      { label: 'Arrêté depuis plusieurs mois', points: 40 },
      { label: 'Occasionnellement', points: 75 },
      { label: 'Tous les jours', points: 100 },
    ],
  },
  {
    id: 'verre_alcool',
    element: 'verre',
    type: 'single',
    question: 'Buvez-vous de l\u2019alcool ?',
    weight: 1,
    options: [
      { label: 'Jamais ou exceptionnellement', points: 0 },
      { label: 'Occasionnellement, sans excès', points: 40 },
      { label: 'Plusieurs fois par semaine', points: 75 },
      { label: 'Souvent et en quantité', points: 100 },
    ],
  },
]

function computeScore(answers: AnswersMap): number {
  return scoreFromAnsweredQuestions(questions, answers, 'positive')
}

export const verreDefinition: ElementDefinition = {
  id: 'verre',
  name: 'Verre',
  emoji: '🥃',
  description: 'Capacité de résistance individuelle',
  questions,
  direction: 'positive',
  computeScore,
}
