"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { RefreshCw } from "lucide-react"
import { EnvironmentParticles } from '@/components/dashboard/environment-particles'
import TapComponent from '@/components/dashboard/tap-component'
import GlassComponent from '@/components/dashboard/glass-component'
import StormComponent from '@/components/dashboard/storm-component'
import StrawComponent from '@/components/dashboard/straw-component'
import StormSettingsForm from '@/components/settings/storm-settings-form'
import StrawSettingsForm from '@/components/settings/straw-settings-form'
import ProgressSummary from './progress-summary'

// Interface pour les paramètres de la bulle
interface BubbleSettings {
  temperature: number
  nightShift: boolean
  lighting: number
  noise: number
  useProtection: boolean
  hygiene: number
  space: number
  equipment: number
}

// Interface pour les paramètres de l'orage
interface StormSettings {
  impact: number
  duration: number
  frequency: number
  type: 'physical' | 'mental' | 'organizational'
}

export default function Page10FinalModel() {
  // Drapeau pour éviter les boucles infinies lors des mises à jour
  const [ignoreEvents, setIgnoreEvents] = useState(false)
  
  // États pour les paramètres du verre et du robinet
  const [glassSize, setGlassSize] = useState(100) 
  const [glassCapacity, setGlassCapacity] = useState(100) 
  const [flowRate, setFlowRate] = useState(50)
  const [fillLevel, setFillLevel] = useState(40) 
  const [absorptionRate, setAbsorptionRate] = useState(40) // Pour la paille
  const [isPaused, setIsPaused] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false) 
  
  // Paramètres environnementaux (bulle)
  const [settings, setSettings] = useState<BubbleSettings>({
    temperature: 20,
    lighting: 500,
    noise: 70,
    useProtection: false,
    hygiene: 60,
    space: 50,
    equipment: 40,
    nightShift: false
  })
  
  // État pour le score environnemental
  const [environmentScore, setEnvironmentScore] = useState(60)

  // État pour l'intensité de l'orage
  const [stormIntensity, setStormIntensity] = useState(40)
  
  // Paramètres de l'orage
  const [stormSettings, setStormSettings] = useState<StormSettings>({
    impact: 5,
    duration: 15,
    frequency: 3,
    type: 'physical'
  })
  
  // Gérer le remplissage du verre (même modèle que page 6)
  useEffect(() => {
    if (isPaused) return
    
    // Calculer la vitesse de remplissage en fonction du débit et du score environnemental
    const fillTimer = setInterval(() => {
      setFillLevel(prevLevel => {
        // Vitesse de remplissage basée sur le débit du robinet et modifiée par le score environnemental
        // Plus le score environnemental est élevé, plus l'impact sur la vitesse est faible
        const environmentImpact = Math.max(0.5, environmentScore / 100);
        const fillIncrement = (flowRate / 25) * (1 - (environmentImpact * 0.5));
        
        const newLevel = prevLevel + fillIncrement;
        
        // Vérifier si le verre déborde
        const isNowOverflowing = newLevel > glassSize;
        if (isNowOverflowing !== isOverflowing) {
          setIsOverflowing(isNowOverflowing);
        }
        
        // Limiter le niveau maximum au niveau du verre
        return Math.min(newLevel, 100);
      });
    }, 50); // Mise à jour fréquente pour une animation fluide
    
    return () => clearInterval(fillTimer);
  }, [flowRate, glassSize, isPaused, environmentScore, isOverflowing])
  
  // Charger les paramètres depuis le localStorage (une seule fois au montage)
  useEffect(() => {
    if (typeof window === 'undefined' || ignoreEvents) return
    
    // Charger la largeur du verre
    const savedGlassWidth = localStorage.getItem('glassWidth')
    if (savedGlassWidth) {
      try {
        const width = parseFloat(savedGlassWidth)
        if (!isNaN(width)) {
          setGlassSize(width)
        }
      } catch (e) {
        console.error("Erreur lors du chargement de la largeur du verre:", e)
      }
    }
    
    // Charger la capacité d'absorption du verre
    const savedGlassCapacity = localStorage.getItem('glassCapacity')
    if (savedGlassCapacity) {
      try {
        const capacity = parseFloat(savedGlassCapacity)
        if (!isNaN(capacity)) {
          setGlassCapacity(capacity)
        }
      } catch (e) {
        console.error("Erreur lors du chargement de la capacité d'absorption:", e)
      }
    }
    
    // Charger le débit du robinet
    const savedFlowRate = localStorage.getItem('flowRate')
    if (savedFlowRate) {
      try {
        const rate = parseFloat(savedFlowRate)
        if (!isNaN(rate)) {
          setFlowRate(rate)
        }
      } catch (e) {
        console.error("Erreur lors du chargement du débit du robinet:", e)
      }
    }

    // Charger le niveau de remplissage
    const savedFillLevel = localStorage.getItem('fillLevel')
    if (savedFillLevel) {
      try {
        const level = parseFloat(savedFillLevel)
        if (!isNaN(level)) {
          setFillLevel(level)
        }
      } catch (e) {
        console.error("Erreur lors du chargement du niveau de remplissage:", e)
      }
    }

    // Charger l'intensité de l'orage
    const savedStormIntensity = localStorage.getItem('stormIntensity')
    if (savedStormIntensity) {
      try {
        const intensity = parseFloat(savedStormIntensity)
        if (!isNaN(intensity)) {
          setStormIntensity(intensity)
        }
      } catch (e) {
        console.error("Erreur lors du chargement de l'intensité de l'orage:", e)
      }
    }

    // Charger le taux d'absorption de la paille
    const savedAbsorptionRate = localStorage.getItem('absorptionRate')
    if (savedAbsorptionRate) {
      try {
        const rate = parseFloat(savedAbsorptionRate)
        if (!isNaN(rate)) {
          setAbsorptionRate(rate)
        }
      } catch (e) {
        console.error("Erreur lors du chargement du taux d'absorption:", e)
      }
    }

    // Charger les paramètres de l'orage
    const savedStormSettings = localStorage.getItem('stormSettings')
    if (savedStormSettings) {
      try {
        const parsedSettings = JSON.parse(savedStormSettings) as StormSettings
        setStormSettings(parsedSettings)
      } catch (e) {
        console.error("Erreur lors du chargement des paramètres de l'orage:", e)
      }
    }
    
    // Charger les paramètres environnementaux
    const savedEnvironmentSettings = localStorage.getItem('environmentSettings')
    if (savedEnvironmentSettings) {
      try {
        const parsedSettings = JSON.parse(savedEnvironmentSettings) as BubbleSettings
        setSettings(parsedSettings)
        // Calculer le score environnemental
        const score = calculateEnvironmentScore(parsedSettings)
        setEnvironmentScore(score)
      } catch (e) {
        console.error("Erreur lors du chargement des paramètres environnementaux:", e)
      }
    }
  }, []) // Dépendances vides pour ne s'exécuter qu'une fois au montage

  // Écouter les événements de stockage pour synchroniser les paramètres
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleStorageEvent = () => {
      if (ignoreEvents) return // Ignorer les événements si le drapeau est activé
      
      // Synchroniser les paramètres à partir du localStorage
    }
    
    // Écouter l'événement personnalisé de la paille
    const handleStrawUpdate = (e: CustomEvent<{recoveryCapacity: number}>) => {
      if (ignoreEvents) return // Ignorer les événements si le drapeau est activé
      
      if (e.detail && typeof e.detail.recoveryCapacity === 'number') {
        setAbsorptionRate(e.detail.recoveryCapacity)
      }
    }
    
    window.addEventListener('storageEvent', handleStorageEvent as EventListener)
    window.addEventListener('strawUpdateEvent', handleStrawUpdate as EventListener)
    
    return () => {
      window.removeEventListener('storageEvent', handleStorageEvent as EventListener)
      window.removeEventListener('strawUpdateEvent', handleStrawUpdate as EventListener)
    }
  }, [ignoreEvents]) // Dépendance sur ignoreEvents pour réagir à ses changements

  // Calculer le score environnemental
  const calculateEnvironmentScore = (settings: BubbleSettings): number => {
    const temperatureImpact = Math.abs(settings.temperature - 22) >= 4 ? 
      100 - Math.min(Math.abs(settings.temperature - 22) * 8, 50) : 100
    
    const lightingImpact = settings.lighting < 300 ? 
      Math.max(settings.lighting / 3, 50) : 
      settings.lighting > 700 ? 
      100 - Math.min((settings.lighting - 700) / 10, 50) : 100
    
    const noiseImpact = settings.noise > 80 ? 
      Math.max(100 - ((settings.noise - 80) * 2), 50) : 100
      
    const protectionImpact = settings.useProtection ? 100 : 80
    
    const hygieneImpact = settings.hygiene
    
    const spaceImpact = settings.space
    
    const equipmentImpact = settings.equipment
    
    const nightShiftImpact = settings.nightShift ? 70 : 100
    
    const finalScore = Math.round(
      (temperatureImpact * 0.15) +
      (lightingImpact * 0.1) +
      (noiseImpact * 0.15) +
      (protectionImpact * 0.1) +
      (hygieneImpact * 0.15) +
      (spaceImpact * 0.15) +
      (equipmentImpact * 0.15) +
      (nightShiftImpact * 0.05)
    )
    
    return finalScore
  }
  
  // Calculer l'intensité de l'orage
  const calculateStormIntensity = (settings: StormSettings): number => {
    const impactFactor = (settings.impact / 10) * 100 // 0-100
    const durationFactor = (settings.duration / 60) * 100 // 0-100
    const frequencyFactor = (settings.frequency / 10) * 100 // 0-100
    
    const weightedImpact = impactFactor * 0.5
    const weightedDuration = durationFactor * 0.3
    const weightedFrequency = frequencyFactor * 0.2
    
    // Calculer l'intensité globale
    const calculatedIntensity = Math.round(
      weightedImpact + weightedDuration + weightedFrequency
    )
    
    // Limiter entre 10 et 90
    return Math.max(10, Math.min(90, calculatedIntensity))
  }
  
  // Fonction de réinitialisation
  const handleReset = () => {
    // Activer le drapeau pour ignorer les événements
    setIgnoreEvents(true)
    
    // Réinitialiser tous les états
    setGlassSize(100)
    setGlassCapacity(100)
    setFlowRate(50)
    setFillLevel(40)
    setAbsorptionRate(40)
    setIsPaused(false)
    setIsOverflowing(false)
    setStormIntensity(40)
    setSettings({
      temperature: 20,
      lighting: 500,
      noise: 70,
      useProtection: false,
      hygiene: 60,
      space: 50,
      equipment: 40,
      nightShift: false
    })
    setStormSettings({
      impact: 5,
      duration: 15,
      frequency: 3,
      type: 'physical'
    })
    
    // Mettre à jour le localStorage directement sans émettre d'événements
    localStorage.setItem('glassWidth', '100')
    localStorage.setItem('glassCapacity', '100')
    localStorage.setItem('flowRate', '50')
    localStorage.setItem('fillLevel', '40')
    localStorage.setItem('absorptionRate', '40')
    localStorage.setItem('stormIntensity', '40')
    localStorage.setItem('environmentSettings', JSON.stringify({
      temperature: 20,
      lighting: 500,
      noise: 70,
      useProtection: false,
      hygiene: 60,
      space: 50,
      equipment: 40,
      nightShift: false
    }))
    localStorage.setItem('stormSettings', JSON.stringify({
      impact: 5,
      duration: 15,
      frequency: 3,
      type: 'physical'
    }))
    
    // Désactiver le drapeau après un délai pour permettre aux états de se stabiliser
    setTimeout(() => {
      setIgnoreEvents(false)
      // Émettre un événement personnalisé pour informer tous les composants
      const event = new Event('storageEvent')
      window.dispatchEvent(event)
    }, 100)
  }

  // Gérer le changement de débit du robinet
  const handleFlowRateChange = useCallback((newRate: number) => {
    if (newRate !== flowRate) { // Éviter les mises à jour inutiles
      setFlowRate(newRate)
      localStorage.setItem('flowRate', newRate.toString())
    }
  }, [flowRate])
  
  // Gérer le changement d'intensité de l'orage
  const handleStormIntensityChange = useCallback((newIntensity: number) => {
    if (newIntensity !== stormIntensity) { // Éviter les mises à jour inutiles
      setStormIntensity(newIntensity)
      localStorage.setItem('stormIntensity', newIntensity.toString())
    }
  }, [stormIntensity])

  // Fonctions pour obtenir les descriptions en fonction des scores
  const getEnvironmentDescription = (score: number): string => {
    if (score < 40) return "Défavorable"
    if (score < 60) return "Moyen"
    if (score < 80) return "Favorable"
    return "Optimal"
  }
  
  const getStormIntensityDescription = (intensity: number): string => {
    if (intensity < 30) return "Faible"
    if (intensity < 60) return "Modéré"
    return "Élevé"
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center text-white mb-8">Simulation</h1>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="space-y-6">
          {/* Visualisation principale avec résumé */}
          <div className="flex flex-row gap-6">
            {/* Modèle principal */}
            <Card className="border-slate-800 bg-slate-950 shadow-xl overflow-hidden flex-grow">
              <CardContent className="p-4">
                <div className="bg-gradient-to-r from-slate-950 to-slate-900 p-4 rounded-lg mb-4">
                  <h3 className="text-xl font-semibold text-white mb-1">Simulation</h3>
                  <p className="text-sm text-gray-400">Visualisation des interactions</p>
                </div>
                <div className="relative w-full h-[650px] flex flex-col items-center justify-center">
                  {/* Bulle environnementale */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full overflow-hidden border-2 border-purple-400/40 bg-transparent shadow-[0_0_20px_rgba(168,85,247,0.15)] z-0" style={{ top: '48%' }}>
                    <EnvironmentParticles 
                      score={environmentScore} 
                      isPaused={isPaused}
                    />
                  </div>
                  
                  {/* Nuage d'orage */}
                  <div className="absolute z-40" style={{ top: '40%', left: '40%' }}>
                    <StormComponent 
                      intensity={stormIntensity} 
                      onIntensityChange={handleStormIntensityChange}
                    />
                  </div>
                  
                  {/* Bouton Réinitialiser sur la gauche */}
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white border-blue-500/50 hover:border-blue-400"
                      onClick={handleReset}
                    >
                      <RefreshCw className="h-4 w-4 text-blue-400" />
                      Réinitialiser
                    </Button>
                  </div>
                  
                  {/* Structure avec le robinet, le verre et la paille */}
                  <div className="flex flex-col items-center justify-center relative" style={{ height: '580px' }}>
                    {/* Robinet */}
                    <div className="relative z-20 mt-[50px]">
                      <TapComponent 
                        flowRate={flowRate} 
                        onFlowRateChange={handleFlowRateChange}
                        hideDebitLabel={true}
                      />
                    </div>
                    
                    {/* Verre */}
                    <div className="relative z-10 mt-[-120px]">
                      <GlassComponent 
                        width={glassSize} 
                        height={300}
                        fillLevel={fillLevel}
                        absorptionRate={absorptionRate}
                        absorptionCapacity={glassCapacity}
                        hideColorLegend={false}
                      />
                    </div>
                    
                    {/* Paille */}
                    <div className="absolute z-30 right-[20px] top-[80px]" style={{ transform: "rotate(0deg)" }}>
                      <StrawComponent 
                        absorptionRate={absorptionRate}
                        setAbsorptionRate={setAbsorptionRate}
                        isInsideGlass={true}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Résumé des paramètres */}
            <ProgressSummary 
              showParameters={['glass', 'tap', 'bubble', 'storm', 'straw']} 
              className="mt-0 self-start"
            />
          </div>
          
          {/* Section de contrôles */}
          <div className="grid grid-cols-1 gap-4 max-w-3xl mx-auto">
            {/* Paramètres de la paille */}
            <StrawSettingsForm />
          </div>
          
          {/* Bouton de réinitialisation */}
          <div className="flex justify-center pt-2 pb-8">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw className="w-4 h-4 mr-2" /> Réinitialiser tous les paramètres
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
