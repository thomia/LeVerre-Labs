/**
 * Questions de l'élément BULLE - Environnement de travail.
 *
 * Formule : Score_B = MOYENNE((points_i / maxPoints_i) × 100)
 * Score élevé = environnement dégradé (agression).
 *
 * Questions extraites de `src/components/analyse-video/analysis-modal.tsx`.
 */

import type { ElementDefinition, Question, AnswersMap } from './types'

const questions: Question[] = [
  {
    id: 'bulle_temperature',
    element: 'bulle',
    type: 'single',
    question: 'Température ambiante',
    weight: 1,
    maxPoints: 80,
    options: [
      { label: '18-24°C (confortable)', points: 0 },
      { label: '12-18°C ou 24-28°C', points: 20 },
      { label: '5-12°C (froid)', points: 50 },
      { label: '< 5°C ou > 28°C', points: 80 },
    ],
  },
  {
    id: 'bulle_eclairage',
    element: 'bulle',
    type: 'single',
    question: 'Éclairage',
    weight: 1,
    maxPoints: 75,
    options: [
      { label: '> 500 lux', points: 0 },
      { label: '300-500 lux', points: 15 },
      { label: '100-300 lux', points: 45 },
      { label: '< 100 lux', points: 75 },
    ],
  },
  {
    id: 'bulle_bruit',
    element: 'bulle',
    type: 'single',
    question: 'Bruit',
    weight: 1,
    maxPoints: 90,
    options: [
      { label: '< 70 dB(A)', points: 0 },
      { label: '70-80 dB(A)', points: 35 },
      { label: '80-85 dB', points: 50 },
      { label: '> 85 dB', points: 80 },
    ],
  },
  {
    id: 'bulle_espace',
    element: 'bulle',
    type: 'single',
    question: 'Espace de travail',
    weight: 1,
    maxPoints: 90,
    options: [
      { label: '> 2 m² (dégagé)', points: 0 },
      { label: '1-2 m² (correct)', points: 25 },
      { label: '0.5-1 m² (encombré)', points: 60 },
      { label: '< 0.5 m² (très exigu)', points: 90 },
    ],
  },
  {
    id: 'bulle_horaires',
    element: 'bulle',
    type: 'single',
    question: 'Horaires de travail',
    weight: 1,
    maxPoints: 75,
    options: [
      { label: 'Jour normal 8h-18h', points: 0 },
      { label: 'Décalés tôt/tard', points: 30 },
      { label: 'Nuit ≥ 3h entre 21h-6h', points: 55 },
      { label: '3×8 ou tournants', points: 75 },
    ],
  },
  {
    id: 'bulle_salubrite',
    element: 'bulle',
    type: 'single',
    question: 'Salubrité',
    weight: 1,
    maxPoints: 85,
    options: [
      { label: 'Propre et agréable', points: 0 },
      { label: 'Moyennement propre', points: 20 },
      { label: 'Sale, poussiéreux, odeurs', points: 50 },
      { label: 'Insalubre', points: 85 },
    ],
  },
  {
    id: 'bulle_isolement',
    element: 'bulle',
    type: 'single',
    question: 'Isolement du travailleur',
    weight: 1,
    maxPoints: 75,
    options: [
      { label: 'Toujours avec collègues < 50 m', points: 0 },
      { label: 'Seul, collègues proches < 50 m', points: 15 },
      { label: 'Seul, éloigné > 50 m', points: 45 },
      { label: 'Complètement isolé', points: 75 },
    ],
  },
  {
    id: 'bulle_materiel',
    element: 'bulle',
    type: 'single',
    question: 'Matériel à disposition',
    weight: 1,
    maxPoints: 90,
    options: [
      { label: 'Tout nécessaire, bon état', points: 0 },
      { label: 'Certains manquants ou usés', points: 25 },
      { label: 'Expositions chimiques fréquentes', points: 50 },
      { label: 'Expositions à risque sans protection', points: 80 },
    ],
  },
  {
    id: 'bulle_epi',
    element: 'bulle',
    type: 'single',
    question: "Port d'EPI contraignants",
    weight: 1,
    maxPoints: 80,
    options: [
      { label: 'Aucun EPI ou EPI légers', points: 0 },
      { label: 'EPI modérés', points: 20 },
      { label: 'EPI lourds', points: 50 },
      { label: 'EPI complets isolants / NRBC', points: 80 },
    ],
  },
]

function computeScore(answers: AnswersMap): number {
  let sum = 0
  let count = 0

  for (const q of questions) {
    const raw = answers[q.id]
    if (raw === undefined) continue
    const value = typeof raw === 'number' ? raw : 0
    // Normalisation sur 100 pour cette question
    sum += (value / q.maxPoints) * 100
    count++
  }

  if (count === 0) return 0
  return Math.max(0, Math.min(100, Math.round(sum / count)))
}

export const bulleDefinition: ElementDefinition = {
  id: 'bulle',
  name: 'Bulle',
  emoji: '🫧',
  description: 'Environnement de travail',
  questions,
  computeScore,
}
