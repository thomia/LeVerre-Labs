/**
 * Cadrage du modèle complet (`DashboardSimplified`) pour l'afficher à l'échelle
 * dans un conteneur plus petit.
 *
 * Le dashboard natif occupe environ 800×700 px, mais le verre (positionné à
 * `top-87%` + `scale-125`) déborde d'environ 100 px sous le conteneur : on
 * capture donc 820 px de haut pour voir le fond du verre entier.
 *
 * `ZONE_ELEMENT` relève la zone réellement occupée par chaque élément dans ce
 * repère natif. Sans ce recadrage, on réserve toujours 820 px de haut alors que
 * le verre seul n'en occupe que 375 — plus de la moitié de la place serait du
 * vide.
 */

import type { ElementId } from '@/lib/supabase/types'

export const NATIVE_WIDTH = 800
export const NATIVE_HEIGHT = 820

/** `demiLargeur` = écart maximal au centre horizontal (400), pour rester centré. */
export const ZONE_ELEMENT: Record<ElementId, { haut: number; bas: number; demiLargeur: number }> = {
  verre: { haut: 415, bas: 800, demiLargeur: 130 },
  robinet: { haut: 238, bas: 800, demiLargeur: 110 },
  orage: { haut: 358, bas: 800, demiLargeur: 80 },
  paille: { haut: 126, bas: 800, demiLargeur: 135 },
  bulle: { haut: 133, bas: 845, demiLargeur: 355 },
}

export interface CadreModele {
  haut: number
  gauche: number
  largeur: number
  hauteur: number
}

/**
 * Cadre englobant les éléments visibles. Le verre est toujours affiché, il sert
 * de socle au cadre.
 */
export function calculeCadre(elementsVisibles: ElementId[]): CadreModele {
  const zones = [ZONE_ELEMENT.verre, ...elementsVisibles.map((el) => ZONE_ELEMENT[el])]

  const haut = Math.min(...zones.map((z) => z.haut))
  const bas = Math.max(...zones.map((z) => z.bas))
  const demiLargeur = Math.max(...zones.map((z) => z.demiLargeur))

  return {
    haut,
    gauche: NATIVE_WIDTH / 2 - demiLargeur,
    largeur: demiLargeur * 2,
    hauteur: bas - haut,
  }
}
