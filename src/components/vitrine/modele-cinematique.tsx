/**
 * Le modèle réel, cadré pour un 16:9.
 * Un élément s'éclaire, les autres s'effacent — sans animation tape-à-l'œil.
 */

'use client'

import TapComponent from '@/components/modele/tap-component'
import GlassComponent from '@/components/modele/glass-component'
import StrawComponent from '@/components/modele/straw-component'
import StormComponent from '@/components/modele/storm-component'
import BubbleComponent from '@/components/modele/bubble-component'
import type { CleModele } from '@/lib/video-vitrine/script-60s'
import { cn } from '@/lib/utils'

interface ModeleCinematiqueProps {
  etat: CleModele
}

export function ModeleCinematique({ etat }: ModeleCinematiqueProps) {
  return (
    <div className="pointer-events-none relative mx-auto h-[420px] w-full max-w-[520px] sm:h-[480px]">
      <div
        className="absolute left-1/2 top-[8%] z-0 h-[340px] w-[340px] -translate-x-1/2 overflow-hidden rounded-full sm:h-[400px] sm:w-[400px]"
        style={{ opacity: opacite(etat.highlight, 'bubble') }}
      >
        <BubbleComponent environmentScore={etat.environment} isPaused={false} />
      </div>

      <div
        className="absolute left-1/2 top-0 z-20 -translate-x-1/2 scale-[0.42] sm:scale-[0.48]"
        style={{ opacity: opacite(etat.highlight, 'tap') }}
      >
        <TapComponent
          flowRate={etat.flowRate}
          onFlowRateChange={() => {}}
          hideDebitLabel
        />
      </div>

      <div
        className="absolute left-[18%] top-[18%] z-20 scale-[0.7] sm:left-[22%]"
        style={{ opacity: opacite(etat.highlight, 'storm') }}
      >
        <StormComponent
          intensity={etat.storm}
          onIntensityChange={() => {}}
          hideIntensityLabel
        />
      </div>

      <div
        className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 scale-90 sm:scale-100"
        style={{ opacity: opacite(etat.highlight, 'glass') }}
      >
        <GlassComponent
          fillLevel={etat.fill}
          absorptionRate={etat.straw}
          width={52}
          hideColorLegend
        />
        <div
          className="absolute -right-1 -top-[210px] z-20"
          style={{ opacity: opacite(etat.highlight, 'straw') }}
        >
          <StrawComponent
            absorptionRate={etat.straw}
            setAbsorptionRate={() => {}}
            isInsideGlass
          />
        </div>
      </div>
    </div>
  )
}

function opacite(
  highlight: CleModele['highlight'],
  element: Exclude<CleModele['highlight'], 'none'>
): number {
  if (highlight === 'none') return 1
  return highlight === element ? 1 : 0.22
}

export function VerreSilhouette({
  remplissage,
  className,
}: {
  remplissage: number
  className?: string
}) {
  const teinte =
    remplissage >= 90
      ? 'from-purple-400/70 to-purple-700/70'
      : remplissage >= 80
        ? 'from-red-400/70 to-red-700/70'
        : remplissage >= 60
          ? 'from-yellow-400/70 to-amber-600/70'
          : 'from-emerald-400/70 to-emerald-700/70'

  return (
    <div
      className={cn(
        'relative h-28 w-14 overflow-hidden rounded-b-lg border-x border-b border-white/35 bg-black/30 sm:h-36 sm:w-[4.5rem]',
        className
      )}
    >
      <div
        className={cn('absolute bottom-0 left-0 w-full bg-gradient-to-t', teinte)}
        style={{ height: `${remplissage}%` }}
      />
    </div>
  )
}
