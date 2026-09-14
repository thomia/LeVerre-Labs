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
import { computeOverflowSeconds } from '@/lib/indicateur'
import type { ElementId, ParticipantScores } from '@/lib/supabase/types'

interface ParticipantMiniModelProps {
  scores: Partial<Record<ElementId, number>>
  /**
   * Hauteur MAXIMALE en pixels (défaut 150px). La hauteur réellement occupée
   * peut être plus faible : le modèle est recadré sur les éléments affichés et
   * son échelle est aussi limitée par la largeur disponible.
   */
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
  /**
   * Mode déterministe (formateur) : temps écoulé de simulation en ms. Quand
   * fourni (non-null), le remplissage est calculé analytiquement à partir des
   * scores et de ce temps — identique pour toutes les instances (mosaïque ET
   * modale focus), et figé si le temps ne change plus (pause). `null` = verre en
   * construction (pas de simulation).
   */
  simulationElapsedMs?: number | null
}

// Le DashboardSimplified natif occupe environ 800×700px.
// MAIS le verre (positionné à top-87% + scale-125) déborde d'environ 100px
// sous le conteneur de 700px. On capture donc une hauteur plus large
// pour voir le fond du verre entier.
const NATIVE_WIDTH = 800
const NATIVE_HEIGHT = 820

/**
 * Zone réellement occupée par chaque élément dans le repère natif (800×820),
 * relevée sur le DashboardSimplified rendu (positions `top-[87%]`, `top-[35%]`,
 * `top-[53%]`, `top-[-230px]`, bulle de 700px…).
 *
 * `demiLargeur` = écart maximal au centre horizontal (400) : on garde un cadre
 * symétrique pour que le modèle reste centré.
 *
 * Sans ce recadrage, on réservait toujours 820px de haut alors que le verre
 * seul n'en occupe que 375 — plus de la moitié de la place était du vide, ce
 * qui écrasait le questionnaire sur mobile.
 */
const ZONE_ELEMENT: Record<ElementId, { haut: number; bas: number; demiLargeur: number }> = {
  verre: { haut: 415, bas: 800, demiLargeur: 130 },
  robinet: { haut: 238, bas: 800, demiLargeur: 110 },
  orage: { haut: 358, bas: 800, demiLargeur: 80 },
  paille: { haut: 126, bas: 800, demiLargeur: 135 },
  bulle: { haut: 133, bas: 845, demiLargeur: 355 },
}

interface CadreModele {
  haut: number
  gauche: number
  largeur: number
  hauteur: number
}

/**
 * Cadre englobant les éléments visibles. Le verre est toujours affiché, il sert
 * de socle au cadre.
 */
function calculeCadre(elementsVisibles: ElementId[]): CadreModele {
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

export function ParticipantMiniModel({
  scores,
  height = 150,
  simulationSpeed = null,
  simulationStartedAt = null,
  simulationElapsedMs = null,
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

  // Mode déterministe (formateur) : le remplissage est une fonction du temps
  // écoulé et des scores. Le verre atteint 100 % pile au « temps avant
  // débordement ». Résultat identique pour toutes les instances → la modale
  // focus affiche exactement le même niveau que la carte, y compris en pause.
  const isDeterministic = simulationElapsedMs !== null
  const deterministicFill = useMemo(() => {
    if (simulationElapsedMs === null) return undefined
    const overflow = computeOverflowSeconds(scores as ParticipantScores)
    if (overflow === null || overflow <= 0) return 0
    const elapsedSec = simulationElapsedMs / 1000
    return Math.max(0, Math.min(100, (elapsedSec / overflow) * 100))
  }, [simulationElapsedMs, scores])
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

  // Recadrage sur les seuls éléments affichés : le verre seul tient dans 375px
  // de haut, pas 820. À hauteur égale, le modèle apparaît donc bien plus grand.
  const cadre = useMemo(() => {
    const visibles: ElementId[] = []
    if (showTap) visibles.push('robinet')
    if (showStorm) visibles.push('orage')
    if (showStraw) visibles.push('paille')
    if (showBubble) visibles.push('bulle')
    return calculeCadre(visibles)
  }, [showTap, showStorm, showStraw, showBubble])

  // Largeur réellement disponible : sans elle, un modèle recadré déborderait
  // latéralement de l'écran sur mobile.
  const conteneurRef = useRef<HTMLDivElement>(null)
  const [largeurDisponible, setLargeurDisponible] = useState<number | null>(null)

  useEffect(() => {
    const noeud = conteneurRef.current
    if (!noeud) return
    const observateur = new ResizeObserver(([entree]) => {
      setLargeurDisponible(entree.contentRect.width)
    })
    observateur.observe(noeud)
    return () => observateur.disconnect()
  }, [])

  const scale = Math.min(
    height / cadre.hauteur,
    largeurDisponible ? largeurDisponible / cadre.largeur : Infinity
  )

  return (
    <div ref={conteneurRef} className="w-full">
      <div
        className="relative mx-auto overflow-hidden"
        style={{
          width: `${cadre.largeur * scale}px`,
          height: `${cadre.hauteur * scale}px`,
        }}
      >
        <div
          style={{
            width: `${NATIVE_WIDTH}px`,
            height: `${NATIVE_HEIGHT}px`,
            transform: `translate(${-cadre.gauche * scale}px, ${-cadre.haut * scale}px) scale(${scale})`,
            transformOrigin: 'top left',
            // Désactiver toute interaction — c'est un preview, pas un dashboard
            // interactif pour le formateur
            pointerEvents: 'none',
          }}
        >
          <DashboardSimplified
            hideControlPanel
            hideIcons
            externalIsPaused={isDeterministic ? true : !isAnimating}
            externalSimulationSpeed={isAnimating ? simulationSpeed ?? undefined : undefined}
            externalFillLevel={deterministicFill}
            resetTrigger={resetTrigger}
            savedScores={savedScores}
            showTap={showTap}
            showStraw={showStraw}
            showStorm={showStorm}
            showBubble={showBubble}
          />
        </div>
      </div>
    </div>
  )
}
