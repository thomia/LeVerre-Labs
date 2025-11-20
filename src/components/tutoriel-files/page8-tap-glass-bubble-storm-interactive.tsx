"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { EnvironmentParticles } from '@/components/dashboard/bubble-component'
import TapComponent from '@/components/dashboard/tap-component'
import GlassComponent from '@/components/dashboard/glass-component'
import StormComponent from '@/components/dashboard/storm-component'
import { getLocalStorage, setLocalStorage, emitStorageEvent } from '@/lib/localStorage'
import StormSettingsForm from '@/components/settings/storm-settings-form'
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

export default function TapGlassBubbleStormInteractive() {
  // États pour les paramètres du verre et du robinet
  const [glassSize, setGlassSize] = useState(100) 
  const [glassCapacity, setGlassCapacity] = useState(100) 
  const [flowRate, setFlowRate] = useState(50)
  const [fillLevel, setFillLevel] = useState(0) 
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
  
  // Charger les paramètres depuis le localStorage (une seule fois au montage)
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Charger la largeur du verre
    const savedGlassWidth = getLocalStorage('glassWidth')
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
    
    // Charger la capacité d'absorption
    const savedGlassCapacity = getLocalStorage('glassCapacity')
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

    // Charger l'intensité de l'orage
    const savedStormIntensity = getLocalStorage('stormIntensity')
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

    // Charger les paramètres de l'orage
    const savedStormSettings = getLocalStorage('stormSettings')
    if (savedStormSettings) {
      try {
        const parsedSettings = JSON.parse(savedStormSettings) as StormSettings
        setStormSettings(parsedSettings)
      } catch (e) {
        console.error("Erreur lors du chargement des paramètres de l'orage:", e)
      }
    }
  }, [])

  // Écouter les changements de largeur du verre et de capacité d'absorption
  const handleGlassCapacityUpdate = (event: Event) => {
    const customEvent = event as CustomEvent
    if (customEvent.detail) {
      if (customEvent.detail.width !== undefined) {
        setGlassSize(customEvent.detail.width)
      }
      if (customEvent.detail.capacity !== undefined) {
        setGlassCapacity(customEvent.detail.capacity)
      }
    }
  }

  useEffect(() => {
    window.addEventListener('glassCapacityUpdated', handleGlassCapacityUpdate)
    return () => {
      window.removeEventListener('glassCapacityUpdated', handleGlassCapacityUpdate)
    }
  }, [])

  // Calculer le score environnemental
  const calculateEnvironmentScore = (settings: BubbleSettings): number => {
    // Calculer le score en fonction des paramètres
    const temperatureScore = Math.abs(settings.temperature - 22) > 3 ? 80 : 40 // Idéal autour de 22°C
    const lightingScore = settings.lighting < 300 || settings.lighting > 700 ? 80 : 40 // Idéal entre 300-700 lux
    const noiseScore = settings.noise > 60 ? 80 : 40 // Idéal en dessous de 60 dB
    const protectionScore = !settings.useProtection ? 100 : 20 // Protection auditive recommandée si bruyant
    const hygieneScore = settings.hygiene < 50 ? 100 : 20 // Hygiène adéquate essentielle
    const spaceScore = settings.space < 40 ? 80 : 40 // Espace de travail suffisant nécessaire
    const equipmentScore = settings.equipment < 50 ? 80 : 40 // Équipement adéquat important
    const nightShiftScore = settings.nightShift ? 100 : 0 // Travail de nuit est un facteur significatif
    
    // Moyenne pondérée
    const rawScore = (
      (temperatureScore * 0.15) +
      (lightingScore * 0.15) +
      (noiseScore * 0.15) +
      (protectionScore * 0.1) +
      (hygieneScore * 0.1) +
      (spaceScore * 0.1) +
      (equipmentScore * 0.15) +
      (nightShiftScore * 0.1)
    )
    
    // Arrondir le score
    const roundedScore = Math.round(rawScore)
    
    // Limiter le score entre 0 et 100
    return Math.min(100, Math.max(0, roundedScore))
  }

  // Calculer l'intensité de l'orage
  const calculateStormIntensity = (settings: StormSettings): number => {
    // Normaliser les valeurs entre 0 et 1 pour la pondération
    const normalizedImpact = settings.impact / 10 // 1-10 -> 0.1-1
    const normalizedDuration = settings.duration / 60 // 0-60 -> 0-1
    const normalizedFrequency = settings.frequency / 10 // 1-10 -> 0.1-1  

    // Calculer le score brut        
    const rawScore = (
      (normalizedImpact * 100 / 3) + 
      (normalizedDuration * 100 / 3) +
      (normalizedFrequency * 100 / 3)
    )

    // Arrondir le score
    const roundedScore = Math.round(rawScore)

    // Limiter le score entre 0 et 100
    return Math.min(100, Math.max(0, roundedScore))
  }

  // Mettre à jour le score environnemental lorsque les paramètres changent
  useEffect(() => {
    const calculatedScore = calculateEnvironmentScore(settings);
    setEnvironmentScore(calculatedScore);

    // Sauvegarder le score dans localStorage
    setLocalStorage('environmentScore', calculatedScore.toString());      

    // Émettre un événement pour notifier les autres composants        
    const event = new CustomEvent('environmentScoreUpdated', { detail: { score: calculatedScore } });
    window.dispatchEvent(event);     
  }, [settings]);

  // Mettre à jour l'intensité de l'orage lorsque les paramètres changent
  useEffect(() => {
    const calculatedIntensity = calculateStormIntensity(stormSettings);   
    setStormIntensity(calculatedIntensity);

    // Sauvegarder l'intensité dans localStorage
    setLocalStorage('stormIntensity', calculatedIntensity.toString());    

    // Émettre un événement pour notifier les autres composants        
    const event = new CustomEvent('stormIntensityUpdated', { detail: { intensity: calculatedIntensity } });    
    window.dispatchEvent(event);     
  }, [stormSettings]);

  // Fonction pour gérer le changement de débit
  const handleFlowRateChange = (newRate: number) => {
    setFlowRate(newRate);
    setLocalStorage('flowRate', newRate.toString());
    emitStorageEvent();
  };

  // Fonction pour gérer le changement d'intensité de l'orage
  const handleStormIntensityChange = (newIntensity: number) => {
    setStormIntensity(newIntensity); 
    setLocalStorage('stormIntensity', newIntensity.toString());
    emitStorageEvent();
  };

  // Fonction pour mettre à jour un paramètre de la bulle
  const updateSetting = <K extends keyof BubbleSettings>(key: K, value: BubbleSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Fonction pour mettre à jour un paramètre de l'orage
  const updateStormSetting = <K extends keyof StormSettings>(key: K, value: StormSettings[K]) => {
    setStormSettings(prev => ({ ...prev, [key]: value }));
  };

  // Description du score environnemental
  const getEnvironmentDescription = (score: number): string => {
    if (score < 40) return "Favorable";
    if (score < 60) return "Neutre"; 
    if (score < 80) return "Défavorable";
    return "Critique";
  };

  // Description de l'intensité de l'orage
  const getStormIntensityDescription = (intensity: number): string => {   
    if (intensity < 30) return "Faible";
    if (intensity < 70) return "Modérée";
    return "Élevée";
  };

  // Fonction pour réinitialiser tous les paramètres
  const handleReset = () => {
    setGlassSize(100);
    setGlassCapacity(100);
    setFlowRate(50);
    setFillLevel(0);
    setSettings({
      temperature: 20,
      lighting: 500,
      noise: 70,
      useProtection: false,
      hygiene: 60,
      space: 50,
      equipment: 40,
      nightShift: false
    });
    setStormSettings({
      impact: 5,
      duration: 15,
      frequency: 3,
      type: 'physical'
    });
  };

  return (
    <div className="h-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}     
        animate={{ opacity: 1 }}     
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl px-4"
      >
        <div className="space-y-8">  
          <div className="flex flex-col items-center justify-center space-y-4">
            <h1 className="text-2xl font-bold">Visualisation des composants du modèle</h1>
            <p className="text-gray-500 text-center max-w-2xl">
              Cette page vous permet de visualiser l'interaction entre le robinet (débit), le verre (capacité),
              la bulle (environnement) et l'orage (aléas). Ajustez les paramètres pour voir leur impact sur le modèle.
            </p>
          </div>
          
          {/* Visualisation principale avec résumé */}
          <div className="flex flex-row gap-6">
            {/* Modèle principal */}
            <Card className="bg-gray-900/60 border-gray-800 overflow-hidden flex-grow">
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
                  
                  {/* Structure avec le robinet et le verre */}
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
                        absorptionRate={70}
                        absorptionCapacity={glassCapacity}
                        hideColorLegend={false}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Résumé des paramètres */}
            <ProgressSummary 
              showParameters={['glass', 'tap', 'bubble', 'storm']} 
              className="mt-0 self-start"
            />
          </div>
          
          {/* Section de contrôles */}
          <div className="grid grid-cols-1 gap-4 max-w-3xl mx-auto">
            {/* Paramètres de l'orage (aléas) */}
            <StormSettingsForm />
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
