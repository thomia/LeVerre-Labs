"use client"

import { useEffect, useState } from 'react'
import { Card } from "@/components/ui/card"
import { getLocalStorage } from '@/lib/localStorage'
import { cn } from '@/lib/utils'

// Types pour les différents paramètres
type ParameterTypes = 'glass' | 'tap' | 'bubble' | 'storm' | 'straw'

interface ProgressSummaryProps {
  showParameters: ParameterTypes[] // Les paramètres à afficher
  className?: string
}

export default function ProgressSummary({ showParameters, className }: ProgressSummaryProps) {
  // États pour stocker les valeurs des paramètres
  const [glassWidth, setGlassWidth] = useState<number | null>(null)
  const [glassCapacity, setGlassCapacity] = useState<number | null>(null)
  const [flowRate, setFlowRate] = useState<number | null>(null)
  const [environmentScore, setEnvironmentScore] = useState<number | null>(null)
  const [stormIntensity, setStormIntensity] = useState<number | null>(null)
  const [strawEfficiency, setStrawEfficiency] = useState<number | null>(null)

  // Chargement des valeurs depuis le localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Verre
    if (showParameters.includes('glass')) {
      const savedGlassWidth = getLocalStorage('glassWidth')
      if (savedGlassWidth) {
        setGlassWidth(Math.round(parseFloat(savedGlassWidth)))
      }
      
      const savedGlassCapacity = getLocalStorage('glassCapacity')
      if (savedGlassCapacity) {
        setGlassCapacity(Math.round(parseFloat(savedGlassCapacity)))
      }
    }
    
    // Robinet
    if (showParameters.includes('tap')) {
      const savedFlowRate = getLocalStorage('flowRate')
      if (savedFlowRate) {
        setFlowRate(Math.round(parseFloat(savedFlowRate)))
      }
    }
    
    // Bulle environnementale
    if (showParameters.includes('bubble')) {
      const savedEnvironmentScore = getLocalStorage('environmentScore')
      if (savedEnvironmentScore) {
        setEnvironmentScore(Math.round(parseFloat(savedEnvironmentScore)))
      }
    }
    
    // Orage
    if (showParameters.includes('storm')) {
      const savedStormIntensity = getLocalStorage('stormIntensity')
      if (savedStormIntensity) {
        setStormIntensity(Math.round(parseFloat(savedStormIntensity)))
      }
    }
    
    // Paille
    if (showParameters.includes('straw')) {
      const savedStrawEfficiency = getLocalStorage('strawEfficiency')
      if (savedStrawEfficiency) {
        setStrawEfficiency(Math.round(parseFloat(savedStrawEfficiency)))
      }
    }
  }, [showParameters])

  // Fonction pour obtenir la couleur en fonction de la valeur
  const getValueColor = (value: number | null) => {
    if (value === null) return "text-gray-400"
    if (value < 30) return "text-green-500"
    if (value < 60) return "text-yellow-500"
    if (value < 80) return "text-amber-500"
    return "text-red-500"
  }

  // Vérifier s'il y a des données à afficher
  const hasData = [glassWidth, glassCapacity, flowRate, environmentScore, stormIntensity, strawEfficiency].some(val => val !== null)

  if (!hasData) return null

  return (
    <Card className={cn(
      "p-4 bg-slate-900/90 border-slate-800 shadow-lg max-w-[250px]",
      className
    )}>
      <h3 className="text-sm font-bold text-white border-b border-slate-700 pb-2 mb-3">
        Vos réglages précédents
      </h3>
      
      <div className="space-y-3">
        {/* Verre */}
        {showParameters.includes('glass') && (glassWidth !== null || glassCapacity !== null) && (
          <div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500/50 border border-blue-400"></div>
              <h4 className="text-xs font-semibold text-blue-400">Verre</h4>
            </div>
            <div className="mt-1 pl-5 space-y-1 text-xs">
              {glassWidth !== null && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Largeur:</span>
                  <span className={getValueColor(glassWidth)}>{glassWidth}%</span>
                </div>
              )}
              {glassCapacity !== null && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Capacité:</span>
                  <span className={getValueColor(glassCapacity)}>{glassCapacity}%</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Robinet */}
        {showParameters.includes('tap') && flowRate !== null && (
          <div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500/50 border border-blue-400"></div>
              <h4 className="text-xs font-semibold text-blue-400">Robinet</h4>
            </div>
            <div className="mt-1 pl-5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Débit:</span>
                <span className={getValueColor(flowRate)}>{flowRate}%</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Bulle environnementale */}
        {showParameters.includes('bubble') && environmentScore !== null && (
          <div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500/50 border border-purple-400"></div>
              <h4 className="text-xs font-semibold text-purple-400">Environnement</h4>
            </div>
            <div className="mt-1 pl-5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Score:</span>
                <span className={getValueColor(environmentScore)}>{environmentScore}%</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Orage */}
        {showParameters.includes('storm') && stormIntensity !== null && (
          <div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500/50 border border-amber-400"></div>
              <h4 className="text-xs font-semibold text-amber-400">Orage</h4>
            </div>
            <div className="mt-1 pl-5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Intensité:</span>
                <span className={getValueColor(stormIntensity)}>{stormIntensity}%</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Paille */}
        {showParameters.includes('straw') && strawEfficiency !== null && (
          <div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500/50 border border-green-400"></div>
              <h4 className="text-xs font-semibold text-green-400">Paille</h4>
            </div>
            <div className="mt-1 pl-5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Efficacité:</span>
                <span className={getValueColor(strawEfficiency)}>{strawEfficiency}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
