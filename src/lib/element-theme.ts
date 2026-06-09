/**
 * Thème visuel des 5 éléments du modèle.
 *
 * Source unique pour les titres et les couleurs d'accent associés à chaque
 * élément, utilisés dans la session Sensibilisation (côté participant comme
 * formateur). On évite les emojis au profit de titres colorés.
 */

import type { ElementId } from './supabase/types'

export interface ElementTheme {
  /** Nom affiché (ex. "Verre") */
  name: string
  /** Description courte (sous-titre) */
  description: string
  /** Classes Tailwind pour un badge / chip (bg + texte + bordure) */
  chipClass: string
  /** Classe Tailwind pour un titre en couleur pleine */
  titleClass: string
  /** Classe Tailwind pour un sous-titre / accent doux */
  accentClass: string
  /** Classe Tailwind pour un cadre (bg + bordure) d'en-tête de section */
  sectionClass: string
}

export const ELEMENT_THEME: Record<ElementId, ElementTheme> = {
  verre: {
    name: 'Verre',
    description: "Capacité d'absorption (profil personnel)",
    chipClass: 'bg-gray-500/15 text-gray-200 border-gray-400/30',
    titleClass: 'text-gray-200',
    accentClass: 'text-gray-400',
    sectionClass: 'bg-gray-500/10 border-gray-400/30',
  },
  robinet: {
    name: 'Robinet',
    description: 'Charge de travail',
    chipClass: 'bg-blue-500/15 text-blue-200 border-blue-400/30',
    titleClass: 'text-blue-300',
    accentClass: 'text-blue-400',
    sectionClass: 'bg-blue-500/10 border-blue-400/30',
  },
  bulle: {
    name: 'Bulle',
    description: 'Environnement',
    chipClass: 'bg-purple-500/15 text-purple-200 border-purple-400/30',
    titleClass: 'text-purple-300',
    accentClass: 'text-purple-400',
    sectionClass: 'bg-purple-500/10 border-purple-400/30',
  },
  orage: {
    name: 'Orage',
    description: 'Aléas',
    chipClass: 'bg-amber-500/15 text-amber-200 border-amber-400/30',
    titleClass: 'text-amber-300',
    accentClass: 'text-amber-400',
    sectionClass: 'bg-amber-500/10 border-amber-400/30',
  },
  paille: {
    name: 'Paille',
    description: 'Récupération',
    chipClass: 'bg-green-500/15 text-green-200 border-green-400/30',
    titleClass: 'text-green-300',
    accentClass: 'text-green-400',
    sectionClass: 'bg-green-500/10 border-green-400/30',
  },
}

export const ELEMENTS_ORDER: ElementId[] = [
  'verre',
  'robinet',
  'bulle',
  'orage',
  'paille',
]
