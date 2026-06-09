/**
 * Questions de l'élément VERRE - Capacité d'absorption (profil personnel).
 *
 * Formule : Score_V = clamp(100 - Σ(Contributions × Poids), 0, 100)
 * Plus le score est élevé, plus le verre est large (meilleure résistance).
 *
 * Questions extraites de `src/components/analyse-video/analysis-modal.tsx`.
 */

import type { ElementDefinition, Question, AnswersMap } from './types'

const questions: Question[] = [
  {
    id: 'verre_age',
    element: 'verre',
    type: 'single',
    question: 'Quel est votre âge ?',
    subtitle: 'Facteur de fragilité tissulaire',
    weight: 1,
    maxPoints: 25,
    options: [
      { label: '< 30 ans', points: 0 },
      { label: '30 à 45 ans', points: 8 },
      { label: '45 à 55 ans', points: 16 },
      { label: '> 55 ans', points: 25 },
    ],
  },
  {
    id: 'verre_historique_tms',
    element: 'verre',
    type: 'single',
    question: 'Avez-vous des antécédents de troubles musculo-squelettiques (TMS) ?',
    subtitle: 'Risque de récidive',
    weight: 1,
    maxPoints: 40,
    options: [
      { label: 'Non, jamais', points: 0 },
      { label: 'Oui, guéris depuis > 2 ans', points: 12 },
      { label: 'Oui, récemment ou récurrents', points: 25 },
      { label: 'Oui, douleurs actuelles', points: 40 },
    ],
  },
  {
    id: 'verre_activite_physique',
    element: 'verre',
    type: 'single',
    question: "Combien d'heures d'activité physique hebdomadaire (sport, marche) ?",
    subtitle: 'Facteur protecteur musculo-squelettique',
    weight: 1,
    maxPoints: 25,
    options: [
      { label: '≥ 2h/semaine', points: 0 },
      { label: '~1h/semaine', points: 8 },
      { label: '1-2 fois/mois', points: 18 },
      { label: 'Sédentaire', points: 25 },
    ],
  },
  {
    id: 'verre_lifestyle',
    element: 'verre',
    type: 'single',
    question: 'Dormez-vous bien et mangez-vous équilibré ?',
    subtitle: 'Sommeil 7-8h + alimentation équilibrée',
    weight: 1,
    maxPoints: 10,
    options: [
      { label: 'Bien sur les deux critères', points: 0 },
      { label: 'Correct (un critère dégradé)', points: 3 },
      { label: 'Difficile (un critère compromis)', points: 7 },
      { label: 'Problématique (les deux compromis)', points: 10 },
    ],
  },
  {
    id: 'verre_sexe',
    element: 'verre',
    type: 'single',
    question: 'Quel est votre sexe biologique ?',
    subtitle: 'Référence NF X35-109',
    weight: 1,
    maxPoints: 8,
    options: [
      { label: 'Homme', points: 0 },
      { label: 'Femme', points: 8 },
    ],
  },
]

function computeScore(answers: AnswersMap): number {
  let contribution = 0

  for (const q of questions) {
    const raw = answers[q.id]
    if (raw === undefined) continue
    const value = typeof raw === 'number' ? raw : 0
    contribution += value * q.weight
  }

  // Score de base : 100 moins la somme des pénalités
  const score = 100 - contribution
  return Math.max(0, Math.min(100, Math.round(score)))
}

export const verreDefinition: ElementDefinition = {
  id: 'verre',
  name: 'Verre',
  emoji: '🥃',
  description: "Capacité d'absorption (profil personnel)",
  questions,
  computeScore,
}
