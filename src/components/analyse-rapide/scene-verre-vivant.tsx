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
import { NATIVE_HEIGHT, NATIVE_WIDTH, calculeCadre } from '@/lib/modele/cadrage-modele'
import type { ScoresMoment } from '@/lib/analyse-rapide'

interface SceneVerreVivantProps {
  scores: ScoresMoment
  /** Niveau du verre 0-100, calculé à partir du temps vidéo. */
  niveau: number
}

/**
 * Cadre volontairement serré sur le verre, le robinet, la paille et l'orage :
 * la Bulle est un halo de 710 px de large qui, à l'échelle d'une colonne
 * d'écran, écraserait le verre à la taille d'un timbre. On la laisse déborder
 * du cadre — ses particules font un fond de scène — pour garder un verre assez
 * grand pour qu'on voie l'eau monter à l'image.
 */
const CADRE = calculeCadre(['robinet', 'orage', 'paille'])

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

  const echelle = taille
    ? Math.min(taille.largeur / CADRE.largeur, taille.hauteur / CADRE.hauteur)
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
            height: `${NATIVE_HEIGHT}px`,
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
