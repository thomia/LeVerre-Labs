"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { BaseSettingsHeader } from "@/components/ui/base-settings-header"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CheckCircle2, Weight, Repeat, Layers, Brain, Users, Footprints, Timer, RefreshCw } from "lucide-react"
import TapComponent from '@/components/dashboard/tap-component'
import GlassComponent from '@/components/dashboard/glass-component'
import { getLocalStorage, setLocalStorage, emitStorageEvent } from '@/lib/localStorage'
import ProgressSummary from './progress-summary'

// Interface pour les paramètres de la bulle
interface BubbleSettings {
  temperature: number // 5-30°C
  nightShift: boolean // true/false
  lighting: number // 0-1000 lux
  noise: number // 40-95 dB
  useProtection: boolean // true/false (EPI/EPC pour le bruit)
  hygiene: number // 0-100%
  space: number // 0-100%
  equipment: number // 0-100%
}

// Interface pour les paramètres du robinet
interface TapSettings {
  // Paramètres physiques
  weight: number // Poids manipulé (0-100 kg)
  frequency: number // Fréquence des manipulations (0-100 par heure)
  posture: number // Score de posture (0-100)
  
  // Paramètres psychosociaux
  mentalWorkload: number // Charge mentale (0-100)
  psychosocialRisk: number // Risques psychosociaux (0-100)
}

// Fonction pour obtenir la couleur de fond du score
function getScoreBgColor(score: number, max: number): string {
  const percentage = score / max
  if (percentage < 0.25) return "bg-cyan-950/30"
  if (percentage < 0.5) return "bg-teal-950/30"
  if (percentage < 0.75) return "bg-amber-950/30"
  return "bg-rose-950/30"
}

// Fonction pour obtenir la couleur de bordure du score
function getScoreBorderColor(score: number, max: number): string {
  const percentage = score / max
  if (percentage < 0.25) return "border-cyan-900"
  if (percentage < 0.5) return "border-teal-900"
  if (percentage < 0.75) return "border-amber-900"
  return "border-rose-900"
}

// Fonction pour obtenir la couleur du texte du score
function getScoreColor(score: number, max: number): string {
  return "text-blue-400"
}

// Fonction pour calculer les scores intermédiaires
const getIntermediateScore = (score: number, maxScore: number) => {
  return Math.round((score / maxScore) * 20);
};

export default function TapAndGlassInteractive() {
  // États pour les paramètres du verre et du robinet
  const [glassSize, setGlassSize] = useState(100) // Valeur par défaut si aucune valeur n'est sauvegardée
  const [glassCapacity, setGlassCapacity] = useState(100) // Capacité d'absorption du verre
  const [flowRate, setFlowRate] = useState(50)
  const [isPaused, setIsPaused] = useState(false)
  
  // Charger la largeur du verre et la capacité d'absorption depuis le localStorage
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
    
    // Écouter les changements de largeur du verre et de capacité d'absorption
    const handleGlassCapacityUpdate = (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent.detail) {
        if (customEvent.detail.width) {
          setGlassSize(customEvent.detail.width)
        }
        if (customEvent.detail.capacity) {
          setGlassCapacity(customEvent.detail.capacity)
        }
      }
    }
    
    window.addEventListener('glassCapacityUpdated', handleGlassCapacityUpdate)
    
    return () => {
      window.removeEventListener('glassCapacityUpdated', handleGlassCapacityUpdate)
    }
  }, [])
  
  // États pour les paramètres du tap settings
  const [load, setLoad] = useState(20)
  const [frequency, setFrequency] = useState(10)
  const [posture, setPosture] = useState(15)
  const [mentalWorkload, setMentalWorkload] = useState(10)
  const [psychosocialRisk, setPsychosocialRisk] = useState(5)
  
  // Paramètres du robinet
  const [tapSettings, setTapSettings] = useState<TapSettings>({
    weight: 30,
    frequency: 40,
    posture: 50,
    mentalWorkload: 45,
    psychosocialRisk: 45
  })
  
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
  
  // État pour le statut (débordement ou non)
  const [isOverflowing, setIsOverflowing] = useState(false)
  
  // État pour le niveau de remplissage du verre
  const [fillLevel, setFillLevel] = useState(0)
  
  // Calculer le score environnemental
  const calculateEnvironmentScore = (settings: BubbleSettings): number => {
    // Facteurs de base
    let tempFactor = Math.abs(settings.temperature - 20) * 1.5; // Optimal à 20°C
    let lightFactor = Math.abs(settings.lighting - 500) / 10; // Optimal à 500 lux
    let noiseFactor = settings.noise;
    
    // Ajustements
    if (settings.noise > 85 && !settings.useProtection) {
      noiseFactor += 15; // Pénalité pour absence de protection à niveau sonore élevé
    }
    
    // Calcul du score final (0-100)
    const rawScore = (
      tempFactor + 
      lightFactor + 
      noiseFactor * 0.5 + 
      settings.hygiene * 0.7 + 
      settings.space * 0.6 + 
      settings.equipment * 0.8 + 
      (settings.nightShift ? 15 : 0)
    ) / 5;
    
    return Math.min(100, Math.max(0, Math.round(rawScore)));
  }
  
  // Mettre à jour le score environnemental lorsque les paramètres changent
  useEffect(() => {
    const score = calculateEnvironmentScore(settings);
    setEnvironmentScore(score);
  }, [settings]);
  
  // Calculer le débit du robinet en fonction des paramètres
  useEffect(() => {
    // Facteurs de base pour chaque paramètre
    const weightFactor = tapSettings.weight * 0.3 // 0-30
    const frequencyFactor = tapSettings.frequency * 0.2 // 0-20
    const postureFactor = tapSettings.posture * 0.2 // 0-20
    const mentalFactor = tapSettings.mentalWorkload * 0.15 // 0-15
    const psychosocialFactor = tapSettings.psychosocialRisk * 0.15 // 0-15
    
    // Calcul du débit total (0-100)
    let calculatedFlow = (
      weightFactor + 
      frequencyFactor + 
      postureFactor + 
      mentalFactor + 
      psychosocialFactor
    )
    
    // Limiter le débit entre 0 et 100
    calculatedFlow = Math.max(0, Math.min(100, calculatedFlow))
    
    // Mettre à jour le débit immédiatement sans délai
    setFlowRate(Math.round(calculatedFlow))
  }, [tapSettings]);
  
  // Mettre à jour le débit lorsque les paramètres changent
  useEffect(() => {
    updateFlowRate();
  }, [load, frequency, posture, mentalWorkload, psychosocialRisk]);
  
  // Simuler le remplissage progressif du verre en fonction du débit
  useEffect(() => {
    if (flowRate === 0 || isPaused) return;
    
    // Intervalle pour augmenter progressivement le niveau de remplissage
    const interval = setInterval(() => {
      setFillLevel(prevLevel => {
        // Calculer le nouveau niveau en fonction du débit
        // Plus le débit est élevé, plus le remplissage est rapide
        const inflow = (flowRate / 100) * 0.5;
        
        // Facteur environnemental (impact de l'environnement sur le remplissage)
        const environmentFactor = 1 + (environmentScore / 200);
        
        // Calculer le changement net avec un facteur linéaire
        const netChange = inflow * environmentFactor;
        
        // Appliquer le changement avec une progression linéaire
        let newLevel = prevLevel + netChange;
        
        // Vérifier si le verre est plein par rapport à sa capacité
        if (newLevel >= glassSize) {
          // Si le verre déborde, continuer à augmenter jusqu'à 100% pour l'affichage visuel
          // mais marquer comme débordant
          setIsOverflowing(true);
          
          // Continuer à remplir jusqu'à 100% pour montrer toutes les zones de couleur
          return Math.min(100, newLevel);
        }
        
        return newLevel;
      });
    }, 50); // Mise à jour fréquente pour une animation fluide
    
    return () => clearInterval(interval);
  }, [flowRate, glassSize, isPaused, environmentScore, isOverflowing]);
  
  // Réinitialiser le niveau de remplissage lorsque les paramètres sont modifiés
  const resetFillLevel = () => {
    setFillLevel(0);
    setIsOverflowing(false);
  };
  
  // Fonction pour vider complètement le verre
  const handleEmptyGlass = useCallback(() => {
    // Réinitialiser le niveau de remplissage
    setFillLevel(0);
    setIsOverflowing(false);
    
    // Pause temporaire pour éviter un remplissage immédiat
    setIsPaused(true);
    setTimeout(() => {
      setIsPaused(false);
    }, 300);
  }, []);

  // Fonction pour gérer le changement de débit
  const handleFlowRateChange = (newRate: number) => {
    setFlowRate(newRate);
  }
  
  // Fonction pour mettre à jour le débit en fonction des 5 dimensions
  const updateFlowRate = () => {
    const calculatedRate = calculateTotalScore();
    setFlowRate(calculatedRate);
    
    // Vérifier si le verre déborde
    setIsOverflowing(calculatedRate > glassSize);
  }
  
  // Fonction pour calculer le score total qui détermine le débit
  const calculateTotalScore = () => {
    // Normalisation de chaque sous-thème sur 20 points
    const normalizedLoad = (load / 55) * 20;
    const normalizedFrequency = (frequency / 60) * 20;
    const normalizedPosture = (posture / 30) * 20;
    const normalizedMental = (mentalWorkload / 20) * 20;
    const normalizedPsychosocial = (psychosocialRisk / 15) * 20;
    
    // Score final sur 100 points
    return Math.round(
      normalizedLoad + 
      normalizedPosture + 
      normalizedFrequency + 
      normalizedMental + 
      normalizedPsychosocial
    );
  }
  
  // Fonction pour obtenir la description du score total
  function getTotalScoreDescription(score: number): string {
    if (score >= 80) return "Risque très élevé";
    if (score >= 60) return "Risque élevé";
    if (score >= 40) return "Risque modéré";
    return "Risque faible";
  }
  
  // Fonction pour mettre à jour un paramètre de la bulle
  const updateSetting = <K extends keyof BubbleSettings>(key: K, value: BubbleSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }
  
  // Fonction pour mettre à jour un paramètre du robinet
  const updateTapSetting = <K extends keyof TapSettings>(key: K, value: TapSettings[K]) => {
    // Mettre à jour les paramètres du robinet
    setTapSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      
      // Calculer le débit instantanément
      const weightFactor = newSettings.weight * 0.3; // 0-30
      const frequencyFactor = newSettings.frequency * 0.2; // 0-20
      const postureFactor = newSettings.posture * 0.2; // 0-20
      const mentalFactor = newSettings.mentalWorkload * 0.15; // 0-15
      const psychosocialFactor = newSettings.psychosocialRisk * 0.15; // 0-15
      
      // Calcul du débit total (0-100)
      let calculatedFlow = (
        weightFactor + 
        frequencyFactor + 
        postureFactor + 
        mentalFactor + 
        psychosocialFactor
      );
      
      // Limiter le débit entre 0 et 100
      calculatedFlow = Math.max(0, Math.min(100, calculatedFlow));
      
      // Mettre à jour le débit immédiatement
      setFlowRate(Math.round(calculatedFlow));
      
      return newSettings;
    });
  }
  
  // Description du score environnemental
  function getEnvironmentDescription(score: number): string {
    if (score >= 80) return "Agitation importante";
    if (score >= 60) return "Agitation élevée";
    if (score >= 40) return "Agitation acceptable";
    return "Agitation faible";
  }

  return (
    <div className="w-full h-auto min-h-screen py-6 flex flex-col items-center">
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-gradient-to-b from-slate-950 to-slate-900 rounded-xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Interaction Verre, Robinet et Bulle</h2>
          
          <div className="flex flex-col gap-6">
            {/* Espace pour d'autres composants si nécessaire */}
            
            {/* Visualisation principale avec ProgressSummary */}
            <div className="flex flex-row gap-6">
              {/* Modèle principal */}
              <Card className="bg-gray-900/60 border-gray-800 overflow-hidden flex-grow">
                <CardContent className="p-4">
                  <div className="bg-gradient-to-r from-slate-950 to-slate-900 p-4 rounded-lg mb-4">
                    <h3 className="text-xl font-semibold text-white mb-1">Simulation</h3>
                    <p className="text-sm text-gray-400">Visualisation des interactions</p>
                  </div>
              
                  <div className="relative w-full h-[650px] flex flex-col items-center justify-center">
                      
                    {/* Bouton Réinitialiser sur la gauche */}
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white border-blue-500/50 hover:border-blue-400"
                        onClick={handleEmptyGlass}
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
              
              {/* Résumé des paramètres précédents */}
              <ProgressSummary 
                showParameters={['glass']} 
                className="mt-0 self-start"
              />
            </div>
          </div>
        </div>
        
        {/* Partie inférieure: Paramètres */}
        <Card className="bg-gradient-to-b from-slate-950 to-slate-900 border-slate-800 mt-6">
          {/* Affichage du score calculé */}
          <div className="px-6 pt-6">
            <BaseSettingsHeader
              title="Score de débit calculé"
              description="Ce score représente le débit du robinet en fonction des paramètres physiques et psychosociaux."
              currentValue={flowRate}
              getValueDescription={getTotalScoreDescription}
              scoreType="tap"
            />
          </div>
          
          <CardHeader>
            <CardTitle className="text-blue-400 text-xl">
              Paramètres du Robinet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-gray-300">
                Le robinet représente les contraintes physiques et mentales imposées par le travail.
                Ajustez les paramètres ci-dessous pour voir comment ils influencent le débit.
              </p>
              
              {/* Paramètres physiques */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Footprints className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-blue-400">Facteurs physiques</h3>
                </div>
                
                {/* Poids manipulé */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium text-white flex items-center gap-2">
                      <Weight className="h-4 w-4 text-blue-400" />
                      Poids manipulé
                    </Label>
                    <span className="px-2 py-1 rounded-md bg-gray-800 text-sm font-medium text-gray-100 shadow-md">{tapSettings.weight} kg</span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    value={[tapSettings.weight]}
                    onValueChange={([value]) => updateTapSetting('weight', value)}
                    className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:bg-blue-400 [&_[role=slider]]:border-2 [&_[role=slider]]:border-blue-500 [&_[role=slider]]:shadow-md relative [&_.range]:bg-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Léger</span>
                    <span>Lourd</span>
                  </div>
                </div>
                
                {/* Fréquence */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium text-white flex items-center gap-2">
                      <Timer className="h-4 w-4 text-blue-400" />
                      Fréquence des manipulations
                    </Label>
                    <span className="px-2 py-1 rounded-md bg-gray-800 text-sm font-medium text-gray-100 shadow-md">{tapSettings.frequency}/heure</span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    value={[tapSettings.frequency]}
                    onValueChange={([value]) => updateTapSetting('frequency', value)}
                    className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:bg-blue-400 [&_[role=slider]]:border-2 [&_[role=slider]]:border-blue-500 [&_[role=slider]]:shadow-md relative [&_.range]:bg-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Rare</span>
                    <span>Fréquent</span>
                  </div>
                </div>
                
                {/* Score de posture */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium text-white flex items-center gap-2">
                      <Footprints className="h-4 w-4 text-blue-400" />
                      Score de posture
                    </Label>
                    <span className="px-2 py-1 rounded-md bg-gray-800 text-sm font-medium text-gray-100 shadow-md">{tapSettings.posture}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    value={[tapSettings.posture]}
                    onValueChange={([value]) => updateTapSetting('posture', value)}
                    className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:bg-blue-400 [&_[role=slider]]:border-2 [&_[role=slider]]:border-blue-500 [&_[role=slider]]:shadow-md relative [&_.range]:bg-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Confortable</span>
                    <span>Contraignante</span>
                  </div>
                </div>
              </div>
              
              {/* Paramètres psychosociaux */}
              <div className="space-y-6 mt-8">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-purple-400">Facteurs psychosociaux</h3>
                </div>
                
                {/* Charge mentale */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium text-white flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-400" />
                      Charge mentale
                    </Label>
                    <span className="px-2 py-1 rounded-md bg-gray-800 text-sm font-medium text-gray-100 shadow-md">{tapSettings.mentalWorkload}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    value={[tapSettings.mentalWorkload]}
                    onValueChange={([value]) => updateTapSetting('mentalWorkload', value)}
                    className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:bg-purple-400 [&_[role=slider]]:border-2 [&_[role=slider]]:border-purple-500 [&_[role=slider]]:shadow-md relative [&_.range]:bg-purple-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Faible</span>
                    <span>Élevée</span>
                  </div>
                </div>
                
                {/* Risques psychosociaux */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium text-white flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-400" />
                      Risques psychosociaux
                    </Label>
                    <span className="px-2 py-1 rounded-md bg-gray-800 text-sm font-medium text-gray-100 shadow-md">{tapSettings.psychosocialRisk}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    value={[tapSettings.psychosocialRisk]}
                    onValueChange={([value]) => updateTapSetting('psychosocialRisk', value)}
                    className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:bg-purple-400 [&_[role=slider]]:border-2 [&_[role=slider]]:border-purple-500 [&_[role=slider]]:shadow-md relative [&_.range]:bg-purple-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Faibles</span>
                    <span>Élevés</span>
                  </div>
                </div>
              </div>
              
              {/* Explication du calcul */}
              <div className="mt-8 p-4 bg-slate-900/80 rounded-lg border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-3">Comment le débit est-il calculé ?</h3>
                
                <div className="space-y-3 text-sm text-slate-300">
                  <p>Le débit du robinet représente les contraintes physiques et mentales imposées par le travail. Il est calculé en fonction de plusieurs facteurs :</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    <div className="flex items-start gap-2">
                      <Weight className="h-4 w-4 mt-0.5 text-rose-400" />
                      <div>
                        <p className="font-medium text-rose-400">Poids manipulé</p>
                        <p className="text-xs text-gray-400">Impact: 30% du débit total</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Timer className="h-4 w-4 mt-0.5 text-amber-400" />
                      <div>
                        <p className="font-medium text-amber-400">Fréquence</p>
                        <p className="text-xs text-gray-400">Impact: 20% du débit total</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Footprints className="h-4 w-4 mt-0.5 text-blue-400" />
                      <div>
                        <p className="font-medium text-blue-400">Posture</p>
                        <p className="text-xs text-gray-400">Impact: 20% du débit total</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Brain className="h-4 w-4 mt-0.5 text-purple-400" />
                      <div>
                        <p className="font-medium text-purple-400">Charge mentale</p>
                        <p className="text-xs text-gray-400">Impact: 15% du débit total</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 mt-0.5 text-emerald-400" />
                      <div>
                        <p className="font-medium text-emerald-400">Risques psychosociaux</p>
                        <p className="text-xs text-gray-400">Impact: 15% du débit total</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <p>Le débit final est comparé à la capacité d'absorption du verre pour déterminer si le corps peut faire face aux contraintes imposées.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
