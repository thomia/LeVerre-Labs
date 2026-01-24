/**
 * Mode Présentation pour Formateur
 * Basé sur le workflow de formation Phase 1
 * Révélation progressive des éléments avec storytelling
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Play, 
  Pause,
  BookOpen,
  Eye,
  EyeOff,
  Maximize2,
  Clock,
  FastForward
} from 'lucide-react'
import { DashboardWrapper } from './dashboard-wrapper'

// Étapes de la présentation (Phase 1 du workflow)
const PRESENTATION_STEPS = [
  {
    id: 'intro',
    title: 'Introduction',
    subtitle: 'Bienvenue dans le modèle du Verre',
    icon: '👋',
    elements: [],
    trainerNotes: [
      'Accueillir les participants',
      'Expliquer l\'objectif : comprendre le risque lié à l\'activité physique',
      'Présenter la métaphore du verre'
    ]
  },
  {
    id: 'glass',
    title: 'Le Verre',
    subtitle: 'Notre capacité individuelle',
    icon: '🥃',
    elements: ['glass'],
    trainerNotes: [
      'Question : "Quelle est la largeur de votre verre ?"',
      'Facteurs : âge, antécédents, sommeil, alimentation, condition physique',
      'Message clé : Nous ne sommes pas tous égaux face aux contraintes',
      'Révéler le verre avec son scoreV'
    ]
  },
  {
    id: 'initial-level',
    title: 'Niveau Initial',
    subtitle: 'Où est ton verre maintenant ?',
    icon: '📊',
    elements: ['glass'],
    needsInitialLevel: true,
    trainerNotes: [
      'Question : "À quel niveau estimez-vous votre verre en ce moment ?"',
      'Faire placer une jauge (60, 80, 90, 100)',
      'Message clé : On n\'arrive jamais au travail avec le verre vide',
      'Sport du matin, mauvais sommeil, enfants... ça remplit déjà le verre'
    ]
  },
  {
    id: 'tap',
    title: 'Le Robinet',
    subtitle: 'Ce qui remplit le verre',
    icon: '🚰',
    elements: ['glass', 'tap'],
    trainerNotes: [
      'Question : "Qu\'est-ce qui remplit le verre au travail ?"',
      'Les 5 facteurs :',
      '  - QUOI ? La charge manipulée',
      '  - COMMENT ? La posture de travail',
      '  - COMBIEN DE TEMPS ? La fréquence/durée',
      '  - Ressources mentales ? La charge mentale',
      '  - État émotionnel ? La charge psycho-sociale',
      'Exemple : Analyser cette salle de formation',
      'Révéler le robinet avec scoreR'
    ]
  },
  {
    id: 'bubble',
    title: 'La Bulle',
    subtitle: 'L\'environnement de travail',
    icon: '🫧',
    elements: ['glass', 'tap', 'bubble'],
    trainerNotes: [
      'Question : "Dans quel environnement je travaille ?"',
      'La question du OÙ est cruciale',
      'Facteurs environnementaux : lumière, bruit, hygiène, espace, vibrations, température...',
      'Ces éléments sont des accélérateurs de fatigue',
      'Exemple : Analyser cette salle',
      'Révéler la bulle avec scoreB'
    ]
  },
  {
    id: 'storm',
    title: 'L\'Orage',
    subtitle: 'Les aléas et perturbations',
    icon: '⛈️',
    elements: ['glass', 'tap', 'bubble', 'storm'],
    trainerNotes: [
      'Question : "Qu\'est-ce qui vous énerve au travail ?"',
      'Slide travail prescrit / travail réel',
      'Les imprévus demandent EN PLUS des ressources supplémentaires',
      'Aller plus vite, rattraper le retard, gérer le stress...',
      'Exemple : Aléas possibles pendant cette formation',
      'Révéler l\'orage avec scoreO'
    ]
  },
  {
    id: 'straw',
    title: 'La Paille',
    subtitle: 'La récupération',
    icon: '🥤',
    elements: ['glass', 'tap', 'bubble', 'storm', 'straw'],
    trainerNotes: [
      'Question : "Il manque quelque chose... pour vider le verre !"',
      'Heureusement, notre corps est capable d\'évacuer les contraintes',
      'Exemples : pauses, sommeil, étirements, marcher, discuter...',
      'Note : Un levier efficace = effet contraire à la tâche',
      '  (Assis → Se lever / marcher)',
      'Révéler la paille avec scoreP'
    ]
  },
  {
    id: 'simulation',
    title: 'Simulation',
    subtitle: 'Voyons le verre évoluer',
    icon: '▶️',
    elements: ['glass', 'tap', 'bubble', 'storm', 'straw'],
    trainerNotes: [
      'Félicitations ! Vous avez analysé un poste de travail',
      'Tâche : Écouter une formation LeVerre Labs pendant 1h',
      'Question : "Comment votre verre va évoluer dans la prochaine heure ?"',
      'Lancer la simulation (durée : 1h en 10 secondes)',
      'Résultat : Le verre évolue de X à Y',
      'Analyse : Resté dans le vert/orange = rien d\'alarmant pour une formation assise'
    ]
  }
]

interface PresentationTrainerProps {
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
}

export function PresentationTrainer({ 
  isFullscreen = false,
  onToggleFullscreen 
}: PresentationTrainerProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showNotes, setShowNotes] = useState(true)
  const [visibleElements, setVisibleElements] = useState<string[]>([])
  const [initialLevel, setInitialLevel] = useState(60)
  const [hasSetInitialLevel, setHasSetInitialLevel] = useState(false)
  
  const [savedScores, setSavedScores] = useState({
    scoreV: 50,
    scoreR: 0,
    scoreB: 0,
    scoreO: 0,
    scoreP: 0
  })

  // États pour la simulation
  const [isPaused, setIsPaused] = useState(false)
  const [simulationSpeed, setSimulationSpeed] = useState(1)
  const [workTime, setWorkTime] = useState(0)
  const [workStartTime, setWorkStartTime] = useState(Date.now())
  const [lastSimulationSpeed, setLastSimulationSpeed] = useState(1)
  const [resetTrigger, setResetTrigger] = useState(0)
  const [hasReachedLimit, setHasReachedLimit] = useState(false)

  const step = PRESENTATION_STEPS[currentStep]

  // Mettre à jour les éléments visibles quand on change d'étape
  useEffect(() => {
    setVisibleElements(step.elements)
  }, [currentStep])

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Espace : Pause/Reprendre
      if (e.code === 'Space' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        handlePauseToggle()
      }
      // Flèche droite : Étape suivante
      else if (e.code === 'ArrowRight' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        handleNext()
      }
      // Flèche gauche : Étape précédente
      else if (e.code === 'ArrowLeft' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        handlePrevious()
      }
      // R : Reset
      else if (e.code === 'KeyR' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        handleResetSimulation()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStep, isPaused, workTime, simulationSpeed])

  const handleNext = () => {
    if (currentStep < PRESENTATION_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setVisibleElements([])
    setHasSetInitialLevel(false)
    setInitialLevel(60)
    setSavedScores({
      scoreV: 50,
      scoreR: 0,
      scoreB: 0,
      scoreO: 0,
      scoreP: 0
    })
  }

  const handleSetInitialLevel = () => {
    setHasSetInitialLevel(true)
  }

  // Handlers de simulation (de dashboard-new.tsx)
  const handlePauseToggle = () => {
    setIsPaused(!isPaused)
    
    if (isPaused) {
      // Si on reprend, mettre à jour le temps de démarrage et réinitialiser le flag de limite
      setWorkStartTime(Date.now() - (workTime * 1000 / simulationSpeed))
      setHasReachedLimit(false)
    }
  }

  const handleSpeedChange = (speed: number) => {
    // Sauvegarder l'ancienne vitesse
    setLastSimulationSpeed(simulationSpeed)
    
    // Calculer le temps simulé actuel
    const elapsedRealTime = Date.now() - workStartTime
    const currentSimulatedTime = elapsedRealTime * simulationSpeed
    
    // Mettre à jour le temps de démarrage pour maintenir la cohérence du temps simulé
    setWorkStartTime(Date.now() - (currentSimulatedTime / speed))
    
    // Mettre à jour la vitesse
    setSimulationSpeed(speed)
  }

  const handleResetSimulation = () => {
    setWorkTime(0)
    setWorkStartTime(Date.now())
    setIsPaused(false)
    setHasReachedLimit(false)
    setResetTrigger(prev => prev + 1) // Déclenche la réinitialisation du verre
  }

  // Formatage du temps
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
        
        // Mettre en pause seulement si on atteint la limite et qu'on ne l'a pas encore marquée
        if (simulatedSeconds >= 480 && !hasReachedLimit) {
          setIsPaused(true)
          setHasReachedLimit(true)
        }
      }
    }, 50)
    
    return () => clearInterval(interval)
  }, [isPaused, workStartTime, simulationSpeed, hasReachedLimit])

  // Déterminer quels sliders sont actifs selon l'étape
  const getActiveSliders = () => {
    const stepId = step.id
    switch (stepId) {
      case 'glass':
        return ['scoreV']
      case 'initial-level':
        return [] // Pas de sliders, juste l'input du niveau
      case 'tap':
        return ['scoreV', 'scoreR']
      case 'bubble':
        return ['scoreV', 'scoreR', 'scoreB']
      case 'storm':
        return ['scoreV', 'scoreR', 'scoreB', 'scoreO']
      case 'straw':
      case 'simulation':
        return ['scoreV', 'scoreR', 'scoreB', 'scoreO', 'scoreP']
      default:
        return []
    }
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Zone principale : Verre en plein écran */}
      <div className="flex-1 flex overflow-hidden">
        {/* Verre plein écran */}
        <div className="flex-1 relative">
          {/* Interface spéciale pour l'étape 3 : Niveau Initial */}
          {step.id === 'initial-level' && !hasSetInitialLevel && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4"
              >
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  À quel niveau est ton verre maintenant ?
                </h3>
                <p className="text-gray-400 text-sm mb-6 text-center">
                  Sport du matin, mauvais sommeil, stress... Ça remplit déjà le verre !
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <span className="text-6xl font-bold text-white">{initialLevel}%</span>
                  </div>
                  
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={initialLevel}
                    onChange={(e) => setInitialLevel(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[rgb(255,30,90)]"
                  />
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Vide (0%)</span>
                    <span>Plein (100%)</span>
                  </div>
                  
                  <Button
                    onClick={handleSetInitialLevel}
                    className="w-full bg-gradient-to-r from-[rgb(255,30,90)] to-purple-500 hover:opacity-90 text-white font-semibold py-3"
                  >
                    Valider le niveau
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
          
          <DashboardWrapper 
            visibleElements={step.elements}
            activeSliders={getActiveSliders()}
            initialLevel={hasSetInitialLevel ? initialLevel : 0}
            hideIcons={true}
            savedScores={savedScores}
            onScoresChange={setSavedScores}
            isPaused={isPaused}
            simulationSpeed={simulationSpeed}
            resetTrigger={resetTrigger}
          />
        </div>
      </div>

      {/* Contrôles de simulation - version compacte */}
      <div className="bg-gradient-to-r from-slate-950 to-black border-t border-white/10 py-3 px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-6">
          {/* Chronomètre */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-400/20">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-base font-mono font-semibold text-white">{formattedWorkTime()}</span>
          </div>
          
          {/* Contrôles principaux */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetSimulation}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 text-sm transition-all border border-gray-600/30 hover:border-gray-500/50"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
            
            <button
              onClick={handlePauseToggle}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 text-white text-sm transition-all border border-blue-400/30 hover:border-blue-400/50"
            >
              {isPaused ? (
                <>
                  <Play className="h-4 w-4" />
                  <span>Reprendre</span>
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4" />
                  <span>Pause</span>
                </>
              )}
            </button>
          </div>
          
          {/* Vitesse */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-400/20">
            <div className="flex items-center gap-2">
              <FastForward className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-400">Vitesse</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={simulationSpeed}
              onChange={(e) => handleSpeedChange(Number(e.target.value))}
              className="w-24 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="text-sm font-semibold text-blue-400 min-w-[2rem] text-right">x{simulationSpeed}</span>
          </div>
        </div>
      </div>

      {/* Navigation - style LeverreLab */}
      <div className="bg-gradient-to-r from-slate-950 via-black to-slate-950 border-t border-white/10 py-4 px-8">
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-8">
          {/* Indicateur raccourcis clavier */}
          <div className="absolute left-8 flex items-center gap-2 text-xs text-gray-500">
            <kbd className="px-2 py-1 bg-gray-800/50 rounded border border-gray-700">←→</kbd>
            <span>Navigation</span>
            <kbd className="px-2 py-1 bg-gray-800/50 rounded border border-gray-700 ml-3">Espace</kbd>
            <span>Pause</span>
            <kbd className="px-2 py-1 bg-gray-800/50 rounded border border-gray-700 ml-3">R</kbd>
            <span>Reset</span>
          </div>
          {/* Bouton Précédent */}
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:from-gray-700/60 hover:to-gray-800/60 disabled:opacity-20 disabled:cursor-not-allowed text-white text-sm font-medium transition-all border border-gray-600/30 hover:border-gray-500/50 shadow-lg hover:shadow-xl"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Précédent</span>
          </button>

          {/* Nom de l'étape */}
          <motion.div
            key={step.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-gray-800/40 via-gray-900/40 to-gray-800/40 border border-gray-600/30"
          >
            <div className="text-center">
              <h2 className="text-sm font-bold text-white tracking-wide">{step.title}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{step.subtitle}</p>
            </div>
          </motion.div>

          {/* Bouton Suivant */}
          <button
            onClick={handleNext}
            disabled={currentStep === PRESENTATION_STEPS.length - 1}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[rgb(255,30,90)] to-purple-500 hover:opacity-90 disabled:opacity-20 disabled:cursor-not-allowed text-white text-sm font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span>Suivant</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
