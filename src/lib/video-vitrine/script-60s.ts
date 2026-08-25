/**
 * Timeline de l'essai 60 s.
 * Peu de phrases. Le modèle porte l'explication.
 */

export const DUREE_VIDEO_MS = 60_000

export interface LegendeVideo {
  fromMs: number
  toMs: number
  texte: string
}

export interface CleModele {
  atMs: number
  fill: number
  flowRate: number
  environment: number
  storm: number
  straw: number
  highlight: 'none' | 'glass' | 'tap' | 'bubble' | 'storm' | 'straw'
}

export interface VerreSalle {
  remplissage: number
}

export const LEGENDES: LegendeVideo[] = [
  {
    fromMs: 600,
    toMs: 7_000,
    texte: '88 % des maladies professionnelles viennent du geste au travail.',
  },
  {
    fromMs: 7_800,
    toMs: 13_000,
    texte: 'Personne ne voit le risque s’accumuler.',
  },
  {
    fromMs: 28_000,
    toMs: 36_000,
    texte: 'Quand ça déborde : accident, ou TMS.',
  },
  {
    fromMs: 39_000,
    toMs: 47_000,
    texte: 'En session, chacun voit le sien.',
  },
  {
    fromMs: 50_500,
    toMs: 56_000,
    texte: 'Aujourd’hui : sensibiliser une équipe.',
  },
]

export const CLES_MODELE: CleModele[] = [
  {
    atMs: 0,
    fill: 12,
    flowRate: 32,
    environment: 22,
    storm: 10,
    straw: 48,
    highlight: 'none',
  },
  {
    atMs: 13_500,
    fill: 18,
    flowRate: 42,
    environment: 28,
    storm: 14,
    straw: 46,
    highlight: 'glass',
  },
  {
    atMs: 17_000,
    fill: 34,
    flowRate: 76,
    environment: 34,
    storm: 16,
    straw: 40,
    highlight: 'tap',
  },
  {
    atMs: 20_000,
    fill: 48,
    flowRate: 76,
    environment: 80,
    storm: 20,
    straw: 38,
    highlight: 'bubble',
  },
  {
    atMs: 23_000,
    fill: 66,
    flowRate: 80,
    environment: 80,
    storm: 86,
    straw: 30,
    highlight: 'storm',
  },
  {
    atMs: 25_500,
    fill: 58,
    flowRate: 80,
    environment: 80,
    storm: 86,
    straw: 74,
    highlight: 'straw',
  },
  {
    atMs: 30_000,
    fill: 92,
    flowRate: 86,
    environment: 82,
    storm: 88,
    straw: 16,
    highlight: 'none',
  },
  {
    atMs: 35_000,
    fill: 54,
    flowRate: 44,
    environment: 32,
    storm: 22,
    straw: 84,
    highlight: 'none',
  },
  {
    atMs: 38_000,
    fill: 36,
    flowRate: 36,
    environment: 26,
    storm: 14,
    straw: 86,
    highlight: 'none',
  },
]

/** Niveaux seulement. Pas de prénoms, pas de métiers. */
export const VERRES_SALLE: VerreSalle[] = [
  { remplissage: 82 },
  { remplissage: 68 },
  { remplissage: 91 },
  { remplissage: 44 },
  { remplissage: 74 },
  { remplissage: 55 },
]

export function interpolerNombre(debut: number, fin: number, t: number): number {
  return debut + (fin - debut) * t
}

export function etatModeleA(ms: number): CleModele {
  const premier = CLES_MODELE[0]
  const dernier = CLES_MODELE[CLES_MODELE.length - 1]
  if (!premier || !dernier) {
    return {
      atMs: ms,
      fill: 0,
      flowRate: 0,
      environment: 0,
      storm: 0,
      straw: 0,
      highlight: 'none',
    }
  }
  if (ms <= premier.atMs) return premier
  if (ms >= dernier.atMs) return dernier

  const indexSuivant = CLES_MODELE.findIndex((cle) => cle.atMs > ms)
  const precedent = CLES_MODELE[indexSuivant - 1] ?? premier
  const suivant = CLES_MODELE[indexSuivant] ?? dernier
  const t = (ms - precedent.atMs) / Math.max(1, suivant.atMs - precedent.atMs)

  return {
    atMs: ms,
    fill: interpolerNombre(precedent.fill, suivant.fill, t),
    flowRate: interpolerNombre(precedent.flowRate, suivant.flowRate, t),
    environment: interpolerNombre(precedent.environment, suivant.environment, t),
    storm: interpolerNombre(precedent.storm, suivant.storm, t),
    straw: interpolerNombre(precedent.straw, suivant.straw, t),
    highlight: t < 0.4 ? precedent.highlight : suivant.highlight,
  }
}

export function legendeA(ms: number): string {
  const legende = LEGENDES.find((item) => ms >= item.fromMs && ms < item.toMs)
  return legende?.texte ?? ''
}

export function visuelA(ms: number): 'accroche' | 'modele' | 'salle' | 'offre' {
  if (ms < 8_000) return 'accroche'
  if (ms < 38_000) return 'modele'
  if (ms < 49_500) return 'salle'
  return 'offre'
}
