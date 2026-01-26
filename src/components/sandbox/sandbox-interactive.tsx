/**
 * SANDBOX INTERACTIVE - BAC À SABLE PUBLIC
 * Permet au grand public d'interagir avec le modèle du verre
 * Version simplifiée focalisée sur l'exploration et l'expérimentation
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Play, Pause, Clock, FastForward } from 'lucide-react'
import { Slider } from '@/components/ui/slider-number-flow'
import TapComponent from '@/components/dashboard/tap-component'
import GlassComponent from '@/components/dashboard/glass-component'
import StrawComponent from '@/components/dashboard/straw-component'
import StormComponent from '@/components/dashboard/storm-component'
import { EnvironmentParticles } from '@/components/dashboard/bubble-component'

// Composant pour les sliders
function SlidersPanel({ 
  savedScores, 
  setSavedScores, 
  activeSliders 
}: {
  savedScores: {
    scoreV: number
    scoreR: number
    scoreB: number
    scoreO: number
    scoreP: number
  }
  setSavedScores: (scores: any) => void
  activeSliders: string[]
}) {
  return (
    <div className="space-y-3">
      {/* Score V - Verre */}
      <div className="p-4 rounded-lg bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-400/20">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-600/30">
          <div className="flex items-center gap-2">
            <span className="text-xl">🥃</span>
            <h4 className="text-sm font-medium text-gray-300">Score V</h4>
          </div>
          <h4 className="text-sm font-medium text-gray-400">Largeur du verre</h4>
        </div>
        <Slider
          value={[savedScores.scoreV]}
          min={0}
          max={100}
          step={1}
          onValueChange={(values) => setSavedScores({ ...savedScores, scoreV: values[0] })}
          className="mx-auto w-full"
          valueColor="text-gray-300"
          style={{
            '--slider-range-bg': 'rgb(209 213 219)',
            '--slider-thumb-ring': 'rgb(209 213 219 / 0.2)'
          } as React.CSSProperties}
        />
      </div>

      {/* Score R - Robinet */}
      <div className="p-4 rounded-lg bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-400/20">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-blue-500/30">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚰</span>
            <h4 className="text-sm font-medium text-blue-400">Score R</h4>
          </div>
          <h4 className="text-sm font-medium text-blue-300">Débit du robinet</h4>
        </div>
        <Slider
          value={[savedScores.scoreR]}
          min={0}
          max={100}
          step={1}
          onValueChange={(values) => setSavedScores({ ...savedScores, scoreR: values[0] })}
          className="mx-auto w-full"
          valueColor="text-blue-400"
          style={{
            '--slider-range-bg': 'rgb(96 165 250)',
            '--slider-thumb-ring': 'rgb(96 165 250 / 0.2)'
          } as React.CSSProperties}
        />
      </div>

      {/* Score B - Bulle */}
      <div className="p-4 rounded-lg bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-400/20">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-purple-500/30">
          <div className="flex items-center gap-2">
            <span className="text-xl">🫧</span>
            <h4 className="text-sm font-medium text-purple-400">Score B</h4>
          </div>
          <h4 className="text-sm font-medium text-purple-300">Agitation de l'environnement</h4>
        </div>
        <Slider
          value={[savedScores.scoreB]}
          min={0}
          max={100}
          step={1}
          onValueChange={(values) => setSavedScores({ ...savedScores, scoreB: values[0] })}
          className="mx-auto w-full"
          valueColor="text-purple-400"
          style={{
            '--slider-range-bg': 'rgb(192 132 252)',
            '--slider-thumb-ring': 'rgb(192 132 252 / 0.2)'
          } as React.CSSProperties}
        />
      </div>

      {/* Score O - Orage */}
      <div className="p-4 rounded-lg bg-gradient-to-br from-amber-900/20 to-amber-800/10 border border-amber-400/20">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-amber-500/30">
          <div className="flex items-center gap-2">
            <span className="text-xl">⛈️</span>
            <h4 className="text-sm font-medium text-amber-400">Score O</h4>
          </div>
          <h4 className="text-sm font-medium text-amber-300">Intensité de la pluie</h4>
        </div>
        <Slider
          value={[savedScores.scoreO]}
          min={0}
          max={100}
          step={1}
          onValueChange={(values) => setSavedScores({ ...savedScores, scoreO: values[0] })}
          className="mx-auto w-full"
          valueColor="text-amber-400"
          style={{
            '--slider-range-bg': 'rgb(251 191 36)',
            '--slider-thumb-ring': 'rgb(251 191 36 / 0.2)'
          } as React.CSSProperties}
        />
      </div>

      {/* Score P - Paille */}
      <div className="p-4 rounded-lg bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-400/20">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-green-500/30">
          <div className="flex items-center gap-2">
            <span className="text-xl">🥤</span>
            <h4 className="text-sm font-medium text-green-400">Score P</h4>
          </div>
          <h4 className="text-sm font-medium text-green-300">Vitesse d'aspiration</h4>
        </div>
        <Slider
          value={[savedScores.scoreP]}
          min={0}
          max={100}
          step={1}
          onValueChange={(values) => setSavedScores({ ...savedScores, scoreP: values[0] })}
          className="mx-auto w-full"
          valueColor="text-green-400"
          style={{
            '--slider-range-bg': 'rgb(74 222 128)',
            '--slider-thumb-ring': 'rgb(74 222 128 / 0.2)'
          } as React.CSSProperties}
        />
      </div>
    </div>
  )
}

// Composant pour la visualisation 3D
function ModelVisualization({
  visibleElements,
  savedScores,
  isPaused,
  simulationSpeed,
  resetTrigger
}: {
  visibleElements: string[]
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
    const newWidth = 10 + (savedScores.scoreV / 100) * 30
    setGlassWidth(newWidth)
  }, [savedScores.scoreV])

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setFillLevel(prev => {
        const inflowRate = (savedScores.scoreR / 100) * 2 * (1 + savedScores.scoreO / 200)
        const outflowRate = (savedScores.scoreP / 100) * 1.5
        const netChange = (inflowRate - outflowRate) * simulationSpeed * 0.05
        const newLevel = Math.max(0, Math.min(100, prev + netChange))
        return newLevel
      })
    }, 50)

    return () => clearInterval(interval)
  }, [savedScores, isPaused, simulationSpeed])

  return (
    <div className="relative w-full flex items-center justify-center px-4" style={{ minHeight: '450px' }}>
      <div className="relative w-full max-w-[600px] mx-auto">
        {/* Bulle environnementale */}
        <div className="bubble-container absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-[600px] max-h-[600px] rounded-full overflow-hidden border-2 border-purple-400/40 bg-transparent shadow-[0_0_20px_rgba(168,85,247,0.15)] z-0" style={{ top: '60%' }}>
          <EnvironmentParticles 
            score={savedScores.scoreB} 
            isPaused={isPaused}
          />
        </div>
        
        {/* Structure centrale */}
        <div className="relative" style={{ height: '450px' }}>
          {/* Verre avec paille */}
          <div className="glass-container absolute left-1/2 top-[75%] transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative">
              <GlassComponent 
                fillLevel={fillLevel} 
                absorptionRate={savedScores.scoreP}
                width={glassWidth}
              />
              
              {/* Paille */}
              <div className="straw-container absolute top-[-180px] right-[-5px] z-20">
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
          <div className="tap-container absolute left-1/2 top-[25%] transform -translate-x-1/2 z-20">
            <TapComponent 
              flowRate={savedScores.scoreR} 
              onFlowRateChange={() => {}}
              hideDebitLabel={true}
            />
          </div>
          
          {/* Orage */}
          <div className="storm-container absolute left-[45%] top-[45%] transform -translate-x-1/2 z-20">
            <StormComponent 
              intensity={savedScores.scoreO} 
              onIntensityChange={() => {}}
              hideIntensityLabel={true}
            />
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

  // Tous les éléments sont visibles et tous les sliders sont actifs
  const visibleElements = ['glass', 'tap', 'bubble', 'storm', 'straw']
  const activeSliders = ['scoreV', 'scoreR', 'scoreB', 'scoreO', 'scoreP']

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
    <div className="bg-black min-h-screen flex flex-col">
      {/* Styles spécifiques sandbox - layout vertical responsive */}
      <style jsx global>{`
        /* IMPORTANT: Pas de transform scale sur les conteneurs principaux */
        /* Le zoom natif doit fonctionner normalement */
        
        /* Layout vertical : sliders > modèle > control panel */
        .sandbox-layout {
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: 0;
        }
        
        /* 1. Sliders en haut */
        .sandbox-sliders {
          order: 1;
          width: 100%;
          padding: 1rem;
          background: transparent;
        }
        
        /* 2. Modèle au milieu */
        .sandbox-model {
          order: 2;
          width: 100%;
          padding: 0.5rem 0;
          background: transparent;
        }
        
        /* 3. Control panel en bas */
        .sandbox-controls {
          order: 3;
          width: 100%;
          flex-shrink: 0;
        }
        
        /* Adaptations mobile (petits écrans) */
        @media (max-width: 640px) {
          .sandbox-sliders {
            padding: 0.75rem;
          }
          
          .sandbox-sliders .space-y-3 {
            gap: 0.5rem;
          }
          
          .sandbox-sliders .p-4 {
            padding: 0.75rem;
          }
          
          .sandbox-model {
            padding: 0.25rem 0;
            min-height: 350px;
          }
          
          /* Adapter la taille des textes sur mobile */
          .sandbox-sliders h4 {
            font-size: 0.8rem;
          }
          
          .sandbox-controls {
            padding: 0.5rem 0.75rem !important;
          }
          
          /* Boutons plus compacts sur mobile */
          .sandbox-controls button {
            padding: 0.5rem 0.75rem !important;
            font-size: 0.875rem;
          }
          
          .sandbox-controls .text-xl {
            font-size: 1.125rem !important;
          }
          
          .sandbox-controls .h-4 {
            height: 0.875rem;
            width: 0.875rem;
          }
        }
        
        /* Tablettes */
        @media (min-width: 641px) and (max-width: 1024px) {
          .sandbox-sliders {
            max-width: 600px;
            margin: 0 auto;
          }
          
          .sandbox-model {
            padding: 1rem 0;
          }
        }
        
        /* Desktop */
        @media (min-width: 1025px) {
          .sandbox-sliders {
            max-width: 700px;
            margin: 0 auto;
            padding: 1.5rem;
          }
          
          .sandbox-model {
            padding: 1.5rem 0;
          }
        }
      `}</style>
      
      {/* Header avec logo et titre */}
      <div className="bg-gradient-to-r from-slate-950 via-black to-slate-950 border-b border-white/10 py-3 px-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <img 
              src="/photo%20video/logo_noir-removebg-preview.png" 
              alt="LeVerre Labs Logo" 
              className="h-10 w-10 object-contain brightness-0 invert"
            />
            <div className="text-center">
              <h1 className="text-2xl font-bold">
                <span className="text-[rgb(255,30,90)]">LeVerre</span>{' '}
                <span className="text-white">Labs</span>
              </h1>
              <p className="text-gray-400 text-xs mt-0.5">
                Explorez le modèle du verre
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Layout vertical : Sliders > Modèle > Control Panel */}
      <div className="flex-1 overflow-y-auto">
        <div className="sandbox-layout">
          {/* 1. SLIDERS EN HAUT */}
          <div className="sandbox-sliders">
            <SlidersPanel 
              savedScores={savedScores}
              setSavedScores={setSavedScores}
              activeSliders={activeSliders}
            />
          </div>
          
          {/* 2. MODÈLE AU MILIEU */}
          <div className="sandbox-model">
            <ModelVisualization 
              visibleElements={visibleElements}
              savedScores={savedScores}
              isPaused={isPaused}
              simulationSpeed={simulationSpeed}
              resetTrigger={resetTrigger}
            />
          </div>
          
          {/* 3. CONTROL PANEL EN BAS */}
          <div className="sandbox-controls bg-gradient-to-r from-slate-950 to-black border-t border-white/10 py-3 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Chronomètre + Boutons */}
                <div className="flex items-center justify-between md:justify-start gap-3 flex-1">
                  {/* Chronomètre */}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-400/20">
                    <Clock className="h-4 w-4 text-[rgb(255,30,90)]" />
                    <span className="text-xl font-sans font-bold text-white tracking-wide">{formattedWorkTime()}</span>
                  </div>
                  
                  {/* Contrôles principaux */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetSimulation}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgb(255,30,90)]/20 hover:bg-[rgb(255,30,90)]/30 text-white transition-all border border-[rgb(255,30,90)]/40 hover:border-[rgb(255,30,90)]/60"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span className="font-medium">Reset</span>
                    </button>
                    
                    <button
                      onClick={handlePauseToggle}
                      className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[rgb(255,30,90)]/20 hover:bg-[rgb(255,30,90)]/30 text-white transition-all border border-[rgb(255,30,90)]/40 hover:border-[rgb(255,30,90)]/60"
                    >
                      {isPaused ? (
                        <>
                          <Play className="h-4 w-4" />
                          <span className="font-medium">Play</span>
                        </>
                      ) : (
                        <>
                          <Pause className="h-4 w-4" />
                          <span className="font-medium">Pause</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Vitesse de simulation */}
                <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-400/20">
                  <div className="flex items-center gap-2">
                    <FastForward className="h-4 w-4 text-[rgb(255,30,90)]" />
                    <span className="text-sm text-gray-300 font-medium whitespace-nowrap">Vitesse</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={simulationSpeed}
                    onChange={(e) => handleSpeedChange(Number(e.target.value))}
                    className="w-32 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[rgb(255,30,90)]"
                  />
                  <span className="text-sm font-semibold text-[rgb(255,30,90)] min-w-[2rem] text-right">x{simulationSpeed}</span>
                </div>
              </div>

              {/* Indicateur raccourcis clavier */}
              <div className="hidden md:flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-gray-800/50 rounded border border-gray-700">Espace</kbd>
                  <span>Pause/Reprendre</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-gray-800/50 rounded border border-gray-700">R</kbd>
                  <span>Reset</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
