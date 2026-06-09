/**
 * Questions de l'élément ORAGE - Aléas et perturbations.
 *
 * Formule : Score_O = MOYENNE(Fréquence_i × Impact_i) pour 2 imprévus
 * Score élevé = aléas impactants.
 *
 * Questions extraites de `src/components/analyse-video/analysis-modal.tsx`.
 */

import type { ElementDefinition, Question, AnswersMap } from './types'

const questions: Question[] = [
  {
    id: 'orage_imprevu1_frequence',
    element: 'orage',
    type: 'single',
    section: 'Imprévu 1',
    question: "Identifier l'imprévu le plus pénalisant : à quelle fréquence se produit-il ?",
    subtitle: 'Imprévu 1 - Fréquence',
    weight: 0,
    maxPoints: 1.0,
    options: [
      { label: 'Rare (1/mois)', points: 0.2 },
      { label: 'Occasionnel (1/semaine)', points: 0.5 },
      { label: 'Fréquent (2-3/semaine)', points: 0.8 },
      { label: 'Quotidien', points: 1.0 },
    ],
  },
  {
    id: 'orage_imprevu1_impact',
    element: 'orage',
    type: 'single',
    section: 'Imprévu 1',
    question: "Quel est l'impact de cet imprévu sur le déroulement du travail ?",
    subtitle: 'Imprévu 1 - Impact',
    weight: 0,
    maxPoints: 100,
    options: [
      { label: 'Mineur (perd 5-10 min)', points: 20 },
      { label: 'Modéré (perd 15-30 min)', points: 40 },
      { label: 'Important (perd > 30 min)', points: 70 },
      { label: 'Majeur (perd > 1h, stress intense)', points: 100 },
    ],
  },
  {
    id: 'orage_imprevu2_frequence',
    element: 'orage',
    type: 'single',
    section: 'Imprévu 2',
    question: 'Identifier un 2ème imprévu pénalisant : à quelle fréquence se produit-il ?',
    subtitle: 'Imprévu 2 - Fréquence',
    weight: 0,
    maxPoints: 1.0,
    options: [
      { label: 'Rare (1/mois)', points: 0.2 },
      { label: 'Occasionnel (1/semaine)', points: 0.5 },
      { label: 'Fréquent (2-3/semaine)', points: 0.8 },
      { label: 'Quotidien', points: 1.0 },
    ],
  },
  {
    id: 'orage_imprevu2_impact',
    element: 'orage',
    type: 'single',
    section: 'Imprévu 2',
    question: "Quel est l'impact de cet imprévu sur le déroulement du travail ?",
    subtitle: 'Imprévu 2 - Impact',
    weight: 0,
    maxPoints: 100,
    options: [
      { label: 'Mineur (perd 5-10 min)', points: 20 },
      { label: 'Modéré (perd 15-30 min)', points: 40 },
      { label: 'Important (perd > 30 min)', points: 70 },
      { label: 'Majeur (perd > 1h, stress intense)', points: 100 },
    ],
  },
]

function computeScore(answers: AnswersMap): number {
  const num = (id: string) => {
    const v = answers[id]
    return typeof v === 'number' ? v : 0
  }

  const imprevu1 = num('orage_imprevu1_frequence') * num('orage_imprevu1_impact')
  const imprevu2 = num('orage_imprevu2_frequence') * num('orage_imprevu2_impact')

  // Chaque score imprevu est entre 0 et 100 (freq max 1.0 × impact max 100)
  const score = (imprevu1 + imprevu2) / 2
  return Math.max(0, Math.min(100, Math.round(score)))
}

export const orageDefinition: ElementDefinition = {
  id: 'orage',
  name: 'Orage',
  emoji: '⛈️',
  description: 'Aléas et perturbations',
  questions,
  computeScore,
}
