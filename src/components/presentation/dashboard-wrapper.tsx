/**
 * Wrapper pour le Dashboard en mode présentation
 * Masque/affiche les éléments via CSS
 */

'use client'

import DashboardSimplified from '../dashboard/dashboard-simplified'
import { AnimatePresence, motion } from 'framer-motion'

interface DashboardWrapperProps {
  visibleElements: string[]
  activeSliders?: string[]
  initialLevel?: number
  hideIcons?: boolean
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
  isPaused?: boolean
  simulationSpeed?: number
  resetTrigger?: number
}

export function DashboardWrapper({ 
  visibleElements,
  activeSliders = [],
  initialLevel = 0,
  hideIcons = true,
  savedScores,
  onScoresChange,
  isPaused,
  simulationSpeed,
  resetTrigger
}: DashboardWrapperProps) {
  // Créer une clé pour forcer le re-render quand les éléments changent
  const key = visibleElements.sort().join('-')
  
  return (
    <div key={key} className="dashboard-presentation-wrapper relative">
      {/* Overlay pour contrôler la visibilité avec CSS */}
      <style jsx global>{`
        /* Masquer tous les éléments par défaut en mode présentation */
        .dashboard-presentation-wrapper .tap-container {
          display: ${visibleElements.includes('tap') ? 'block' : 'none'} !important;
          animation: ${visibleElements.includes('tap') ? 'fadeInScale 0.6s ease-out' : 'none'};
        }
        .dashboard-presentation-wrapper .glass-container {
          display: ${visibleElements.includes('glass') ? 'block' : 'none'} !important;
          animation: ${visibleElements.includes('glass') ? 'fadeInScale 0.6s ease-out' : 'none'};
        }
        .dashboard-presentation-wrapper .straw-container {
          display: ${visibleElements.includes('straw') ? 'block' : 'none'} !important;
          animation: ${visibleElements.includes('straw') ? 'fadeInScale 0.6s ease-out' : 'none'};
        }
        .dashboard-presentation-wrapper .storm-container {
          display: ${visibleElements.includes('storm') ? 'block' : 'none'} !important;
          animation: ${visibleElements.includes('storm') ? 'fadeInScale 0.6s ease-out' : 'none'};
        }
        .dashboard-presentation-wrapper .bubble-container {
          display: ${visibleElements.includes('bubble') ? 'block' : 'none'} !important;
          animation: ${visibleElements.includes('bubble') ? 'fadeInScale 0.6s ease-out' : 'none'};
        }
        
        /* Animation d'apparition - simple fade */
        @keyframes fadeInScale {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        /* Afficher le panneau de contrôle (sliders) en mode présentation */
        .dashboard-presentation-wrapper > div > div > div > div.lg\\:col-span-4 {
          display: block !important;
          padding-top: 0 !important;
        }
        
        /* Garder la visualisation sur 8 colonnes */
        .dashboard-presentation-wrapper > div > div > div > div.lg\\:col-span-8 {
          grid-column: span 8 / span 8 !important;
        }
        
        /* Feedback visuel - élément nouvellement apparu */
        .dashboard-presentation-wrapper .glass-container {
          filter: ${visibleElements.includes('glass') && visibleElements.length === 1 ? 'drop-shadow(0 0 25px rgba(209, 213, 219, 0.6)) !important' : 'none !important'};
        }
        .dashboard-presentation-wrapper .tap-container {
          filter: ${visibleElements.includes('tap') && visibleElements.length === 2 ? 'drop-shadow(0 0 20px rgba(96, 165, 250, 0.6)) !important' : 'none !important'};
        }
        .dashboard-presentation-wrapper .bubble-container {
          box-shadow: ${visibleElements.includes('bubble') && visibleElements.length === 3 ? '0 0 25px rgba(168, 85, 247, 0.5), 0 0 50px rgba(168, 85, 247, 0.3) !important' : '0 0 20px rgba(168,85,247,0.15) !important'};
          border-color: ${visibleElements.includes('bubble') && visibleElements.length === 3 ? 'rgba(168, 85, 247, 0.6) !important' : 'rgba(168, 85, 247, 0.4) !important'};
        }
        .dashboard-presentation-wrapper .storm-container {
          filter: ${visibleElements.includes('storm') && visibleElements.length === 4 ? 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.6)) !important' : 'none !important'};
        }
        .dashboard-presentation-wrapper .straw-container {
          filter: none !important;
        }
        
        /* Mode présentation: fond plus sombre */
        .dashboard-presentation-wrapper {
          background: #000;
          min-height: 100vh;
        }
      `}</style>
      
      {/* Message temporaire si aucun élément n'est visible */}
      {visibleElements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="text-center">
            <p className="text-2xl text-gray-400">Prêt à commencer...</p>
            <p className="text-sm text-gray-500 mt-2">Les éléments apparaîtront progressivement</p>
          </div>
        </div>
      )}
      
      <DashboardSimplified 
        activeSliders={activeSliders}
        initialLevel={initialLevel}
        hideIcons={hideIcons}
        savedScores={savedScores}
        onScoresChange={onScoresChange}
        externalIsPaused={isPaused}
        externalSimulationSpeed={simulationSpeed}
        resetTrigger={resetTrigger}
      />
    </div>
  )
}
