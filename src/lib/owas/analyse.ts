/**
 * Analyse OWAS d'une séance : sorties méthodologiques PURES.
 * =========================================================
 *
 * Volontairement, aucune conversion en note 0-100 ici. On expose
 * uniquement les résultats OWAS officiels (catégories de risque 1-4).
 * L'interprétation de ces catégories en note Robinet /100 sera décidée
 * plus tard, séparément.
 *
 * Deux niveaux d'analyse (cf. Ergonautas / Karhu et al. 1977) :
 *   - par posture observée : code 4 chiffres → catégorie d'action (Tabla 6) ;
 *   - par segment sur toute la séance : fréquence relative de chaque
 *     position → catégorie de risque du segment (Tabla 7).
 */

import type {
  CodificationOwas,
  CategorieAction,
  CodeDos,
  CodeBras,
  CodeJambes,
  CodeCharge,
} from './types'
import { getCategorieAction } from './table-categories-action'
import {
  categorieFrequenceDos,
  categorieFrequenceBras,
  categorieFrequenceJambes,
} from './table-frequence'

/* ---------- Niveau 1 : par posture observée ---------- */

/** Code OWAS officiel à 4 chiffres, ex. "2-1-3-2". */
export function codeOwas(codif: CodificationOwas): string {
  return `${codif.dos}-${codif.bras}-${codif.jambes}-${codif.charge}`
}

/** Catégorie d'action d'une posture (Tabla 6 des 252 combinaisons). */
export function categorieActionPosture(codif: CodificationOwas): CategorieAction {
  return getCategorieAction(codif.dos, codif.bras, codif.jambes, codif.charge)
}

/* ---------- Niveau 2 : par segment sur la séance (fréquence) ---------- */

/** Fréquence relative et catégorie d'une position d'un segment. */
export interface FrequencePosition<P extends number> {
  position: P
  nombre: number
  frequencePct: number
  categorie: CategorieAction
}

function frequencesSegment<P extends number>(
  codifications: CodificationOwas[],
  position: (c: CodificationOwas) => P,
  categorieFrequence: (pos: P, frequencePct: number) => CategorieAction,
): FrequencePosition<P>[] {
  const total = codifications.length
  if (total === 0) return []

  const occurrences = new Map<P, number>()
  for (const c of codifications) {
    const pos = position(c)
    occurrences.set(pos, (occurrences.get(pos) ?? 0) + 1)
  }

  const resultat: FrequencePosition<P>[] = []
  occurrences.forEach((nombre, pos) => {
    const frequencePct = (nombre / total) * 100
    resultat.push({
      position: pos,
      nombre,
      frequencePct,
      categorie: categorieFrequence(pos, frequencePct),
    })
  })
  resultat.sort((a, b) => a.position - b.position)
  return resultat
}

export function frequencesDos(codifications: CodificationOwas[]): FrequencePosition<CodeDos>[] {
  return frequencesSegment(codifications, (c) => c.dos, categorieFrequenceDos)
}

export function frequencesBras(codifications: CodificationOwas[]): FrequencePosition<CodeBras>[] {
  return frequencesSegment(codifications, (c) => c.bras, categorieFrequenceBras)
}

export function frequencesJambes(codifications: CodificationOwas[]): FrequencePosition<CodeJambes>[] {
  return frequencesSegment(codifications, (c) => c.jambes, categorieFrequenceJambes)
}

/** Catégorie de risque d'un segment = la pire de ses positions. */
function pireCategorie<P extends number>(frequences: FrequencePosition<P>[]): CategorieAction {
  let pire: CategorieAction = 1
  for (const f of frequences) if (f.categorie > pire) pire = f.categorie
  return pire
}

export interface CategoriesSegments {
  dos: CategorieAction
  bras: CategorieAction
  jambes: CategorieAction
}

/** Catégories de risque des 3 segments sur l'ensemble de la séance. */
export function categoriesSegments(codifications: CodificationOwas[]): CategoriesSegments {
  return {
    dos: pireCategorie(frequencesDos(codifications)),
    bras: pireCategorie(frequencesBras(codifications)),
    jambes: pireCategorie(frequencesJambes(codifications)),
  }
}

/** Catégorie posturale la plus critique de la séance (max des 3 segments). */
export function pireCategoriePosture(codifications: CodificationOwas[]): CategorieAction {
  const { dos, bras, jambes } = categoriesSegments(codifications)
  return Math.max(dos, bras, jambes) as CategorieAction
}

/* ---------- Distributions (pour l'écran récapitulatif) ---------- */

/** Répartition (en %) des postures par catégorie d'action (Tabla 6). */
export function repartitionCategoriesPostures(
  codifications: CodificationOwas[],
): Record<CategorieAction, number> {
  const counts: Record<CategorieAction, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }
  for (const c of codifications) counts[categorieActionPosture(c)]++
  const base = codifications.length || 1
  return {
    1: Math.round((counts[1] / base) * 100),
    2: Math.round((counts[2] / base) * 100),
    3: Math.round((counts[3] / base) * 100),
    4: Math.round((counts[4] / base) * 100),
  }
}

/** Répartition (en %) des postures par niveau de charge. */
export function repartitionCharge(
  codifications: CodificationOwas[],
): Record<CodeCharge, number> {
  const counts: Record<CodeCharge, number> = { 1: 0, 2: 0, 3: 0 }
  for (const c of codifications) counts[c.charge]++
  const total = codifications.length || 1
  return {
    1: Math.round((counts[1] / total) * 100),
    2: Math.round((counts[2] / total) * 100),
    3: Math.round((counts[3] / total) * 100),
  }
}
