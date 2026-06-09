/**
 * Constantes UI partagees pour la console d'exploration `/statistiques`.
 *
 * Tout ce qui est "vocabulaire metier" (libelles CTN, libelles des vues,
 * libelles des indicateurs principaux) se trouve ici, en source unique
 * de verite. Les composants (filtres, KPI cards, vues) consomment ces
 * constantes plutot que de dupliquer leurs propres litteraux.
 */

import type { CtnCode } from '@/data/stats-am/types'

/* =============================================================
 * 1. CTN (secteurs d'activite)
 * ============================================================= */

/**
 * Liste ordonnee des CTN avec leur libelle court et leur couleur
 * d'accent (utile pour les heatmaps / comparaisons).
 *
 * NOTE : "tous" = total national (les 9 CTN agreges + compte special MP).
 */
export const CTN_INFO: Record<CtnCode, { libelle: string; libelleCourt: string }> = {
  tous: { libelle: 'Tous les CTN (national)', libelleCourt: 'France entière' },
  A: { libelle: 'Industries de la métallurgie', libelleCourt: 'Métallurgie' },
  B: { libelle: 'Industries du BTP', libelleCourt: 'BTP' },
  C: {
    libelle: 'Industries des transports, eau, gaz, électricité, livre',
    libelleCourt: 'Transports / énergie',
  },
  D: {
    libelle: 'Services, commerces et industries de l’alimentation',
    libelleCourt: 'Alimentation / commerce',
  },
  E: {
    libelle: 'Industries de la chimie, caoutchouc, plasturgie',
    libelleCourt: 'Chimie',
  },
  F: {
    libelle: 'Industries du bois, ameublement, papier-carton, textile, vêtement, cuirs et peaux, pierres et terres à feu',
    libelleCourt: 'Bois / textile',
  },
  G: { libelle: 'Commerce non alimentaire', libelleCourt: 'Commerce' },
  H: {
    libelle: 'Activités de services I (banques, assurances, administration, ...)',
    libelleCourt: 'Services I (tertiaire)',
  },
  I: {
    libelle: 'Activités de services II et travail temporaire (santé, action sociale, nettoyage, intérim, ...)',
    libelleCourt: 'Services II (santé / intérim)',
  },
}

/**
 * Ordre conventionnel des CTN (tous + A..I) pour iteration dans les UI.
 */
export const ORDRE_CTN: CtnCode[] = ['tous', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']

/* =============================================================
 * 2. VUES (mode d'exploration)
 * ============================================================= */

/**
 * Vues disponibles dans la console. Chaque vue determine quel ensemble
 * de visualisations s'affiche dans la zone d'analyse.
 */
export const VUES = {
  synthese: {
    id: 'synthese',
    libelle: 'Synthèse',
    description: 'Chiffres clés et répartition des risques',
  },
  demographie: {
    id: 'demographie',
    libelle: 'Démographie',
    description: 'Âge, sexe, qualification, type de lieu',
  },
  causes: {
    id: 'causes',
    libelle: 'Causes',
    description: 'Déviations, agents matériels, activité physique',
  },
  lesions: {
    id: 'lesions',
    libelle: 'Lésions',
    description: 'Siège, nature et modalité des lésions',
  },
  evolution: {
    id: 'evolution',
    libelle: 'Évolution',
    description: 'Tendance sur 10 ans (2015-2024)',
  },
  comparaison: {
    id: 'comparaison',
    libelle: 'Comparaison',
    description: 'Tous les secteurs CTN en parallèle',
  },
  tms: {
    id: 'tms',
    libelle: 'Focus TMS',
    description: 'Troubles musculo-squelettiques en détail',
  },
} as const

export type VueId = keyof typeof VUES
export const ORDRE_VUES: VueId[] = [
  'synthese',
  'demographie',
  'causes',
  'lesions',
  'evolution',
  'comparaison',
  'tms',
]

/* =============================================================
 * 3. INDICATEURS (type de sinistre)
 * ============================================================= */

/**
 * Indicateur principal selectionne (filtre les KPI cards et certaines
 * vues). Le TMS est un sous-ensemble particulier des MP.
 */
export const INDICATEURS = {
  at: { id: 'at', libelle: 'Accidents du travail', libelleCourt: 'AT' },
  tj: { id: 'tj', libelle: 'Accidents de trajet', libelleCourt: 'TJ' },
  mp: { id: 'mp', libelle: 'Maladies professionnelles', libelleCourt: 'MP' },
  tms: { id: 'tms', libelle: 'TMS', libelleCourt: 'TMS' },
} as const

export type IndicateurId = keyof typeof INDICATEURS
export const ORDRE_INDICATEURS: IndicateurId[] = ['at', 'tj', 'mp', 'tms']
