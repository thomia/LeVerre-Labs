/**
 * Physique du verre pour l'ANALYSE RAPIDE — le verre "vit" pendant la lecture.
 *
 * On garde les facteurs du modèle historique (`dashboard-simplified.tsx`,
 * `lib/indicateur.ts`) et la reformulation propre du §6 de
 * `docs/SIMULATION_PRINCIPLES.md` : un **taux de remplissage exprimé par minute
 * de travail**, indépendant de la cadence d'affichage. La lecture de la vidéo
 * ne fait que faire défiler ce temps de travail, via la projection (§6.2).
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
import { scoresDuMoment, scoresNeutres } from './scoring'

/** Part de la charge qu'une paille à 100 peut évacuer. */
export const RATIO_DRAIN = 0.6

/** Facteur sans dimension du pire cas absolu : R=100, B=100, O=100, P=0, V=0. */
const FACTEUR_PIRE_CAS = 3.75

/**
 * Calibration (§7.1 de `docs/SIMULATION_PRINCIPLES.md`, option B) : au pire cas
 * absolu, le verre déborde après **2 h de travail**. « Une matinée et c'est
 * plié » — assez marquant pour un usage pédagogique, sans être invraisemblable.
 *
 * Ordres de grandeur qui en découlent, en temps de travail :
 *
 *   - pire cas absolu                                  → déborde en 2 h
 *   - moment dur    (R 100, B 80, O 60, P 10, V 20)    → déborde en ~3 h
 *   - moment chargé (R 80, B 60, O 30, P 30, V 40)     → déborde en ~6 h 30
 *   - moment neutre (tous à 50, pas d'imprévu)         → ~4 % du verre par heure
 *   - moment tenable (R 20, B 20, P 80, V 80)          → le verre se vide
 */
export const PIRE_CAS_MINUTES = 120

/** % de verre par minute **de travail**, à facteur de charge égal à 1. */
export const TAUX_MAX_PAR_MINUTE = 100 / (PIRE_CAS_MINUTES * FACTEUR_PIRE_CAS)

/**
 * Part de la paille qui continue d'agir entre deux moments.
 *
 * Le temps non découpé n'est pas du repos : c'est surtout du travail qu'on n'a
 * pas analysé. Laisser la récupération à pleine puissance viderait le verre
 * dans chaque intervalle et effacerait tout ce que les moments viennent de
 * raconter ; la couper complètement figerait le verre. On récupère donc à
 * moitié, ce qui fait redescendre le niveau environ deux fois moins vite qu'un
 * moment ordinaire ne le fait monter.
 */
export const RECUPERATION_HORS_MOMENT = 0.5

/**
 * Projection : quelle durée de travail la séquence filmée représente.
 *
 * C'est la « vitesse de simulation » du §6.2 de la doc, formulée en langage
 * métier. Une vidéo de poste est un échantillon : filmer deux minutes ne veut
 * pas dire que l'opérateur travaille deux minutes. En temps réel strict, le
 * verre ne bougerait donc quasiment pas — mathématiquement juste, mais muet à
 * l'écran. En annonçant « ce que je filme là, il le fait pendant 4 h », le
 * verre parcourt la dynamique réelle du poste pendant la lecture, et le
 * débordement redevient un résultat interprétable.
 *
 * La physique (§6.1) reste inchangée : la projection n'agit que sur le temps
 * qui passe, jamais sur le débit.
 */
export const PROJECTIONS = [
  { id: '1h', label: '1 h', minutes: 60, aide: 'la séquence résume 1 h de travail' },
  { id: '2h', label: '2 h', minutes: 120, aide: 'la séquence résume 2 h de travail' },
  { id: '4h', label: '4 h', minutes: 240, aide: 'la séquence résume une demi-journée' },
  { id: '8h', label: '8 h', minutes: 480, aide: 'la séquence résume une journée entière' },
] as const

export type ProjectionId = (typeof PROJECTIONS)[number]['id']

export const PROJECTION_PAR_DEFAUT: ProjectionId = '4h'

export function minutesProjetees(projection: ProjectionId): number {
  return PROJECTIONS.find((option) => option.id === projection)?.minutes ?? 240
}

/** Garde-fou pour les analyses relues depuis le stockage local. */
export function projectionValide(valeur: unknown): ProjectionId {
  return PROJECTIONS.some((option) => option.id === valeur)
    ? (valeur as ProjectionId)
    : PROJECTION_PAR_DEFAUT
}

/** Minutes de travail représentées par une minute de vidéo. */
export function facteurProjection(projection: ProjectionId, dureeVideo: number): number {
  if (dureeVideo <= 0) return 1
  return minutesProjetees(projection) / (dureeVideo / 60)
}

/** Minutes de travail déjà représentées à l'instant `temps` de la vidéo. */
export function travailEcoule(projection: ProjectionId, temps: number, dureeVideo: number): number {
  if (dureeVideo <= 0) return 0
  return (Math.min(temps, dureeVideo) / dureeVideo) * minutesProjetees(projection)
}

/** Taux de remplissage en % de verre par minute de travail (négatif = se vide). */
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
 * s'éteint (plus de tâche observée), la personne et son environnement restent
 * ceux du dernier moment, et la récupération n'agit qu'à moitié — le verre
 * redescend doucement au lieu de se figer ou de se vider d'un coup.
 */
export function scoresHorsMoment(precedents: ScoresMoment): ScoresMoment {
  return {
    ...precedents,
    robinet: 0,
    orage: 0,
    paille: Math.round(precedents.paille * RECUPERATION_HORS_MOMENT),
  }
}

/**
 * État affiché avant le premier moment : robinet fermé, hypothèse neutre pour
 * le reste. Rien ne coule tant qu'aucune tâche n'a été découpée.
 */
export function scoresRepos(): ScoresMoment {
  return scoresHorsMoment(scoresNeutres())
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
export function niveauAuTemps(segments: SegmentSimulation[], temps: number, facteur = 1): number {
  let niveau = 0

  for (const segment of segments) {
    if (segment.debut >= temps) break

    const fin = Math.min(segment.fin, temps)
    const minutes = ((fin - segment.debut) / 60) * facteur
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
  facteur = 1
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
        niveau = avance(niveau, segment, debut, segment.fin, facteur)
        tPrecedent = segment.fin
      }
      index += 1
    }

    if (index < segments.length) {
      const segment = segments[index]
      const debut = Math.max(segment.debut, tPrecedent)
      if (t > debut) {
        niveau = avance(niveau, segment, debut, t, facteur)
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
  facteur: number
): number {
  const minutes = ((fin - debut) / 60) * facteur
  return Math.max(0, Math.min(100, niveau + tauxParMinute(segment.scores) * minutes))
}

/**
 * Minutes de **travail** restantes avant débordement au rythme courant.
 * `null` quand le verre ne déborde pas (taux nul ou négatif).
 *
 * Exprimé en temps de travail et non en temps de vidéo : c'est la phrase qu'on
 * prononce en commentant ("à ce rythme-là, il déborde avant la pause").
 */
export function travailAvantDebordement(scores: ScoresMoment, niveauActuel: number): number | null {
  const taux = tauxParMinute(scores)
  if (taux <= 0) return null

  return (100 - niveauActuel) / taux
}

/**
 * Couleur d'un moment sur la frise, lue comme « en combien de temps de travail
 * ce moment-là remplirait le verre à lui seul » :
 *
 *   vert   → il vide le verre (récupération nette)
 *   lime   → soutenable au-delà de la semaine
 *   jaune  → déborde dans la semaine
 *   orange → déborde dans la journée
 *   rouge  → déborde avant la demi-journée
 */
export function couleurTaux(taux: number): string {
  if (taux <= 0) return '#4ade80'

  const heuresPourRemplir = 100 / taux / 60
  if (heuresPourRemplir > 40) return '#a3e635'
  if (heuresPourRemplir > 8) return '#facc15'
  if (heuresPourRemplir > 4) return '#fb923c'
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
