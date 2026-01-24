"use client"

/**
 * ANALYSE GUIDÉE - ROBINET (Score R)
 * ===================================
 * Évalue la CHARGE DE TRAVAIL totale à travers 4 sections :
 * 
 * A. CHARGES PHYSIQUES (5 questions)
 * B. POSTURES (2 questions) 
 * C. CHARGE MENTALE NASA-TLX (6 échelles)
 * D. RISQUES PSYCHOSOCIAUX Karasek (18 questions)
 * 
 * CALCUL FINAL DU SCORE R :
 * -------------------------
 * Score_R = (Score_Charges × Pond_A) + (Score_Postures × Pond_B) + 
 *           (Score_Mental × Pond_C) + (Score_RPS × Pond_D)
 * 
 * Plafonné entre 0 et 100
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardSimplified from '@/components/dashboard/dashboard-simplified'
import { ChevronRight, Info } from 'lucide-react'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface QuestionOption {
  label: string
  value: number
  description?: string
}

interface Question {
  id: string
  section: 'A' | 'B' | 'C' | 'D'
  type: 'single' | 'multiple' | 'scale'
  question: string
  subtitle?: string
  options?: QuestionOption[]
  scaleMin?: number
  scaleMax?: number
  scaleLabels?: { min: string; max: string }
}

// ============================================================================
// SECTION A : CHARGES PHYSIQUES
// ============================================================================

/**
 * FORMULE SECTION A - CHARGES :
 * ------------------------------
 * Score_Charges_Brut = Points_Base_Poids × (1 + Ajust_Préhension + Ajust_Fréquence)
 * 
 * Où :
 * - Points_Base_Poids : de 5 à 100 selon le poids de la charge (Q3)
 * - Ajust_Préhension : de 0 à 0.45 selon la difficulté de prise (Q4)
 * - Ajust_Fréquence : de 0 à 0.60 selon la fréquence de manipulation (Q5)
 * 
 * Le score brut est ensuite normalisé sur 100 et pondéré dans le Score R final
 */

const sectionA_Questions: Question[] = [
  {
    id: 'charges_presence',
    section: 'A',
    type: 'single',
    question: 'Est-ce que l\'opérateur doit soulever, pousser, tirer ou porter quelque chose ?',
    subtitle: 'Question filtre - Si "Non", la section Charges ne s\'applique pas',
    options: [
      { label: 'Non, aucune manipulation', value: 0 },
      { label: 'Oui, rarement (< 10 fois/heure)', value: 1 },
      { label: 'Oui, régulièrement (10-50 fois/heure)', value: 2 },
      { label: 'Oui, très fréquemment (> 50 fois/heure)', value: 3 }
    ]
  },
  {
    id: 'charges_type',
    section: 'A',
    type: 'single',
    question: 'Majoritairement, comment la charge est-elle manipulée ?',
    subtitle: 'Type de manipulation dominant',
    options: [
      { label: 'Soulevée (du sol ou d\'une surface)', value: 1, description: 'Soulever verticalement' },
      { label: 'Portée sur une distance', value: 2, description: 'Transport horizontal' },
      { label: 'Poussée (chariot, caisse, etc.)', value: 3, description: 'Pousser devant soi' },
      { label: 'Tirée (vers soi)', value: 4, description: 'Tirer vers soi' }
    ]
  },
  {
    id: 'charges_poids',
    section: 'A',
    type: 'single',
    question: 'Combien pèse la charge typique ?',
    subtitle: 'Poids moyen des charges manipulées',
    options: [
      { label: '< 3 kg', value: 5, description: 'Très léger' },
      { label: '3-5 kg', value: 10, description: 'Léger' },
      { label: '5-10 kg', value: 20, description: 'Modéré' },
      { label: '10-15 kg', value: 40, description: 'Élevé' },
      { label: '15-25 kg', value: 60, description: 'Très élevé' },
      { label: '25-40 kg', value: 80, description: 'Critique' },
      { label: '40-55 kg', value: 90, description: 'Très critique' },
      { label: '> 55 kg', value: 100, description: 'Extrême' }
    ]
  },
  {
    id: 'charges_prehension',
    section: 'A',
    type: 'single',
    question: 'Comment est la prise en main ?',
    subtitle: 'Qualité de la préhension - Multiplicateur appliqué au score de base',
    options: [
      { label: 'Facile', value: 0, description: 'Poignées, prises ergonomiques' },
      { label: 'Correct', value: 0.1, description: 'Prise possible mais non optimale' },
      { label: 'Difficile', value: 0.30, description: 'Forme inadaptée, glissant' },
      { label: 'Très difficile', value: 0.45, description: 'Aucune prise, poids déséquilibré' }
    ]
  },
  {
    id: 'charges_frequence',
    section: 'A',
    type: 'single',
    question: 'Pendant 2 minutes, combien de fois la charge est manipulée ?',
    subtitle: 'Fréquence de manipulation - Multiplicateur appliqué au score de base',
    options: [
      { label: 'Rare : < 1 fois/minute', value: 0, description: 'Occasionnel' },
      { label: 'Occasionnel : 1-5 fois/minute', value: 0.20, description: 'Régulier' },
      { label: 'Fréquent : 5-15 fois/minute', value: 0.40, description: 'Répétitif' },
      { label: 'Très fréquent : > 15 fois/minute', value: 0.60, description: 'Très répétitif' }
    ]
  }
]

// ============================================================================
// SECTION B : POSTURES
// ============================================================================

/**
 * FORMULE SECTION B - POSTURES :
 * -------------------------------
 * Score_Postures = Σ(Points_Postures_Observées) × Facteur_Fréquence
 * 
 * Où :
 * - Points_Postures_Observées : somme des points des postures cochées (Q6)
 *   (de +15 à +40 par posture, plusieurs postures peuvent être sélectionnées)
 * - Facteur_Fréquence : multiplicateur selon durée d'exposition (Q7)
 *   ×0.5 (ponctuel) / ×1 (modéré) / ×1.5 (important) / ×2 (très important)
 * 
 * Le score est ensuite normalisé sur 100 et pondéré dans le Score R final
 */

const sectionB_Questions: Question[] = [
  {
    id: 'postures_observation',
    section: 'B',
    type: 'multiple',
    question: 'Regarde l\'opérateur durant 2-3 minutes et coche ce que tu observes :',
    subtitle: 'Plusieurs postures peuvent être sélectionnées - Points cumulatifs',
    options: [
      { 
        label: 'Bras levés au-dessus des épaules', 
        value: 35,
        description: 'Coudes au niveau des oreilles ou plus haut (abduction ≥60°)'
      },
      { 
        label: 'Dos penché en avant de manière répétée', 
        value: 40,
        description: 'Tête dépasse la ligne verticale des hanches (flexion >30°)'
      },
      { 
        label: 'Dos en torsion/rotation pendant le travail', 
        value: 25,
        description: 'Épaules et hanches ne pointent pas dans la même direction'
      },
      { 
        label: 'Cou penché en avant OU en arrière', 
        value: 15,
        description: 'Menton proche de la poitrine (flexion) OU tête basculée arrière'
      },
      { 
        label: 'Gestes rapides et répétés des mains/poignets avec effort', 
        value: 20,
        description: 'Mouvements de préhension/torsion/vissage répétés'
      },
      { 
        label: 'À genoux ou accroupi de manière prolongée', 
        value: 20,
        description: 'Position à genoux ou accroupi (cuisses proches des mollets)'
      },
      { 
        label: 'Position statique prolongée (debout ou assis)', 
        value: 10,
        description: 'Reste dans la même position >30 min sans changement'
      }
    ]
  },
  {
    id: 'postures_frequence',
    section: 'B',
    type: 'single',
    question: 'À quelle fréquence ces postures contraignantes sont-elles adoptées ?',
    subtitle: 'Durée d\'exposition quotidienne - Multiplicateur appliqué au score',
    options: [
      { label: 'Ponctuel (< 1h/jour)', value: 0.5, description: 'Exposition limitée' },
      { label: 'Modéré (1-2h/jour)', value: 1, description: 'Exposition modérée' },
      { label: 'Important (2-4h/jour)', value: 1.5, description: 'Exposition significative' },
      { label: 'Très important (>4h/jour)', value: 2, description: 'Exposition prolongée' }
    ]
  }
]

// ============================================================================
// SECTION C : CHARGE MENTALE (NASA-TLX)
// ============================================================================

/**
 * FORMULE SECTION C - CHARGE MENTALE (NASA-TLX) :
 * ------------------------------------------------
 * Score_Mental_Brut = Σ(Échelles_1_à_6) / 120 × 100
 * 
 * Où chaque échelle varie de 0 à 20 points :
 * 1. Exigence mentale (0-20)
 * 2. Exigence physique (0-20)
 * 3. Exigence temporelle (0-20)
 * 4. Performance (0-20, inversé : mauvaise performance = score élevé)
 * 5. Effort (0-20)
 * 6. Niveau de frustration (0-20)
 * 
 * Score maximum : 120 points, normalisé sur 100
 * Le score est ensuite pondéré dans le Score R final
 */

const sectionC_Questions: Question[] = [
  {
    id: 'mental_exigence',
    section: 'C',
    type: 'scale',
    question: 'Exigence mentale',
    subtitle: 'Quelle activité mentale et perceptive était requise (penser, décider, calculer, se souvenir, regarder, chercher) ?',
    scaleMin: 0,
    scaleMax: 20,
    scaleLabels: { min: 'Faible', max: 'Élevée' }
  },
  {
    id: 'mental_physique',
    section: 'C',
    type: 'scale',
    question: 'Exigence physique',
    subtitle: 'Quelle quantité d\'activité physique était requise (pousser, tirer, tourner, contrôler, activer) ?',
    scaleMin: 0,
    scaleMax: 20,
    scaleLabels: { min: 'Faible', max: 'Élevée' }
  },
  {
    id: 'mental_temporelle',
    section: 'C',
    type: 'scale',
    question: 'Exigence temporelle',
    subtitle: 'Quelle pression temporelle avez-vous ressentie ? Le rythme était-il lent et tranquille ou rapide et effréné ?',
    scaleMin: 0,
    scaleMax: 20,
    scaleLabels: { min: 'Faible', max: 'Élevée' }
  },
  {
    id: 'mental_performance',
    section: 'C',
    type: 'scale',
    question: 'Performance',
    subtitle: 'Dans quelle mesure pensez-vous avoir réussi à atteindre les objectifs de la tâche ?',
    scaleMin: 0,
    scaleMax: 20,
    scaleLabels: { min: 'Bonne', max: 'Mauvaise' }
  },
  {
    id: 'mental_effort',
    section: 'C',
    type: 'scale',
    question: 'Effort',
    subtitle: 'Dans quelle mesure avez-vous dû travailler (mentalement et physiquement) pour atteindre votre niveau de performance ?',
    scaleMin: 0,
    scaleMax: 20,
    scaleLabels: { min: 'Faible', max: 'Élevé' }
  },
  {
    id: 'mental_frustration',
    section: 'C',
    type: 'scale',
    question: 'Niveau de frustration',
    subtitle: 'Dans quelle mesure avez-vous ressenti de l\'insécurité, du découragement, de l\'irritation, du stress et de l\'agacement ?',
    scaleMin: 0,
    scaleMax: 20,
    scaleLabels: { min: 'Faible', max: 'Élevé' }
  }
]

export default function RobinetAnalysisPage() {
  const [responses, setResponses] = useState<Record<string, number | number[]>>({})
  const [currentStep, setCurrentStep] = useState(0)

  const allQuestions = [
    ...sectionA_Questions,
    ...sectionB_Questions,
    ...sectionC_Questions
  ]

  const handleResponse = (questionId: string, value: number | number[]) => {
    setResponses(prev => ({ ...prev, [questionId]: value }))
  }

  const calculateScore = () => {
    let totalScore = 0
    
    const chargesPresence = responses['charges_presence'] as number || 0
    if (chargesPresence > 0) {
      const poids = responses['charges_poids'] as number || 0
      const prehension = responses['charges_prehension'] as number || 0
      const frequence = responses['charges_frequence'] as number || 0
      totalScore += poids * (1 + prehension + frequence)
    }

    const posturesArray = responses['postures_observation'] as number[] || []
    const posturesSum = posturesArray.reduce((sum, val) => sum + val, 0)
    const posturesFreq = responses['postures_frequence'] as number || 1
    totalScore += posturesSum * posturesFreq

    const mentalQuestions = ['mental_exigence', 'mental_physique', 'mental_temporelle', 
                            'mental_performance', 'mental_effort', 'mental_frustration']
    const mentalScore = mentalQuestions.reduce((sum, id) => sum + (responses[id] as number || 0), 0)
    totalScore += (mentalScore / 120) * 100

    return Math.min(100, Math.round(totalScore / 3))
  }

  const currentQuestion = allQuestions[currentStep]
  const isLastQuestion = currentStep === allQuestions.length - 1
  const canProgress = responses[currentQuestion?.id] !== undefined

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-400 mb-2">
            🚰 Analyse Robinet - Score R
          </h1>
          <p className="text-slate-300">
            Évaluation de la charge de travail
          </p>
          
          <div className="mt-6 bg-slate-900/50 rounded-lg p-4">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Question {currentStep + 1} sur {allQuestions.length}</span>
              <span>{Math.round(((currentStep + 1) / allQuestions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / allQuestions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-8 border border-slate-800"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  {currentQuestion.question}
                </h2>
                {currentQuestion.subtitle && (
                  <p className="text-slate-400 flex items-start gap-2">
                    <Info className="w-4 h-4 mt-1 flex-shrink-0" />
                    {currentQuestion.subtitle}
                  </p>
                )}
              </div>

              {currentQuestion.type === 'single' && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleResponse(currentQuestion.id, option.value)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        responses[currentQuestion.id] === option.value
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                      }`}
                    >
                      <div className="font-medium text-white">{option.label}</div>
                      {option.description && (
                        <div className="text-sm text-slate-400 mt-1">{option.description}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'multiple' && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => {
                    const selected = (responses[currentQuestion.id] as number[] || []).includes(option.value)
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          const current = (responses[currentQuestion.id] as number[] || [])
                          const newValue = selected 
                            ? current.filter(v => v !== option.value)
                            : [...current, option.value]
                          handleResponse(currentQuestion.id, newValue)
                        }}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selected
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                        }`}
                      >
                        <div className="font-medium text-white">{option.label}</div>
                        {option.description && (
                          <div className="text-sm text-slate-400 mt-1">{option.description}</div>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {currentQuestion.type === 'scale' && (
                <div className="space-y-4">
                  <input
                    type="range"
                    min={currentQuestion.scaleMin}
                    max={currentQuestion.scaleMax}
                    value={responses[currentQuestion.id] as number || 0}
                    onChange={(e) => handleResponse(currentQuestion.id, parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>{currentQuestion.scaleLabels?.min}</span>
                    <span className="text-blue-400 font-semibold text-lg">
                      {responses[currentQuestion.id] || 0}
                    </span>
                    <span>{currentQuestion.scaleLabels?.max}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className="px-6 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                
                {isLastQuestion ? (
                  <button
                    onClick={() => {
                      const score = calculateScore()
                      alert(`Score R calculé : ${score}/100`)
                    }}
                    disabled={!canProgress}
                    className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Calculer le Score
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentStep(prev => Math.min(allQuestions.length - 1, prev + 1))}
                    disabled={!canProgress}
                    className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Suivant
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
