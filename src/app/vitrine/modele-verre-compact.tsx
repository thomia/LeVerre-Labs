/**
 * MODÈLE DU VERRE — VERSION COMPACTE, DÉCORATIVE
 * Destiné au premier écran de l'accueil.
 *
 * Reprend l'assemblage des cinq éléments de la démonstration interactive, mais
 * figé et mis à l'échelle : ici le modèle n'est pas manipulable, il sert
 * d'image de marque. La version cliquable reste plus bas dans la page.
 *
 * `pointer-events-none` et `aria-hidden` : rien à cliquer, rien à annoncer aux
 * lecteurs d'écran, le sens est porté par le texte à côté.
 */

'use client'

import TapComponent from '@/components/modele/tap-component'
import GlassComponent from '@/components/modele/glass-component'
import StrawComponent from '@/components/modele/straw-component'
import StormComponent from '@/components/modele/storm-component'
import BubbleComponent from '@/components/modele/bubble-component'

interface ModeleVerreCompactProps {
  /** Facteur d'échelle appliqué à l'assemblage d'origine (800 × 700 px). */
  echelle?: number
}

export function ModeleVerreCompact({ echelle = 0.62 }: ModeleVerreCompactProps) {
  // Hauteur relevée sur le rendu réel : l'assemblage descend plus bas que la
  // zone de mise en page des cinq éléments (le verre agrandi dépasse).
  const LARGEUR_ORIGINE = 800
  const HAUTEUR_ORIGINE = 830

  return (
    <div
      aria-hidden
      className="pointer-events-none select-none"
      style={{
        width: LARGEUR_ORIGINE * echelle,
        height: HAUTEUR_ORIGINE * echelle,
      }}
    >
      <div
        style={{
          width: LARGEUR_ORIGINE,
          height: HAUTEUR_ORIGINE,
          transform: `scale(${echelle})`,
          transformOrigin: 'top left',
        }}
      >
        <div
          className="relative flex flex-col items-center justify-center"
          style={{ height: 720 }}
        >
          {/* Bulle : l'environnement qui englobe toute la situation. */}
          <div
            className="absolute left-1/2 z-0"
            style={{ top: '53%', transform: 'translate(-50%, -50%)' }}
          >
            <div className="h-[700px] w-[700px] overflow-hidden rounded-full border-2 border-purple-400/40 bg-transparent shadow-[0_0_20px_rgba(168,85,247,0.15)]">
              <BubbleComponent environmentScore={55} isPaused={false} />
            </div>
          </div>

          <div className="relative z-20 mt-[220px]">
            <TapComponent flowRate={60} onFlowRateChange={() => {}} hideDebitLabel />
          </div>

          <div className="relative z-20 mb-[30px] ml-[-120px] mt-[-180px] scale-110">
            <StormComponent intensity={40} onIntensityChange={() => {}} hideIntensityLabel />
          </div>

          <div className="relative z-10 mt-[-20px] scale-125">
            <div className="relative">
              <GlassComponent fillLevel={45} absorptionRate={50} width={55} />
              <div className="absolute right-[-5px] top-[-230px] z-20">
                <StrawComponent
                  absorptionRate={50}
                  setAbsorptionRate={() => {}}
                  isInsideGlass
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
