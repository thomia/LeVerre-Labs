/**
 * Logique partagée pour la phase d'animation / simulation.
 *
 * Responsabilités :
 *   - Définition des 3 scénarios (tâche / journée / semaine)
 *   - Conversion scénario → vitesse de simulation passée à DashboardSimplified
 *   - Conversion scénario → libellé du chrono (08:00 → 16:00, etc.)
 *   - Durée totale de l'animation (toujours 10s côté UX, peu importe le scénario)
 */

import type { ParticipantScores, SimulationScenario } from './supabase/types'

export const SIMULATION_DURATION_MS = 10_000

/**
 * Référence interne du DashboardSimplified : 480 secondes simulées = 8 heures.
 * Donc 1 seconde simulée = 1 minute réelle.
 *
 * Pour mapper un scénario sur 10s réelles, on cherche la vitesse `speed`
 * telle que `(SIMULATION_DURATION_MS / 1000) * speed = secondes simulées cible`.
 */
const SECONDS_PER_HOUR = 60

const SCENARIO_HOURS: Record<SimulationScenario, number> = {
  tache: 1,
  journee: 8,
  semaine: 40, // 5 × 8h
}

export interface ScenarioMeta {
  id: SimulationScenario
  /** Titre court affiché sur la carte de choix */
  title: string
  /** Sous-titre explicatif */
  description: string
  /** Heures réelles que représente ce scénario */
  hours: number
  /** Vitesse à passer à `externalSimulationSpeed` du DashboardSimplified */
  speed: number
}

export const SCENARIOS: Record<SimulationScenario, ScenarioMeta> = {
  tache: {
    id: 'tache',
    title: 'Une tâche intense',
    description: 'Un pic d\'activité d\'environ 1 heure',
    hours: SCENARIO_HOURS.tache,
    speed:
      (SCENARIO_HOURS.tache * SECONDS_PER_HOUR) / (SIMULATION_DURATION_MS / 1000),
  },
  journee: {
    id: 'journee',
    title: 'Une journée type',
    description: 'Un poste complet de 8 heures',
    hours: SCENARIO_HOURS.journee,
    speed:
      (SCENARIO_HOURS.journee * SECONDS_PER_HOUR) / (SIMULATION_DURATION_MS / 1000),
  },
  semaine: {
    id: 'semaine',
    title: 'Une semaine chargée',
    description: '5 jours d\'affilée sans vraie récupération',
    hours: SCENARIO_HOURS.semaine,
    speed:
      (SCENARIO_HOURS.semaine * SECONDS_PER_HOUR) / (SIMULATION_DURATION_MS / 1000),
  },
}

export const SCENARIOS_ORDER: SimulationScenario[] = ['tache', 'journee', 'semaine']

/**
 * Calcule la progression (0 → 1) d'une simulation démarrée à `startedAt`.
 * Retourne 0 si pas démarrée, 1 si terminée.
 */
export function getSimulationProgress(startedAt: string | null): number {
  if (!startedAt) return 0
  const elapsed = Date.now() - new Date(startedAt).getTime()
  if (elapsed <= 0) return 0
  if (elapsed >= SIMULATION_DURATION_MS) return 1
  return elapsed / SIMULATION_DURATION_MS
}

/**
 * Indique si la simulation est terminée (10s écoulées depuis le démarrage).
 */
export function isSimulationFinished(startedAt: string | null): boolean {
  if (!startedAt) return false
  return Date.now() - new Date(startedAt).getTime() >= SIMULATION_DURATION_MS
}

/**
 * Formate le chrono affiché pendant la simulation, en fonction du scénario
 * et de la progression (0 → 1).
 *
 * Exemples :
 *   - tache    : "00:00 → 01:00" qui défile en minutes:secondes
 *   - journee  : "08:00 → 16:00" qui défile en heures:minutes
 *   - semaine  : "Lun 08:00 → Ven 17:00"
 */
export function formatSimulationClock(
  scenario: SimulationScenario,
  progress: number,
): string {
  const safeProgress = Math.max(0, Math.min(1, progress))

  if (scenario === 'tache') {
    // 0 → 60 minutes (00:00 → 01:00)
    const totalMinutes = safeProgress * 60
    const minutes = Math.floor(totalMinutes)
    const seconds = Math.floor((totalMinutes - minutes) * 60)
    return `${pad(minutes)}:${pad(seconds)}`
  }

  if (scenario === 'journee') {
    // 8h → 16h
    const startHour = 8
    const totalHoursElapsed = safeProgress * 8
    const currentTotal = startHour + totalHoursElapsed
    const hour = Math.floor(currentTotal)
    const minutes = Math.floor((currentTotal - hour) * 60)
    return `${pad(hour)}:${pad(minutes)}`
  }

  // semaine : 5 jours de 9h (08:00 → 17:00)
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven']
  const totalHoursElapsed = safeProgress * (5 * 9) // 5 jours × 9h ouvrées
  const dayIndex = Math.min(4, Math.floor(totalHoursElapsed / 9))
  const hourInDay = totalHoursElapsed - dayIndex * 9
  const hour = 8 + Math.floor(hourInDay)
  const minutes = Math.floor((hourInDay - Math.floor(hourInDay)) * 60)
  return `${days[dayIndex]} ${pad(hour)}:${pad(minutes)}`
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

/**
 * Heuristique d'évaluation du risque de débordement pour un participant donné.
 *
 * On NE peut PAS lire le `fillLevel` interne du DashboardSimplified depuis
 * l'extérieur. On approxime donc la pression nette à partir des scores :
 *
 *   pression  = robinet (charge) + bulle/2 (environnement) + orage/2 (aléas)
 *   capacité  = verre + paille (récupération)
 *
 * Quand `pression > capacité`, le verre est en risque (ring rouge subtil
 * sur la mosaïque formateur, pendant ou après la simulation).
 *
 * Le scénario long (semaine) accumule plus de pression que la tâche courte,
 * donc on le pondère légèrement.
 */
export function estimateIsOverloaded(
  scores: ParticipantScores,
  scenario: SimulationScenario | null,
): boolean {
  const verre = scores.verre ?? 0
  const robinet = scores.robinet ?? 0
  const bulle = scores.bulle ?? 0
  const orage = scores.orage ?? 0
  const paille = scores.paille ?? 0

  // Modulateur de scénario : tâche = 0.7 (court), journée = 1, semaine = 1.3
  const scenarioFactor =
    scenario === 'tache' ? 0.7 : scenario === 'semaine' ? 1.3 : 1

  const pressure = (robinet + bulle * 0.5 + orage * 0.5) * scenarioFactor
  const capacity = verre + paille

  return pressure > capacity
}
