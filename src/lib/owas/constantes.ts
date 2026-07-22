/**
 * Libellés (français) et couleurs de risque du moteur OWAS.
 *
 * Les libellés reprennent la terminologie OWAS standard. Les couleurs
 * suivent le code feu de signalisation classique des catégories d'action :
 * vert (AC1) → rouge (AC4).
 */

import type {
  CodeDos,
  CodeBras,
  CodeJambes,
  CodeCharge,
  CategorieAction,
} from './types'

export const LIBELLES_DOS: Record<CodeDos, string> = {
  1: 'Droit',
  2: 'Penché en avant / arrière',
  3: 'En torsion',
  4: 'Penché et en torsion',
}

export const LIBELLES_BRAS: Record<CodeBras, string> = {
  1: 'Les deux sous le niveau des épaules',
  2: 'Un au niveau ou au-dessus des épaules',
  3: 'Les deux au niveau ou au-dessus',
}

export const LIBELLES_JAMBES: Record<CodeJambes, string> = {
  1: 'Assis',
  2: 'Debout, deux jambes tendues',
  3: 'Debout sur une jambe tendue',
  4: 'Debout ou accroupi, deux genoux fléchis',
  5: 'Debout ou accroupi, un genou fléchi',
  6: 'À genoux',
  7: 'En marche / déplacement',
}

export const LIBELLES_CHARGE: Record<CodeCharge, string> = {
  1: '≤ 10 kg',
  2: '10 – 20 kg',
  3: '> 20 kg',
}

interface InfoCategorieAction {
  /** Intitulé court de la catégorie. */
  libelle: string
  /** Action corrective recommandée. */
  action: string
  /** Couleur hex (code feu : vert → rouge). */
  couleur: string
}

export const INFO_CATEGORIE_ACTION: Record<CategorieAction, InfoCategorieAction> = {
  1: {
    libelle: 'AC1 — Posture normale',
    action: 'Aucune action nécessaire.',
    couleur: '#22c55e', // vert
  },
  2: {
    libelle: 'AC2 — Risque léger',
    action: 'Action corrective dans un avenir proche.',
    couleur: '#eab308', // jaune
  },
  3: {
    libelle: 'AC3 — Risque marqué',
    action: 'Action corrective dès que possible.',
    couleur: '#f97316', // orange
  },
  4: {
    libelle: 'AC4 — Risque sévère',
    action: 'Action corrective immédiate.',
    couleur: '#ef4444', // rouge
  },
}
