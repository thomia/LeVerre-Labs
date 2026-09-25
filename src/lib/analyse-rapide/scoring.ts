/**
 * Calcul des 5 scores d'un moment à partir de ses notations rapides.
 *
 * On réutilise strictement le moteur du questionnaire Sensibilisation
 * (`src/lib/questions/scoring.ts`) : moyenne quadratique pondérée des défaveurs
 * puis application du sens de l'élément. Seule la provenance des poids change —
 * ici ce sont les 4 cases cochées en face de chaque critère, là-bas le
 * classement des aspects.
 *
 *     A = √( Σ wᵢ·xᵢ² / Σ wᵢ )        xᵢ = gravité 0-100, wᵢ = poids de la case
 *     score = A            (Robinet, Bulle, Orage — haut = défavorable)
 *     score = 100 − A      (Verre, Paille — haut = favorable)
 *
 * Cas particulier de l'Orage : le critère `role: 'multiplicateur'` ne rentre
 * pas dans la moyenne, il module le résultat (A × occurrence/100), comme la
 * fréquence AMDEC du questionnaire Orage. Un imprévu qui ne survient pas dans
 * le moment observé donne donc un Orage nul, quelle que soit sa gravité.
 */

import { applyDirection, weightedQuadraticMean, type ElementDirection, type WeightedValue } from '@/lib/questions/scoring'
import type { ElementId } from '@/lib/supabase/types'
import {
  CRITERES_PAR_ELEMENT,
  GRAVITE_PAR_DEFAUT,
  NIVEAUX_POIDS,
  ORDRE_NOTATION,
  TOUS_LES_CRITERES,
  type CritereRapide,
} from './criteres'
import type { NotationCritere, NotationsMoment, ScoresMoment } from './types'

/** Sens de chaque élément, identique aux définitions de `lib/questions`. */
export const DIRECTION_ELEMENT: Record<ElementId, ElementDirection> = {
  robinet: 'negative',
  bulle: 'negative',
  orage: 'negative',
  paille: 'positive',
  verre: 'positive',
}

/** Notation initiale d'un critère : hypothèse neutre + poids pré-réglé. */
export function notationParDefaut(critere: CritereRapide): NotationCritere {
  return {
    gravite: critere.graviteDefaut ?? GRAVITE_PAR_DEFAUT,
    niveauPoids: critere.niveauPoidsDefaut,
  }
}

/** Notations initiales d'un moment. */
export function notationsParDefaut(): NotationsMoment {
  const notations: NotationsMoment = {}

  for (const critere of TOUS_LES_CRITERES) {
    notations[critere.id] = notationParDefaut(critere)
  }

  return notations
}

/** Notation d'un critère, avec repli sur la valeur par défaut si absente. */
function litNotation(notations: NotationsMoment, critere: CritereRapide): NotationCritere {
  return notations[critere.id] ?? notationParDefaut(critere)
}

export function poidsDuNiveau(niveau: number | null): number {
  if (niveau === null) return 0
  return NIVEAUX_POIDS[niveau]?.poids ?? 0
}

/** Score 0-100 d'un élément pour un moment donné. */
export function scoreElement(element: ElementId, notations: NotationsMoment): number {
  const items: WeightedValue[] = []
  let multiplicateur = 1

  for (const critere of CRITERES_PAR_ELEMENT[element]) {
    const notation = litNotation(notations, critere)

    if (critere.role === 'multiplicateur') {
      multiplicateur = Math.max(0, Math.min(100, notation.gravite)) / 100
      continue
    }

    const poids = poidsDuNiveau(notation.niveauPoids)
    if (poids <= 0) continue

    items.push({ value: notation.gravite, weight: poids })
  }

  const defaveur = weightedQuadraticMean(items) * multiplicateur

  return applyDirection(defaveur, DIRECTION_ELEMENT[element])
}

/** Les 5 scores d'un moment. */
export function scoresDuMoment(notations: NotationsMoment): ScoresMoment {
  const scores = {} as ScoresMoment

  for (const element of ORDRE_NOTATION) {
    scores[element] = scoreElement(element, notations)
  }

  return scores
}

/**
 * Scores d'un moment "vide" (aucune observation) : sert d'état de repos entre
 * deux moments et tant qu'aucun moment n'a été créé.
 */
export function scoresNeutres(): ScoresMoment {
  return scoresDuMoment(notationsParDefaut())
}
