/**
 * Physique du verre pour l'ANALYSE RAPIDE — le verre "vit" pendant la lecture.
 *
 * On garde les facteurs du modèle historique (`dashboard-simplified.tsx`,
 * `lib/indicateur.ts`) et la reformulation propre du §6 de
 * `docs/SIMULATION_PRINCIPLES.md` : un **taux de remplissage exprimé par minute**,
 * indépendant de la cadence d'affichage. Ici la minute de référence est la
 * minute de **vidéo**, puisque c'est elle qui fait avancer l'analyse.
 *
 *     ENV(B)   = 1 + B/200        1.0 → 1.5
 *     STORM(O) = 1 + O/150        1.0 → 1.667
 *     CAP(V)   = 1.5 − V/100      1.5 → 0.5   (verre large = se remplit lentement)
 *     DRAIN    = 0.6              (la paille à 100 évacue ce qu'un robinet à 60 apporte)
 *
 *     taux %/min = ( R/100 × ENV × STORM − P/100 × DRAIN ) × CAP × TAUX_MAX_PAR_MINUTE
 *
 * Deux propriétés qui comptent pour l'usage en direct :
 *
 *   - **Déterministe** : le niveau à l'instant t est une fonction pure des
 *     moments notés. On peut donc rembobiner, sauter dans la timeline ou
 *     rejouer la séquence, le verre affiche toujours exactement la même chose —
 *     indispensable quand on refait une prise pour la vidéo.
 *   - **Intégration par segments** : le taux est constant à l'intérieur d'un
 *     moment, on n'a donc pas besoin d'accumuler image par image.
 */

import type { ElementId } from '@/lib/supabase/types'
import type { MomentAnalyse, ScoresMoment } from './types'
import { scoresDuMoment } from './scoring'

/** Part de la charge qu'une paille à 100 peut évacuer. */
export const RATIO_DRAIN = 0.6

/**
 * Calibration : % de verre rempli par minute de vidéo, au pire cas absolu
 * (R=100, B=100, O=100, P=0, V=0 → facteur 3.75).
 *
 *   - pire cas absolu        → verre plein en ~40 s de vidéo
 *   - moment lourd réaliste  (R 60, B 40, O 20, P 35, V 55) → ~4 min
 *   - moment tenable         (R 30, B 20, O 10, P 60, V 70) → le verre se vide
 *
 * Ces ordres de grandeur sont choisis pour une vidéo de poste de 3 à 10 min :
 * le verre doit raconter quelque chose à l'échelle de la séquence filmée, pas
 * à l'échelle de la journée de travail.
 */
export const TAUX_MAX_PAR_MINUTE = 40

/** Tempos proposés à l'observateur pour caler la dynamique sur sa vidéo. */
export const TEMPOS = [
  { id: 'lent', label: 'Lent', facteur: 0.5 },
  { id: 'normal', label: 'Normal', facteur: 1 },
  { id: 'rapide', label: 'Rapide', facteur: 2 },
] as const

export type TempoId = (typeof TEMPOS)[number]['id']

export function facteurTempo(tempo: TempoId): number {
  return TEMPOS.find((t) => t.id === tempo)?.facteur ?? 1
}

/** Taux de remplissage en % de verre par minute de vidéo (négatif = se vide). */
export function tauxParMinute(scores: ScoresMoment): number {
  const environnement = 1 + scores.bulle / 200
  const orage = 1 + scores.orage / 150
  const capacite = 1.5 - scores.verre / 100

  const entree = (scores.robinet / 100) * environnement * orage
  const sortie = (scores.paille / 100) * RATIO_DRAIN

  return (entree - sortie) * capacite * TAUX_MAX_PAR_MINUTE
}

/** Segment de timeline sur lequel le taux de remplissage est constant. */
export interface SegmentSimulation {
  debut: number
  fin: number
  scores: ScoresMoment
  /** `null` entre deux moments (récupération hors tâche observée). */
  momentId: string | null
}

/**
 * Scores appliqués entre deux moments : le robinet se ferme et l'orage
 * s'éteint (plus de tâche observée), mais la personne, son environnement et sa
 * récupération restent ceux du dernier moment — le verre se vide doucement au
 * lieu de se figer.
 */
function scoresHorsMoment(precedents: ScoresMoment): ScoresMoment {
  return { ...precedents, robinet: 0, orage: 0 }
}

/**
 * Découpe la timeline en segments à taux constant. Les moments sont supposés
 * triés et non chevauchants (garanti à la création côté UI).
 */
export function construitSegments(moments: MomentAnalyse[], dureeVideo: number): SegmentSimulation[] {
  const tries = [...moments].sort((a, b) => a.debut - b.debut)
  const segments: SegmentSimulation[] = []
  let precedents: ScoresMoment | null = null
  let curseur = 0

  for (const moment of tries) {
    if (moment.debut > curseur && precedents) {
      segments.push({
        debut: curseur,
        fin: moment.debut,
        scores: scoresHorsMoment(precedents),
        momentId: null,
      })
    }

    const scores = scoresDuMoment(moment.notations)
    segments.push({ debut: Math.max(curseur, moment.debut), fin: moment.fin, scores, momentId: moment.id })
    precedents = scores
    curseur = Math.max(curseur, moment.fin)
  }

  if (precedents && dureeVideo > curseur) {
    segments.push({
      debut: curseur,
      fin: dureeVideo,
      scores: scoresHorsMoment(precedents),
      momentId: null,
    })
  }

  return segments
}

/**
 * Niveau du verre (0-100) à l'instant `temps` de la vidéo.
 *
 * Le clamp est appliqué segment par segment : comme le taux y est constant, un
 * verre qui déborde au milieu d'un segment reste à 100 jusqu'à sa fin, et un
 * verre vidé reste à 0. Le résultat est donc exact, sans pas de temps.
 */
export function niveauAuTemps(segments: SegmentSimulation[], temps: number, tempo = 1): number {
  let niveau = 0

  for (const segment of segments) {
    if (segment.debut >= temps) break

    const fin = Math.min(segment.fin, temps)
    const minutes = ((fin - segment.debut) / 60) * tempo
    if (minutes <= 0) continue

    niveau = Math.max(0, Math.min(100, niveau + tauxParMinute(segment.scores) * minutes))
  }

  return niveau
}

/** Segment actif à l'instant donné (celui qui pilote les 5 éléments à l'écran). */
export function segmentAuTemps(segments: SegmentSimulation[], temps: number): SegmentSimulation | null {
  for (const segment of segments) {
    if (temps >= segment.debut && temps < segment.fin) return segment
  }

  return segments.length > 0 && temps >= segments[segments.length - 1].fin
    ? segments[segments.length - 1]
    : null
}

/**
 * Courbe du niveau sur toute la vidéo, échantillonnée pour l'aperçu sous la
 * frise. Un seul balayage des segments : coût linéaire en nombre de points.
 */
export function courbeNiveau(
  segments: SegmentSimulation[],
  dureeVideo: number,
  nbPoints = 240,
  tempo = 1
): number[] {
  if (dureeVideo <= 0 || segments.length === 0) return []

  const points: number[] = []
  const pas = dureeVideo / (nbPoints - 1)
  let niveau = 0
  let tPrecedent = 0
  let index = 0

  for (let i = 0; i < nbPoints; i += 1) {
    const t = i * pas

    while (index < segments.length && segments[index].fin <= t) {
      const segment = segments[index]
      const debut = Math.max(segment.debut, tPrecedent)
      if (segment.fin > debut) {
        niveau = avance(niveau, segment, debut, segment.fin, tempo)
        tPrecedent = segment.fin
      }
      index += 1
    }

    if (index < segments.length) {
      const segment = segments[index]
      const debut = Math.max(segment.debut, tPrecedent)
      if (t > debut) {
        niveau = avance(niveau, segment, debut, t, tempo)
        tPrecedent = t
      }
    }

    points.push(niveau)
  }

  return points
}

function avance(
  niveau: number,
  segment: SegmentSimulation,
  debut: number,
  fin: number,
  tempo: number
): number {
  const minutes = ((fin - debut) / 60) * tempo
  return Math.max(0, Math.min(100, niveau + tauxParMinute(segment.scores) * minutes))
}

/**
 * Temps de vidéo restant avant débordement au rythme courant, en secondes.
 * `null` quand le verre ne déborde pas (le taux est nul ou négatif).
 */
export function secondesAvantDebordement(
  scores: ScoresMoment,
  niveauActuel: number,
  tempo = 1
): number | null {
  const taux = tauxParMinute(scores) * tempo
  if (taux <= 0) return null

  return ((100 - niveauActuel) / taux) * 60
}

/**
 * Couleur d'un moment sur la frise, selon ce qu'il fait au verre :
 * vert = il vide, jaune = il remplit doucement, rouge = il remplit vite.
 */
export function couleurTaux(taux: number): string {
  if (taux <= 0) return '#4ade80'
  if (taux < 10) return '#facc15'
  if (taux < 25) return '#fb923c'
  return '#f87171'
}

/** Couleur d'état du verre, alignée sur les paliers de `GlassComponent`. */
export function couleurNiveau(niveau: number): string {
  if (niveau >= 90) return '#c084fc'
  if (niveau >= 80) return '#f87171'
  if (niveau >= 60) return '#facc15'
  return '#4ade80'
}

export const ORDRE_AFFICHAGE_SCORES: ElementId[] = ['robinet', 'bulle', 'orage', 'paille', 'verre']
