/**
 * Questions de l'élément ORAGE - Aléas et perturbations.
 *
 * Formule : Score_O = MOYENNE(Fréquence_i × Impact_i) pour 2 imprévus
 * Score élevé = aléas impactants.
 *
 * Questions extraites de `src/components/analyse-video/analysis-modal.tsx`.
 */

import type { ElementDefinition, Question, AnswersMap } from './types'

const FREQUENCE_OPTIONS = [
  { label: 'Rare (1/mois)', points: 0.2 },
  { label: 'Occasionnel (1/semaine)', points: 0.5 },
  { label: 'Fréquent (2-3/semaine)', points: 0.8 },
  { label: 'Quotidien', points: 1.0 },
]

const IMPACT_OPTIONS = [
  { label: 'Mineur (perd 5-10 min)', points: 20 },
  { label: 'Modéré (perd 15-30 min)', points: 40 },
  { label: 'Important (perd > 30 min)', points: 70 },
  { label: 'Majeur (perd > 1h, stress intense)', points: 100 },
]

const questions: Question[] = [
  {
    id: 'orage_imprevu1_titre',
    element: 'orage',
    type: 'text',
    section: 'Imprévu 1',
    question: "Nomme l'imprévu le plus pénalisant",
    subtitle: 'Un titre court, ex. « Panne machine », « Commande urgente »',
    weight: 0,
    maxPoints: 0,
  },
  {
    id: 'orage_imprevu1_frequence',
    element: 'orage',
    type: 'single',
    section: 'Imprévu 1',
    question: 'À quelle fréquence se produit-il ?',
    subtitle: 'Imprévu 1 - Fréquence',
    weight: 0,
    maxPoints: 1.0,
    options: FREQUENCE_OPTIONS,
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
    options: IMPACT_OPTIONS,
  },
  {
    id: 'orage_imprevu2_titre',
    element: 'orage',
    type: 'text',
    section: 'Imprévu 2',
    question: 'Nomme un 2ème imprévu pénalisant',
    subtitle: 'Un titre court, ex. « Absence collègue », « Matériel manquant »',
    weight: 0,
    maxPoints: 0,
  },
  {
    id: 'orage_imprevu2_frequence',
    element: 'orage',
    type: 'single',
    section: 'Imprévu 2',
    question: 'À quelle fréquence se produit-il ?',
    subtitle: 'Imprévu 2 - Fréquence',
    weight: 0,
    maxPoints: 1.0,
    options: FREQUENCE_OPTIONS,
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
    options: IMPACT_OPTIONS,
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

// ---------------------------------------------------------------------------
// Détail des imprévus (côté formateur : tooltip sur le score Orage)
// ---------------------------------------------------------------------------

export interface OrageImprevu {
  /** Titre libre saisi par le participant (ou null si non renseigné). */
  titre: string | null
  /** Libellé de la fréquence choisie (ou null). */
  frequence: string | null
  /** Libellé de l'impact choisi (ou null). */
  impact: string | null
}

function labelForPoints(
  options: { label: string; points: number }[],
  value: unknown
): string | null {
  if (typeof value !== 'number') return null
  return options.find((o) => o.points === value)?.label ?? null
}

/**
 * Reconstruit les 2 imprévus d'un participant à partir de ses réponses
 * (titre + libellés fréquence/impact), pour affichage formateur.
 */
export function getOrageImprevus(answers: Record<string, unknown>): OrageImprevu[] {
  return [1, 2].map((n) => {
    const rawTitre = answers[`orage_imprevu${n}_titre`]
    const titre =
      typeof rawTitre === 'string' && rawTitre.trim() ? rawTitre.trim() : null
    return {
      titre,
      frequence: labelForPoints(FREQUENCE_OPTIONS, answers[`orage_imprevu${n}_frequence`]),
      impact: labelForPoints(IMPACT_OPTIONS, answers[`orage_imprevu${n}_impact`]),
    }
  })
}
