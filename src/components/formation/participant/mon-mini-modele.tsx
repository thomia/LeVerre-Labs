"use client"

/**
 * ParticipantMiniModel - version miniature du modèle complet du verre.
 *
 * Au lieu de redessiner un verre simplifié, on réutilise `DashboardSimplified`
 * (le composant exact qu'on affiche dans l'analyse vidéo) et on le scale avec
 * CSS transform pour tenir dans la mosaïque formateur.
 *
 * Deux modes :
 *   - **Construction (défaut)** : `externalIsPaused=true`. Le verre ne se
 *     remplit PAS — seuls les états visuels (débit, intensité orage, largeur
 *     du verre, vitesse paille) évoluent selon les scores.
 *   - **Animation** : on passe `simulationSpeed` non-null. Le verre se remplit
 *     selon les dynamiques internes du DashboardSimplified, à la vitesse
 *     correspondant au scénario choisi par le participant.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import DashboardSimplified from '@/components/modele/dashboard-simplified'
import type { ElementId } from '@/lib/supabase/types'

interface ParticipantMiniModelProps {
  scores: Partial<Record<ElementId, number>>
  /** Hauteur finale affichée en pixels (défaut 150px) */
  height?: number
  /**
   * Vitesse de simulation en mode animation. Quand non-null, le verre se
   * remplit. La valeur correspond à `externalSimulationSpeed` du
   * DashboardSimplified (cf. `lib/simulation.ts`).
   */
  simulationSpeed?: number | null
  /**
   * Timestamp ISO de démarrage de la simulation. Utilisé pour reset le verre
   * quand on relance une nouvelle simulation (changement de timestamp).
   */
  simulationStartedAt?: string | null
}

// Le DashboardSimplified natif occupe environ 800×700px.
// MAIS le verre (positionné à top-87% + scale-125) déborde d'environ 100px
// sous le conteneur de 700px. On capture donc une hauteur plus large
// pour voir le fond du verre entier.
const NATIVE_WIDTH = 800
const NATIVE_HEIGHT = 820

export function ParticipantMiniModel({
  scores,
  height = 150,
  simulationSpeed = null,
  simulationStartedAt = null,
}: ParticipantMiniModelProps) {
  // Reset le verre à chaque nouvelle simulation. Le DashboardSimplified
  // accepte un `resetTrigger` (numérique qui s'incrémente) — on incrémente
  // un compteur local à chaque changement de simulationStartedAt.
  const [resetTrigger, setResetTrigger] = useState(0)
  const lastStartRef = useRef<string | null>(null)

  useEffect(() => {
    if (simulationStartedAt && simulationStartedAt !== lastStartRef.current) {
      lastStartRef.current = simulationStartedAt
      setResetTrigger((n) => n + 1)
    } else if (!simulationStartedAt) {
      lastStartRef.current = null
    }
  }, [simulationStartedAt])

  const isAnimating = simulationSpeed !== null && simulationSpeed > 0
  // Mappe les scores {verre, robinet,...} vers le format attendu {scoreV, scoreR,...}
  // useMemo pour éviter de recréer l'objet à chaque render (sinon le useEffect
  // interne de DashboardSimplified se redéclenche en boucle).
  const savedScores = useMemo(
    () => ({
      scoreV: scores.verre ?? 0,
      scoreR: scores.robinet ?? 0,
      scoreB: scores.bulle ?? 0,
      scoreO: scores.orage ?? 0,
      scoreP: scores.paille ?? 0,
    }),
    [scores.verre, scores.robinet, scores.bulle, scores.orage, scores.paille]
  )

  // Construction progressive : un élément n'apparaît QUE lorsque le participant
  // a commencé à répondre aux questions de cet élément (= score en BDD).
  // On teste `!== undefined` (et pas `> 0`) pour que même un score de 0 soit
  // visible une fois l'élément abordé.
  const showTap = scores.robinet !== undefined
  const showStraw = scores.paille !== undefined
  const showStorm = scores.orage !== undefined
  const showBubble = scores.bulle !== undefined

  // Calcule le facteur de scale pour atteindre la hauteur cible
  const scale = height / NATIVE_HEIGHT
  const scaledWidth = NATIVE_WIDTH * scale

  return (
    <div
      className="relative mx-auto overflow-hidden"
      style={{
        width: `${scaledWidth}px`,
        height: `${height}px`,
      }}
    >
      <div
        style={{
          width: `${NATIVE_WIDTH}px`,
          height: `${NATIVE_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          // Désactiver toute interaction — c'est un preview, pas un dashboard
          // interactif pour le formateur
          pointerEvents: 'none',
        }}
      >
        <DashboardSimplified
          hideControlPanel
          hideIcons
          externalIsPaused={!isAnimating}
          externalSimulationSpeed={isAnimating ? simulationSpeed ?? undefined : undefined}
          resetTrigger={resetTrigger}
          savedScores={savedScores}
          showTap={showTap}
          showStraw={showStraw}
          showStorm={showStorm}
          showBubble={showBubble}
        />
      </div>
    </div>
  )
}
