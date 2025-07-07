"use client"

import { useState, useCallback, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import GlassComponent from '../dashboard/glass-component'
import { BaseSettingsHeader } from "@/components/ui/base-settings-header"
import { getLocalStorage, setLocalStorage, emitStorageEvent } from '@/lib/localStorage'
import ProgressSummary from './progress-summary'

// Types pour les antécédents médicaux
interface MedicalHistory {
  neckProblems: boolean;
  backProblems: boolean;
  shoulderProblems: boolean;
  wristProblems: boolean;
  kneeProblems: boolean;
  previousTMS: boolean;
}

type MedicalHistoryKey = keyof MedicalHistory;

// Pathologies possibles avec leurs descriptions
const pathologies = [
  { 
    id: 'neckProblems', 
    label: 'Problèmes de cou',
    description: 'Antécédents de douleurs ou tensions cervicales'
  },
  { 
    id: 'backProblems', 
    label: 'Problèmes de dos',
    description: 'Antécédents de lombalgies ou autres troubles du dos'
  },
  { 
    id: 'shoulderProblems', 
    label: 'Problèmes d\'épaule',
    description: 'Antécédents de tendinites ou douleurs à l\'épaule'
  },
  { 
    id: 'wristProblems', 
    label: 'Problèmes de poignet',
    description: 'Antécédents de syndrome du canal carpien ou tendinites'
  },
  { 
    id: 'kneeProblems', 
    label: 'Problèmes de genou',
    description: 'Antécédents de troubles articulaires du genou'
  },
  { 
    id: 'previousTMS', 
    label: 'Autres antécédents de TMS',
    description: 'Autres troubles musculo-squelettiques non listés'
  }
]

export default function GlassInteractive() {
  // États pour les paramètres individuels
  const [age, setAge] = useState(30)
  const [physicalActivity, setPhysicalActivity] = useState(3)
  const [nutrition, setNutrition] = useState(3)
  const [sleepDuration, setSleepDuration] = useState(7)

  // État pour les antécédents médicaux
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory>({
    neckProblems: false,
    backProblems: false,
    shoulderProblems: false,
    wristProblems: false,
    kneeProblems: false,
    previousTMS: false
  })

  // Calculer la capacité d'absorption et la largeur du verre
  const { absorptionCapacity, glassWidth } = useMemo(() => {
    // Facteur d'âge (diminue avec l'âge)
    const ageFactor = age <= 30 ? 20 : 
                     age <= 40 ? 15 :
                     age <= 50 ? 10 :
                     age <= 60 ? 5 : 0
    
    // Facteur d'activité physique (0-7 fois par semaine)
    const activityFactor = physicalActivity * 5 // 0-35
    
    // Facteur de nutrition (1-5 échelle)
    const nutritionFactor = nutrition * 5 // 5-25
    
    // Facteur de sommeil (10% par heure jusqu'à 7h)
    const sleepFactor = Math.min(sleepDuration, 7) * 5 // 0-35
    
    // Facteur d'antécédents médicaux (négatif)
    const medicalFactor = Object.values(medicalHistory)
      .reduce((acc, condition) => condition ? acc - 5 : acc, 0)
    
    // Calculer la capacité totale
    let capacity = ageFactor + activityFactor + nutritionFactor + sleepFactor + medicalFactor
    
    // Limiter la capacité entre 10% et 100%
    capacity = Math.max(10, Math.min(100, capacity))
    
    const calculatedCapacity = Math.round(capacity)
    const calculatedWidth = 20 + (capacity / 100) * 70
    
    return {
      absorptionCapacity: calculatedCapacity,
      glassWidth: calculatedWidth
    }
  }, [age, physicalActivity, nutrition, sleepDuration, medicalHistory])
  
  // Sauvegarder la capacité d'absorption et la largeur du verre dans le localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Sauvegarder les valeurs dans le localStorage
    setLocalStorage('glassCapacity', absorptionCapacity.toString())
    setLocalStorage('glassWidth', glassWidth.toString())
    
    // Émettre un événement pour notifier les autres composants
    const event = new CustomEvent('glassCapacityUpdated', {
      detail: { 
        capacity: absorptionCapacity,
        width: glassWidth
      }
    })
    window.dispatchEvent(event)
    
    // Émettre un événement storage pour synchroniser tous les composants
    emitStorageEvent('glassCapacity')
    emitStorageEvent('glassWidth')
  }, [absorptionCapacity, glassWidth])

  // Gérer les changements d'antécédents médicaux
  const handleMedicalHistoryChange = useCallback((key: MedicalHistoryKey, checked: boolean) => {
    setMedicalHistory(prev => ({ ...prev, [key]: checked }))
  }, [])

  // Obtenir la description de la nutrition
  const getNutritionDescription = useCallback((value: number) => {
    if (value >= 4) return "Alimentation très équilibrée"
    if (value >= 3) return "Alimentation équilibrée"
    if (value >= 2) return "Alimentation moyenne"
    return "Alimentation non équilibrée"
  }, [])
  
  // Obtenir la description de la capacité d'absorption
  const getAbsorptionCapacityDescription = useCallback((value: number) => {
    if (value >= 80) return "Excellente capacité d'absorption"
    if (value >= 60) return "Bonne capacité d'absorption"
    if (value >= 40) return "Capacité d'absorption moyenne"
    if (value >= 20) return "Faible capacité d'absorption"
    return "Très faible capacité d'absorption"
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto p-4 relative">
      {/* Visualisation du verre */}
      <div className="flex gap-6 items-start relative">
        <Card className="mb-6 bg-gradient-to-r from-slate-950 to-slate-900 flex-grow">
          <BaseSettingsHeader 
            title="Capacité d'absorption" 
            description="Facteurs individuels qui influencent la résistance aux TMS"
            currentValue={absorptionCapacity}
            scoreType="glass"
            getValueDescription={(value) => {
              if (value >= 80) return "Excellente capacité d'absorption";
              if (value >= 60) return "Bonne capacité d'absorption";
              if (value >= 40) return "Capacité d'absorption moyenne";
              if (value >= 20) return "Faible capacité d'absorption";
              return "Très faible capacité d'absorption";
            }}
          />
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center">
              <GlassComponent 
                width={glassWidth} 
                height={300} 
                fillLevel={0}
                absorptionCapacity={absorptionCapacity}
                absorptionRate={70}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Résumé des paramètres précédents */}
        <div className="sticky top-4">
          <ProgressSummary 
            showParameters={['glass']} 
            className="mt-1"
          />
        </div>
      </div>

      {/* Section du verre - paramètres */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-blue-400 text-2xl">Le Verre : Votre Capacité d'Absorption</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Indicateur de note de capacité */}
            <div className="w-full mb-6">
              <BaseSettingsHeader
                title="Capacité d'absorption"
                description="Votre capacité à absorber les contraintes physiques et à récupérer"
                currentValue={absorptionCapacity}
                getValueDescription={getAbsorptionCapacityDescription}
                scoreType="glass"
              />
            </div>
            
            {/* Accordion pour les paramètres */}
            <Accordion type="single" collapsible className="space-y-4">
              {/* Facteurs individuels */}
              <AccordionItem value="facteurs-individuels" className="border-none">
                <AccordionTrigger className="text-white hover:text-blue-400 py-4 px-6 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors text-lg">
                  Facteurs individuels
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-6">
                  <div className="space-y-6">
                    {/* Age */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label className="text-gray-300 text-base">Âge</Label>
                        <span className="text-gray-300 text-base">{age} ans</span>
                      </div>
                      <input
                        type="range"
                        min={18}
                        max={65}
                        value={age}
                        onChange={(e) => setAge(parseInt(e.target.value))}
                        className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500
                          [&::-webkit-slider-thumb]:w-5 
                          [&::-webkit-slider-thumb]:h-5 
                          [&::-webkit-slider-thumb]:appearance-none 
                          [&::-webkit-slider-thumb]:bg-white 
                          [&::-webkit-slider-thumb]:rounded-full 
                          [&::-webkit-slider-thumb]:shadow-[0_0_5px_rgba(255,255,255,0.5)]
                          [&::-webkit-slider-thumb]:transition-all
                          [&::-webkit-slider-thumb]:duration-150
                          [&::-webkit-slider-thumb]:hover:scale-110"
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">18 ans</span>
                        <span className="text-xs text-gray-500">65 ans</span>
                      </div>
                    </div>

                    {/* Activité sportive */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label className="text-gray-300 text-base">Activité sportive</Label>
                        <span className="text-gray-300 text-base">{physicalActivity} fois/semaine</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={7}
                        value={physicalActivity}
                        onChange={(e) => setPhysicalActivity(parseInt(e.target.value))}
                        className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500
                          [&::-webkit-slider-thumb]:w-5 
                          [&::-webkit-slider-thumb]:h-5 
                          [&::-webkit-slider-thumb]:appearance-none 
                          [&::-webkit-slider-thumb]:bg-white 
                          [&::-webkit-slider-thumb]:rounded-full 
                          [&::-webkit-slider-thumb]:shadow-[0_0_5px_rgba(255,255,255,0.5)]
                          [&::-webkit-slider-thumb]:transition-all
                          [&::-webkit-slider-thumb]:duration-150
                          [&::-webkit-slider-thumb]:hover:scale-110"
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">0 fois/semaine</span>
                        <span className="text-xs text-gray-500">7 fois/semaine</span>
                      </div>
                    </div>

                    {/* Alimentation */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label className="text-gray-300 text-base">Alimentation</Label>
                        <span className="text-gray-300 text-base">{getNutritionDescription(nutrition)}</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={nutrition}
                        onChange={(e) => setNutrition(parseInt(e.target.value))}
                        className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500
                          [&::-webkit-slider-thumb]:w-5 
                          [&::-webkit-slider-thumb]:h-5 
                          [&::-webkit-slider-thumb]:appearance-none 
                          [&::-webkit-slider-thumb]:bg-white 
                          [&::-webkit-slider-thumb]:rounded-full 
                          [&::-webkit-slider-thumb]:shadow-[0_0_5px_rgba(255,255,255,0.5)]
                          [&::-webkit-slider-thumb]:transition-all
                          [&::-webkit-slider-thumb]:duration-150
                          [&::-webkit-slider-thumb]:hover:scale-110"
                      />
                    </div>

                    {/* Sommeil */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label className="text-gray-300 text-base">Sommeil</Label>
                        <span className="text-gray-300 text-base">{sleepDuration} heures/jour</span>
                      </div>
                      <input
                        type="range"
                        min={4}
                        max={10}
                        value={sleepDuration}
                        onChange={(e) => setSleepDuration(parseInt(e.target.value))}
                        className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500
                          [&::-webkit-slider-thumb]:w-5 
                          [&::-webkit-slider-thumb]:h-5 
                          [&::-webkit-slider-thumb]:appearance-none 
                          [&::-webkit-slider-thumb]:bg-white 
                          [&::-webkit-slider-thumb]:rounded-full 
                          [&::-webkit-slider-thumb]:shadow-[0_0_5px_rgba(255,255,255,0.5)]
                          [&::-webkit-slider-thumb]:transition-all
                          [&::-webkit-slider-thumb]:duration-150
                          [&::-webkit-slider-thumb]:hover:scale-110"
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">4 heures/jour</span>
                        <span className="text-xs text-gray-500">10 heures/jour</span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Antécédents médicaux */}
              <AccordionItem value="antecedents-medicaux" className="border-none">
                <AccordionTrigger className="text-white hover:text-blue-400 py-4 px-6 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors text-lg">
                  Antécédents médicaux
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-6">
                  <div className="grid grid-cols-1 gap-4">
                    {pathologies.map((pathology) => {
                      const isSelected = medicalHistory[pathology.id as MedicalHistoryKey];
                      return (
                        <button
                          key={pathology.id}
                          onClick={() => handleMedicalHistoryChange(pathology.id as MedicalHistoryKey, !isSelected)}
                          className={`w-full p-4 rounded-lg transition-colors duration-200 flex items-center justify-between
                            ${isSelected ? 'bg-blue-500/20' : 'bg-slate-800/50 hover:bg-slate-800'}`}
                        >
                          <div className="flex-1">
                            <p className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                              {pathology.label}
                            </p>
                            <p className={`text-base ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                              {pathology.description}
                            </p>
                          </div>
                          <div className={`ml-3 rounded-full p-1.5 
                            ${isSelected 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-slate-700 text-gray-400'
                            }`}
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className={`w-5 h-5 transition-transform duration-200 ${isSelected ? 'scale-100' : 'scale-0'}`}
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
