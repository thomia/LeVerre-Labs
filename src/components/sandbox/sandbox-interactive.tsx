/**
 * SANDBOX INTERACTIVE - BAC À SABLE PUBLIC
 * Permet au grand public d'interagir avec le modèle du verre
 * Version simplifiée focalisée sur l'exploration et l'expérimentation
 */

'use client'

import { useState, useEffect } from 'react'
import { RotateCcw, Play, Pause, Clock, FastForward } from 'lucide-react'
import NumberFlow from '@number-flow/react'
import * as RadixSlider from '@radix-ui/react-slider'
import TapComponent from '@/components/dashboard/tap-component'
import GlassComponent from '@/components/dashboard/glass-component'
import StrawComponent from '@/components/dashboard/straw-component'
import StormComponent from '@/components/dashboard/storm-component'
import { EnvironmentParticles } from '@/components/dashboard/bubble-component'

interface CompactSliderProps {
  labelLeft: string
  labelRight: string
  description: string
  value: number
  valueColorClassName: string
  rangeClassName: string
  thumbClassName: string
  onValueChange: (value: number) => void
}

function CompactSlider({
  labelLeft,
  labelRight,
  description,
  value,
  valueColorClassName,
  rangeClassName,
  thumbClassName,
  onValueChange,
}: CompactSliderProps) {
  return (
    <div className="grid grid-cols-1 gap-1">
      <div className="flex items-center justify-center gap-2">
        <span className={"text-[clamp(0.875rem,3vw,1rem)] font-medium " + valueColorClassName}>{labelLeft}</span>
        <span className={"text-[clamp(0.875rem,3vw,1rem)] font-medium " + valueColorClassName}>-</span>
        <span className={"text-[clamp(0.875rem,3vw,1rem)] font-normal " + valueColorClassName}>{description}</span>
      </div>

      <div className="relative">
        <RadixSlider.Root
          value={[value]}
          min={0}
          max={100}
          step={1}
          onValueChange={(values) => onValueChange(values[0] ?? 0)}
          className="relative flex h-14 w-full touch-none select-none items-center"
        >
          <RadixSlider.Track className="relative h-1.5 grow rounded-full bg-white/10">
            <RadixSlider.Range className={"absolute h-full rounded-full " + rangeClassName} />
          </RadixSlider.Track>
          <RadixSlider.Thumb
            className={"relative block h-11 w-11 rounded-full bg-white shadow-md ring " + thumbClassName}
            aria-label={labelLeft}
          >
            <NumberFlow
              willChange
              value={value}
              isolate
              opacityTiming={{
                duration: 250,
                easing: 'ease-out'
              }}
              transformTiming={{
                easing: `linear(0, 0.0033 0.8%, 0.0263 2.39%, 0.0896 4.77%, 0.4676 15.12%, 0.5688, 0.6553, 0.7274, 0.7862, 0.8336 31.04%, 0.8793, 0.9132 38.99%, 0.9421 43.77%, 0.9642 49.34%, 0.9796 55.71%, 0.9893 62.87%, 0.9952 71.62%, 0.9983 82.76%, 0.9996 99.47%)`,
                duration: 500
              }}
              className={
                value >= 95
                  ? `absolute left-1/2 -translate-x-1/2 -top-10 text-xl font-bold tabular-nums whitespace-nowrap ${valueColorClassName}`
                  : `absolute left-[3.5rem] top-[85%] -translate-y-1/2 text-xl font-bold tabular-nums whitespace-nowrap ${valueColorClassName}`
              }
            />
          </RadixSlider.Thumb>
        </RadixSlider.Root>
      </div>
    </div>
  )
}

// Composant pour les sliders
function SlidersPanel({ 
  savedScores, 
  setSavedScores 
}: {
  savedScores: {
    scoreV: number
    scoreR: number
    scoreB: number
    scoreO: number
    scoreP: number
  }
  setSavedScores: (scores: any) => void
}) {
  return (
    <div className="grid grid-cols-1 gap-1">
      {/* Score V - Verre */}
      <div className="rounded-lg bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-400/20 px-2 py-0.5">
        <CompactSlider
          labelLeft="Score V"
          labelRight="Largeur du verre"
          description="Capacité physiologique et psychologique propre à chacun"
          value={savedScores.scoreV}
          valueColorClassName="text-gray-300"
          rangeClassName="bg-[rgb(209_213_219)]"
          thumbClassName="ring-[rgb(209_213_219_/_0.25)]"
          onValueChange={(nextValue) => setSavedScores({ ...savedScores, scoreV: nextValue })}
        />
      </div>

      {/* Score R - Robinet */}
      <div className="rounded-lg bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-400/20 px-2 py-0.5">
        <CompactSlider
          labelLeft="Score R"
          labelRight="Débit du robinet"
          description="Sollicitations physiques et mentales du travail"
          value={savedScores.scoreR}
          valueColorClassName="text-blue-400"
          rangeClassName="bg-[rgb(96_165_250)]"
          thumbClassName="ring-[rgb(96_165_250_/_0.25)]"
          onValueChange={(nextValue) => setSavedScores({ ...savedScores, scoreR: nextValue })}
        />
      </div>

      {/* Score B - Bulle */}
      <div className="rounded-lg bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-400/20 px-2 py-0.5">
        <CompactSlider
          labelLeft="Score B"
          labelRight="Influence de l'environnement"
          description="L'environnement module le coût biologique de l'activité"
          value={savedScores.scoreB}
          valueColorClassName="text-purple-400"
          rangeClassName="bg-[rgb(192_132_252)]"
          thumbClassName="ring-[rgb(192_132_252_/_0.25)]"
          onValueChange={(nextValue) => setSavedScores({ ...savedScores, scoreB: nextValue })}
        />
      </div>

      {/* Score O - Orage */}
      <div className="rounded-lg bg-gradient-to-br from-amber-900/20 to-amber-800/10 border border-amber-400/20 px-2 py-0.5">
        <CompactSlider
          labelLeft="Score O"
          labelRight="Intensité de la pluie"
          description="Imprévus mobilisant des ressources additionnelles"
          value={savedScores.scoreO}
          valueColorClassName="text-amber-400"
          rangeClassName="bg-[rgb(251_191_36)]"
          thumbClassName="ring-[rgb(251_191_36_/_0.25)]"
          onValueChange={(nextValue) => setSavedScores({ ...savedScores, scoreO: nextValue })}
        />
      </div>

      {/* Score P - Paille */}
      <div className="rounded-lg bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-400/20 px-2 py-0.5">
        <CompactSlider
          labelLeft="Score P"
          labelRight="Vitesse d'aspiration"
          description="Stratégies individuelles et organisationnelles"
          value={savedScores.scoreP}
          valueColorClassName="text-green-400"
          rangeClassName="bg-[rgb(74_222_128)]"
          thumbClassName="ring-[rgb(74_222_128_/_0.25)]"
          onValueChange={(nextValue) => setSavedScores({ ...savedScores, scoreP: nextValue })}
        />
      </div>
    </div>
  )
}

// Composant pour la visualisation 3D
function ModelVisualization({
  savedScores,
  isPaused,
  simulationSpeed,
  resetTrigger,
  onReset,
  onPauseToggle
}: {
  savedScores: {
    scoreV: number
    scoreR: number
    scoreB: number
    scoreO: number
    scoreP: number
  }
  isPaused: boolean
  simulationSpeed: number
  resetTrigger: number
  onReset: () => void
  onPauseToggle: () => void
}) {
  const [fillLevel, setFillLevel] = useState(0)
  const [glassWidth, setGlassWidth] = useState(20)

  // Calculer le niveau de remplissage
  useEffect(() => {
    if (resetTrigger > 0) {
      setFillLevel(0)
    }
  }, [resetTrigger])

  useEffect(() => {
    const newWidth = 5 + (savedScores.scoreV / 100) * 55
    setGlassWidth(newWidth)
  }, [savedScores.scoreV])

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setFillLevel(prev => {
        // Entrée d'eau (Robinet)
        const inflow = (savedScores.scoreR / 100) * 0.5 * simulationSpeed
        
        // Sortie d'eau (Paille)
        const outflow = (savedScores.scoreP / 100) * 0.3 * simulationSpeed
        
        // Facteur environnemental (Bulle)
        const environmentFactor = 1 + (savedScores.scoreB / 200)
        
        // Impact des aléas (Orage)
        const stormImpact = 1 + (savedScores.scoreO / 150)
        
        // Facteur capacité (Verre) - un verre plus large se remplit plus lentement
        const capacityFactor = 1.5 - (savedScores.scoreV / 100)
        
        // Calcul net avec impact de la capacité
        const netChange = ((inflow * environmentFactor * stormImpact) - outflow) * capacityFactor
        
        // Nouveau niveau (0-100)
        return Math.max(0, Math.min(100, prev + netChange))
      })
    }, 50)

    return () => clearInterval(interval)
  }, [savedScores, isPaused, simulationSpeed])

  return (
    <div className="relative w-full h-full min-h-0 flex items-center justify-center overflow-visible">
      {/* Boutons Reset et Pause - Au-dessus du modèle */}
      <div className="absolute left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2" style={{ top: 'calc(10rem + 1rem)' }}>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgb(255,30,90)] hover:bg-[rgb(255,30,90)]/80 text-white transition-all shadow-lg hover:shadow-xl"
        >
          <RotateCcw className="h-5 w-5" />
          <span className="text-sm font-semibold">Reset</span>
        </button>
        
        <button
          onClick={onPauseToggle}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgb(255,30,90)] hover:bg-[rgb(255,30,90)]/80 text-white transition-all shadow-lg hover:shadow-xl"
        >
          {isPaused ? (
            <>
              <Play className="h-5 w-5" />
              <span className="text-sm font-semibold">Play</span>
            </>
          ) : (
            <>
              <Pause className="h-5 w-5" />
              <span className="text-sm font-semibold">Pause</span>
            </>
          )}
        </button>
      </div>
      
      <div className="sandbox-model-canvas relative">
        <div className="sandbox-model-canvas-inner relative">
          {/* Bulle environnementale */}
          <div className="bubble-container absolute left-1/2 top-[70%] transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full overflow-hidden border-2 border-purple-400/40 bg-transparent shadow-[0_0_20px_rgba(168,85,247,0.15)] z-0">
            <EnvironmentParticles 
              score={savedScores.scoreB} 
              isPaused={isPaused}
            />
          </div>
          
          {/* Structure centrale */}
          <div className="relative h-[700px]">
            {/* Verre avec paille */}
            <div className="glass-container absolute left-1/2 top-[87%] transform -translate-x-1/2 -translate-y-1/2 scale-125 z-10">
              <div className="relative">
                <GlassComponent 
                  fillLevel={fillLevel} 
                  absorptionRate={savedScores.scoreP}
                  width={glassWidth}
                />
                
                {/* Paille */}
                <div className="straw-container absolute top-[-230px] right-[-5px] z-20">
                  <StrawComponent 
                    absorptionRate={savedScores.scoreP} 
                    setAbsorptionRate={() => {}}
                    isInsideGlass={true}
                    isPaused={isPaused}
                  />
                </div>
              </div>
            </div>
            
            {/* Robinet */}
            <div className="tap-container absolute left-1/2 top-[35%] transform -translate-x-1/2 z-20">
              <TapComponent 
                flowRate={savedScores.scoreR} 
                onFlowRateChange={() => {}}
                hideDebitLabel={true}
              />
            </div>
            
            {/* Orage */}
            <div className="storm-container absolute left-[45%] top-[53%] transform -translate-x-1/2 scale-110 z-20">
              <StormComponent 
                intensity={savedScores.scoreO} 
                onIntensityChange={() => {}}
                hideIntensityLabel={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SandboxInteractive() {
  // États des scores
  const [savedScores, setSavedScores] = useState({
    scoreV: 50,  // Largeur du verre (capacité)
    scoreR: 40,  // Robinet (travail)
    scoreB: 30,  // Bulle (environnement)
    scoreO: 20,  // Orage (aléas)
    scoreP: 25   // Paille (récupération)
  })

  // États de simulation
  const [isPaused, setIsPaused] = useState(false)
  const [simulationSpeed, setSimulationSpeed] = useState(1)
  const [workTime, setWorkTime] = useState(0)
  const [workStartTime, setWorkStartTime] = useState(Date.now())
  const [resetTrigger, setResetTrigger] = useState(0)
  const [hasReachedLimit, setHasReachedLimit] = useState(false)

  // Gestion de la pause/reprise
  const handlePauseToggle = () => {
    setIsPaused(!isPaused)
    
    if (isPaused) {
      setWorkStartTime(Date.now() - (workTime * 1000 / simulationSpeed))
      setHasReachedLimit(false)
    }
  }

  // Gestion du changement de vitesse
  const handleSpeedChange = (speed: number) => {
    const elapsedRealTime = Date.now() - workStartTime
    const currentSimulatedTime = elapsedRealTime * simulationSpeed
    setWorkStartTime(Date.now() - (currentSimulatedTime / speed))
    setSimulationSpeed(speed)
  }

  // Reset de la simulation
  const handleResetSimulation = () => {
    setWorkTime(0)
    setWorkStartTime(Date.now())
    setIsPaused(false)
    setHasReachedLimit(false)
    setResetTrigger(prev => prev + 1)
    // Réinitialiser les scores à 0
    setSavedScores({
      scoreV: 0,
      scoreR: 0,
      scoreB: 0,
      scoreO: 0,
      scoreP: 0
    })
  }

  // Formatage du temps (MM:SS)
  const formattedWorkTime = () => {
    const totalSeconds = Math.floor(workTime)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  // Chronomètre de travail
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        const elapsedRealTime = Date.now() - workStartTime
        const simulatedSeconds = (elapsedRealTime * simulationSpeed) / 1000
        setWorkTime(simulatedSeconds)
        
        // Pause automatique après 8 minutes (480s)
        if (simulatedSeconds >= 480 && !hasReachedLimit) {
          setIsPaused(true)
          setHasReachedLimit(true)
        }
      }
    }, 50)
    
    return () => clearInterval(interval)
  }, [isPaused, workStartTime, simulationSpeed, hasReachedLimit])

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Éviter d'intercepter les raccourcis si on est dans un input
      if ((e.target as HTMLElement).tagName === 'INPUT') return

      if (e.code === 'Space') {
        e.preventDefault()
        handlePauseToggle()
      } else if (e.code === 'KeyR') {
        e.preventDefault()
        handleResetSimulation()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPaused])

  return (
    <div className="bg-black h-[100svh] flex flex-col overflow-hidden">
      {/* Styles spécifiques sandbox - layout vertical responsive */}
      <style jsx global>{`
        /* IMPORTANT: Pas de transform scale sur les conteneurs principaux */
        /* Le zoom natif doit fonctionner normalement */
        
        /* Layout vertical : sliders > modèle (sans control panel) */
        .sandbox-layout {
          display: grid;
          grid-template-rows: auto minmax(0, 1fr);
          width: 100%;
          gap: 0;
          height: 100%;
          overflow: hidden;
        }
        
        /* 1. Sliders en haut - compacts */
        .sandbox-sliders {
          order: 1;
          width: 100%;
          padding: 0.5rem;
          background: transparent;
          flex-shrink: 0;
          position: relative;
          z-index: 100;
        }
        
        /* 2. Modèle au milieu - compact, tout visible */
        .sandbox-model {
          order: 2;
          width: 100%;
          padding: 0;
          background: transparent;
          min-height: 0;
          overflow: visible;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        
        /* Avec viewport forcé à 1280px scale 0.5, on garde une taille fixe optimisée */
        /* Tous les devices verront la même chose grâce au viewport */
        .sandbox-sliders {
          max-width: 100%;
          padding: 0.5rem;
        }
        
        .sandbox-model {
          padding: 0;
          margin-top: -10rem;
        }

        .sandbox-model-canvas {
          --sandbox-model-scale: 0.95;
          width: 700px;
          height: 700px;
          transform-origin: center center;
          transform: scale(var(--sandbox-model-scale));
          margin: 0 auto;
        }

        .sandbox-model-canvas-inner {
          width: 700px;
          height: 700px;
          position: relative;
        }
      `}</style>
      
      {/* Header avec logo et titre uniquement */}
      <div className="bg-gradient-to-r from-slate-950 via-black to-slate-950 border-b border-white/10 py-1 px-3 flex-shrink-0">
        <div className="flex items-center justify-center gap-1.5">
          <img 
            src="/photo%20video/logo_noir-removebg-preview.png" 
            alt="LeVerre Labs Logo" 
            className="h-5 w-5 object-contain brightness-0 invert"
          />
          <h1 className="text-base font-bold">
            <span className="text-[rgb(255,30,90)]">LeVerre</span>{' '}
            <span className="text-white">Labs</span>
          </h1>
        </div>
      </div>

      {/* Layout vertical : Sliders > Modèle - Sans scroll */}
      <div className="flex-1 overflow-hidden">
        <div className="sandbox-layout">
          {/* 1. SLIDERS EN HAUT */}
          <div className="sandbox-sliders">
            <SlidersPanel 
              savedScores={savedScores}
              setSavedScores={setSavedScores}
            />
          </div>
          
          {/* 2. MODÈLE AU MILIEU */}
          <div className="sandbox-model">
            <ModelVisualization 
              savedScores={savedScores}
              isPaused={isPaused}
              simulationSpeed={simulationSpeed}
              resetTrigger={resetTrigger}
              onReset={handleResetSimulation}
              onPauseToggle={handlePauseToggle}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
