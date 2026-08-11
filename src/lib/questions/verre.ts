/**
 * Questions de l'élément VERRE - Capacité de résistance individuelle.
 *
 * Élément POSITIF : score élevé = verre large (bonne résistance).
 * Chaque option porte une défaveur (0 = idéal, 100 = pire). Le score est la
 * moyenne quadratique pondérée des défaveurs, puis `100 - A` (voir scoring.ts).
 */

import type { ElementDefinition, Question, AnswersMap } from './types'
import { scoreFromAnsweredQuestions } from './scoring'

const questions: Question[] = [
  {
    id: 'verre_age',
    element: 'verre',
    type: 'single',
    question: "Âge de l'opérateur",
    subtitle: 'Facteur de fragilité tissulaire',
    weight: 2,
    options: [
      { label: '< 30 ans', points: 0 },
      { label: '30 à 49 ans', points: 40 },
      { label: '50 à 64 ans', points: 60 },
      { label: '> 65 ans', points: 100 },
    ],
  },
  {
    id: 'verre_antecedents',
    element: 'verre',
    type: 'single',
    question: 'Antécédents médicaux liés au travail',
    subtitle: 'Risque de récidive',
    weight: 3,
    options: [
      { label: 'Aucun TMS / chirurgie / blessure significative', points: 0 },
      { label: 'Blessure guérie, sans douleur ni limitation', points: 40 },
      { label: 'Plusieurs épisodes ou douleurs récurrentes', points: 70 },
      { label: 'Douleur persistante, traitement en cours ou limitation fonctionnelle', points: 100 },
    ],
  },
  {
    id: 'verre_condition_physique',
    element: 'verre',
    type: 'single',
    question: 'Condition physique',
    subtitle: 'Facteur protecteur musculo-squelettique',
    weight: 2,
    options: [
      { label: '> 2,5 h/semaine (renforcement + endurance)', points: 0 },
      { label: '> 1,5 h/semaine (renforcement/endurance)', points: 10 },
      { label: '≈ 1 h/semaine d\u2019activité modérée', points: 40 },
      { label: 'Pas toutes les semaines', points: 70 },
      { label: 'Sédentaire, aucune activité', points: 100 },
    ],
  },
  {
    id: 'verre_nutrition',
    element: 'verre',
    type: 'single',
    question: 'Nutrition',
    subtitle: 'Qualité de l\u2019alimentation',
    weight: 1,
    options: [
      { label: '≥ 5 portions fruits/légumes + protéines + fibres + céréales complètes régulières', points: 0 },
      { label: '3-4 portions + protéines la plupart des jours', points: 20 },
      { label: '< 3 portions + protéines irrégulières + alimentation transformée fréquente', points: 50 },
      { label: 'Très peu de fruits/légumes + alimentation ultra-transformée majoritaire', points: 100 },
    ],
  },
  {
    id: 'verre_sommeil',
    element: 'verre',
    type: 'single',
    question: 'Sommeil (dernier mois)',
    weight: 1,
    options: [
      { label: 'Je dors généralement bien, réveil reposé, sommeil ne perturbe pas mes journées', points: 0 },
      { label: 'Sommeil globalement satisfaisant, réveils parfois fatigués', points: 40 },
      { label: 'Sommeil régulièrement perturbé, fatigue occasionnelle en journée', points: 75 },
      { label: 'Sommeil fréquemment insuffisant, fatigue/somnolence importante', points: 100 },
    ],
  },
  {
    id: 'verre_tabagisme',
    element: 'verre',
    type: 'single',
    question: 'Tabagisme',
    weight: 1,
    options: [
      { label: 'Ne fume pas, pas de nicotine', points: 0 },
      { label: 'A arrêté depuis plusieurs mois', points: 40 },
      { label: 'Fume occasionnellement ou nicotine certains jours', points: 75 },
      { label: 'Fume ou consomme quotidiennement', points: 100 },
    ],
  },
  {
    id: 'verre_alcool',
    element: 'verre',
    type: 'single',
    question: 'Alcool',
    weight: 1,
    options: [
      { label: 'Ne boit pas ou exceptionnellement', points: 0 },
      { label: 'Consommation occasionnelle sans excès', points: 40 },
      { label: 'Plusieurs fois/semaine ou plusieurs verres en une occasion', points: 75 },
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
