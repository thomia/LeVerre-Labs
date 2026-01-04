/**
 * Dashboard Simplifié - Version Formation
 * Avec nouvelle nomenclature des scores et sliders uniquement
 */

"use client"

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import TapComponent from './tap-component'
import GlassComponent from './glass-component'
import StrawComponent from './straw-component'
import StormComponent from './storm-component'
import { EnvironmentParticles } from './bubble-component'
import { Slider } from '@/components/ui/slider-number-flow'
import { Clock, RefreshCcw, Play, Pause, FastForward } from 'lucide-react'

interface DashboardSimplifiedProps {
  activeSliders?: string[]
  initialLevel?: number
  hideIcons?: boolean
  hideControlPanel?: boolean
  savedScores?: {
    scoreV: number
    scoreR: number
    scoreB: number
    scoreO: number
    scoreP: number
  }
  onScoresChange?: (scores: {
    scoreV: number
    scoreR: number
    scoreB: number
    scoreO: number
    scoreP: number
  }) => void
  externalIsPaused?: boolean
  externalSimulationSpeed?: number
  resetTrigger?: number
}

export default function DashboardSimplified({
  activeSliders = ['scoreV', 'scoreR', 'scoreB', 'scoreO', 'scoreP'],
  initialLevel = 0,
  hideIcons = false,
  hideControlPanel = false,
  savedScores,
  onScoresChange,
  externalIsPaused,
  externalSimulationSpeed,
  resetTrigger
}: DashboardSimplifiedProps = {}) {
  // États principaux - Nouvelle nomenclature
  const [isMounted, setIsMounted] = useState(false)
  const [internalIsPaused, setInternalIsPaused] = useState(false)
  const [internalSimulationSpeed, setInternalSimulationSpeed] = useState(1)
  
  // Utiliser les valeurs externes si fournies, sinon utiliser les internes
  const isPaused = externalIsPaused !== undefined ? externalIsPaused : internalIsPaused
  const simulationSpeed = externalSimulationSpeed !== undefined ? externalSimulationSpeed : internalSimulationSpeed
  
  // 🥃 Score V - Verre (Capacité)
  const [scoreV, setScoreV] = useState(savedScores?.scoreV ?? 50)
  const [fillLevel, setFillLevel] = useState(0)
  const [glassWidth, setGlassWidth] = useState(20)
  
  // 🚰 Score R - Robinet (Débit/Charge de travail)
  const [scoreR, setScoreR] = useState(savedScores?.scoreR ?? 0)
  
  // ⛈️ Score O - Orage (Intensité des aléas)
  const [scoreO, setScoreO] = useState(savedScores?.scoreO ?? 0)
  
  // 🥤 Score P - Paille (Absorption/Récupération)
  const [scoreP, setScoreP] = useState(savedScores?.scoreP ?? 0)
  
  // 🫧 Score B - Bulle (Agitation/Environnement)
  const [scoreB, setScoreB] = useState(savedScores?.scoreB ?? 0)
  
  // Chronomètre
  const [workTime, setWorkTime] = useState(0)
  const [workStartTime, setWorkStartTime] = useState(Date.now())
  
  const glassRef = useRef<HTMLDivElement>(null)

  // Initialisation
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Réinitialiser le verre quand resetTrigger change
  useEffect(() => {
    if (resetTrigger !== undefined && resetTrigger > 0) {
      setFillLevel(0)
      setWorkTime(0)
      setWorkStartTime(Date.now())
    }
  }, [resetTrigger])

  useEffect(() => {
    setWorkStartTime(Date.now())
    // Définir le niveau initial si fourni
    if (initialLevel > 0) {
      setFillLevel(initialLevel)
    }
  }, [initialLevel])
  
  // Synchroniser les scores avec savedScores quand ils changent
  useEffect(() => {
    if (savedScores) {
      setScoreV(savedScores.scoreV)
      setScoreR(savedScores.scoreR)
      setScoreB(savedScores.scoreB)
      setScoreO(savedScores.scoreO)
      setScoreP(savedScores.scoreP)
    }
  }, [savedScores])
  
  // Notifier le parent quand les scores changent
  useEffect(() => {
    if (onScoresChange) {
      onScoresChange({ scoreV, scoreR, scoreB, scoreO, scoreP })
    }
  }, [scoreV, scoreR, scoreB, scoreO, scoreP, onScoresChange])

  // Calcul de la largeur du verre selon scoreV
  useEffect(() => {
    if (!isMounted) return
    const newGlassWidth = Math.round(20 + (scoreV * 0.7))
    setGlassWidth(newGlassWidth)
  }, [scoreV, isMounted])

  // Chronomètre de travail
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        const elapsedRealTime = Date.now() - workStartTime
        const simulatedSeconds = (elapsedRealTime * simulationSpeed) / 1000
        setWorkTime(simulatedSeconds)
        
        // Journée de 8h = 480 secondes simulées
        if (simulatedSeconds >= 480 && externalIsPaused === undefined) {
          setInternalIsPaused(true)
        }
      }
    }, 50)
    
    return () => clearInterval(interval)
  }, [isPaused, workStartTime, simulationSpeed])

  // Simulation du remplissage du verre
  useEffect(() => {
    if (isPaused) return
    
    const interval = setInterval(() => {
      setFillLevel(prev => {
        // Entrée d'eau (Robinet)
        const inflow = (scoreR / 100) * 0.5 * simulationSpeed
        
        // Sortie d'eau (Paille)
        const outflow = (scoreP / 100) * 0.3 * simulationSpeed
        
        // Facteur environnemental (Bulle)
        const environmentFactor = 1 + (scoreB / 200)
        
        // Impact des aléas (Orage)
        const stormImpact = 1 + (scoreO / 150)
        
        // Facteur capacité (Verre) - un verre plus large se remplit plus lentement
        // scoreV de 0 = verre étroit (facteur 1.5), scoreV de 100 = verre large (facteur 0.5)
        const capacityFactor = 1.5 - (scoreV / 100)
        
        // Calcul net avec impact de la capacité
        const netChange = ((inflow * environmentFactor * stormImpact) - outflow) * capacityFactor
        
        // Nouveau niveau (0-100)
        return Math.max(0, Math.min(100, prev + netChange))
      })
    }, 50)
    
    return () => clearInterval(interval)
  }, [scoreR, scoreP, scoreB, scoreO, scoreV, isPaused, simulationSpeed])

  // Formatage du temps
  const formattedWorkTime = () => {
    const totalSeconds = Math.floor(workTime)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  // Handlers
  const handleReset = () => {
    setFillLevel(0)
    setWorkTime(0)
    setWorkStartTime(Date.now())
    if (externalIsPaused === undefined) {
      setInternalIsPaused(false)
    }
  }

  const handlePauseToggle = () => {
    if (isPaused) {
      setWorkStartTime(Date.now() - (workTime * 1000 / simulationSpeed))
    }
    setInternalIsPaused(!isPaused)
  }

  const handleSpeedChange = (value: number) => {
    const newSpeed = value
    setWorkStartTime(Date.now() - (workTime * 1000 / newSpeed))
    setInternalSimulationSpeed(newSpeed)
  }

  if (!isMounted) return null

  return (
    <div className="w-full">
      <div className="w-full max-w-[1400px] mx-auto">
        <div className={`grid grid-cols-1 ${!hideControlPanel ? 'lg:grid-cols-12' : ''} gap-8`}>
          {/* Panneau de contrôle - 4 colonnes */}
          {!hideControlPanel && (
          <div className="lg:col-span-4 space-y-4">
            {/* Score Cards avec Sliders */}
            <div className="space-y-3 mt-56">
              {/* 🥃 Score V - Verre */}
              <div className={`p-3 rounded-lg bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-400/20 ${!activeSliders.includes('scoreV') ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-2 mb-8 pb-3 border-b border-gray-600/30">
                  {!hideIcons && <span className="text-xl">🥃</span>}
                  <h4 className="text-sm font-medium text-gray-300">Capacité du verre</h4>
                </div>
                <Slider
                  value={[scoreV]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(values) => activeSliders.includes('scoreV') && setScoreV(values[0])}
                  className="mx-auto w-full"
                  valueColor="text-gray-300"
                  disabled={!activeSliders.includes('scoreV')}
                  style={{
                    '--slider-range-bg': 'rgb(209 213 219)',
                    '--slider-thumb-ring': 'rgb(209 213 219 / 0.2)'
                  } as React.CSSProperties}
                />
              </div>

              {/* 🚰 Score R - Robinet */}
              <div className={`p-3 rounded-lg bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-400/20 ${!activeSliders.includes('scoreR') ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-2 mb-8 pb-3 border-b border-blue-500/30">
                  {!hideIcons && <span className="text-xl">🚰</span>}
                  <h4 className="text-sm font-medium text-blue-400">Charge de travail</h4>
                </div>
                <Slider
                  value={[scoreR]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(values) => activeSliders.includes('scoreR') && setScoreR(values[0])}
                  className="mx-auto w-full"
                  valueColor="text-blue-400"
                  disabled={!activeSliders.includes('scoreR')}
                  style={{
                    '--slider-range-bg': 'rgb(96 165 250)',
                    '--slider-thumb-ring': 'rgb(96 165 250 / 0.2)'
                  } as React.CSSProperties}
                />
              </div>

              {/* 🫧 Score B - Bulle */}
              <div className={`p-3 rounded-lg bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-400/20 ${!activeSliders.includes('scoreB') ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-2 mb-8 pb-3 border-b border-purple-500/30">
                  {!hideIcons && <span className="text-xl">🫧</span>}
                  <h4 className="text-sm font-medium text-purple-400">Environnement</h4>
                </div>
                <Slider
                  value={[scoreB]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(values) => activeSliders.includes('scoreB') && setScoreB(values[0])}
                  className="mx-auto w-full"
                  valueColor="text-purple-400"
                  disabled={!activeSliders.includes('scoreB')}
                  style={{
                    '--slider-range-bg': 'rgb(192 132 252)',
                    '--slider-thumb-ring': 'rgb(192 132 252 / 0.2)'
                  } as React.CSSProperties}
                />
              </div>

              {/* ⛈️ Score O - Orage */}
              <div className={`p-3 rounded-lg bg-gradient-to-br from-amber-900/20 to-amber-800/10 border border-amber-400/20 ${!activeSliders.includes('scoreO') ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-2 mb-8 pb-3 border-b border-amber-500/30">
                  {!hideIcons && <span className="text-xl">⛈️</span>}
                  <h4 className="text-sm font-medium text-amber-400">Aléas</h4>
                </div>
                <Slider
                  value={[scoreO]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(values) => activeSliders.includes('scoreO') && setScoreO(values[0])}
                  className="mx-auto w-full"
                  valueColor="text-amber-400"
                  disabled={!activeSliders.includes('scoreO')}
                  style={{
                    '--slider-range-bg': 'rgb(251 191 36)',
                    '--slider-thumb-ring': 'rgb(251 191 36 / 0.2)'
                  } as React.CSSProperties}
                />
              </div>

              {/* 🥤 Score P - Paille */}
              <div className={`p-3 rounded-lg bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-400/20 ${!activeSliders.includes('scoreP') ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-2 mb-8 pb-3 border-b border-green-500/30">
                  {!hideIcons && <span className="text-xl">🥤</span>}
                  <h4 className="text-sm font-medium text-green-400">Récupération</h4>
                </div>
                <Slider
                  value={[scoreP]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(values) => activeSliders.includes('scoreP') && setScoreP(values[0])}
                  className="mx-auto w-full"
                  valueColor="text-green-400"
                  disabled={!activeSliders.includes('scoreP')}
                  style={{
                    '--slider-range-bg': 'rgb(74 222 128)',
                    '--slider-thumb-ring': 'rgb(74 222 128 / 0.2)'
                  } as React.CSSProperties}
                />
              </div>
            </div>
          </div>
          )}
          
          {/* Visualisation - 8 colonnes */}
          <div className={!hideControlPanel ? 'lg:col-span-8' : 'w-full'}>
            <div className="relative w-full h-full min-h-[600px] flex items-center justify-center">
              <div className="relative w-full max-w-[800px] mx-auto">
                {/* Bulle environnementale */}
                <div className="bubble-container absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full overflow-hidden border-2 border-purple-400/40 bg-transparent shadow-[0_0_20px_rgba(168,85,247,0.15)] z-0" style={{ top: '70%' }}>
                  <EnvironmentParticles 
                    score={scoreB} 
                    isPaused={isPaused}
                  />
                </div>
                
                {/* Structure centrale avec positionnement absolu */}
                <div className="relative" style={{ height: '700px' }}>
                  {/* Verre avec paille - Position fixe au centre */}
                  <div className="glass-container absolute left-1/2 top-[87%] transform -translate-x-1/2 -translate-y-1/2 scale-125 z-10">
                    <div ref={glassRef} className="relative">
                      <GlassComponent 
                        fillLevel={fillLevel} 
                        absorptionRate={scoreP}
                        width={glassWidth}
                      />
                      
                      {/* Paille */}
                      <div className="straw-container absolute top-[-230px] right-[-5px] z-20">
                        <StrawComponent 
                          absorptionRate={scoreP} 
                          setAbsorptionRate={setScoreP} 
                          isInsideGlass={true}
                          isPaused={isPaused}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Robinet - Positionné au-dessus du verre */}
                  <div className="tap-container absolute left-1/2 top-[35%] transform -translate-x-1/2 z-20">
                    <TapComponent 
                      flowRate={scoreR} 
                      onFlowRateChange={setScoreR}
                      hideDebitLabel={hideIcons}
                    />
                  </div>
                  
                  {/* Orage - Positionné entre le robinet et le verre */}
                  <div className="storm-container absolute left-[45%] top-[53%] transform -translate-x-1/2 scale-110 z-20">
                    <StormComponent 
                      intensity={scoreO} 
                      onIntensityChange={setScoreO}
                      hideIntensityLabel={hideIcons} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
