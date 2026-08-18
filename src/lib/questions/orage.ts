/**
 * Questions de l'élément ORAGE - Imprévus et perturbations.
 *
 * Élément NÉGATIF : score élevé = aléas lourds.
 *
 * Pour CHAQUE imprévu, le participant le NOMME puis répond à 3 dimensions
 * (méthode AMDEC, criticité = fréquence × gravité) :
 *   - Fréquence (F) : multiplicateur d'occurrence (0-1).
 *   - Gravité (G)   : moyenne des deux facettes temps (T) et énergie (E), 0-100.
 *   - Criticité xⱼ  = F × (T + E) / 2
 *   - Score O       = √( (x₁² + x₂²) / n )   (voir scoring.ts)
 *
 * La fréquence agit comme un interrupteur : un imprévu qui n'arrive jamais a
 * une criticité nulle, quelle que soit sa gravité.
 */

import type { ElementDefinition, Question, AnswersMap } from './types'
import { applyDirection, weightedQuadraticMean } from './scoring'

/** Un imprévu = un titre + un triplet de questions (fréquence, temps, énergie). */
interface ImprevuKeys {
  titre: string
  frequence: string
  temps: string
  energie: string
}

export const ORAGE_IMPREVUS: ImprevuKeys[] = [
  {
    titre: 'orage_imprevu1_titre',
    frequence: 'orage_imprevu1_frequence',
    temps: 'orage_imprevu1_temps',
    energie: 'orage_imprevu1_energie',
  },
  {
    titre: 'orage_imprevu2_titre',
    frequence: 'orage_imprevu2_frequence',
    temps: 'orage_imprevu2_temps',
    energie: 'orage_imprevu2_energie',
  },
]

const FREQUENCE_OPTIONS = [
  { label: 'Rare (1/mois)', points: 0.2 },
  { label: 'Occasionnel (1/semaine)', points: 0.5 },
  { label: 'Fréquent (2-3/semaine)', points: 0.8 },
  { label: 'Quotidien', points: 1 },
]

const TEMPS_OPTIONS = [
  { label: 'Quelques minutes (moins de 10 min)', points: 20 },
  { label: "Un quart d'heure (10-30 min)", points: 40 },
  { label: 'Une demi-heure à 1h (30-60 min)', points: 70 },
  { label: "Plus d'une heure", points: 100 },
]

const ENERGIE_OPTIONS = [
  { label: 'Anodin — je gère sans y penser', points: 25 },
  { label: 'Agaçant — un peu de tension', points: 50 },
  { label: 'Éprouvant — ça me stresse et me fatigue', points: 75 },
  { label: 'Épuisant — ça me met à cran, plombe ma journée', points: 100 },
]

function buildImprevuQuestions(index: number, keys: ImprevuKeys): Question[] {
  const section = `Imprévu ${index + 1}`
  const titreQuestion =
    index === 0
      ? 'Dans la tâche que vous avez choisie, quel imprévu vous semble le plus significatif ?'
      : 'Identifiez un second imprévu significatif dans cette tâche'

  return [
    {
      id: keys.titre,
      element: 'orage',
      type: 'text',
      section,
      question: titreQuestion,
    },
    {
      id: keys.frequence,
      element: 'orage',
      type: 'single',
      section,
      question: 'À quelle fréquence cet imprévu survient-il ?',
      options: FREQUENCE_OPTIONS,
    },
    {
      id: keys.temps,
      element: 'orage',
      type: 'single',
      section,
      question: 'Quand il survient, combien de temps cela vous fait-il perdre ?',
      subtitle: 'Attente, rattrapage, reprise',
      options: TEMPS_OPTIONS,
    },
    {
      id: keys.energie,
      element: 'orage',
      type: 'single',
      section,
      question: 'Sur le moment, à quel point cela vous coûte en énergie / stress ?',
      options: ENERGIE_OPTIONS,
    },
  ]
}

const questions: Question[] = ORAGE_IMPREVUS.flatMap((keys, index) =>
  buildImprevuQuestions(index, keys)
)

function num(answers: AnswersMap, key: string): number | null {
  const raw = answers[key]
  return typeof raw === 'number' ? raw : null
}

/**
 * Criticité AMDEC d'un imprévu = F × (T + E) / 2, ou `null` si aucune de ses
 * dimensions n'est renseignée. Les dimensions manquantes comptent comme 0
 * (utile pour un score progressif). Le titre n'entre pas dans le calcul.
 */
function criticite(answers: AnswersMap, keys: ImprevuKeys): number | null {
  const f = num(answers, keys.frequence)
  const t = num(answers, keys.temps)
  const e = num(answers, keys.energie)
  if (f === null && t === null && e === null) return null

  const gravite = ((t ?? 0) + (e ?? 0)) / 2
  return (f ?? 0) * gravite
}

function computeScore(answers: AnswersMap): number {
  const items = ORAGE_IMPREVUS.map((keys) => criticite(answers, keys))
    .filter((value): value is number => value !== null)
    .map((value) => ({ value, weight: 1 }))

  return applyDirection(weightedQuadraticMean(items), 'negative')
}

export const orageDefinition: ElementDefinition = {
  id: 'orage',
  name: 'Orage',
  emoji: '⛈️',
  description: 'Imprévus et perturbations',
  questions,
  direction: 'negative',
  computeScore,
}
