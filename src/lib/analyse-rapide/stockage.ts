/**
 * Persistance locale d'une analyse rapide.
 *
 * La vidéo est lue depuis le disque de l'observateur (object URL) : rien ne
 * part sur le réseau. On sauvegarde donc le découpage dans le navigateur,
 * indexé par nom de fichier + durée, pour qu'un rafraîchissement ou une reprise
 * le lendemain ne perde pas une heure de notation.
 */

import { getLocalStorage, setLocalStorage } from '@/lib/localStorage'
import type { MomentAnalyse } from './types'
import type { ProjectionId } from './physique-verre'

const PREFIXE = 'leverre:analyse-rapide:'

export interface AnalyseSauvegardee {
  titre: string
  moments: MomentAnalyse[]
  projection: ProjectionId
  enregistreLe: string
}

export function cleAnalyse(nomFichier: string, duree: number): string {
  return `${PREFIXE}${nomFichier}:${Math.round(duree)}`
}

export function chargeAnalyse(cle: string): AnalyseSauvegardee | null {
  const brut = getLocalStorage(cle)
  if (!brut) return null

  try {
    const donnees = JSON.parse(brut) as AnalyseSauvegardee
    return Array.isArray(donnees.moments) ? donnees : null
  } catch {
    return null
  }
}

export function sauvegardeAnalyse(cle: string, analyse: Omit<AnalyseSauvegardee, 'enregistreLe'>): void {
  setLocalStorage(cle, JSON.stringify({ ...analyse, enregistreLe: new Date().toISOString() }))
}
