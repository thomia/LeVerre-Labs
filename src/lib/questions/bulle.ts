/**
 * Questions de l'élément BULLE - Environnement de travail.
 *
 * Élément NÉGATIF : score élevé = environnement dégradé (amplifie le Robinet).
 * Chaque option porte une défaveur (0 = idéal, 100 = pire). Le score est la
 * moyenne quadratique pondérée des défaveurs (voir scoring.ts).
 */

import type { ElementDefinition, Question, AnswersMap } from './types'
import { scoreFromAnsweredQuestions } from './scoring'

const questions: Question[] = [
  {
    id: 'bulle_temperature',
    element: 'bulle',
    type: 'single',
    question: 'Quelle est la température ambiante ?',
    weight: 2,
    options: [
      { label: 'Confortable 18-24°C', points: 0 },
      { label: 'Un peu frais/chaud 12-18°C ou 24-28°C', points: 20 },
      { label: 'Froid 5-12°C', points: 50 },
      { label: 'Très froid/chaud < 5°C ou > 28°C', points: 100 },
    ],
  },
  {
    id: 'bulle_eclairage',
    element: 'bulle',
    type: 'single',
    question: "L'éclairage est-il suffisant ?",
    weight: 1,
    options: [
      { label: 'Très bon > 500 lux', points: 0 },
      { label: 'Correct 300-500 lux', points: 15 },
      { label: 'Faible 100-300 lux', points: 45 },
      { label: 'Insuffisant < 100 lux', points: 100 },
    ],
  },
  {
    id: 'bulle_bruit',
    element: 'bulle',
    type: 'single',
    question: 'Quel est le niveau sonore ?',
    weight: 2,
    options: [
      { label: 'Calme < 70 dB(A)', points: 0 },
      { label: 'Bruyant 70-80 dB(A)', points: 35 },
      { label: 'Très bruyant 80-85 dB(A)', points: 60 },
      { label: 'Excessif > 85 dB(A)', points: 100 },
    ],
  },
  {
    id: 'bulle_vibrations',
    element: 'bulle',
    type: 'single',
    question: 'Outils vibrants ou conduite de véhicules ?',
    weight: 2,
    options: [
      { label: 'Non', points: 0 },
      { label: 'Occasionnel < 2h', points: 25 },
      { label: 'Régulier 2-4h', points: 50 },
      { label: 'Prolongé > 4h', points: 100 },
    ],
  },
  {
    id: 'bulle_horaires',
    element: 'bulle',
    type: 'single',
    question: 'Horaires décalés ou de nuit ?',
    weight: 2,
    options: [
      { label: 'Jour normal 8h-18h', points: 0 },
      { label: 'Décalés tôt/tard', points: 30 },
      { label: 'Nuit > 3h entre 21h-6h', points: 55 },
      { label: '3x8 ou tournants', points: 100 },
    ],
  },
  {
    id: 'bulle_espace',
    element: 'bulle',
    type: 'single',
    question: 'Assez de place pour travailler ?',
    weight: 1,
    options: [
      { label: 'Dégagé > 2 m²', points: 0 },
      { label: 'Correct 1-2 m²', points: 25 },
      { label: 'Encombré 0,5-1 m²', points: 60 },
      { label: 'Très exigu < 0,5 m²', points: 100 },
    ],
  },
  {
    id: 'bulle_salubrite',
    element: 'bulle',
    type: 'single',
    question: 'Environnement propre et sain ?',
    weight: 1,
    options: [
      { label: 'Propre et agréable', points: 0 },
      { label: 'Moyennement propre', points: 20 },
      { label: 'Sale, poussiéreux, odeurs', points: 50 },
      { label: 'Insalubre (déchets, sanitaires pollués)', points: 100 },
    ],
  },
  {
    id: 'bulle_isolement',
    element: 'bulle',
    type: 'single',
    question: 'Travaillez-vous seul ?',
    weight: 1,
    options: [
      { label: 'Toujours avec collègues < 50 m', points: 0 },
      { label: 'Seul, collègues proches < 50 m', points: 15 },
      { label: 'Seul, éloigné > 50 m', points: 45 },
      { label: 'Complètement isolé', points: 100 },
    ],
  },
  {
    id: 'bulle_materiel',
    element: 'bulle',
    type: 'single',
    question: 'Les bons outils/équipements sont-ils disponibles ?',
    weight: 1,
    options: [
      { label: 'Tout nécessaire, bon état', points: 0 },
      { label: 'Globalement oui, certains manquants/usés', points: 25 },
      { label: 'Utilise des bricolages inadaptés', points: 60 },
      { label: 'Matériel vétuste ou dangereux', points: 100 },
    ],
  },
  {
    id: 'bulle_epi',
    element: 'bulle',
    type: 'single',
    question: "Port d'EPI contraignants (combinaison, masque, gants épais…) ?",
    weight: 1,
    options: [
      { label: 'Aucun EPI ou EPI légers', points: 0 },
      { label: 'EPI modérés (casque + chaussures + gants moyens)', points: 20 },
      { label: 'EPI lourds (combinaison + masque + gants épais)', points: 50 },
      { label: 'EPI complets isolants / NRBC / ventilation forcée', points: 100 },
    ],
  },
]

function computeScore(answers: AnswersMap): number {
  return scoreFromAnsweredQuestions(questions, answers, 'negative')
}

export const bulleDefinition: ElementDefinition = {
  id: 'bulle',
  name: 'Bulle',
  emoji: '🫧',
  description: 'Environnement de travail',
  questions,
  direction: 'negative',
  computeScore,
}
