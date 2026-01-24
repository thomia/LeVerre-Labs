"use client"

/**
 * INTERFACE D'ANALYSE UNIFIÉE - ProtoVerreTMS
 * ============================================
 * Une seule page pour analyser tous les éléments du modèle :
 * - 🥃 Verre (Capacité)
 * - 🚰 Robinet (Charge de travail)
 * - 🫧 Bulle (Environnement)
 * - ⛈️ Orage (Aléas)
 * - 🥤 Paille (Récupération)
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Info } from 'lucide-react'
import DashboardSimplified from '@/components/dashboard/dashboard-simplified'

// ============================================================================
// TYPES
// ============================================================================

type ElementType = 'verre' | 'robinet' | 'bulle' | 'orage' | 'paille'

interface Question {
  id: string
  element: ElementType
  type: 'single' | 'multiple'  // single = choix unique, multiple = plusieurs choix possibles
  section?: string  // Nom de la section (ex: "Charges", "Postures", "Charge Mentale", "RPS")
  question: string
  subtitle?: string
  weight: number  // CONFIDENTIEL - Pondération dans le calcul final
  maxPoints: number  // CONFIDENTIEL - Score maximum pour cette question
  options: Array<{
    label: string
    points: number  // CONFIDENTIEL - Points attribués (invisible pour l'utilisateur)
    description?: string  // Info bulle optionnelle
  }>
}

// ============================================================================
// DÉFINITION DES ÉLÉMENTS
// ============================================================================

const elements = [
  {
    id: 'verre' as ElementType,
    name: 'Verre',
    emoji: '🥃',
    description: 'Capacité d\'absorption',
    color: 'gray',
    bgColor: 'bg-gray-700/30',
    borderColor: 'border-gray-500',
    textColor: 'text-gray-300'
  },
  {
    id: 'robinet' as ElementType,
    name: 'Robinet',
    emoji: '🚰',
    description: 'Charge de travail',
    color: 'blue',
    bgColor: 'bg-blue-700/30',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-400'
  },
  {
    id: 'bulle' as ElementType,
    name: 'Bulle',
    emoji: '🫧',
    description: 'Environnement',
    color: 'purple',
    bgColor: 'bg-purple-700/30',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-400'
  },
  {
    id: 'orage' as ElementType,
    name: 'Orage',
    emoji: '⛈️',
    description: 'Aléas',
    color: 'amber',
    bgColor: 'bg-amber-700/30',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-400'
  },
  {
    id: 'paille' as ElementType,
    name: 'Paille',
    emoji: '🥤',
    description: 'Récupération',
    color: 'green',
    bgColor: 'bg-green-700/30',
    borderColor: 'border-green-500',
    textColor: 'text-green-400'
  }
]

// ============================================================================
// QUESTIONS PAR ÉLÉMENT
// ============================================================================

/**
 * VERRE - Score V (Capacité d'absorption des tissus)
 * Formule : Score_V = 100 - Σ(Contributions_Pondérées)
 */
const questionsVerre: Question[] = [
  {
    id: 'verre_age',
    element: 'verre',
    type: 'single',
    question: 'Quelle est la tranche d\'âge du travailleur ?',
    weight: 0.20,
    maxPoints: 30,
    options: [
      { label: '< 30 ans', points: 5 },
      { label: '30 à 45 ans', points: 15 },
      { label: '45 à 55 ans', points: 25 },
      { label: '> 55 ans', points: 30 }
    ]
  },
  {
    id: 'verre_medical',
    element: 'verre',
    type: 'single',
    question: 'La personne a-t-elle déjà eu des douleurs/blessures liées au travail ?',
    weight: 0.40,
    maxPoints: 70,
    options: [
      { label: 'Non, jamais', points: 0 },
      { label: 'Oui, mais guéris depuis longtemps (> 2 ans)', points: 15 },
      { label: 'Oui, récemment ou ça revient parfois (< 2 ans)', points: 30 },
      { label: 'Oui, douleurs actuelles', points: 60 }
    ]
  },
  {
    id: 'verre_physical',
    element: 'verre',
    type: 'single',
    question: 'L\'opérateur fait-il du sport ou de l\'activité physique régulière ?',
    weight: 0.25,
    maxPoints: 30,
    options: [
      { label: '≥ 2h/semaine', points: -10 },
      { label: '~1h/semaine', points: 0 },
      { label: '1-2 fois/mois', points: 20 },
      { label: 'Sédentaire', points: 30 }
    ]
  },
  {
    id: 'verre_lifestyle',
    element: 'verre',
    type: 'single',
    question: 'Globalement, l\'opérateur dort-il bien et mange-t-il équilibré ?',
    weight: 0.15,
    maxPoints: 40,
    options: [
      { label: 'Bien sur les deux critères', points: 0 },
      { label: 'Correct', points: 10 },
      { label: 'Difficile', points: 25 },
      { label: 'Problématique', points: 40 }
    ]
  }
]

/**
 * ROBINET - SECTION A : CHARGES PHYSIQUES
 * =========================================
 * 
 * MÉTHODE DE CALCUL DU SCORE CHARGES :
 * 
 * 1. Q1 (Présence) : Filtre - Si "Non" → Score Charges = 0
 * 2. Q2 (Type) : Information qualitative, applique un facteur de risque
 *    - Soulevée : ×1.2 (risque lombaire élevé)
 *    - Portée : ×1.15 (effort soutenu)
 *    - Poussée : ×1.1 (effort modéré)
 *    - Tirée : ×1.1 (effort modéré)
 * 3. Q3 (Poids) : Points de base (5 à 100)
 * 4. Q4 (Préhension) : Multiplicateur additif (0 à 0.45)
 * 5. Q5 (Fréquence) : Multiplicateur additif (0 à 0.60)
 * 
 * FORMULE FINALE :
 * Score_Charges_Brut = Points_Poids × Facteur_Type × (1 + Ajust_Préhension + Ajust_Fréquence)
 * 
 * Normalisation : Score maximum théorique = 100 × 1.2 × (1 + 0.45 + 0.60) = 246
 * Score_Charges_Normalisé = (Score_Brut / 246) × 100
 * 
 * Ce score représente 30% du Score R final
 */
const questionsRobinet: Question[] = [
  // Q1 : FILTRE - Présence de charges
  {
    id: 'robinet_charges_presence',
    element: 'robinet',
    type: 'single',
    section: 'Charges',
    question: 'Est-ce que l\'opérateur doit soulever, pousser, tirer ou porter quelque chose ?',
    subtitle: 'Observation durant 2-3 minutes',
    weight: 0,
    maxPoints: 3,
    options: [
      { label: 'Non, aucune manipulation', points: 0 },
      { label: 'Oui, rarement (< 10 fois/heure)', points: 1 },
      { label: 'Oui, régulièrement (10-50 fois/heure)', points: 2 },
      { label: 'Oui, très fréquemment (> 50 fois/heure)', points: 3 }
    ]
  },
  // Q2 : TYPE de manipulation
  {
    id: 'robinet_charges_type',
    element: 'robinet',
    type: 'single',
    section: 'Charges',
    question: 'Majoritairement, comment la charge est-elle manipulée ?',
    subtitle: 'Type de manipulation observé',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: 'Soulevée (du sol ou d\'une surface)', points: 4, description: 'Risque lombaire élevé' },
      { label: 'Portée sur une distance', points: 3, description: 'Effort soutenu' },
      { label: 'Poussée (chariot, caisse, etc.)', points: 2, description: 'Effort modéré' },
      { label: 'Tirée (vers soi)', points: 1, description: 'Effort modéré' }
    ]
  },
  // Q3 : POIDS de la charge
  {
    id: 'robinet_charges_poids',
    element: 'robinet',
    type: 'single',
    section: 'Charges',
    question: 'Combien pèse la charge typique ?',
    subtitle: 'Estimation du poids manipulé',
    weight: 0,
    maxPoints: 100,
    options: [
      { label: '< 3 kg', points: 5 },
      { label: '3-5 kg', points: 10 },
      { label: '5-10 kg', points: 20 },
      { label: '10-15 kg', points: 40 },
      { label: '15-25 kg', points: 60 },
      { label: '25-40 kg', points: 80 },
      { label: '40-55 kg', points: 90 },
      { label: '> 55 kg', points: 100 }
    ]
  },
  // Q4 : PRÉHENSION
  {
    id: 'robinet_charges_prehension',
    element: 'robinet',
    type: 'single',
    section: 'Charges',
    question: 'Comment est la prise en main ?',
    subtitle: 'Qualité de la préhension observée',
    weight: 0,
    maxPoints: 0.45,
    options: [
      { label: 'Facile', points: 0, description: 'Poignées ergonomiques' },
      { label: 'Correct', points: 0.1, description: 'Prise possible' },
      { label: 'Difficile', points: 0.30, description: 'Forme inadaptée' },
      { label: 'Très difficile', points: 0.45, description: 'Aucune prise' }
    ]
  },
  // Q5 : FRÉQUENCE
  {
    id: 'robinet_charges_frequence',
    element: 'robinet',
    type: 'single',
    section: 'Charges',
    question: 'Pendant 2 minutes, compte combien de fois la charge est manipulée (chronomètre en main).',
    subtitle: 'Fréquence de manipulation observée',
    weight: 0,
    maxPoints: 0.60,
    options: [
      { label: 'Rare : < 1 fois/minute', points: 0, description: 'Occasionnel' },
      { label: 'Occasionnel : 1-5 fois/minute', points: 0.20, description: 'Régulier' },
      { label: 'Fréquent : 5-15 fois/minute', points: 0.40, description: 'Répétitif' },
      { label: 'Très fréquent : > 15 fois/minute', points: 0.60, description: 'Très répétitif' }
    ]
  },

  // ============================================================================
  // SECTION B : POSTURES
  // ============================================================================

  /**
   * Q6 : OBSERVATION DES POSTURES (Choix multiples)
   * 
   * MÉTHODE DE CALCUL :
   * - Plusieurs postures peuvent être sélectionnées
   * - Chaque posture ajoute des points au score brut
   * - Les points sont cumulatifs
   * 
   * Score max théorique Q6 = 35+40+25+15+20+20+10 = 165 points
   */
  {
    id: 'robinet_postures_observation',
    element: 'robinet',
    type: 'multiple',
    section: 'Postures',
    question: 'Regarde l\'opérateur durant 2-3 minutes et coche ce que tu observes :',
    subtitle: 'Plusieurs postures peuvent être cochées',
    weight: 0,
    maxPoints: 165,
    options: [
      { 
        label: 'Bras levés au-dessus des épaules', 
        points: 35,
        description: 'Coudes au niveau des oreilles ou plus haut (abduction/antépulsion ≥60°)'
      },
      { 
        label: 'Dos penché en avant de manière répétée', 
        points: 40,
        description: 'Tête dépasse nettement la ligne verticale des hanches (vue de profil - flexion >30°)'
      },
      { 
        label: 'Dos en torsion/rotation pendant le travail', 
        points: 25,
        description: 'Épaules et hanches ne pointent pas dans la même direction (vue de dessus)'
      },
      { 
        label: 'Cou penché en avant OU en arrière', 
        points: 15,
        description: 'Menton proche de la poitrine (flexion) OU Tête basculée arrière, regard vers le plafond (extension)'
      },
      { 
        label: 'Gestes rapides et répétés des mains/poignets avec effort', 
        points: 20,
        description: 'Mouvements de préhension/torsion/vissage répétés observables (cycle visible)'
      },
      { 
        label: 'À genoux ou accroupi de manière prolongée', 
        points: 20,
        description: 'Position à genoux visible OU Accroupi (cuisses proches des mollets)'
      },
      { 
        label: 'Position statique prolongée (debout ou assis)', 
        points: 10,
        description: 'Reste dans la même position >30 min sans changement'
      }
    ]
  },

  /**
   * Q7 : FRÉQUENCE DES POSTURES CONTRAIGNANTES
   * 
   * MÉTHODE DE CALCUL :
   * - Multiplicateur appliqué au score brut des postures
   * - Facteur selon la durée d'exposition quotidienne
   * 
   * FORMULE FINALE SECTION POSTURES :
   * Score_Postures_Brut = Σ(Points_Postures_Q6) × Facteur_Fréquence_Q7
   * 
   * Score max théorique = 165 × 2 = 330 points
   * Score_Postures_Normalisé = (Score_Brut / 330) × 100
   * 
   * Ce score représente 30% du Score R final
   */
  {
    id: 'robinet_postures_frequence',
    element: 'robinet',
    type: 'single',
    section: 'Postures',
    question: 'À quelle fréquence ces postures contraignantes sont-elles adoptées ?',
    subtitle: 'Durée d\'exposition quotidienne',
    weight: 0,
    maxPoints: 2,
    options: [
      { label: 'Ponctuel (< 1h/jour)', points: 0.5, description: 'Exposition limitée' },
      { label: 'Modéré (1-2h/jour)', points: 1, description: 'Exposition modérée' },
      { label: 'Important (2-4h/jour)', points: 1.5, description: 'Exposition significative' },
      { label: 'Très important (>4h/jour)', points: 2, description: 'Exposition prolongée' }
    ]
  }
]

/**
 * BULLE - Score B (Environnement de travail) - Placeholder
 */
const questionsBulle: Question[] = [
  {
    id: 'bulle_placeholder',
    element: 'bulle',
    type: 'single',
    question: 'Questions Bulle à venir...',
    weight: 1,
    maxPoints: 100,
    options: [
      { label: 'En cours de développement', points: 50 }
    ]
  }
]

/**
 * ORAGE - Score O (Aléas et perturbations) - Placeholder
 */
const questionsOrage: Question[] = [
  {
    id: 'orage_placeholder',
    element: 'orage',
    type: 'single',
    question: 'Questions Orage à venir...',
    weight: 1,
    maxPoints: 100,
    options: [
      { label: 'En cours de développement', points: 50 }
    ]
  }
]

/**
 * PAILLE - Score P (Récupération) - Placeholder
 */
const questionsPaille: Question[] = [
  {
    id: 'paille_placeholder',
    element: 'paille',
    type: 'single',
    question: 'Questions Paille à venir...',
    weight: 1,
    maxPoints: 100,
    options: [
      { label: 'En cours de développement', points: 50 }
    ]
  }
]

// Toutes les questions
const allQuestions: Record<ElementType, Question[]> = {
  verre: questionsVerre,
  robinet: questionsRobinet,
  bulle: questionsBulle,
  orage: questionsOrage,
  paille: questionsPaille
}

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

export default function AnalysePage() {
  const [selectedElement, setSelectedElement] = useState<ElementType>('verre')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  // Support des réponses simples (number) et multiples (number[])
  const [answers, setAnswers] = useState<Record<string, number | number[]>>({})
  
  // Scores calculés
  const [scores, setScores] = useState({
    verre: 50,
    robinet: 30,
    bulle: 20,
    orage: 15,
    paille: 25
  })

  const currentElement = elements.find(e => e.id === selectedElement)!
  const currentQuestions = allQuestions[selectedElement]
  const currentQuestion = currentQuestions[currentQuestionIndex]
  
  const answeredForElement = currentQuestions.filter(q => answers[q.id] !== undefined).length
  const progressElement = (answeredForElement / currentQuestions.length) * 100

  /**
   * FONCTION DE CALCUL DU SCORE CHARGES (Robinet - Section A)
   * ===========================================================
   * 
   * Étapes de calcul :
   * 1. Vérifier Q1 (Présence) : Si = 0 (aucune manipulation) → Score = 0
   * 2. Récupérer Q2 (Type) et appliquer le facteur de risque :
   *    - Soulevée (4) → ×1.2
   *    - Portée (3) → ×1.15
   *    - Poussée (2) → ×1.1
   *    - Tirée (1) → ×1.1
   * 3. Récupérer Q3 (Poids) : Points de base (5 à 100)
   * 4. Récupérer Q4 (Préhension) : Multiplicateur additif (0 à 0.45)
   * 5. Récupérer Q5 (Fréquence) : Multiplicateur additif (0 à 0.60)
   * 6. Appliquer la formule :
   *    Score_Brut = Poids × Facteur_Type × (1 + Préhension + Fréquence)
   * 7. Normaliser sur 100 (max théorique = 246)
   */
  const calculateScoreCharges = (): number => {
    const presence = answers['robinet_charges_presence']
    const type = answers['robinet_charges_type']
    const poids = answers['robinet_charges_poids']
    const prehension = answers['robinet_charges_prehension']
    const frequence = answers['robinet_charges_frequence']

    // Si aucune manipulation, score = 0
    if (presence === undefined || presence === 0) return 0

    // Si toutes les questions ne sont pas répondues, retourner 0
    if (type === undefined || poids === undefined || prehension === undefined || frequence === undefined) {
      return 0
    }

    // S'assurer que toutes les valeurs sont des nombres (pas des tableaux)
    const poidsNum = typeof poids === 'number' ? poids : 0
    const typeNum = typeof type === 'number' ? type : 0
    const prehensionNum = typeof prehension === 'number' ? prehension : 0
    const frequenceNum = typeof frequence === 'number' ? frequence : 0

    // Facteur de risque selon le type de manipulation
    // Soulevée (4) = 1.2, Portée (3) = 1.15, Poussée (2) = 1.1, Tirée (1) = 1.1
    const facteurType = typeNum === 4 ? 1.2 : typeNum === 3 ? 1.15 : 1.1

    // Calcul du score brut
    // Formule : Poids × Facteur_Type × (1 + Ajust_Préhension + Ajust_Fréquence)
    const scoreBrut = poidsNum * facteurType * (1 + prehensionNum + frequenceNum)

    // Normalisation sur 100
    // Score max théorique = 100 × 1.2 × (1 + 0.45 + 0.60) = 246
    const scoreMax = 246
    const scoreNormalise = (scoreBrut / scoreMax) * 100

    return Math.min(100, scoreNormalise)
  }

  /**
   * FONCTION DE CALCUL DU SCORE POSTURES (Robinet - Section B)
   * ============================================================
   * 
   * Étapes de calcul :
   * 1. Récupérer Q6 (Observation) : Tableau des postures cochées
   *    - Chaque posture ajoute ses points au score brut
   *    - Les points sont cumulatifs
   * 2. Récupérer Q7 (Fréquence) : Facteur multiplicateur (0.5 à 2)
   * 3. Appliquer la formule :
   *    Score_Brut = Σ(Points_Postures) × Facteur_Fréquence
   * 4. Normaliser sur 100 (max théorique = 330)
   * 
   * FORMULE :
   * Score_Postures_Brut = Σ(Points_Postures_Q6) × Facteur_Fréquence_Q7
   * Score_Postures_Normalisé = (Score_Brut / 330) × 100
   */
  const calculateScorePostures = (): number => {
    const posturesObservation = answers['robinet_postures_observation']
    const frequence = answers['robinet_postures_frequence']

    // Si les questions ne sont pas répondues, retourner 0
    if (posturesObservation === undefined || frequence === undefined) {
      return 0
    }

    // Q6 est un choix multiple, donc un tableau de points
    // Si aucune posture cochée, score = 0
    if (Array.isArray(posturesObservation) && posturesObservation.length === 0) {
      return 0
    }

    // Somme des points de toutes les postures cochées
    const sommePostures = Array.isArray(posturesObservation) 
      ? posturesObservation.reduce((sum, val) => sum + val, 0)
      : 0

    // Q7 est un choix simple (number) - Facteur de fréquence
    const facteurFrequence = typeof frequence === 'number' ? frequence : 1

    // Calcul du score brut
    // Formule : Σ(Points_Postures) × Facteur_Fréquence
    const scoreBrut = sommePostures * facteurFrequence

    // Normalisation sur 100
    // Score max théorique = 165 (toutes postures) × 2 (fréquence max) = 330
    const scoreMax = 330
    const scoreNormalise = (scoreBrut / scoreMax) * 100

    return Math.min(100, scoreNormalise)
  }

  /**
   * CALCUL DES SCORES EN TEMPS RÉEL
   */
  useEffect(() => {
    // ========================================
    // SCORE V (VERRE) - Capacité d'absorption
    // ========================================
    // Formule : Score_V = 100 - Σ(Contributions_Pondérées)
    // Plus le score est élevé, meilleure est la capacité
    let totalV = 0
    questionsVerre.forEach(q => {
      const answer = answers[q.id]
      if (answer !== undefined && typeof answer === 'number') {
        const contribution = (answer / q.maxPoints) * q.weight * 100
        totalV += contribution
      }
    })
    const scoreV = Math.max(0, Math.min(100, 100 - totalV))

    // ========================================
    // SCORE R (ROBINET) - Charge de travail
    // ========================================
    // Sections implémentées : CHARGES + POSTURES
    // Le Score R final intégrera : Charges (30%) + Postures (30%) + Mental (20%) + RPS (20%)
    
    const scoreCharges = calculateScoreCharges()
    const scorePostures = calculateScorePostures()
    
    // Pondération :
    // - Charges : 30%
    // - Postures : 30%
    // - Mental : 20% (non implémenté)
    // - RPS : 20% (non implémenté)
    // Pour l'instant, on pondère sur les sections implémentées uniquement
    // Charges et Postures représentent chacune 50% du score actuel
    const scoreR = (scoreCharges * 0.5) + (scorePostures * 0.5)

    setScores(prev => ({
      ...prev,
      verre: Math.round(scoreV),
      robinet: Math.round(scoreR)
    }))
  }, [answers])

  // Gestion des réponses simples (single)
  const handleAnswer = (points: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: points }))
    
    // LOGIQUE SPÉCIALE : Si Q1 Charges = 0 (aucune manipulation), skip toutes les questions Charges
    if (currentQuestion.id === 'robinet_charges_presence' && points === 0) {
      // Trouver l'index de la première question de la section suivante (Postures)
      const nextSectionIndex = currentQuestions.findIndex((q, idx) => 
        idx > currentQuestionIndex && q.section !== 'Charges'
      )
      
      if (nextSectionIndex !== -1) {
        setTimeout(() => setCurrentQuestionIndex(nextSectionIndex), 300)
      }
    } else if (currentQuestionIndex < currentQuestions.length - 1) {
      setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 300)
    }
  }

  // Gestion des réponses multiples (multiple)
  const handleMultipleAnswer = (points: number) => {
    const currentAnswer = answers[currentQuestion.id]
    const currentArray = Array.isArray(currentAnswer) ? currentAnswer : []
    
    // Toggle : si le point est déjà sélectionné, on le retire, sinon on l'ajoute
    const newArray = currentArray.includes(points)
      ? currentArray.filter(p => p !== points)
      : [...currentArray, points]
    
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: newArray }))
  }

  // Navigation manuelle vers la question suivante (pour les questions multiples)
  const goToNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handleElementChange = (elementId: ElementType) => {
    setSelectedElement(elementId)
    setCurrentQuestionIndex(0)
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  // Déterminer la section actuelle
  const getCurrentSection = () => {
    return currentQuestion.section || ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-[1800px] mx-auto p-8">
        
        {/* Header avec titre */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-300">Analyse</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,0.5fr] gap-8">
          
          {/* MODÈLE À GAUCHE */}
          <div className="space-y-4">
            {/* Scores display - Cliquables pour sélectionner l'élément */}
            <div className="grid grid-cols-5 gap-3">
              {elements.map((element) => {
                const score = scores[element.id]
                const isActive = selectedElement === element.id
                const elementQuestions = allQuestions[element.id]
                const answered = elementQuestions.filter(q => answers[q.id] !== undefined).length
                const total = elementQuestions.length
                const isComplete = answered === total
                
                return (
                  <motion.button
                    key={element.id}
                    onClick={() => handleElementChange(element.id)}
                    className={`relative rounded-xl p-4 border-2 transition-all text-left ${
                      isActive
                        ? `${element.bgColor} ${element.borderColor} shadow-lg shadow-${element.color}-500/20`
                        : 'bg-slate-900/30 border-gray-700/30 hover:border-gray-600 hover:bg-slate-900/50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Nom de l'élément */}
                    <p className={`text-xs font-medium mb-1 ${isActive ? element.textColor : 'text-gray-500'}`}>
                      {element.name}
                    </p>
                    
                    {/* Score */}
                    <p className={`text-xl font-bold mb-2 ${isActive ? 'text-gray-200' : 'text-gray-500'}`}>
                      {score !== null ? score : '--'}
                    </p>
                    
                    {/* Progression */}
                    <div className="flex items-center justify-between text-xs">
                      <span className={isActive ? 'text-gray-400' : 'text-gray-600'}>
                        {answered}/{total}
                      </span>
                      {isComplete && (
                        <span className="text-green-400">✓</span>
                      )}
                    </div>
                    
                    {/* Badge de complétion en haut à droite */}
                    {isComplete && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <span className="text-white text-xs font-bold">✓</span>
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>
            
            {/* Model */}
            <div className="bg-black border border-gray-700/50 rounded-xl overflow-hidden h-[900px] flex items-center justify-center p-4">
              <div className="w-full max-w-[650px] h-full">
                <DashboardSimplified
                  activeSliders={[]}
                  hideIcons={false}
                  hideControlPanel={true}
                  savedScores={{
                    scoreV: scores.verre,
                    scoreR: scores.robinet,
                    scoreB: scores.bulle,
                    scoreO: scores.orage,
                    scoreP: scores.paille
                  }}
                  externalIsPaused={true}
                  externalSimulationSpeed={0}
                />
              </div>
            </div>
          </div>

          {/* QUESTIONNAIRE À DROITE */}
          <div className="space-y-6 flex flex-col items-center justify-center">
            
            {/* Navigation dots - Indicateur de progression */}
            <div className={`flex items-center gap-3 justify-center mb-6 border-2 rounded-full px-6 py-3 bg-slate-900/80 backdrop-blur-sm ${
              currentElement.borderColor
            } shadow-lg`}>
              {currentQuestions.map((q, idx) => {
                const isCurrentQuestion = idx === currentQuestionIndex
                const isAnswered = answers[q.id] !== undefined
                
                return (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(idx)}
                    className={`rounded-full transition-all duration-300 hover:scale-125 ${
                      isCurrentQuestion
                        ? `w-12 h-3 shadow-lg ${currentElement.bgColor.replace('/30', '')} border-2 ${currentElement.borderColor}`
                        : isAnswered
                        ? `w-3 h-3 ${currentElement.bgColor.replace('/30', '')} border ${currentElement.borderColor}`
                        : 'w-3 h-3 bg-gray-700 border border-gray-600 hover:bg-gray-600'
                    }`}
                    title={`Question ${idx + 1}${isAnswered ? ' (répondue)' : ''}`}
                  />
                )
              })}
            </div>

            {/* Question card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedElement}-${currentQuestionIndex}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`border-2 rounded-2xl p-8 shadow-2xl shadow-gray-900/50 w-full max-w-md ${
                  currentElement.bgColor
                } ${currentElement.borderColor}`}
              >
                {/* Indicateur de section */}
                {getCurrentSection() && (
                  <div className="mb-4">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                      currentElement.bgColor
                    } ${currentElement.borderColor} border`}>
                      <div className={`w-2 h-2 rounded-full ${currentElement.bgColor.replace('/30', '')}`} />
                      <span className="text-white">Section : {getCurrentSection()}</span>
                    </div>
                  </div>
                )}

                <div className="mb-8 text-center">
                  <p className="text-xl font-medium text-gray-200 leading-relaxed">
                    {currentQuestion.question}
                  </p>
                  {currentQuestion.subtitle && (
                    <p className="text-sm text-gray-400 mt-2">{currentQuestion.subtitle}</p>
                  )}
                  <div className={`mt-4 h-1 w-16 rounded-full mx-auto ${
                    currentElement.bgColor.replace('/30', '')
                  }`}></div>
                </div>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    // Pour les questions simples (single)
                    const isSelectedSingle = currentQuestion.type === 'single' && answers[currentQuestion.id] === option.points
                    
                    // Pour les questions multiples (multiple)
                    const currentAnswer = answers[currentQuestion.id]
                    const isSelectedMultiple = currentQuestion.type === 'multiple' && 
                      Array.isArray(currentAnswer) && 
                      currentAnswer.includes(option.points)
                    
                    const isSelected = isSelectedSingle || isSelectedMultiple

                    return (
                      <motion.button
                        key={idx}
                        onClick={() => currentQuestion.type === 'single' 
                          ? handleAnswer(option.points)
                          : handleMultipleAnswer(option.points)
                        }
                        className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? `${currentElement.bgColor} ${currentElement.borderColor} shadow-lg`
                            : 'bg-slate-800/40 border-gray-700/40 hover:border-gray-500 hover:bg-slate-800/60'
                        }`}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <div className="flex items-center gap-3">
                          {/* Checkbox pour les questions multiples, radio pour les simples */}
                          {currentQuestion.type === 'multiple' ? (
                            <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? `bg-${currentElement.color}-500 border-${currentElement.color}-500`
                                : 'bg-transparent border-gray-600'
                            }`}>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500 }}
                                >
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </motion.div>
                              )}
                            </div>
                          ) : (
                            <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 transition-all ${
                              isSelected
                                ? `bg-${currentElement.color}-500 border-${currentElement.color}-500`
                                : 'border-gray-600'
                            }`} />
                          )}
                          
                          <div className="flex-1">
                            <span className={`font-medium transition-colors block ${
                              isSelected ? 'text-white' : 'text-gray-300'
                            }`}>
                              {option.label}
                            </span>
                          </div>
                          
                          {/* Info bulle si description disponible */}
                          {option.description && (
                            <div className="group relative flex-shrink-0">
                              <Info className={`w-4 h-4 ${
                                isSelected ? 'text-white' : 'text-gray-500'
                              } cursor-help`} />
                              {/* Tooltip */}
                              <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-50 w-64">
                                <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl border border-gray-700">
                                  {option.description}
                                  <div className="absolute top-full right-4 -mt-1">
                                    <div className="border-4 border-transparent border-t-gray-900" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Chevron pour les questions simples sélectionnées */}
                          {currentQuestion.type === 'single' && isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500 }}
                              className="flex-shrink-0"
                            >
                              <ChevronRight className={`w-5 h-5 ${currentElement.textColor}`} />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
                
                {/* Bouton Continuer pour les questions multiples */}
                {currentQuestion.type === 'multiple' && currentQuestionIndex < currentQuestions.length - 1 && (
                  <motion.button
                    onClick={goToNextQuestion}
                    className={`w-full mt-6 px-6 py-3 rounded-xl font-medium transition-all ${
                      currentElement.bgColor
                    } ${currentElement.borderColor} border-2 hover:opacity-80`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-white">Continuer →</span>
                  </motion.button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
