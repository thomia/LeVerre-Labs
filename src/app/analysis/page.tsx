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
import { ChevronRight, Info, Check } from 'lucide-react'
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
    weight: 1,
    maxPoints: 25,
    options: [
      { label: '< 30 ans', points: 0, description: 'Référence optimale' },
      { label: '30 à 45 ans', points: 8 },
      { label: '45 à 55 ans', points: 16 },
      { label: '> 55 ans', points: 25, description: 'Sarcopénie progressive' }
    ]
  },
  {
    id: 'verre_medical',
    element: 'verre',
    type: 'single',
    question: 'La personne a-t-elle déjà eu des douleurs/blessures liées au travail ?',
    weight: 1,
    maxPoints: 40,
    options: [
      { label: 'Non, jamais', points: 0 },
      { label: 'Oui, guéris depuis > 2 ans', points: 12 },
      { label: 'Oui, récemment ou récurrents', points: 25 },
      { label: 'Oui, douleurs actuelles', points: 40, description: 'Risque élevé' }
    ]
  },
  {
    id: 'verre_physical',
    element: 'verre',
    type: 'single',
    question: 'L\'opérateur pratique-t-il une activité physique régulière en dehors du travail ?',
    weight: 1,
    maxPoints: 25,
    options: [
      { label: '≥ 2h/semaine', points: 0, description: 'Condition optimale' },
      { label: '~1h/semaine', points: 8 },
      { label: '1-2 fois/mois', points: 18 },
      { label: 'Sédentaire', points: 25 }
    ]
  },
  {
    id: 'verre_lifestyle',
    element: 'verre',
    type: 'single',
    question: 'L\'opérateur dort-il bien et mange-t-il équilibré ?',
    subtitle: 'Sommeil 7-8h + alimentation équilibrée',
    weight: 1,
    maxPoints: 10,
    options: [
      { label: 'Bien sur les deux critères', points: 0 },
      { label: 'Correct (un critère dégradé)', points: 3 },
      { label: 'Difficile (un critère compromis)', points: 7 },
      { label: 'Problématique (les deux compromis)', points: 10 }
    ]
  },
  {
    id: 'verre_sexe',
    element: 'verre',
    type: 'single',
    question: 'Quel est le sexe biologique de l\'opérateur ?',
    weight: 1,
    maxPoints: 8,
    options: [
      { label: 'Homme', points: 0, description: 'Référence NF X35-109' },
      { label: 'Femme', points: 8, description: 'Seuil charge 15 kg vs 25 kg' }
    ]
  }
]

/**
 * ROBINET - SECTION A : CHARGES PHYSIQUES (40% du Score R)
 * =========================================
 * 
 * MÉTHODE DE CALCUL DU SCORE CHARGES :
 * 
 * Q_A1 (Poids) : Points de base (5 à 100)
 * Q_A2 (Distance) : Facteur multiplicateur NIOSH (1.0 à 1.8)
 * Q_A3 (Préhension) : Facteur multiplicateur (1.0 à 1.45)
 * Q_A4 (Fréquence) : Facteur multiplicateur (1.0 à 1.60)
 * 
 * FORMULE FINALE :
 * Score_Charges = MIN(100, Points_Poids × (1 + Ajust_Distance) × (1 + Ajust_Préhension) × (1 + Ajust_Fréquence))
 * 
 * Ce score représente 40% du Score R final
 */
const questionsRobinet: Question[] = [
  // Q_A1 : POIDS de la charge
  {
    id: 'robinet_charges_poids',
    element: 'robinet',
    type: 'single',
    section: 'Charges',
    question: 'Combien pèse la charge typique ?',
    weight: 0,
    maxPoints: 100,
    options: [
      { label: '< 3 kg', points: 5 },
      { label: '3-5 kg', points: 10 },
      { label: '5-10 kg', points: 20 },
      { label: '10-15 kg', points: 40 },
      { label: '15-25 kg', points: 60, description: '⚠️ Seuil femme NF X35-109' },
      { label: '25-40 kg', points: 80, description: '⚠️ Zone grise' },
      { label: '40-55 kg', points: 90, description: '🔴 Limite homme' },
      { label: '> 55 kg', points: 100, description: '🔴 Violation R4541-9' }
    ]
  },
  // Q_A2 : DISTANCE des mains par rapport au tronc
  {
    id: 'robinet_charges_distance',
    element: 'robinet',
    type: 'single',
    section: 'Charges',
    question: 'À quelle distance du corps la charge est-elle saisie/tenue ?',
    subtitle: 'Facteur NIOSH - distance horizontale',
    weight: 0,
    maxPoints: 0.80,
    options: [
      { label: '< 25 cm (très proche du tronc)', points: 0.00 },
      { label: '25-40 cm (proche)', points: 0.20 },
      { label: '40-55 cm (éloigné)', points: 0.50, description: '⚠️ Risque accru' },
      { label: '> 55 cm (bras tendus)', points: 0.80, description: '🔴 Très risqué' }
    ]
  },
  // Q_A3 : PRÉHENSION
  {
    id: 'robinet_charges_prehension',
    element: 'robinet',
    type: 'single',
    section: 'Charges',
    question: 'Comment est la prise en main de la charge ?',
    subtitle: 'Facteur couplage NIOSH',
    weight: 0,
    maxPoints: 0.45,
    options: [
      { label: 'Facile (poignées ergonomiques, charge équilibrée)', points: 0.00 },
      { label: 'Correct (prise à deux mains possible)', points: 0.10 },
      { label: 'Difficile (encombrante, glissante, sans poignée)', points: 0.30, description: '⚠️' },
      { label: 'Très difficile (poids mal réparti, forme irrégulière)', points: 0.45, description: '🔴' }
    ]
  },
  // Q_A4 : FRÉQUENCE de manipulation
  {
    id: 'robinet_charges_frequence',
    element: 'robinet',
    type: 'single',
    section: 'Charges',
    question: 'Chronométrer 2 minutes et compter le nombre de manipulations.',
    subtitle: 'Fréquence selon ISO 11228-3',
    weight: 0,
    maxPoints: 0.60,
    options: [
      { label: 'Rare : < 1 fois/min', points: 0.00 },
      { label: 'Occasionnel : 1-5/min', points: 0.20 },
      { label: 'Fréquent : 5-15/min', points: 0.40, description: '⚠️ Répétitif' },
      { label: 'Très fréquent : > 15/min', points: 0.60, description: '🔴 Très répétitif' }
    ]
  },

  // ============================================================================
  // SECTION B : POSTURES (35% du Score R)
  // ============================================================================
  // 5 zones corporelles : Tronc, Bras, Cou, Poignets, Jambes
  // Pour chaque zone : 3 questions imbriquées (Sévérité, Type, %Temps)
  // Formule par zone : Score = Sévérité × Mult_Type × Fact_%Temps
  // Score final = MAX(zones)×0.5 + MOYENNE(zones)×0.5

  // ZONE 1 : TRONC / DOS
  {
    id: 'robinet_postures_tronc_severite',
    element: 'robinet',
    type: 'single',
    section: 'Postures',
    question: 'Observer la posture la plus contraignante du tronc/dos.',
    subtitle: 'ZONE 1 : TRONC - Sévérité',
    weight: 0,
    maxPoints: 55,
    options: [
      { label: 'Droit (neutre)', points: 0 },
      { label: 'Penché léger < 20°', points: 10 },
      { label: 'Penché modéré 20-45°', points: 30, description: '⚠️' },
      { label: 'Penché marqué > 45°', points: 45, description: '🔴' },
      { label: 'Tordu / rotation latérale', points: 20 },
      { label: 'Combinaison penché + tordu', points: 55, description: '🔴' }
    ]
  },
  {
    id: 'robinet_postures_tronc_type',
    element: 'robinet',
    type: 'single',
    section: 'Postures',
    question: 'La posture est-elle tenue fixe ou en mouvement ?',
    subtitle: 'ZONE 1 : TRONC - Type',
    weight: 0,
    maxPoints: 2.0,
    options: [
      { label: 'Dynamique (mouvement répété, non maintenu)', points: 1.0 },
      { label: 'Statique court (maintenu < 2 min)', points: 1.3, description: '⚠️' },
      { label: 'Statique prolongé (maintenu > 2 min)', points: 1.6, description: '🔴' },
      { label: 'Statique extrême (> 10 min sans pause)', points: 2.0, description: '🔴' }
    ]
  },
  {
    id: 'robinet_postures_tronc_pct',
    element: 'robinet',
    type: 'single',
    section: 'Postures',
    question: 'Quel % du temps cette posture contraignante est-elle adoptée ?',
    subtitle: 'ZONE 1 : TRONC - % Temps',
    weight: 0,
    maxPoints: 1.6,
    options: [
      { label: '< 10%', points: 0.5 },
      { label: '10-33%', points: 0.75 },
      { label: '33-50%', points: 1.0, description: '⚠️' },
      { label: '50-80%', points: 1.3, description: '🔴' },
      { label: '> 80%', points: 1.6, description: '🔴' }
    ]
  },

  // ZONE 2 : BRAS / ÉPAULES
  {
    id: 'robinet_postures_bras_severite',
    element: 'robinet',
    type: 'single',
    section: 'Postures',
    question: 'Observer la posture la plus contraignante des bras/épaules.',
    subtitle: 'ZONE 2 : BRAS - Sévérité',
    weight: 0,
    maxPoints: 45,
    options: [
      { label: 'Proche du corps, détendu', points: 0 },
      { label: 'Légèrement écartés < 45°', points: 10 },
      { label: 'Tendus loin du corps', points: 20 },
      { label: 'Au-dessus des épaules > 90°', points: 45, description: '🔴' },
      { label: 'Maintenu en avant > 30 cm', points: 30, description: '⚠️' }
    ]
  },
  {
    id: 'robinet_postures_bras_type',
    element: 'robinet',
    type: 'single',
    section: 'Postures',
    question: 'La posture est-elle tenue fixe ou en mouvement ?',
    subtitle: 'ZONE 2 : BRAS - Type',
    weight: 0,
    maxPoints: 2.0,
    options: [
      { label: 'Dynamique', points: 1.0 },
      { label: 'Statique court (< 2 min)', points: 1.3, description: '⚠️' },
      { label: 'Statique prolongé (> 2 min)', points: 1.6, description: '🔴' },
      { label: 'Statique extrême (> 10 min)', points: 2.0, description: '🔴' }
    ]
  },
  {
    id: 'robinet_postures_bras_pct',
    element: 'robinet',
    type: 'single',
    section: 'Postures',
    question: 'Quel % du temps cette posture contraignante est-elle adoptée ?',
    subtitle: 'ZONE 2 : BRAS - % Temps',
    weight: 0,
    maxPoints: 1.6,
    options: [
      { label: '< 10%', points: 0.5 },
      { label: '10-33%', points: 0.75 },
      { label: '33-50%', points: 1.0, description: '⚠️' },
      { label: '50-80%', points: 1.3, description: '🔴' },
      { label: '> 80%', points: 1.6, description: '🔴' }
    ]
  },

  // ZONE 3 : COU
  {
    id: 'robinet_postures_cou_severite',
    element: 'robinet',
    type: 'single',
    section: 'Postures',
    question: 'Observer la posture la plus contraignante du cou.',
    subtitle: 'ZONE 3 : COU - Sévérité',
    weight: 0,
    maxPoints: 25,
    options: [
      { label: 'Aligné (neutre)', points: 0 },
      { label: 'Penché léger < 20°', points: 10 },
      { label: 'Penché marqué > 20°', points: 20, description: '⚠️' },
      { label: 'Rotation significative', points: 15 },
      { label: 'Combinaison penché + rotation', points: 25, description: '🔴' }
    ]
  },
  {
    id: 'robinet_postures_cou_type',
    element: 'robinet',
    type: 'single',
    section: 'Postures',
    question: 'La posture est-elle tenue fixe ou en mouvement ?',
    subtitle: 'ZONE 3 : COU - Type',
    weight: 0,
    maxPoints: 2.0,
    options: [
      { label: 'Dynamique', points: 1.0 },
      { label: 'Statique court (< 2 min)', points: 1.3, description: '⚠️' },
      { label: 'Statique prolongé (> 2 min)', points: 1.6, description: '🔴' },
      { label: 'Statique extrême (> 10 min)', points: 2.0, description: '🔴' }
    ]
  },
  {
    id: 'robinet_postures_cou_pct',
    element: 'robinet',
    type: 'single',
    section: 'Postures',
    question: 'Quel % du temps cette posture contraignante est-elle adoptée ?',
    subtitle: 'ZONE 3 : COU - % Temps',
    weight: 0,
    maxPoints: 1.6,
    options: [
      { label: '< 10%', points: 0.5 },
      { label: '10-33%', points: 0.75 },
      { label: '33-50%', points: 1.0, description: '⚠️' },
      { label: '50-80%', points: 1.3, description: '🔴' },
      { label: '> 80%', points: 1.6, description: '🔴' }
    ]
  },

  // ZONE 4 : POIGNETS / MAINS
  {
    id: 'robinet_postures_poignets_severite',
    element: 'robinet',
    type: 'single',
    section: 'Postures',
    question: 'Observer la posture la plus contraignante des poignets/mains.',
    subtitle: 'ZONE 4 : POIGNETS - Sévérité',
    weight: 0,
    maxPoints: 45,
    options: [
      { label: 'Position neutre (axe avant-bras)', points: 0 },
      { label: 'Déviation légère < 15°', points: 10 },
      { label: 'Déviation modérée 15-30°', points: 25, description: '⚠️' },
      { label: 'Déviation extrême > 30°', points: 45, description: '🔴' },
      { label: 'Pinch grip / prise en pince', points: 30, description: '🔴' }
    ]
  },
  {
    id: 'robinet_postures_poignets_type',
    element: 'robinet',
    type: 'single',
    section: 'Postures',
    question: 'La posture est-elle tenue fixe ou en mouvement ?',
    subtitle: 'ZONE 4 : POIGNETS - Type',
    weight: 0,
    maxPoints: 2.0,
    options: [
      { label: 'Dynamique', points: 1.0 },
      { label: 'Statique court (< 2 min)', points: 1.3, description: '⚠️' },
      { label: 'Statique prolongé (> 2 min)', points: 1.6, description: '🔴' },
      { label: 'Statique extrême (> 10 min)', points: 2.0, description: '🔴' }
    ]
  },
  {
    id: 'robinet_postures_poignets_pct',
    element: 'robinet',
    type: 'single',
    section: 'Postures',
    question: 'Quel % du temps cette posture contraignante est-elle adoptée ?',
    subtitle: 'ZONE 4 : POIGNETS - % Temps',
    weight: 0,
    maxPoints: 1.6,
    options: [
      { label: '< 10%', points: 0.5 },
      { label: '10-33%', points: 0.75 },
      { label: '33-50%', points: 1.0, description: '⚠️' },
      { label: '50-80%', points: 1.3, description: '🔴' },
      { label: '> 80%', points: 1.6, description: '🔴' }
    ]
  },

  // ZONE 5 : JAMBES / STABILITÉ
  {
    id: 'robinet_postures_jambes_severite',
    element: 'robinet',
    type: 'single',
    section: 'Postures',
    question: 'Observer la posture la plus contraignante des jambes/stabilité.',
    subtitle: 'ZONE 5 : JAMBES - Sévérité',
    weight: 0,
    maxPoints: 45,
    options: [
      { label: 'Équilibré, poids distribué', points: 0 },
      { label: 'Debout statique > 2h', points: 20, description: '⚠️' },
      { label: 'Debout statique > 4h', points: 35, description: '🔴' },
      { label: 'Assis statique > 4h', points: 15 },
      { label: 'À genoux / accroupi prolongé', points: 45, description: '🔴' }
    ]
  },
  {
    id: 'robinet_postures_jambes_type',
    element: 'robinet',
    type: 'single',
    section: 'Postures',
    question: 'La posture est-elle tenue fixe ou en mouvement ?',
    subtitle: 'ZONE 5 : JAMBES - Type',
    weight: 0,
    maxPoints: 2.0,
    options: [
      { label: 'Dynamique', points: 1.0 },
      { label: 'Statique court (< 2 min)', points: 1.3, description: '⚠️' },
      { label: 'Statique prolongé (> 2 min)', points: 1.6, description: '🔴' },
      { label: 'Statique extrême (> 10 min)', points: 2.0, description: '🔴' }
    ]
  },
  {
    id: 'robinet_postures_jambes_pct',
    element: 'robinet',
    type: 'single',
    section: 'Postures',
    question: 'Quel % du temps cette posture contraignante est-elle adoptée ?',
    subtitle: 'ZONE 5 : JAMBES - % Temps',
    weight: 0,
    maxPoints: 1.6,
    options: [
      { label: '< 10%', points: 0.5 },
      { label: '10-33%', points: 0.75 },
      { label: '33-50%', points: 1.0, description: '⚠️' },
      { label: '50-80%', points: 1.3, description: '🔴' },
      { label: '> 80%', points: 1.6, description: '🔴' }
    ]
  },

  // ============================================================================
  // SECTION C : CHARGE MENTALE NASA-TLX (15% du Score R)
  // ============================================================================
  // 6 dimensions notées de 0 à 20 chacune
  // Score = (Σ 6 dimensions / 120) × 100

  {
    id: 'robinet_mental_exigence_mentale',
    element: 'robinet',
    type: 'single',
    section: 'Charge Mentale',
    question: 'Exigence mentale : activité mentale requise (penser, décider, calculer...)',
    subtitle: 'NASA-TLX Dimension 1/6',
    weight: 0,
    maxPoints: 20,
    options: [
      { label: 'Très faible', points: 0 },
      { label: 'Faible', points: 5 },
      { label: 'Modérée', points: 10 },
      { label: 'Élevée', points: 15 },
      { label: 'Très élevée', points: 20 }
    ]
  },
  {
    id: 'robinet_mental_exigence_physique',
    element: 'robinet',
    type: 'single',
    section: 'Charge Mentale',
    question: 'Exigence physique : quantité d\'activité physique requise',
    subtitle: 'NASA-TLX Dimension 2/6',
    weight: 0,
    maxPoints: 20,
    options: [
      { label: 'Très faible', points: 0 },
      { label: 'Faible', points: 5 },
      { label: 'Modérée', points: 10 },
      { label: 'Élevée', points: 15 },
      { label: 'Très élevée', points: 20 }
    ]
  },
  {
    id: 'robinet_mental_exigence_temporelle',
    element: 'robinet',
    type: 'single',
    section: 'Charge Mentale',
    question: 'Exigence temporelle : pression temporelle ressentie',
    subtitle: 'NASA-TLX Dimension 3/6',
    weight: 0,
    maxPoints: 20,
    options: [
      { label: 'Rythme lent', points: 0 },
      { label: 'Rythme détendu', points: 5 },
      { label: 'Rythme normal', points: 10 },
      { label: 'Rythme soutenu', points: 15 },
      { label: 'Rythme effréné', points: 20 }
    ]
  },
  {
    id: 'robinet_mental_performance',
    element: 'robinet',
    type: 'single',
    section: 'Charge Mentale',
    question: 'Performance : dans quelle mesure les objectifs ont été atteints',
    subtitle: 'NASA-TLX Dimension 4/6',
    weight: 0,
    maxPoints: 20,
    options: [
      { label: 'Parfait', points: 0 },
      { label: 'Bon', points: 5 },
      { label: 'Satisfaisant', points: 10 },
      { label: 'Médiocre', points: 15 },
      { label: 'Échec', points: 20 }
    ]
  },
  {
    id: 'robinet_mental_effort',
    element: 'robinet',
    type: 'single',
    section: 'Charge Mentale',
    question: 'Effort : effort fourni pour atteindre la performance',
    subtitle: 'NASA-TLX Dimension 5/6',
    weight: 0,
    maxPoints: 20,
    options: [
      { label: 'Très faible', points: 0 },
      { label: 'Faible', points: 5 },
      { label: 'Modéré', points: 10 },
      { label: 'Élevé', points: 15 },
      { label: 'Très élevé', points: 20 }
    ]
  },
  {
    id: 'robinet_mental_frustration',
    element: 'robinet',
    type: 'single',
    section: 'Charge Mentale',
    question: 'Frustration : insécurité, découragement, irritation',
    subtitle: 'NASA-TLX Dimension 6/6',
    weight: 0,
    maxPoints: 20,
    options: [
      { label: 'Très faible (détendu, satisfait)', points: 0 },
      { label: 'Faible', points: 5 },
      { label: 'Modérée', points: 10 },
      { label: 'Élevée', points: 15 },
      { label: 'Très élevée (stress intense)', points: 20 }
    ]
  },

  // ============================================================================
  // SECTION D : RISQUES PSYCHOSOCIAUX Karasek (10% du Score R)
  // ============================================================================
  // 18 questions : 1-4 (jamais à toujours)
  // Axe Demande psychologique (9 items)
  // Axe Latitude décisionnelle (9 items)
  // Quadrant Karasek → Score RPS

  // DEMANDE PSYCHOLOGIQUE
  {
    id: 'robinet_rps_demande_1',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Mon travail me demande de travailler très vite',
    subtitle: 'Demande psychologique 1/9',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: 'Jamais', points: 1 },
      { label: 'Rarement', points: 2 },
      { label: 'Souvent', points: 3 },
      { label: 'Toujours', points: 4 }
    ]
  },
  {
    id: 'robinet_rps_demande_2',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'On me demande une quantité de travail excessive',
    subtitle: 'Demande psychologique 2/9',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: 'Jamais', points: 1 },
      { label: 'Rarement', points: 2 },
      { label: 'Souvent', points: 3 },
      { label: 'Toujours', points: 4 }
    ]
  },
  {
    id: 'robinet_rps_demande_3',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Je dispose du temps nécessaire pour travailler correctement',
    subtitle: 'Demande psychologique 3/9 (INVERSÉ)',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: 'Jamais', points: 4 },
      { label: 'Rarement', points: 3 },
      { label: 'Souvent', points: 2 },
      { label: 'Toujours', points: 1 }
    ]
  },
  {
    id: 'robinet_rps_demande_4',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Je reçois des ordres contradictoires',
    subtitle: 'Demande psychologique 4/9',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: 'Jamais', points: 1 },
      { label: 'Rarement', points: 2 },
      { label: 'Souvent', points: 3 },
      { label: 'Toujours', points: 4 }
    ]
  },
  {
    id: 'robinet_rps_demande_5',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Mon travail demande de longues périodes de concentration intense',
    subtitle: 'Demande psychologique 5/9',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: 'Jamais', points: 1 },
      { label: 'Rarement', points: 2 },
      { label: 'Souvent', points: 3 },
      { label: 'Toujours', points: 4 }
    ]
  },
  {
    id: 'robinet_rps_demande_6',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Mes tâches sont souvent interrompues avant d\'\u00eatre achevées',
    subtitle: 'Demande psychologique 6/9',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: 'Jamais', points: 1 },
      { label: 'Rarement', points: 2 },
      { label: 'Souvent', points: 3 },
      { label: 'Toujours', points: 4 }
    ]
  },
  {
    id: 'robinet_rps_demande_7',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Mon travail est très bousculé',
    subtitle: 'Demande psychologique 7/9',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: 'Jamais', points: 1 },
      { label: 'Rarement', points: 2 },
      { label: 'Souvent', points: 3 },
      { label: 'Toujours', points: 4 }
    ]
  },

  // LATITUDE DÉCISIONNELLE
  {
    id: 'robinet_rps_latitude_1',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Mon travail me permet de prendre souvent des décisions moi-même',
    subtitle: 'Latitude décisionnelle 1/9',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: 'Jamais', points: 1 },
      { label: 'Rarement', points: 2 },
      { label: 'Souvent', points: 3 },
      { label: 'Toujours', points: 4 }
    ]
  },
  {
    id: 'robinet_rps_latitude_2',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'J\'ai très peu de libertés pour décider comment je fais mon travail',
    subtitle: 'Latitude décisionnelle 2/9 (INVERSÉ)',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: 'Jamais', points: 4 },
      { label: 'Rarement', points: 3 },
      { label: 'Souvent', points: 2 },
      { label: 'Toujours', points: 1 }
    ]
  },
  {
    id: 'robinet_rps_latitude_3',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'J\'ai la possibilité d\'influencer le déroulement de mon travail',
    subtitle: 'Latitude décisionnelle 3/9',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: 'Jamais', points: 1 },
      { label: 'Rarement', points: 2 },
      { label: 'Souvent', points: 3 },
      { label: 'Toujours', points: 4 }
    ]
  },
  {
    id: 'robinet_rps_latitude_4',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Dans mon travail, j\'effectue des tâches répétitives',
    subtitle: 'Latitude décisionnelle 4/9 (INVERSÉ)',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: 'Jamais', points: 4 },
      { label: 'Rarement', points: 3 },
      { label: 'Souvent', points: 2 },
      { label: 'Toujours', points: 1 }
    ]
  },
  {
    id: 'robinet_rps_latitude_5',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Mon travail demande un haut niveau de compétence',
    subtitle: 'Latitude décisionnelle 5/9',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: 'Jamais', points: 1 },
      { label: 'Rarement', points: 2 },
      { label: 'Souvent', points: 3 },
      { label: 'Toujours', points: 4 }
    ]
  },
  {
    id: 'robinet_rps_latitude_6',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'J\'ai des activités variées',
    subtitle: 'Latitude décisionnelle 6/9',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: 'Jamais', points: 1 },
      { label: 'Rarement', points: 2 },
      { label: 'Souvent', points: 3 },
      { label: 'Toujours', points: 4 }
    ]
  },
  {
    id: 'robinet_rps_latitude_7',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Je dois apprendre des choses nouvelles',
    subtitle: 'Latitude décisionnelle 7/9',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: 'Jamais', points: 1 },
      { label: 'Rarement', points: 2 },
      { label: 'Souvent', points: 3 },
      { label: 'Toujours', points: 4 }
    ]
  },
  {
    id: 'robinet_rps_latitude_8',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Mon travail me demande d\'\u00eatre créatif',
    subtitle: 'Latitude décisionnelle 8/9',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: 'Jamais', points: 1 },
      { label: 'Rarement', points: 2 },
      { label: 'Souvent', points: 3 },
      { label: 'Toujours', points: 4 }
    ]
  },
  {
    id: 'robinet_rps_latitude_9',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'J\'ai l\'occasion de développer mes compétences professionnelles',
    subtitle: 'Latitude décisionnelle 9/9',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: 'Jamais', points: 1 },
      { label: 'Rarement', points: 2 },
      { label: 'Souvent', points: 3 },
      { label: 'Toujours', points: 4 }
    ]
  },
]

/**
 * BULLE - Score B (Environnement de travail)
 * Formule : Score_B = MOYENNE(10 questions)
 * Multiplicateur appliqué au Score R selon le niveau
 */
const questionsBulle: Question[] = [
  {
    id: 'bulle_temperature',
    element: 'bulle',
    type: 'single',
    question: 'Température ambiante',
    weight: 1,
    maxPoints: 80,
    options: [
      { label: '18-24°C (confortable)', points: 0 },
      { label: '12-18°C ou 24-28°C', points: 20 },
      { label: '5-12°C (froid)', points: 50, description: '⚠️' },
      { label: '< 5°C ou > 28°C', points: 80, description: '🔴 R4223-13' }
    ]
  },
  {
    id: 'bulle_eclairage',
    element: 'bulle',
    type: 'single',
    question: 'Éclairage',
    weight: 1,
    maxPoints: 75,
    options: [
      { label: '> 500 lux', points: 0 },
      { label: '300-500 lux', points: 15 },
      { label: '100-300 lux', points: 45, description: '⚠️' },
      { label: '< 100 lux', points: 75, description: '🔴 NF X35-103' }
    ]
  },
  {
    id: 'bulle_bruit',
    element: 'bulle',
    type: 'single',
    question: 'Bruit',
    weight: 1,
    maxPoints: 90,
    options: [
      { label: '< 70 dB(A)', points: 0 },
      { label: '70-80 dB(A)', points: 35 },
      { label: '80-85 dB(A)', points: 60, description: '⚠️' },
      { label: '> 85 dB(A)', points: 90, description: '🔴 Protection obligatoire R4431-2' }
    ]
  },
  {
    id: 'bulle_vibrations',
    element: 'bulle',
    type: 'single',
    question: 'Vibrations',
    weight: 1,
    maxPoints: 80,
    options: [
      { label: 'Aucune', points: 0 },
      { label: 'Occasionnel < 2h', points: 25 },
      { label: 'Régulier 2-4h', points: 50, description: '⚠️' },
      { label: 'Prolongé > 4h', points: 80, description: '🔴 R4441-1' }
    ]
  },
  {
    id: 'bulle_horaires',
    element: 'bulle',
    type: 'single',
    question: 'Horaires de travail',
    weight: 1,
    maxPoints: 75,
    options: [
      { label: 'Jour normal 8h-18h', points: 0 },
      { label: 'Décalés tôt/tard', points: 30 },
      { label: 'Nuit ≥ 3h entre 21h-6h', points: 55, description: '⚠️' },
      { label: '3×8 ou tournants', points: 75, description: '🔴 Roquelaure +30% TMS' }
    ]
  },
  {
    id: 'bulle_espace',
    element: 'bulle',
    type: 'single',
    question: 'Espace de travail',
    weight: 1,
    maxPoints: 90,
    options: [
      { label: '> 2 m² (dégagé)', points: 0 },
      { label: '1-2 m² (correct)', points: 25 },
      { label: '0.5-1 m² (encombré)', points: 60, description: '⚠️' },
      { label: '< 0.5 m² (très exigu)', points: 90, description: '🔴' }
    ]
  },
  {
    id: 'bulle_salubrite',
    element: 'bulle',
    type: 'single',
    question: 'Salubrité',
    weight: 1,
    maxPoints: 85,
    options: [
      { label: 'Propre et agréable', points: 0 },
      { label: 'Moyennement propre', points: 20 },
      { label: 'Sale, poussiéreux, odeurs', points: 50, description: '⚠️' },
      { label: 'Insalubre (déchets, sanitaires pollués)', points: 85, description: '🔴' }
    ]
  },
  {
    id: 'bulle_isolement',
    element: 'bulle',
    type: 'single',
    question: 'Isolement du travailleur',
    weight: 1,
    maxPoints: 75,
    options: [
      { label: 'Toujours avec collègues < 50 m', points: 0 },
      { label: 'Seul, collègues proches < 50 m', points: 15 },
      { label: 'Seul, éloigné > 50 m', points: 45, description: '⚠️' },
      { label: 'Complètement isolé', points: 75, description: '🔴 DATI obligatoire R4543-19' }
    ]
  },
  {
    id: 'bulle_materiel',
    element: 'bulle',
    type: 'single',
    question: 'Matériel à disposition',
    weight: 1,
    maxPoints: 90,
    options: [
      { label: 'Tout nécessaire, bon état', points: 0 },
      { label: 'Certains manquants ou usés', points: 25 },
      { label: 'Bricolages inadaptés', points: 60, description: '⚠️' },
      { label: 'Matériel vétuste ou dangereux', points: 90, description: '🔴' }
    ]
  },
  {
    id: 'bulle_epi',
    element: 'bulle',
    type: 'single',
    question: 'Port d\'EPI contraignants',
    weight: 1,
    maxPoints: 80,
    options: [
      { label: 'Aucun EPI ou EPI légers (gants fins, lunettes)', points: 0 },
      { label: 'EPI modérés (casque + chaussures + gants moyens)', points: 20 },
      { label: 'EPI lourds (combinaison + masque + gants épais)', points: 50, description: '⚠️' },
      { label: 'EPI complets isolants / NRBC / ventilation forcée', points: 80, description: '🔴 Réduit préhension -25%' }
    ]
  }
]

/**
 * ORAGE - Score O (Aléas et perturbations)
 * Formule : Score_O = (Score_Imprévu1 + Score_Imprévu2) / 2
 * Score_Imprévu = Coefficient_Fréquence × Points_Impact
 */
const questionsOrage: Question[] = [
  // IMPRÉVU 1
  {
    id: 'orage_imprevu1_frequence',
    element: 'orage',
    type: 'single',
    question: 'Identifier le 1er imprévu/perturbation le plus pénalisant : à quelle fréquence se produit-il ?',
    subtitle: 'Imprévu 1 - Fréquence',
    weight: 0,
    maxPoints: 1.0,
    options: [
      { label: 'Rare (1/mois)', points: 0.2 },
      { label: 'Occasionnel (1/semaine)', points: 0.5 },
      { label: 'Fréquent (2-3/semaine)', points: 0.8, description: '⚠️' },
      { label: 'Quotidien', points: 1.0, description: '🔴' }
    ]
  },
  {
    id: 'orage_imprevu1_impact',
    element: 'orage',
    type: 'single',
    question: 'Quel est l\'impact de cet imprévu sur le déroulement du travail ?',
    subtitle: 'Imprévu 1 - Impact',
    weight: 0,
    maxPoints: 100,
    options: [
      { label: 'Mineur (perd 5-10 min)', points: 20 },
      { label: 'Modéré (perd 15-30 min)', points: 40 },
      { label: 'Important (perd > 30 min)', points: 70, description: '⚠️' },
      { label: 'Majeur (perd > 1h, stress intense)', points: 100, description: '🔴' }
    ]
  },

  // IMPRÉVU 2
  {
    id: 'orage_imprevu2_frequence',
    element: 'orage',
    type: 'single',
    question: 'Identifier le 2ème imprévu/perturbation le plus pénalisant : à quelle fréquence se produit-il ?',
    subtitle: 'Imprévu 2 - Fréquence',
    weight: 0,
    maxPoints: 1.0,
    options: [
      { label: 'Rare (1/mois)', points: 0.2 },
      { label: 'Occasionnel (1/semaine)', points: 0.5 },
      { label: 'Fréquent (2-3/semaine)', points: 0.8, description: '⚠️' },
      { label: 'Quotidien', points: 1.0, description: '🔴' }
    ]
  },
  {
    id: 'orage_imprevu2_impact',
    element: 'orage',
    type: 'single',
    question: 'Quel est l\'impact de cet imprévu sur le déroulement du travail ?',
    subtitle: 'Imprévu 2 - Impact',
    weight: 0,
    maxPoints: 100,
    options: [
      { label: 'Mineur (perd 5-10 min)', points: 20 },
      { label: 'Modéré (perd 15-30 min)', points: 40 },
      { label: 'Important (perd > 30 min)', points: 70, description: '⚠️' },
      { label: 'Majeur (perd > 1h, stress intense)', points: 100, description: '🔴' }
    ]
  }
]

/**
 * PAILLE - Score P (Récupération)
 * Formule : Score_P = MOYENNE(6 questions)
 * Score élevé = bonne récupération
 */
const questionsPaille: Question[] = [
  {
    id: 'paille_pauses',
    element: 'paille',
    type: 'single',
    question: 'L\'opérateur peut-il faire des pauses quand il en a besoin ?',
    weight: 1,
    maxPoints: 100,
    options: [
      { label: 'Pauses libres + pauses officielles', points: 100 },
      { label: 'Pauses officielles uniquement (fixes)', points: 70 },
      { label: 'Pauses rares ou difficiles à prendre', points: 40, description: '⚠️' },
      { label: 'Aucune pause — travail continu', points: 0, description: '🔴 Violation L3121-33 si > 6h' }
    ]
  },
  {
    id: 'paille_mobilite',
    element: 'paille',
    type: 'single',
    question: 'L\'opérateur peut-il bouger et changer de position ?',
    weight: 1,
    maxPoints: 100,
    options: [
      { label: 'Alterne assis/debout/marche librement', points: 100 },
      { label: 'Peut bouger un peu sur place', points: 60 },
      { label: 'Position statique quasi-permanente', points: 30, description: '🔴' }
    ]
  },
  {
    id: 'paille_etirements',
    element: 'paille',
    type: 'single',
    question: 'L\'opérateur peut-il s\'\u00e9tirer pendant le travail ?',
    weight: 1,
    maxPoints: 100,
    options: [
      { label: 'Fait des étirements réguliers', points: 100 },
      { label: 'Pourrait mais ne le fait pas', points: 50 },
      { label: 'Impossible (pas d\'espace, pas de temps)', points: 0, description: '🔴' }
    ]
  },
  {
    id: 'paille_hydratation',
    element: 'paille',
    type: 'single',
    question: 'L\'opérateur peut-il boire de l\'eau facilement ?',
    weight: 1,
    maxPoints: 100,
    options: [
      { label: 'Bouteille à portée ou fontaine proche', points: 100 },
      { label: 'Accessible mais à distance', points: 75 },
      { label: 'Difficile (loin ou interdit pendant la tâche)', points: 30, description: '🔴 R4225-2' }
    ]
  },
  {
    id: 'paille_repos',
    element: 'paille',
    type: 'single',
    question: 'Y a-t-il un endroit calme pour se reposer aux pauses ?',
    weight: 1,
    maxPoints: 100,
    options: [
      { label: 'Salle de pause dédiée, calme', points: 100 },
      { label: 'Existe mais bruyante/partagée', points: 65 },
      { label: 'Non — pause sur le poste ou debout', points: 30, description: '⚠️' }
    ]
  },
  {
    id: 'paille_preparation',
    element: 'paille',
    type: 'single',
    question: 'L\'opérateur effectue-t-il des exercices de préparation (réveil musculaire, mobilisation articulaire) avant les tâches critiques ?',
    weight: 1,
    maxPoints: 100,
    options: [
      { label: 'Protocole structuré avant chaque tâche critique', points: 100 },
      { label: 'Parfois, selon la motivation du jour', points: 60 },
      { label: 'Rare, uniquement en cas de douleur existante', points: 30, description: '⚠️' },
      { label: 'Jamais — aucune préparation physique', points: 0, description: '🔴' }
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

  // Protection : si currentQuestion est undefined, réinitialiser l'index
  useEffect(() => {
    if (!currentQuestion && currentQuestions.length > 0) {
      setCurrentQuestionIndex(0)
    }
  }, [currentQuestion, currentQuestions])


  // ============================================================================
  // FONCTIONS DE CALCUL DES SCORES
  // ============================================================================

  /**
   * ROBINET Section A : CHARGES (40% du Score R)
   * Formule : MIN(100, Poids × (1 + Dist) × (1 + Préh) × (1 + Fréq))
   */
  const calculateScoreCharges = (): number => {
    const poids = answers['robinet_charges_poids']
    const distance = answers['robinet_charges_distance']
    const prehension = answers['robinet_charges_prehension']
    const frequence = answers['robinet_charges_frequence']

    if (poids === undefined || distance === undefined || prehension === undefined || frequence === undefined) {
      return 0
    }

    const poidsNum = typeof poids === 'number' ? poids : 0
    const distNum = typeof distance === 'number' ? distance : 0
    const prehNum = typeof prehension === 'number' ? prehension : 0
    const freqNum = typeof frequence === 'number' ? frequence : 0

    const score = poidsNum * (1 + distNum) * (1 + prehNum) * (1 + freqNum)
    return Math.min(100, score)
  }

  /**
   * ROBINET Section B : POSTURES (35% du Score R)
   * 5 zones corporelles (Tronc, Bras, Cou, Poignets, Jambes)
   * Formule par zone : Sévérité × Type × %Temps
   * Score final : MAX(zones)×0.5 + MOYENNE(zones)×0.5
   */
  const calculateScorePostures = (): number => {
    const zones = ['tronc', 'bras', 'cou', 'poignets', 'jambes']
    const scoresZones: number[] = []

    for (const zone of zones) {
      const severite = answers[`robinet_postures_${zone}_severite`]
      const type = answers[`robinet_postures_${zone}_type`]
      const pct = answers[`robinet_postures_${zone}_pct`]

      if (severite !== undefined && type !== undefined && pct !== undefined) {
        const sev = typeof severite === 'number' ? severite : 0
        const typ = typeof type === 'number' ? type : 1
        const pctVal = typeof pct === 'number' ? pct : 1
        const scoreZone = Math.min(100, sev * typ * pctVal)
        scoresZones.push(scoreZone)
      }
    }

    if (scoresZones.length === 0) return 0

    const maxZone = Math.max(...scoresZones)
    const moyenneZones = scoresZones.reduce((sum, s) => sum + s, 0) / scoresZones.length
    const scoreFinal = (maxZone * 0.5) + (moyenneZones * 0.5)

    return Math.min(100, scoreFinal)
  }

  /**
   * ROBINET Section C : CHARGE MENTALE NASA-TLX (15% du Score R)
   * Formule : (Σ 6 dimensions / 120) × 100
   */
  const calculateScoreMental = (): number => {
    const dimensions = [
      'exigence_mentale',
      'exigence_physique',
      'exigence_temporelle',
      'performance',
      'effort',
      'frustration'
    ]

    let somme = 0
    let count = 0

    for (const dim of dimensions) {
      const val = answers[`robinet_mental_${dim}`]
      if (val !== undefined && typeof val === 'number') {
        somme += val
        count++
      }
    }

    if (count === 0) return 0

    // Score max = 120 (6 × 20)
    const score = (somme / 120) * 100
    return Math.min(100, score)
  }

  /**
   * ROBINET Section D : RPS Karasek (10% du Score R)
   * Calcul des axes Demande et Latitude → Quadrant → Score RPS
   */
  const calculateScoreRPS = (): number => {
    // Demande psychologique (7 items)
    const demandeIds = [
      'robinet_rps_demande_1',
      'robinet_rps_demande_2',
      'robinet_rps_demande_3', // INVERSÉ
      'robinet_rps_demande_4',
      'robinet_rps_demande_5',
      'robinet_rps_demande_6',
      'robinet_rps_demande_7'
    ]

    let sommeDemande = 0
    let countDemande = 0
    for (const id of demandeIds) {
      const val = answers[id]
      if (val !== undefined && typeof val === 'number') {
        sommeDemande += val
        countDemande++
      }
    }

    // Latitude décisionnelle (9 items)
    const latitudeIds = [
      'robinet_rps_latitude_1',
      'robinet_rps_latitude_2', // INVERSÉ
      'robinet_rps_latitude_3',
      'robinet_rps_latitude_4', // INVERSÉ
      'robinet_rps_latitude_5',
      'robinet_rps_latitude_6',
      'robinet_rps_latitude_7',
      'robinet_rps_latitude_8',
      'robinet_rps_latitude_9'
    ]

    let sommeLatitude = 0
    let countLatitude = 0
    for (const id of latitudeIds) {
      const val = answers[id]
      if (val !== undefined && typeof val === 'number') {
        sommeLatitude += val
        countLatitude++
      }
    }

    if (countDemande === 0 || countLatitude === 0) return 0

    // Quadrant Karasek
    // Demande < 21 ET Latitude ≥ 70 → DÉTENDU → -20
    // Demande ≥ 21 ET Latitude ≥ 70 → ACTIF → -10
    // Demande < 21 ET Latitude < 70 → PASSIF → +40
    // Demande ≥ 21 ET Latitude < 70 → TENDU → +80

    let scoreRPS = 0
    if (sommeDemande < 21 && sommeLatitude >= 70) {
      scoreRPS = -20 // Effet protecteur
    } else if (sommeDemande >= 21 && sommeLatitude >= 70) {
      scoreRPS = -10
    } else if (sommeDemande < 21 && sommeLatitude < 70) {
      scoreRPS = 40
    } else {
      scoreRPS = 80 // TENDU
    }

    // Normaliser sur 0-100 (on ramène -20 à 100 vers 0-100)
    // -20 → 0, 80 → 100
    const scoreNormalise = ((scoreRPS + 20) / 100) * 100
    return Math.max(0, Math.min(100, scoreNormalise))
  }

  /**
   * CALCUL DES SCORES EN TEMPS RÉEL
   */
  useEffect(() => {
    // ========================================
    // SCORE V (VERRE) - Capacité d'absorption
    // ========================================
    // Formule : Score_V = MAX(0, MIN(100, 100 - Σ pénalités))
    let sommePenalites = 0
    questionsVerre.forEach(q => {
      const answer = answers[q.id]
      if (answer !== undefined && typeof answer === 'number') {
        sommePenalites += answer
      }
    })
    const scoreV = Math.max(0, Math.min(100, 100 - sommePenalites))

    // ========================================
    // SCORE R (ROBINET) - Charge de travail
    // ========================================
    // 4 sections : Charges (40%) + Postures (35%) + Mental (15%) + RPS (10%)
    const scoreCharges = calculateScoreCharges()
    const scorePostures = calculateScorePostures()
    const scoreMental = calculateScoreMental()
    const scoreRPS = calculateScoreRPS()
    
    const scoreR = Math.min(100, (scoreCharges * 0.40) + (scorePostures * 0.35) + (scoreMental * 0.15) + (scoreRPS * 0.10))

    // ========================================
    // SCORE B (BULLE) - Environnement
    // ========================================
    // Formule : MOYENNE normalisée (10 questions)
    let sommeBulle = 0
    let sommeMaxBulle = 0
    questionsBulle.forEach(q => {
      const answer = answers[q.id]
      if (answer !== undefined && typeof answer === 'number') {
        sommeBulle += answer
        sommeMaxBulle += q.maxPoints
      }
    })
    const scoreB = sommeMaxBulle > 0 ? Math.min(100, (sommeBulle / sommeMaxBulle) * 100) : 0

    // ========================================
    // SCORE O (ORAGE) - Aléas
    // ========================================
    // Formule : (Score_Imprévu1 + Score_Imprévu2) / 2
    // Score_Imprévu = Coeff_Fréquence × Points_Impact
    const freq1 = answers['orage_imprevu1_frequence']
    const impact1 = answers['orage_imprevu1_impact']
    const freq2 = answers['orage_imprevu2_frequence']
    const impact2 = answers['orage_imprevu2_impact']

    let scoreImprevu1 = 0
    if (freq1 !== undefined && impact1 !== undefined && typeof freq1 === 'number' && typeof impact1 === 'number') {
      scoreImprevu1 = freq1 * impact1
    }

    let scoreImprevu2 = 0
    if (freq2 !== undefined && impact2 !== undefined && typeof freq2 === 'number' && typeof impact2 === 'number') {
      scoreImprevu2 = freq2 * impact2
    }

    const scoreO = Math.min(100, (scoreImprevu1 + scoreImprevu2) / 2)

    // ========================================
    // SCORE P (PAILLE) - Récupération
    // ========================================
    // Formule : MOYENNE normalisée (6 questions)
    let sommePaille = 0
    let sommeMaxPaille = 0
    questionsPaille.forEach(q => {
      const answer = answers[q.id]
      if (answer !== undefined && typeof answer === 'number') {
        sommePaille += answer
        sommeMaxPaille += q.maxPoints
      }
    })
    const scoreP = sommeMaxPaille > 0 ? Math.min(100, (sommePaille / sommeMaxPaille) * 100) : 0

    setScores(prev => ({
      ...prev,
      verre: Math.round(scoreV),
      robinet: Math.round(scoreR),
      bulle: Math.round(scoreB),
      orage: Math.round(scoreO),
      paille: Math.round(scoreP)
    }))
  }, [answers])

  // Gestion des réponses simples (single)
  const handleAnswer = (points: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: points }))
    
    // Animation de validation puis passage à la question suivante
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 400)
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

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  // Déterminer la section actuelle
  const getCurrentSection = () => {
    return currentQuestion?.section || ''
  }

  // Calcul du nombre de sections pour Robinet
  const getRobinetSections = () => {
    const sections = ['Charges', 'Postures', 'Charge Mentale', 'RPS']
    return sections
  }

  // Trouver la section actuelle pour Robinet
  const getCurrentRobinetSection = () => {
    if (selectedElement !== 'robinet' || !currentQuestion) return null
    const section = currentQuestion.section || ''
    const sections = getRobinetSections()
    const sectionIndex = sections.indexOf(section)
    return sectionIndex >= 0 ? { name: section, index: sectionIndex, total: sections.length } : null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-[1800px] mx-auto p-8">
        
        {/* Header avec contexte tâche */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Analyse ergonomique</h1>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Tâche :</span>
                <span className="text-blue-400 font-semibold">Assemblage moteur - Ligne A</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-500">Opérateur principal</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Progression globale</div>
              <div className="text-2xl font-bold text-white">
                {Math.round((Object.keys(answers).length / Object.values(allQuestions).flat().length) * 100)}%
              </div>
            </div>
          </div>
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
            
            {/* Barre de progression smart */}
            <div className="w-full max-w-md space-y-3">
              {/* Compteur et section */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">
                    Question {currentQuestionIndex + 1}/{currentQuestions.length}
                  </span>
                  {getCurrentRobinetSection() && (
                    <>
                      <span className="text-gray-600">•</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        currentElement.bgColor
                      } ${currentElement.textColor} border ${currentElement.borderColor}`}>
                        {getCurrentRobinetSection()!.name}
                      </span>
                    </>
                  )}
                </div>
                <span className="text-gray-400">
                  {answeredForElement}/{currentQuestions.length} répondues
                </span>
              </div>
              
              {/* Barre de progression avec segments */}
              <div className="relative h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                {/* Segments pour chaque question */}
                <div className="absolute inset-0 flex">
                  {currentQuestions.map((q, idx) => {
                    const isAnswered = answers[q.id] !== undefined
                    const isCurrent = idx === currentQuestionIndex
                    return (
                      <div
                        key={q.id}
                        className={`flex-1 transition-all duration-300 ${
                          isAnswered 
                            ? currentElement.bgColor.replace('/30', '') 
                            : isCurrent
                            ? 'bg-slate-600'
                            : 'bg-transparent'
                        }`}
                        style={{ 
                          borderRight: idx < currentQuestions.length - 1 ? '1px solid rgba(0,0,0,0.3)' : 'none'
                        }}
                      />
                    )
                  })}
                </div>
                {/* Indicateur position actuelle */}
                <motion.div
                  className="absolute top-0 h-full w-1 bg-white shadow-lg z-10"
                  initial={{ left: 0 }}
                  animate={{ left: `${(currentQuestionIndex / currentQuestions.length) * 100}%` }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </div>
              
              {/* Navigation par sections pour Robinet */}
              {selectedElement === 'robinet' && (
                <div className="flex items-center gap-2 justify-center mt-4">
                  {getRobinetSections().map((sectionName, idx) => {
                    const sectionQuestions = questionsRobinet.filter(q => q.section === sectionName)
                    const sectionAnswered = sectionQuestions.filter(q => answers[q.id] !== undefined).length
                    const isCurrentSection = getCurrentRobinetSection()?.index === idx
                    const isComplete = sectionAnswered === sectionQuestions.length
                    
                    return (
                      <button
                        key={sectionName}
                        onClick={() => {
                          const firstQuestionIndex = questionsRobinet.findIndex(q => q.section === sectionName)
                          if (firstQuestionIndex >= 0) goToQuestion(firstQuestionIndex)
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          isCurrentSection
                            ? `${currentElement.bgColor} ${currentElement.borderColor} border-2 text-white`
                            : isComplete
                            ? 'bg-green-900/30 border border-green-700 text-green-400'
                            : 'bg-slate-800/50 border border-gray-700 text-gray-400 hover:bg-slate-800'
                        }`}
                      >
                        {isComplete && <Check className="w-3 h-3 inline mr-1" />}
                        {sectionName}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Question card */}
            <AnimatePresence mode="wait">
              {!currentQuestion ? (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`border-2 rounded-2xl p-8 shadow-2xl shadow-gray-900/50 w-full max-w-md ${
                    currentElement.bgColor
                  } ${currentElement.borderColor}`}
                >
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">✓</div>
                    <h3 className="text-2xl font-bold text-white mb-2">Section complète !</h3>
                    <p className="text-gray-300">Toutes les questions de {currentElement.name} ont été répondues.</p>
                  </div>
                </motion.div>
              ) : (
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
                        className={`group relative w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? `${currentElement.bgColor} ${currentElement.borderColor} shadow-lg shadow-${currentElement.color}-500/20 scale-[1.02]`
                            : 'bg-slate-800/40 border-gray-700/40 hover:border-gray-500 hover:bg-slate-800/70 hover:shadow-md'
                        }`}
                        whileHover={{ scale: isSelected ? 1.02 : 1.03, x: 6 }}
                        whileTap={{ scale: 0.97 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0,
                          scale: isSelected ? 1.02 : 1
                        }}
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
                              isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'
                            }`}>
                              {option.label}
                            </span>
                            {/* Points visuels (masqués pour l'utilisateur mais visible en dev) */}
                            {process.env.NODE_ENV === 'development' && (
                              <span className="text-xs text-gray-600 mt-1 block">
                                Points: {option.points}
                              </span>
                            )}
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

                  {/* Navigation buttons améliorée */}
                  <div className="flex justify-between gap-4 mt-6">
                    <motion.button
                      onClick={goToPreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                        currentQuestionIndex === 0
                          ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                          : 'bg-slate-800 text-white hover:bg-slate-700 shadow-lg hover:shadow-xl'
                      }`}
                      whileHover={currentQuestionIndex !== 0 ? { scale: 1.02, x: -2 } : {}}
                      whileTap={currentQuestionIndex !== 0 ? { scale: 0.98 } : {}}
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" />
                      Précédent
                    </motion.button>

                    {currentQuestion.type === 'multiple' && (
                      <motion.button
                        onClick={goToNextQuestion}
                        disabled={currentQuestionIndex === currentQuestions.length - 1}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all shadow-lg ${
                          currentQuestionIndex === currentQuestions.length - 1
                            ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                            : `${currentElement.bgColor} ${currentElement.borderColor} border-2 text-white hover:shadow-xl`
                        }`}
                        whileHover={currentQuestionIndex !== currentQuestions.length - 1 ? { scale: 1.02, x: 2 } : {}}
                        whileTap={currentQuestionIndex !== currentQuestions.length - 1 ? { scale: 0.98 } : {}}
                      >
                        Continuer
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
