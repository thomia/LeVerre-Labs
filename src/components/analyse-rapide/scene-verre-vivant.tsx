"use client"

/**
 * Scène du modèle pendant la lecture vidéo.
 *
 * Réutilise tel quel `DashboardSimplified` (donc GlassComponent, TapComponent,
 * StrawComponent, StormComponent et les particules de la Bulle), en mode
 * piloté : le niveau d'eau vient de la physique de l'analyse rapide
 * (`niveauAuTemps`) et non de la boucle interne du dashboard. Les animations
 * des éléments, elles, continuent de tourner même vidéo en pause — c'est ce qui
 * rend la démonstration vivante quand on commente un curseur à l'écran.
 *
 * Le composant se met à l'échelle du conteneur qu'on lui donne : il occupe
 * toute la place disponible sans jamais déborder.
 */

import { memo, useEffect, useMemo, useRef, useState } from 'react'
import DashboardSimplified from '@/components/modele/dashboard-simplified'
import { NATIVE_WIDTH } from '@/lib/modele/cadrage-modele'
import type { ScoresMoment } from '@/lib/analyse-rapide'

interface SceneVerreVivantProps {
  scores: ScoresMoment
  /** Niveau du verre 0-100, calculé à partir du temps vidéo. */
  niveau: number
}

/**
 * On cadre le dashboard en entier, avec une marge en bas : le verre est mis à
 * l'échelle (scale 125) et son fond dépasse le bloc de 700 px. Un cadre plus
 * serré coupait le robinet ou le pied du verre.
 */
const CADRE = { haut: 0, gauche: 0, largeur: NATIVE_WIDTH, hauteur: 980 }

export const SceneVerreVivant = memo(function SceneVerreVivant({ scores, niveau }: SceneVerreVivantProps) {
  const conteneurRef = useRef<HTMLDivElement>(null)
  const [taille, setTaille] = useState<{ largeur: number; hauteur: number } | null>(null)

  useEffect(() => {
    const noeud = conteneurRef.current
    if (!noeud) return

    const observateur = new ResizeObserver(([entree]) => {
      setTaille({ largeur: entree.contentRect.width, hauteur: entree.contentRect.height })
    })
    observateur.observe(noeud)

    return () => observateur.disconnect()
  }, [])

  const savedScores = useMemo(
    () => ({
      scoreV: scores.verre,
      scoreR: scores.robinet,
      scoreB: scores.bulle,
      scoreO: scores.orage,
      scoreP: scores.paille,
    }),
    [scores.verre, scores.robinet, scores.bulle, scores.orage, scores.paille]
  )

  // 0,9 : les éléments (verre à l'échelle, bulle) dépassent légèrement leur
  // boîte. La marge garantit que rien n'est coupé par le cadre.
  const echelle = taille
    ? Math.min(taille.largeur / CADRE.largeur, taille.hauteur / CADRE.hauteur) * 0.9
    : 0

  return (
    <div ref={conteneurRef} className="flex h-full w-full items-center justify-center overflow-hidden">
      <div
        className="relative overflow-hidden"
        style={{ width: `${CADRE.largeur * echelle}px`, height: `${CADRE.hauteur * echelle}px` }}
      >
        <div
          style={{
            width: `${NATIVE_WIDTH}px`,
            height: `${CADRE.hauteur}px`,
            transform: `translate(${-CADRE.gauche * echelle}px, ${-CADRE.haut * echelle}px) scale(${echelle})`,
            transformOrigin: 'top left',
            pointerEvents: 'none',
          }}
        >
          <DashboardSimplified
            hideControlPanel
            hideIcons
            externalIsPaused={false}
            externalFillLevel={niveau}
            savedScores={savedScores}
          />
        </div>
      </div>
    </div>
  )
})
