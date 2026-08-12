/**
 * Questions de l'élément VERRE - Capacité de résistance individuelle.
 *
 * Élément POSITIF : score élevé = verre large (bonne résistance).
 * Chaque option porte une défaveur (0 = idéal, 100 = pire). Le score est la
 * moyenne quadratique pondérée des défaveurs, puis `100 - A` (voir scoring.ts).
 *
 * Questions au vouvoiement (on s'adresse directement à la personne).
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
    question: 'Avez-vous des antécédents médicaux liés au travail ?',
    weight: 3,
    options: [
      { label: 'Aucun trouble musculo-squelettique, chirurgie ou blessure significative', points: 0 },
      { label: 'Blessure guérie, sans douleur ni limitation', points: 40 },
      { label: 'Plusieurs épisodes ou douleurs récurrentes', points: 70 },
      { label: 'Douleur persistante, traitement en cours ou limitation fonctionnelle', points: 100 },
    ],
  },
  {
    id: 'verre_condition_physique',
    element: 'verre',
    type: 'single',
    question: 'Quelle est votre activité physique hebdomadaire ?',
    weight: 2,
    options: [
      { label: 'Plus de 2,5 h/semaine (renforcement + endurance)', points: 0 },
      { label: 'Plus de 1,5 h/semaine', points: 10 },
      { label: "Environ 1 h/semaine d'activité modérée", points: 40 },
      { label: 'Pas toutes les semaines', points: 70 },
      { label: 'Sédentaire, aucune activité', points: 100 },
    ],
  },
  {
    id: 'verre_nutrition',
    element: 'verre',
    type: 'single',
    question: 'Comment est votre alimentation ?',
    weight: 1,
    options: [
      { label: 'Au moins 5 portions de fruits/légumes, protéines, fibres et céréales complètes régulières', points: 0 },
      { label: '3 à 4 portions et protéines la plupart des jours', points: 20 },
      { label: 'Moins de 3 portions, protéines irrégulières et alimentation transformée fréquente', points: 50 },
      { label: 'Très peu de fruits/légumes, alimentation ultra-transformée majoritaire', points: 100 },
    ],
  },
  {
    id: 'verre_sommeil',
    element: 'verre',
    type: 'single',
    question: 'Comment est votre sommeil (dernier mois) ?',
    weight: 1,
    options: [
      { label: 'Je dors généralement bien, réveil reposé, sommeil qui ne perturbe pas mes journées', points: 0 },
      { label: 'Sommeil globalement satisfaisant, réveils parfois fatigués', points: 40 },
      { label: 'Sommeil régulièrement perturbé, fatigue occasionnelle en journée', points: 75 },
      { label: 'Sommeil fréquemment insuffisant, fatigue ou somnolence importante', points: 100 },
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
      { label: 'J\u2019ai arrêté depuis plusieurs mois', points: 40 },
      { label: 'Occasionnellement ou nicotine certains jours', points: 75 },
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
      { label: 'Consommation occasionnelle sans excès', points: 40 },
      { label: 'Plusieurs fois par semaine ou plusieurs verres en une occasion', points: 75 },
      { label: 'Fréquemment en grande quantité ou épisodes d\u2019alcoolisation', points: 100 },
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
