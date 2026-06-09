/**
 * Questions de l'élément PAILLE - Récupération.
 *
 * Formule : Score_P = MOYENNE(6 questions)
 * Score élevé = bonne récupération (la paille évacue bien le contenu du verre).
 *
 * Questions extraites de `src/components/analyse-video/analysis-modal.tsx`.
 */

import type { ElementDefinition, Question, AnswersMap } from './types'

const questions: Question[] = [
  {
    id: 'paille_pauses',
    element: 'paille',
    type: 'single',
    question: 'Peux-tu faire des pauses quand tu en as besoin ?',
    weight: 1,
    maxPoints: 100,
    options: [
      { label: 'Pauses libres + pauses officielles', points: 100 },
      { label: 'Pauses officielles uniquement (fixes)', points: 70 },
      { label: 'Pauses rares ou difficiles à prendre', points: 40 },
      { label: 'Aucune pause — travail continu', points: 0 },
    ],
  },
  {
    id: 'paille_mobilite',
    element: 'paille',
    type: 'single',
    question: 'Peux-tu bouger et changer de position pendant le travail ?',
    weight: 1,
    maxPoints: 100,
    options: [
      { label: 'Alterne assis/debout/marche librement', points: 100 },
      { label: 'Peut bouger un peu sur place', points: 60 },
      { label: 'Position statique quasi-permanente', points: 30 },
    ],
  },
  {
    id: 'paille_etirements',
    element: 'paille',
    type: 'single',
    question: "Peux-tu t'étirer pendant le travail ?",
    weight: 1,
    maxPoints: 100,
    options: [
      { label: 'Fait des étirements réguliers', points: 100 },
      { label: 'Pourrait mais ne le fait pas', points: 50 },
      { label: "Impossible (pas d'espace, pas de temps)", points: 0 },
    ],
  },
  {
    id: 'paille_hydratation',
    element: 'paille',
    type: 'single',
    question: "Peux-tu boire de l'eau facilement ?",
    weight: 1,
    maxPoints: 100,
    options: [
      { label: 'Bouteille à portée ou fontaine proche', points: 100 },
      { label: 'Accessible mais à distance', points: 75 },
      { label: 'Difficile (loin ou interdit pendant la tâche)', points: 30 },
    ],
  },
  {
    id: 'paille_repos',
    element: 'paille',
    type: 'single',
    question: 'Y a-t-il un endroit calme pour se reposer aux pauses ?',
    weight: 1,
    maxPoints: 100,
    options: [
      { label: 'Salle de pause dédiée, calme', points: 100 },
      { label: 'Existe mais bruyante/partagée', points: 65 },
      { label: 'Non — pause sur le poste ou debout', points: 30 },
    ],
  },
  {
    id: 'paille_preparation',
    element: 'paille',
    type: 'single',
    question: "Fais-tu des exercices de préparation (réveil musculaire) avant les tâches critiques ?",
    weight: 1,
    maxPoints: 100,
    options: [
      { label: 'Protocole structuré avant chaque tâche critique', points: 100 },
      { label: 'Parfois, selon la motivation du jour', points: 60 },
      { label: 'Rare, uniquement en cas de douleur existante', points: 30 },
      { label: 'Jamais — aucune préparation physique', points: 0 },
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
    sum += value
    count++
  }

  if (count === 0) return 0
  return Math.max(0, Math.min(100, Math.round(sum / count)))
}

export const pailleDefinition: ElementDefinition = {
  id: 'paille',
  name: 'Paille',
  emoji: '🥤',
  description: 'Récupération',
  questions,
  computeScore,
}
