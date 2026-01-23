/**
 * SANDBOX INTERACTIVE - BAC À SABLE PUBLIC
 * Permet au grand public d'interagir avec le modèle du verre
 * Version simplifiée focalisée sur l'exploration et l'expérimentation
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Play, Pause, Clock, FastForward } from 'lucide-react'
import { DashboardWrapper } from '@/components/presentation/dashboard-wrapper'

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
    <div className="bg-black min-h-screen md:h-screen md:flex md:flex-col md:overflow-hidden">
      {/* Header avec logo et titre */}
      <div className="bg-gradient-to-r from-slate-950 via-black to-slate-950 border-b border-white/10 py-2 px-4 md:py-4 md:px-8 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            <img 
              src="/photo%20video/logo_noir-removebg-preview.png" 
              alt="LeVerre Labs Logo" 
              className="h-8 w-8 md:h-12 md:w-12 object-contain brightness-0 invert"
            />
            <div className="text-center">
              <h1 className="text-xl md:text-3xl font-bold">
                <span className="text-[rgb(255,30,90)]">LeVerre</span>{' '}
                <span className="text-white">Labs</span>
              </h1>
              <p className="text-gray-400 text-xs md:text-sm mt-0.5 md:mt-1 hidden sm:block">
                Explorez le modèle du verre
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Zone principale : Modèle du verre */}
      <div className="md:flex-1 md:overflow-hidden py-4 md:py-0">
        <DashboardWrapper 
          visibleElements={visibleElements}
          activeSliders={activeSliders}
          initialLevel={0}
          hideIcons={true}
          savedScores={savedScores}
          onScoresChange={setSavedScores}
          isPaused={isPaused}
          simulationSpeed={simulationSpeed}
          resetTrigger={resetTrigger}
        />
      </div>

      {/* Contrôles de simulation */}
      <div className="bg-gradient-to-r from-slate-950 to-black border-t border-white/10 py-2 px-3 md:py-4 md:px-8 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 md:gap-6">
            {/* Ligne 1 mobile: Chronomètre + Boutons */}
            <div className="flex items-center justify-between md:justify-start gap-2 md:gap-6 flex-1">
              {/* Chronomètre */}
              <div className="flex items-center gap-1.5 px-2 py-1.5 md:px-6 md:py-3 rounded-lg bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-400/20">
                <Clock className="h-3.5 w-3.5 md:h-5 md:w-5 text-[rgb(255,30,90)]" />
                <span className="text-base md:text-2xl font-sans font-bold text-white tracking-wide">{formattedWorkTime()}</span>
              </div>
              
              {/* Contrôles principaux */}
              <div className="flex items-center gap-1.5 md:gap-4">
                <button
                  onClick={handleResetSimulation}
                  className="flex items-center gap-1 md:gap-2 px-2 py-1.5 md:px-6 md:py-3 rounded-lg bg-[rgb(255,30,90)]/20 hover:bg-[rgb(255,30,90)]/30 text-white text-xs md:text-base transition-all border border-[rgb(255,30,90)]/40 hover:border-[rgb(255,30,90)]/60 active:scale-95 md:hover:scale-105"
                >
                  <RotateCcw className="h-3.5 w-3.5 md:h-5 md:w-5" />
                  <span className="font-medium hidden sm:inline">Reset</span>
                </button>
                
                <button
                  onClick={handlePauseToggle}
                  className="flex items-center gap-1.5 md:gap-3 px-3 py-1.5 md:px-8 md:py-3 rounded-lg bg-[rgb(255,30,90)]/20 hover:bg-[rgb(255,30,90)]/30 text-white text-xs md:text-base transition-all border border-[rgb(255,30,90)]/40 hover:border-[rgb(255,30,90)]/60 active:scale-95 md:hover:scale-105"
                >
                  {isPaused ? (
                    <>
                      <Play className="h-3.5 w-3.5 md:h-5 md:w-5" />
                      <span className="font-medium text-xs md:text-base">Play</span>
                    </>
                  ) : (
                    <>
                      <Pause className="h-3.5 w-3.5 md:h-5 md:w-5" />
                      <span className="font-medium text-xs md:text-base">Pause</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Ligne 2 mobile: Vitesse de simulation */}
            <div className="flex items-center gap-2 md:gap-4 px-3 py-1.5 md:px-6 md:py-3 rounded-lg bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-400/20">
              <div className="flex items-center gap-1.5">
                <FastForward className="h-3.5 w-3.5 md:h-5 md:w-5 text-[rgb(255,30,90)]" />
                <span className="text-xs md:text-base text-gray-300 font-medium whitespace-nowrap">Vitesse</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={simulationSpeed}
                onChange={(e) => handleSpeedChange(Number(e.target.value))}
                className="flex-1 md:w-32 h-1.5 md:h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[rgb(255,30,90)]"
              />
              <span className="text-xs md:text-base font-semibold text-[rgb(255,30,90)] min-w-[2rem] md:min-w-[2.5rem] text-right">x{simulationSpeed}</span>
            </div>
          </div>

          {/* Indicateur raccourcis clavier - masqué sur mobile */}
          <div className="hidden md:flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
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
  )
}
