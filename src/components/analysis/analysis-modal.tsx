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
import { ChevronRight, Info, Check, X, Save } from 'lucide-react'
import DashboardSimplified from '@/components/modele/dashboard-simplified'

// ============================================================================
// TYPES
// ============================================================================

type ElementType = 'verre' | 'robinet' | 'bulle' | 'orage' | 'paille'

interface Question {
  id: string
  element: ElementType
  type: 'single' | 'multiple' | 'scale'  // single = choix unique, multiple = plusieurs choix possibles, scale = curseur
  section?: string  // Nom de la section (ex: "Charges", "Postures", "Charge Mentale", "RPS")
  question: string
  subtitle?: string
  description?: string  // Description détaillée pour les questions de type scale
  weight: number  // CONFIDENTIEL - Pondération dans le calcul final
  maxPoints: number  // CONFIDENTIEL - Score maximum pour cette question
  minValue?: number  // Pour type 'scale' uniquement
  maxValue?: number  // Pour type 'scale' uniquement
  minLabel?: string  // Label pour la valeur minimale (scale)
  maxLabel?: string  // Label pour la valeur maximale (scale)
  options?: Array<{
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
    question: 'Quel est votre âge ?',
    subtitle: 'Facteur de fragilité tissulaire',
    weight: 1,
    maxPoints: 25,
    options: [
      { label: '< 30 ans', points: 0 }, // Référence optimale
      { label: '30 à 45 ans', points: 8 },
      { label: '45 à 55 ans', points: 16 },
      { label: '> 55 ans', points: 25 } // Sarcopénie progressive
    ]
  },
  {
    id: 'verre_historique_tms',
    element: 'verre',
    type: 'single',
    question: 'Avez-vous des antécédents de troubles musculo-squelettiques (TMS) ?',
    subtitle: 'Risque récidive',
    weight: 1,
    maxPoints: 40,
    options: [
      { label: 'Non, jamais', points: 0 },
      { label: 'Oui, guéris depuis > 2 ans', points: 12 },
      { label: 'Oui, récemment ou récurrents', points: 25 },
      { label: 'Oui, douleurs actuelles', points: 40 } // Risque élevé
    ]
  },
  {
    id: 'verre_activite_physique',
    element: 'verre',
    type: 'single',
    question: 'Combien d\'heures d\'activité physique hebdomadaire (sport, marche) ?',
    subtitle: 'Facteur protecteur musculo-squelettique',
    weight: 1,
    maxPoints: 25,
    options: [
      { label: '≥ 2h/semaine', points: 0 }, // Condition optimale
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
      { label: 'Homme', points: 0 }, // Référence NF X35-109
      { label: 'Femme', points: 8 } // Seuil charge 15 kg vs 25 kg
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
      { label: '15-25 kg', points: 60 }, // Seuil femme NF X35-109
      { label: '25-40 kg', points: 80 }, // Zone grise
      { label: '40-55 kg', points: 90 }, // Limite homme
      { label: '> 55 kg', points: 100 } // NON-CONFORMITÉ R4541-9
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
      { label: '40-55 cm (éloigné)', points: 0.50 }, // Risque accru
      { label: '> 55 cm (bras tendus)', points: 0.80 } // Très risqué
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
      { label: 'Difficile (encombrante, glissante, sans poignée)', points: 0.30 },
      { label: 'Très difficile (poids mal réparti, forme irrégulière)', points: 0.45 }
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
      { label: 'Fréquent : 5-15/min', points: 0.40 }, // Répétitif
      { label: 'Très fréquent : > 15/min', points: 0.60 } // NON-CONFORMITÉ - Très répétitif
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
      { label: 'Penché modéré 20-45°', points: 30 },
      { label: 'Penché marqué > 45°', points: 45 }, // NON-CONFORMITÉ
      { label: 'Tordu / rotation latérale', points: 20 },
      { label: 'Combinaison penché + tordu', points: 55 } // NON-CONFORMITÉ
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
      { label: 'Statique court (maintenu < 2 min)', points: 1.3 },
      { label: 'Statique prolongé (maintenu > 2 min)', points: 1.6 },
      { label: 'Statique extrême (> 10 min sans pause)', points: 2.0 }
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
      { label: '33-50%', points: 1.0 },
      { label: '50-80%', points: 1.3 },
      { label: '> 80%', points: 1.6 }
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
      { label: 'Au-dessus des épaules > 90°', points: 45 }, // NON-CONFORMITÉ
      { label: 'Maintenu en avant > 30 cm', points: 30 }
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
      { label: 'Statique court (< 2 min)', points: 1.3 },
      { label: 'Statique prolongé (> 2 min)', points: 1.6 },
      { label: 'Statique extrême (> 10 min)', points: 2.0 }
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
      { label: '33-50%', points: 1.0 },
      { label: '50-80%', points: 1.3 },
      { label: '> 80%', points: 1.6 }
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
      { label: 'Penché marqué > 20°', points: 20 },
      { label: 'Rotation significative', points: 15 },
      { label: 'Combinaison penché + rotation', points: 25 }
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
      { label: 'Statique court (< 2 min)', points: 1.3 },
      { label: 'Statique prolongé (> 2 min)', points: 1.6 },
      { label: 'Statique extrême (> 10 min)', points: 2.0 }
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
      { label: '33-50%', points: 1.0 },
      { label: '50-80%', points: 1.3 },
      { label: '> 80%', points: 1.6 }
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
      { label: 'Déviation modérée 15-30°', points: 25 },
      { label: 'Déviation extrême > 30°', points: 45 },
      { label: 'Pinch grip / prise en pince', points: 30 }
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
      { label: 'Statique court (< 2 min)', points: 1.3 },
      { label: 'Statique prolongé (> 2 min)', points: 1.6 },
      { label: 'Statique extrême (> 10 min)', points: 2.0 }
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
      { label: '33-50%', points: 1.0 },
      { label: '50-80%', points: 1.3 },
      { label: '> 80%', points: 1.6 }
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
      { label: 'Debout statique > 2h', points: 20 },
      { label: 'Debout statique > 4h', points: 35 },
      { label: 'Assis statique > 4h', points: 15 },
      { label: 'À genoux / accroupi prolongé', points: 45 }
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
      { label: 'Statique court (< 2 min)', points: 1.3 },
      { label: 'Statique prolongé (> 2 min)', points: 1.6 },
      { label: 'Statique extrême (> 10 min)', points: 2.0 }
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
      { label: '33-50%', points: 1.0 },
      { label: '50-80%', points: 1.3 },
      { label: '> 80%', points: 1.6 }
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
    type: 'scale',
    section: 'Charge Mentale',
    question: 'Exigence mentale',
    subtitle: 'NASA-TLX Dimension 1/6',
    description: 'Quelle activité mentale et perceptive était requise (par exemple, penser, décider, calculer, se souvenir, regarder, chercher, etc.) ? La tâche était-elle facile ou exigeante, simple ou complexe, indulgente ou exigeante ?',
    weight: 0,
    maxPoints: 20,
    minValue: 0,
    maxValue: 20,
    minLabel: 'Faible',
    maxLabel: 'Élevée'
  },
  {
    id: 'robinet_mental_exigence_physique',
    element: 'robinet',
    type: 'scale',
    section: 'Charge Mentale',
    question: 'Exigence physique',
    subtitle: 'NASA-TLX Dimension 2/6',
    description: 'Quelle quantité d\'activité physique était requise (par exemple, pousser, tirer, tourner, contrôler, activer, etc.) ? La tâche était-elle facile ou exigeante, lente ou rapide, détendue ou exténuante, reposante ou laborieuse ?',
    weight: 0,
    maxPoints: 20,
    minValue: 0,
    maxValue: 20,
    minLabel: 'Faible',
    maxLabel: 'Élevée'
  },
  {
    id: 'robinet_mental_exigence_temporelle',
    element: 'robinet',
    type: 'scale',
    section: 'Charge Mentale',
    question: 'Exigence temporelle',
    subtitle: 'NASA-TLX Dimension 3/6',
    description: 'Quelle pression temporelle avez-vous ressentie en raison de la vitesse ou du rythme auquel les tâches ou les éléments de la tâche se sont déroulés ? Le rythme était-il lent et tranquille ou rapide et effréné ?',
    weight: 0,
    maxPoints: 20,
    minValue: 0,
    maxValue: 20,
    minLabel: 'Faible',
    maxLabel: 'Élevée'
  },
  {
    id: 'robinet_mental_performance',
    element: 'robinet',
    type: 'scale',
    section: 'Charge Mentale',
    question: 'Performance',
    subtitle: 'NASA-TLX Dimension 4/6',
    description: 'Dans quelle mesure pensez-vous avoir réussi à atteindre les objectifs de la tâche fixés par l\'expérimentateur (ou vous-même) ? Dans quelle mesure avez-vous été satisfait de votre performance dans l\'accomplissement de ces objectifs ?',
    weight: 0,
    maxPoints: 20,
    minValue: 0,
    maxValue: 20,
    minLabel: 'Bonne',
    maxLabel: 'Mauvaise'
  },
  {
    id: 'robinet_mental_effort',
    element: 'robinet',
    type: 'scale',
    section: 'Charge Mentale',
    question: 'Effort',
    subtitle: 'NASA-TLX Dimension 5/6',
    description: 'Dans quelle mesure avez-vous dû travailler (mentalement et physiquement) pour atteindre votre niveau de performance ?',
    weight: 0,
    maxPoints: 20,
    minValue: 0,
    maxValue: 20,
    minLabel: 'Faible',
    maxLabel: 'Élevé'
  },
  {
    id: 'robinet_mental_frustration',
    element: 'robinet',
    type: 'scale',
    section: 'Charge Mentale',
    question: 'Niveau de frustration',
    subtitle: 'NASA-TLX Dimension 6/6',
    description: 'Dans quelle mesure avez-vous ressenti de l\'insécurité, du découragement, de l\'irritation, du stress et de l\'agacement par rapport à de la sécurité, de la satisfaction, du contentement, de la détente et de la complaisance pendant la tâche ?',
    weight: 0,
    maxPoints: 20,
    minValue: 0,
    maxValue: 20,
    minLabel: 'Faible',
    maxLabel: 'Élevé'
  },

  // ============================================================================
  // SECTION D : RISQUES PSYCHOSOCIAUX Karasek (10% du Score R)
  // ============================================================================
  // 18 questions : échelle 1-4
  // Axe Demande psychologique (9 items)
  // Axe Latitude décisionnelle (9 items)
  // Quadrant Karasek → Score RPS

  // QUANTITÉ - RAPIDITÉ
  {
    id: 'robinet_rps_demande_1',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Mon travail me demande de travailler très vite',
    subtitle: 'Quantité - Rapidité 1/3',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: '1', points: 1 },
      { label: '2', points: 2 },
      { label: '3', points: 3 },
      { label: '4', points: 4 }
    ]
  },
  {
    id: 'robinet_rps_demande_2',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'On me demande d\'effectuer une quantité de travail excessive',
    subtitle: 'Quantité - Rapidité 2/3',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: '1', points: 1 },
      { label: '2', points: 2 },
      { label: '3', points: 3 },
      { label: '4', points: 4 }
    ]
  },
  {
    id: 'robinet_rps_demande_3',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Je dispose du temps nécessaire pour exécuter correctement mon travail',
    subtitle: 'Quantité - Rapidité 3/3 (score inversé)',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: '1', points: 1 },
      { label: '2', points: 2 },
      { label: '3', points: 3 },
      { label: '4', points: 4 }
    ]
  },

  // COMPLEXITÉ - INTENSITÉ
  {
    id: 'robinet_rps_demande_4',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Je reçois des ordres contradictoires de la part d\'autres personnes',
    subtitle: 'Complexité - Intensité 1/3',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: '1', points: 1 },
      { label: '2', points: 2 },
      { label: '3', points: 3 },
      { label: '4', points: 4 }
    ]
  },
  {
    id: 'robinet_rps_demande_5',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Mon travail me demande de travailler intensément',
    subtitle: 'Complexité - Intensité 2/3',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: '1', points: 1 },
      { label: '2', points: 2 },
      { label: '3', points: 3 },
      { label: '4', points: 4 }
    ]
  },
  {
    id: 'robinet_rps_demande_6',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Mon travail demande de longues périodes de concentration intense',
    subtitle: 'Complexité - Intensité 3/3',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: '1', points: 1 },
      { label: '2', points: 2 },
      { label: '3', points: 3 },
      { label: '4', points: 4 }
    ]
  },

  // MORCELLEMENT - PRÉVISIBILITÉ
  {
    id: 'robinet_rps_demande_7',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Mes tâches sont souvent interrompues avant d\'être achevées, nécessitant de les reprendre plus tard',
    subtitle: 'Morcellement - Prévisibilité 1/3',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: '1', points: 1 },
      { label: '2', points: 2 },
      { label: '3', points: 3 },
      { label: '4', points: 4 }
    ]
  },
  {
    id: 'robinet_rps_demande_8',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Mon travail est très bousculé',
    subtitle: 'Morcellement - Prévisibilité 2/3',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: '1', points: 1 },
      { label: '2', points: 2 },
      { label: '3', points: 3 },
      { label: '4', points: 4 }
    ]
  },
  {
    id: 'robinet_rps_demande_9',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Attendre le travail de collègues ou d\'autres départements ralentit souvent mon propre travail',
    subtitle: 'Morcellement - Prévisibilité 3/3',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: '1', points: 1 },
      { label: '2', points: 2 },
      { label: '3', points: 3 },
      { label: '4', points: 4 }
    ]
  },

  // LATITUDE OU MARGES DE MANŒUVRE
  {
    id: 'robinet_rps_latitude_1',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Mon travail me permet de prendre souvent des décisions moi même',
    subtitle: 'Latitude ou marges de manœuvre 1/3',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: '1', points: 1 },
      { label: '2', points: 2 },
      { label: '3', points: 3 },
      { label: '4', points: 4 }
    ]
  },
  {
    id: 'robinet_rps_latitude_2',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Dans ma tâche, j\'ai très peu de libertés pour décider comment je fais mon travail',
    subtitle: 'Latitude ou marges de manœuvre 2/3 (score inversé)',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: '1', points: 1 },
      { label: '2', points: 2 },
      { label: '3', points: 3 },
      { label: '4', points: 4 }
    ]
  },
  {
    id: 'robinet_rps_latitude_3',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'J\'ai la possibilité d\'influencer le déroulement de mon travail',
    subtitle: 'Latitude ou marges de manœuvre 3/3',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: '1', points: 1 },
      { label: '2', points: 2 },
      { label: '3', points: 3 },
      { label: '4', points: 4 }
    ]
  },

  // UTILISATION ACTUELLE DES COMPÉTENCES
  {
    id: 'robinet_rps_latitude_4',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Dans mon travail, j\'effectue des tâches répétitives',
    subtitle: 'Utilisation actuelle des compétences 1/3 (score inversé)',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: '1', points: 1 },
      { label: '2', points: 2 },
      { label: '3', points: 3 },
      { label: '4', points: 4 }
    ]
  },
  {
    id: 'robinet_rps_latitude_5',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Mon travail demande un haut niveau de compétence',
    subtitle: 'Utilisation actuelle des compétences 2/3',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: '1', points: 1 },
      { label: '2', points: 2 },
      { label: '3', points: 3 },
      { label: '4', points: 4 }
    ]
  },
  {
    id: 'robinet_rps_latitude_6',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Dans mon travail, j\'ai des activités variées',
    subtitle: 'Utilisation actuelle des compétences 3/3',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: '1', points: 1 },
      { label: '2', points: 2 },
      { label: '3', points: 3 },
      { label: '4', points: 4 }
    ]
  },

  // DÉVELOPPEMENT DES COMPÉTENCES
  {
    id: 'robinet_rps_latitude_7',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Dans mon travail, je dois apprendre des choses nouvelles',
    subtitle: 'Développement des compétences 1/3',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: '1', points: 1 },
      { label: '2', points: 2 },
      { label: '3', points: 3 },
      { label: '4', points: 4 }
    ]
  },
  {
    id: 'robinet_rps_latitude_8',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'Mon travail me demande d\'être créatif',
    subtitle: 'Développement des compétences 2/3',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: '1', points: 1 },
      { label: '2', points: 2 },
      { label: '3', points: 3 },
      { label: '4', points: 4 }
    ]
  },
  {
    id: 'robinet_rps_latitude_9',
    element: 'robinet',
    type: 'single',
    section: 'RPS',
    question: 'J\'ai l\'occasion de développer mes compétences professionnelles',
    subtitle: 'Développement des compétences 3/3',
    weight: 0,
    maxPoints: 4,
    options: [
      { label: '1', points: 1 },
      { label: '2', points: 2 },
      { label: '3', points: 3 },
      { label: '4', points: 4 }
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
      { label: '5-12°C (froid)', points: 50 },
      { label: '< 5°C ou > 28°C', points: 80 } // NON-CONFORMITÉ R4223-13
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
      { label: '100-300 lux', points: 45 },
      { label: '< 100 lux', points: 75 } // NON-CONFORMITÉ R4223-4
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
      { label: '80-85 dB', points: 50 }, // Seuil vigilance
      { label: '> 85 dB', points: 80 } // NON-CONFORMITÉ R4213-5 - protections obligatoires
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
      { label: 'Espace réduit < 1,5m²', points: 50 },
      { label: 'Encombré, risque collision', points: 80 } // NON-CONFORMITÉ R4214
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
      { label: 'Nuit ≥ 3h entre 21h-6h', points: 55 },
      { label: '3×8 ou tournants', points: 75 } // NON-CONFORMITÉ R4223-13
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
      { label: '0.5-1 m² (encombré)', points: 60 },
      { label: '< 0.5 m² (très exigu)', points: 90 } // NON-CONFORMITÉ R4214
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
      { label: 'Sale, poussiéreux, odeurs', points: 50 },
      { label: 'Insalubre (déchets, sanitaires pollués)', points: 85 } // NON-CONFORMITÉ R4214
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
      { label: 'Seul, éloigné > 50 m', points: 45 },
      { label: 'Complètement isolé', points: 75 } // NON-CONFORMITÉ R4214
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
      { label: 'Expositions chimiques fréquentes', points: 50 },
      { label: 'Expositions à risque sans protection', points: 80 } // NON-CONFORMITÉ R4412
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
      { label: 'EPI lourds (combinaison + masque + gants épais)', points: 50 },
      { label: 'EPI complets isolants / NRBC / ventilation forcée', points: 80 } // NON-CONFORMITÉ R4412
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
      { label: 'Fréquent (2-3/semaine)', points: 0.8 },
      { label: 'Quotidien', points: 1.0 }
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
      { label: 'Important (perd > 30 min)', points: 70 },
      { label: 'Majeur (perd > 1h, stress intense)', points: 100 }
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
      { label: 'Fréquent (2-3/semaine)', points: 0.8 },
      { label: 'Quotidien', points: 1.0 }
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
      { label: 'Important (perd > 30 min)', points: 70 },
      { label: 'Majeur (perd > 1h, stress intense)', points: 100 }
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
      { label: 'Pauses rares ou difficiles à prendre', points: 40 },
      { label: 'Aucune pause — travail continu', points: 0 } // Violation L3121-33 si > 6h
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
      { label: 'Position statique quasi-permanente', points: 30 }
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
      { label: 'Impossible (pas d\'espace, pas de temps)', points: 0 }
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
      { label: 'Difficile (loin ou interdit pendant la tâche)', points: 30 } // NON-CONFORMITÉ R4225-2
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
      { label: 'Non — pause sur le poste ou debout', points: 30 }
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
      { label: 'Rare, uniquement en cas de douleur existante', points: 30 },
      { label: 'Jamais — aucune préparation physique', points: 0 }
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
// PROPS DU MODAL
// ============================================================================

interface AnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  taskId?: string | number
  taskName: string
  taskDescription?: string
  initialAnswers?: Record<string, number | number[]>
  initialScores?: {
    verre: number
    robinet: number
    bulle: number
    orage: number
    paille: number
  }
  initialElement?: ElementType
  initialQuestionIndex?: number
  onSave?: (data: { 
    answers: Record<string, number | number[]>, 
    scores: any,
    currentElement: ElementType,
    currentQuestionIndex: number
  }) => void
}

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

export default function AnalysisModal({ 
  isOpen, 
  onClose, 
  taskId, 
  taskName, 
  taskDescription,
  initialAnswers,
  initialScores,
  initialElement,
  initialQuestionIndex,
  onSave 
}: AnalysisModalProps) {
  // États - DOIVENT être avant tout return conditionnel
  const [isClosing, setIsClosing] = useState(false)
  const [selectedElement, setSelectedElement] = useState<ElementType>(initialElement || 'verre')
  // Sauvegarder l'index de question pour CHAQUE élément
  const [questionIndexByElement, setQuestionIndexByElement] = useState<Record<ElementType, number>>({
    verre: 0,
    robinet: 0,
    bulle: 0,
    orage: 0,
    paille: 0
  })
  const [answers, setAnswers] = useState<Record<string, number | number[]>>(initialAnswers || {})
  const [scores, setScores] = useState(initialScores || {
    verre: 50,
    robinet: 30,
    bulle: 20,
    orage: 15,
    paille: 25
  })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  
  // Plan d'action dynamique
  const [actionPlan, setActionPlan] = useState<Array<{
    priority: 'critical' | 'high' | 'medium'
    category: string
    issue: string
    action: string
    questionId: string
  }>>([])

  // Index de question actuel basé sur l'élément sélectionné
  const currentQuestionIndex = questionIndexByElement[selectedElement]

  // Recharger les données quand le modal s'ouvre avec de nouvelles données initiales
  useEffect(() => {
    if (isOpen && initialAnswers) {
      console.log('📥 Rechargement des réponses sauvegardées:', initialAnswers)
      setAnswers(initialAnswers)
    }
    if (isOpen && initialScores) {
      console.log('📥 Rechargement des scores sauvegardés:', initialScores)
      setScores(initialScores)
    }
    if (isOpen && initialElement) {
      console.log('📥 Rechargement de l\'élément:', initialElement)
      setSelectedElement(initialElement)
    }
    if (isOpen && initialQuestionIndex !== undefined && initialElement) {
      console.log('📥 Rechargement de la question:', initialQuestionIndex, 'pour', initialElement)
      setQuestionIndexByElement(prev => ({
        ...prev,
        [initialElement]: initialQuestionIndex
      }))
    }
  }, [isOpen, initialAnswers, initialScores, initialElement, initialQuestionIndex])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 300)
  }

  const handleSave = () => {
    console.log('=== DÉBUT SAUVEGARDE ===')
    console.log('Réponses:', answers)
    console.log('Scores:', scores)
    console.log('Position:', selectedElement, questionIndexByElement[selectedElement])
    console.log('Nombre de questions répondues:', Object.keys(answers).length)
    
    if (onSave) {
      console.log('Callback onSave existe, appel en cours...')
      onSave({ 
        answers, 
        scores,
        currentElement: selectedElement,
        currentQuestionIndex: questionIndexByElement[selectedElement]
      })
      console.log('Callback onSave appelé avec succès')
      
      // Afficher toast de confirmation
      setToastMessage(`✓ Analyse sauvegardée pour "${taskName}"`)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } else {
      console.warn('⚠️ Pas de callback onSave défini !')
    }
    
    console.log('=== FIN SAUVEGARDE ===')
    // Ne pas fermer automatiquement pour que l'utilisateur puisse continuer
  }

  if (!isOpen) return null

  const currentElement = elements.find(e => e.id === selectedElement)!
  const currentQuestions = allQuestions[selectedElement]
  const currentQuestion = currentQuestions[currentQuestionIndex]
  
  // Fonctions helper pour RPS et NASA-TLX (doivent être définies avant calculateProgressForElement)
  const isRPSQuestion = (question: Question) => {
    return question.id.startsWith('robinet_rps_')
  }

  const getRPSGroup = (question: Question): 'demande' | 'latitude' | null => {
    if (!isRPSQuestion(question)) return null
    if (question.id.includes('_demande_')) return 'demande'
    if (question.id.includes('_latitude_')) return 'latitude'
    return null
  }

  const getRPSGroupQuestions = (group: 'demande' | 'latitude'): Question[] => {
    return questionsRobinet.filter(q => getRPSGroup(q) === group)
  }

  const isRPSGroupComplete = (group: 'demande' | 'latitude'): boolean => {
    const groupQuestions = getRPSGroupQuestions(group)
    return groupQuestions.every(q => answers[q.id] !== undefined)
  }

  const isNASATLXQuestion = (question: Question) => {
    return question.id.startsWith('robinet_mental_')
  }

  const getNASATLXQuestions = (): Question[] => {
    return questionsRobinet.filter(q => isNASATLXQuestion(q))
  }

  const isNASATLXGroupComplete = (): boolean => {
    const nasaTLXQuestions = getNASATLXQuestions()
    return nasaTLXQuestions.every(q => answers[q.id] !== undefined)
  }
  
  // Calculer la progression en comptant les groupes RPS et NASA-TLX comme unités uniques
  const calculateProgressForElement = () => {
    if (selectedElement === 'robinet') {
      let totalUnits = 0
      let answeredUnits = 0
      
      // Groupe Demande RPS (1 unité)
      const demandeQuestions = getRPSGroupQuestions('demande')
      totalUnits++
      if (isRPSGroupComplete('demande')) answeredUnits++
      
      // Groupe Latitude RPS (1 unité)
      const latitudeQuestions = getRPSGroupQuestions('latitude')
      totalUnits++
      if (isRPSGroupComplete('latitude')) answeredUnits++
      
      // Questions NASA-TLX (toutes ensemble = 1 unité)
      const nasaTLXQuestions = currentQuestions.filter(q => q.id.startsWith('robinet_mental_'))
      totalUnits++
      if (nasaTLXQuestions.every(q => answers[q.id] !== undefined)) answeredUnits++
      
      // Autres questions individuelles
      const otherQuestions = currentQuestions.filter(q => 
        !isRPSQuestion(q) && !q.id.startsWith('robinet_mental_')
      )
      totalUnits += otherQuestions.length
      answeredUnits += otherQuestions.filter(q => answers[q.id] !== undefined).length
      
      return {
        answered: answeredUnits,
        total: totalUnits,
        progress: (answeredUnits / totalUnits) * 100
      }
    } else {
      // Pour les autres éléments, calcul normal
      const answered = currentQuestions.filter(q => answers[q.id] !== undefined).length
      return {
        answered,
        total: currentQuestions.length,
        progress: (answered / currentQuestions.length) * 100
      }
    }
  }
  
  const { answered: answeredForElement, total: totalForElement, progress: progressElement } = calculateProgressForElement()

  // Analyser les réponses pour générer le plan d'action
  useEffect(() => {
    const newActionPlan: typeof actionPlan = []

    // Parcourir toutes les réponses
    Object.entries(answers).forEach(([questionId, answerValue]) => {
      const question = Object.values(allQuestions).flat().find(q => q.id === questionId)
      if (!question) return

      // Définir les seuils critiques par question
      const criticalThresholds: Record<string, (value: number | number[]) => { priority: 'critical' | 'high' | 'medium', issue: string, action: string } | null> = {
        // VERRE - Âge
        'verre_age': (val) => {
          if (val === 25) return {
            priority: 'high',
            issue: 'Travailleur > 55 ans (sarcopénie progressive)',
            action: 'Adapter les charges manipulées et prévoir des rotations de poste'
          }
          if (val === 16) return {
            priority: 'medium',
            issue: 'Travailleur 45-55 ans',
            action: 'Surveillance médicale renforcée et prévention'
          }
          return null
        },
        // VERRE - Antécédents
        'verre_medical': (val) => {
          if (val === 50) return {
            priority: 'critical',
            issue: 'Arrêt de travail > 3 mois pour TMS',
            action: 'Adaptation de poste OBLIGATOIRE et suivi ergonomique rapproché'
          }
          if (val === 30) return {
            priority: 'high',
            issue: 'Douleurs chroniques ou arrêt < 3 mois',
            action: 'Évaluation ergonomique du poste et aménagements'
          }
          return null
        },
        // ROBINET - Poids de la charge
        'robinet_charges_poids': (val) => {
          const numVal = typeof val === 'number' ? val : 0
          if (numVal >= 75) return {
            priority: 'critical',
            issue: 'Charge > 30 kg (NON-CONFORMITÉ Code du Travail R4541-9)',
            action: 'RÉDUIRE IMMÉDIATEMENT la charge ou prévoir aide mécanique'
          }
          if (numVal >= 40) return {
            priority: 'high',
            issue: 'Charge 15-25 kg (risque élevé)',
            action: 'Évaluer aide technique (chariot, palan, etc.)'
          }
          return null
        },
        // ROBINET - Préhension
        'robinet_charges_prehension': (val) => {
          if (val === 0.45) return {
            priority: 'high',
            issue: 'Préhension très difficile (+45% pénibilité)',
            action: 'Améliorer les points de prise (poignées, découpes)'
          }
          return null
        },
        // ROBINET - Fréquence
        'robinet_charges_frequence': (val) => {
          if (val === 0.60) return {
            priority: 'critical',
            issue: '> 15 manipulations/min (NON-CONFORMITÉ répétitivité)',
            action: 'Réduire la cadence ou automatiser les manipulations'
          }
          if (val === 0.40) return {
            priority: 'high',
            issue: '5-15 manipulations/min (répétitif)',
            action: 'Prévoir des pauses actives toutes les heures'
          }
          return null
        },
        // ROBINET - Postures Tronc
        'robinet_postures_tronc_severite': (val) => {
          const numVal = typeof val === 'number' ? val : 0
          if (numVal >= 45) return {
            priority: 'critical',
            issue: 'Posture tronc très contraignante (> 45° ou combinée)',
            action: 'Rehausser le plan de travail ou prévoir aide technique'
          }
          return null
        },
        // BULLE - Température
        'bulle_temperature': (val) => {
          const numVal = typeof val === 'number' ? val : 0
          if (numVal >= 30) return {
            priority: 'critical',
            issue: 'Température < 0°C ou > 30°C (NON-CONFORMITÉ)',
            action: 'Climatisation/chauffage OBLIGATOIRE ou vêtements adaptés'
          }
          return null
        },
        // BULLE - Bruit
        'bulle_bruit': (val) => {
          if (val === 30) return {
            priority: 'critical',
            issue: 'Bruit > 85 dB (NON-CONFORMITÉ - port protections)',
            action: 'Protections auditives OBLIGATOIRES + réduction à la source'
          }
          if (val === 20) return {
            priority: 'high',
            issue: 'Bruit 80-85 dB (zone de vigilance)',
            action: 'Protections auditives recommandées'
          }
          return null
        },
        // ORAGE - Impact
        'orage_impact': (val) => {
          if (val === 40) return {
            priority: 'high',
            issue: 'Aléas très impactants (arrêt complet)',
            action: 'Identifier et réduire les sources d\'aléas'
          }
          return null
        },
        // PAILLE - Pauses
        'paille_pauses': (val) => {
          if (val === 40) return {
            priority: 'critical',
            issue: 'Aucune pause possible (NON-CONFORMITÉ)',
            action: 'Organiser des micro-pauses toutes les 2h MINIMUM'
          }
          return null
        }
      }

      const analysis = criticalThresholds[questionId]?.(answerValue)
      if (analysis) {
        newActionPlan.push({
          ...analysis,
          category: question.element.toUpperCase(),
          questionId
        })
      }
    })

    // Trier par priorité : critical > high > medium
    newActionPlan.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })

    setActionPlan(newActionPlan)
  }, [answers])

  // Protection : si currentQuestion est undefined, réinitialiser l'index pour cet élément
  useEffect(() => {
    if (!currentQuestion && currentQuestions.length > 0) {
      setQuestionIndexByElement(prev => ({
        ...prev,
        [selectedElement]: 0
      }))
    }
  }, [currentQuestion, currentQuestions, selectedElement])


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

  // État temporaire pour les curseurs (scale)
  const [tempScaleValue, setTempScaleValue] = useState<number | null>(null)

  // Gestion des réponses simples (single)
  const handleAnswer = (points: number, autoAdvance: boolean = true) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: points }))
    
    // Animation de validation puis passage à la question suivante (seulement si autoAdvance = true)
    if (autoAdvance && currentQuestionIndex < currentQuestions.length - 1) {
      setTimeout(() => {
        setQuestionIndexByElement(prev => ({
          ...prev,
          [selectedElement]: currentQuestionIndex + 1
        }))
      }, 400)
    }
  }

  // Valider la réponse du curseur et passer à la suite
  const handleScaleValidation = () => {
    const valueToSave = tempScaleValue !== null ? tempScaleValue : (answers[currentQuestion.id] as number || 10)
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: valueToSave }))
    setTempScaleValue(null)
    
    // Passage à la question suivante
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setTimeout(() => {
        setQuestionIndexByElement(prev => ({
          ...prev,
          [selectedElement]: currentQuestionIndex + 1
        }))
      }, 200)
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

  // Fonction pour changer d'élément
  const handleElementChange = (elementId: ElementType) => {
    setSelectedElement(elementId)
    // L'index est déjà sauvegardé dans questionIndexByElement, pas besoin de réinitialiser
  }

  // Navigation directe vers une question spécifique
  const goToQuestion = (index: number) => {
    setQuestionIndexByElement(prev => ({
      ...prev,
      [selectedElement]: index
    }))
  }

  // Navigation vers question précédente
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setQuestionIndexByElement(prev => ({
        ...prev,
        [selectedElement]: currentQuestionIndex - 1
      }))
    }
  }

  // Navigation vers question suivante
  const goToNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setQuestionIndexByElement(prev => ({
        ...prev,
        [selectedElement]: currentQuestionIndex + 1
      }))
    }
  }

  // Obtenir la section actuelle
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

  // Calcul progression globale
  const totalQuestions = Object.values(allQuestions).flat().length
  const totalAnswered = Object.keys(answers).length
  const progressGlobal = Math.round((totalAnswered / totalQuestions) * 100)
  const isComplete = totalAnswered === totalQuestions

  // Calcul progression par composant
  const getComponentProgress = (elementId: ElementType) => {
    const questions = allQuestions[elementId]
    const answered = questions.filter(q => answers[q.id] !== undefined).length
    return {
      answered,
      total: questions.length,
      percentage: Math.round((answered / questions.length) * 100),
      isComplete: answered === questions.length
    }
  }

  const componentsProgress = {
    verre: getComponentProgress('verre'),
    robinet: getComponentProgress('robinet'),
    bulle: getComponentProgress('bulle'),
    orage: getComponentProgress('orage'),
    paille: getComponentProgress('paille')
  }

  const completedComponents = Object.values(componentsProgress).filter(p => p.isComplete).length

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl shadow-2xl w-full max-w-[95vw] max-h-[95vh] overflow-hidden border-2 border-gray-700/50 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header fixe avec contexte tâche */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b-2 border-gray-700/50 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-white">Analyse ergonomique</h2>
                <div className={`px-3 py-1 rounded-full border ${
                  isComplete 
                    ? 'bg-green-600/20 border-green-500/50' 
                    : 'bg-blue-600/20 border-blue-500/50'
                }`}>
                  <span className={`text-sm font-medium ${
                    isComplete ? 'text-green-400' : 'text-blue-400'
                  }`}>
                    {isComplete ? 'Terminé' : 'En cours'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Tâche :</span>
                <span className="text-blue-400 font-semibold">{taskName}</span>
                {taskDescription && (
                  <>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-500">{taskDescription}</span>
                  </>
                )}
                {taskId && (
                  <>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-600 text-xs">ID: {taskId}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-400">Progression</div>
                <div className="text-2xl font-bold text-white">
                  {progressGlobal}%
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors group"
              >
                <X className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          {/* Contenu scrollable */}
          <div className="overflow-y-auto flex-1 p-6">
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
                const isStarted = answered > 0
                const progressPercent = (answered / total) * 100
                
                return (
                  <motion.button
                    key={element.id}
                    onClick={() => handleElementChange(element.id)}
                    className={`group relative rounded-xl p-4 border-2 transition-all text-left overflow-hidden ${
                      isActive
                        ? `${element.bgColor} ${element.borderColor} shadow-xl shadow-${element.color}-500/30`
                        : isComplete
                        ? 'bg-green-900/20 border-green-700/50 hover:border-green-600 hover:shadow-lg'
                        : isStarted
                        ? `bg-slate-900/40 ${element.borderColor}/40 hover:${element.borderColor} hover:shadow-lg`
                        : 'bg-slate-900/20 border-gray-700/40 hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-500/10'
                    }`}
                    whileHover={{ scale: 1.08, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    animate={!isStarted && !isActive ? {
                      borderColor: ['rgba(107, 114, 128, 0.3)', 'rgba(245, 158, 11, 0.4)', 'rgba(107, 114, 128, 0.3)'],
                    } : {}}
                    transition={!isStarted && !isActive ? {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    } : { duration: 0.2 }}
                  >
                    {/* Barre de progression en fond */}
                    <div className="absolute inset-0 opacity-20">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          isComplete ? 'bg-green-500' : element.bgColor.replace('/30', '')
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    {/* Contenu */}
                    <div className="relative z-10">
                      {/* Nom */}
                      <p className={`text-sm font-bold uppercase tracking-wider mb-3 ${
                        isActive ? element.textColor : 
                        isComplete ? 'text-green-400' :
                        isStarted ? element.textColor :
                        'text-gray-500 group-hover:text-amber-400'
                      }`}>
                        {element.name}
                      </p>
                      
                      {/* Score */}
                      <p className={`text-2xl font-bold mb-2 ${
                        isActive ? 'text-white' : 
                        isComplete ? 'text-green-300' :
                        'text-gray-400'
                      }`}>
                        {score !== null ? score : '--'}
                      </p>
                      
                      {/* Statut et progression */}
                      {isComplete ? (
                        <div className="flex items-center gap-1 text-xs text-green-400 font-medium">
                          <Check className="w-3 h-3" />
                          <span>Terminé</span>
                        </div>
                      ) : isStarted ? (
                        <div className="space-y-1">
                          <div className="text-xs text-gray-400">
                            {answered}/{total} questions
                          </div>
                          <div className="text-xs font-medium text-amber-400 group-hover:text-amber-300">
                            → Continuer
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="text-xs text-gray-500">
                            {total} questions
                          </div>
                          <div className="text-xs font-medium text-amber-500/80 group-hover:text-amber-400">
                            ✦ Cliquez pour commencer
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Badge de complétion */}
                    {isComplete && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}

                    {/* Indicateur visuel pour non commencé */}
                    {!isStarted && !isActive && (
                      <motion.div
                        className="absolute top-2 right-2"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
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
                  {answeredForElement}/{totalForElement} répondues
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
              ) : isNASATLXQuestion(currentQuestion) ? (
                // AFFICHAGE GROUPÉ POUR NASA-TLX
                (() => {
                  const nasaTLXQuestions = getNASATLXQuestions()
                  
                  return (
                    <motion.div
                      key="nasa-tlx-group"
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className={`border-2 rounded-2xl p-8 shadow-2xl shadow-gray-900/50 w-full max-w-4xl ${
                        currentElement.bgColor
                      } ${currentElement.borderColor}`}
                    >
                      {/* Titre NASA-TLX */}
                      <div className="mb-6 text-center">
                        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider border-2 bg-purple-900/20 border-purple-700">
                          <div className="w-3 h-3 rounded-full bg-purple-500" />
                          <span className="text-white">Charge Mentale - NASA-TLX</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-4">Évaluez les 6 dimensions de charge mentale (échelle 0-20)</p>
                      </div>

                      {/* Grille des 6 dimensions avec curseurs */}
                      <div className="space-y-6 mb-8">
                        {nasaTLXQuestions.map((q) => {
                          const currentValue = answers[q.id] as number ?? 10
                          
                          return (
                            <div key={q.id} className="p-5 rounded-lg border bg-slate-800/50 border-gray-600">
                              <div className="mb-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="text-white font-bold text-lg">{q.question}</h4>
                                  <div className="px-3 py-1 rounded-lg bg-blue-900/30 border border-blue-700">
                                    <span className="text-blue-400 font-bold text-lg">{currentValue}</span>
                                    <span className="text-gray-500 text-sm">/20</span>
                                  </div>
                                </div>
                                {q.description && (
                                  <p className="text-sm text-gray-400 italic leading-relaxed">{q.description}</p>
                                )}
                              </div>

                              {/* Curseur */}
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs font-medium text-white">
                                  <span>{q.minLabel}</span>
                                  <span>{q.maxLabel}</span>
                                </div>
                                
                                <input
                                  type="range"
                                  min={q.minValue || 0}
                                  max={q.maxValue || 20}
                                  step={1}
                                  value={currentValue}
                                  onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: parseInt(e.target.value) }))}
                                  className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                                  style={{
                                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentValue / (q.maxValue || 20)) * 100}%, #1e293b ${(currentValue / (q.maxValue || 20)) * 100}%, #1e293b 100%)`
                                  }}
                                />
                                
                                {/* Graduations */}
                                <div className="flex justify-between">
                                  {Array.from({ length: 21 }, (_, i) => i).map((val) => (
                                    <div key={val} className="flex flex-col items-center">
                                      <div className={`w-px ${val % 5 === 0 ? 'h-2 bg-gray-500' : 'h-1 bg-gray-600'}`} />
                                      {val % 5 === 0 && (
                                        <span className="text-xs text-white mt-0.5">{val}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Navigation */}
                      <div className="flex justify-between gap-4 mt-6">
                        <motion.button
                          onClick={goToPreviousQuestion}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all bg-slate-800 text-white hover:bg-slate-700 shadow-lg hover:shadow-xl"
                          whileHover={{ scale: 1.02, x: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ChevronRight className="w-4 h-4 rotate-180" />
                          Précédent
                        </motion.button>

                        <motion.button
                          onClick={() => {
                            // Passer à la section suivante
                            const lastNASAIdx = questionsRobinet.findIndex((q, idx) => 
                              idx > 0 && isNASATLXQuestion(questionsRobinet[idx - 1]) && !isNASATLXQuestion(q)
                            )
                            if (lastNASAIdx >= 0) {
                              goToQuestion(lastNASAIdx)
                            } else {
                              goToNextQuestion()
                            }
                          }}
                          disabled={!isNASATLXGroupComplete()}
                          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg transition-all ${
                            isNASATLXGroupComplete()
                              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white hover:shadow-xl hover:shadow-green-500/50'
                              : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                          }`}
                          whileHover={isNASATLXGroupComplete() ? { scale: 1.05, x: 2 } : {}}
                          whileTap={isNASATLXGroupComplete() ? { scale: 0.95 } : {}}
                        >
                          Continuer
                          <ChevronRight className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )
                })()
              ) : isRPSQuestion(currentQuestion) ? (
                // AFFICHAGE GROUPÉ POUR LES QUESTIONS RPS
                (() => {
                  const rpsGroup = getRPSGroup(currentQuestion)!
                  const groupQuestions = getRPSGroupQuestions(rpsGroup)
                  const groupTitle = rpsGroup === 'demande' ? 'Axe « Demande psychologique »' : 'Axe « Latitude décisionnelle »'
                  const groupColor = rpsGroup === 'demande' ? 'bg-green-900/20 border-green-700' : 'bg-blue-900/20 border-blue-700'

                  return (
                    <motion.div
                      key={`rps-group-${rpsGroup}`}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className={`border-2 rounded-2xl p-8 shadow-2xl shadow-gray-900/50 w-full max-w-4xl ${
                        currentElement.bgColor
                      } ${currentElement.borderColor}`}
                    >
                      {/* Titre du groupe RPS */}
                      <div className="mb-6 text-center">
                        <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider border-2 ${groupColor}`}>
                          <div className={`w-3 h-3 rounded-full ${rpsGroup === 'demande' ? 'bg-green-500' : 'bg-blue-500'}`} />
                          <span className="text-white">{groupTitle}</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-4">Veuillez répondre à toutes les questions ci-dessous (échelle 1-4)</p>
                      </div>

                      {/* Tableau des questions RPS */}
                      <div className="space-y-4 mb-8">
                        {groupQuestions.map((q, qIdx) => (
                          <div key={q.id} className={`p-4 rounded-lg border ${answers[q.id] !== undefined ? 'bg-slate-800/50 border-gray-600' : 'bg-slate-900/30 border-gray-700'}`}>
                            <div className="flex items-start gap-4">
                              <div className="flex-1">
                                <p className="text-white font-medium mb-2">{q.question}</p>
                                {q.subtitle && (
                                  <p className="text-xs text-gray-500 mb-3">{q.subtitle}</p>
                                )}
                              </div>
                              
                              {/* Options 1-4 */}
                              <div className="flex gap-2 flex-shrink-0">
                                {q.options?.map((option, optIdx) => {
                                  const isSelected = answers[q.id] === option.points
                                  return (
                                    <button
                                      key={optIdx}
                                      onClick={() => setAnswers(prev => ({ ...prev, [q.id]: option.points }))}
                                      className={`w-12 h-12 rounded-lg border-2 font-bold transition-all ${
                                        isSelected
                                          ? rpsGroup === 'demande'
                                            ? 'bg-green-600 border-green-500 text-white shadow-lg shadow-green-500/50'
                                            : 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/50'
                                          : 'bg-slate-800 border-gray-600 text-gray-400 hover:border-gray-500 hover:bg-slate-700'
                                      }`}
                                    >
                                      {option.label}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Navigation */}
                      <div className="flex justify-between gap-4 mt-6">
                        <motion.button
                          onClick={() => {
                            // Retour au groupe précédent ou à la question précédente
                            if (rpsGroup === 'latitude') {
                              // Retour au groupe Demande
                              const demandeFirstIdx = questionsRobinet.findIndex(q => getRPSGroup(q) === 'demande')
                              if (demandeFirstIdx >= 0) goToQuestion(demandeFirstIdx)
                            } else {
                              goToPreviousQuestion()
                            }
                          }}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all bg-slate-800 text-white hover:bg-slate-700 shadow-lg hover:shadow-xl"
                          whileHover={{ scale: 1.02, x: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ChevronRight className="w-4 h-4 rotate-180" />
                          Précédent
                        </motion.button>

                        <motion.button
                          onClick={() => {
                            // Passage au groupe suivant ou à la question suivante
                            if (rpsGroup === 'demande') {
                              // Passer au groupe Latitude
                              const latitudeFirstIdx = questionsRobinet.findIndex(q => getRPSGroup(q) === 'latitude')
                              if (latitudeFirstIdx >= 0) goToQuestion(latitudeFirstIdx)
                            } else {
                              // Passer à la section suivante
                              const lastLatitudeIdx = questionsRobinet.findIndex((q, idx) => 
                                idx > 0 && getRPSGroup(questionsRobinet[idx - 1]) === 'latitude' && getRPSGroup(q) !== 'latitude'
                              )
                              if (lastLatitudeIdx >= 0) {
                                goToQuestion(lastLatitudeIdx)
                              } else {
                                goToNextQuestion()
                              }
                            }
                          }}
                          disabled={!isRPSGroupComplete(rpsGroup)}
                          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg transition-all ${
                            isRPSGroupComplete(rpsGroup)
                              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white hover:shadow-xl hover:shadow-green-500/50'
                              : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                          }`}
                          whileHover={isRPSGroupComplete(rpsGroup) ? { scale: 1.05, x: 2 } : {}}
                          whileTap={isRPSGroupComplete(rpsGroup) ? { scale: 0.95 } : {}}
                        >
                          {rpsGroup === 'demande' ? 'Groupe suivant' : 'Continuer'}
                          <ChevronRight className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )
                })()
              ) : (
                // AFFICHAGE NORMAL POUR LES AUTRES QUESTIONS
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

                  {/* Description détaillée pour les questions de type scale */}
                  {currentQuestion.type === 'scale' && currentQuestion.description && (
                    <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-gray-700">
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {currentQuestion.description}
                      </p>
                    </div>
                  )}

                  {/* Interface curseur pour les questions de type scale */}
                  {currentQuestion.type === 'scale' ? (
                    <div className="space-y-6">
                      <div className="px-2">
                        {/* Labels min/max */}
                        <div className="flex justify-between mb-3">
                          <span className="text-sm font-medium text-white">{currentQuestion.minLabel}</span>
                          <span className="text-sm font-medium text-white">{currentQuestion.maxLabel}</span>
                        </div>
                        
                        {/* Curseur */}
                        <div className="relative">
                          <input
                            type="range"
                            min={currentQuestion.minValue || 0}
                            max={currentQuestion.maxValue || 20}
                            step={1}
                            value={tempScaleValue !== null ? tempScaleValue : (answers[currentQuestion.id] as number || 10)}
                            onChange={(e) => setTempScaleValue(parseInt(e.target.value))}
                            className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                            style={{
                              background: `linear-gradient(to right, ${currentElement.color === 'blue' ? '#3b82f6' : currentElement.color === 'purple' ? '#a855f7' : currentElement.color === 'green' ? '#22c55e' : currentElement.color === 'amber' ? '#f59e0b' : '#6b7280'} 0%, ${currentElement.color === 'blue' ? '#3b82f6' : currentElement.color === 'purple' ? '#a855f7' : currentElement.color === 'green' ? '#22c55e' : currentElement.color === 'amber' ? '#f59e0b' : '#6b7280'} ${((tempScaleValue !== null ? tempScaleValue : (answers[currentQuestion.id] as number || 10)) / (currentQuestion.maxValue || 20)) * 100}%, #1e293b ${((tempScaleValue !== null ? tempScaleValue : (answers[currentQuestion.id] as number || 10)) / (currentQuestion.maxValue || 20)) * 100}%, #1e293b 100%)`
                            }}
                          />
                          {/* Graduations */}
                          <div className="flex justify-between mt-2">
                            {Array.from({ length: 21 }, (_, i) => i).map((val) => (
                              <div key={val} className="flex flex-col items-center">
                                <div className={`w-px ${val % 5 === 0 ? 'h-3 bg-gray-500' : 'h-2 bg-gray-600'}`} />
                                {val % 5 === 0 && (
                                  <span className="text-xs text-white mt-1">{val}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Valeur actuelle */}
                        <div className="text-center mt-4">
                          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg ${currentElement.bgColor} ${currentElement.borderColor} border-2`}>
                            <span className="text-sm text-gray-400">Valeur sélectionnée :</span>
                            <span className={`text-2xl font-bold ${currentElement.textColor}`}>
                              {tempScaleValue !== null ? tempScaleValue : (answers[currentQuestion.id] !== undefined ? answers[currentQuestion.id] : 10)} / 20
                            </span>
                          </div>
                        </div>

                      </div>

                      {/* Bouton Valider intégré dans la navigation */}
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

                        <motion.button
                          onClick={handleScaleValidation}
                          className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 hover:shadow-xl hover:shadow-green-500/50"
                          whileHover={{ scale: 1.05, x: 2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Valider et continuer
                          <ChevronRight className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {currentQuestion.options?.map((option, idx) => {
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
                          </div>
                          
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

                      {/* Navigation buttons pour les questions non-scale */}
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
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
            </div>
          </div>

          {/* Toast de notification */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] pointer-events-none"
              >
                <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border-2 border-green-400">
                  <Check className="w-5 h-5" />
                  <span className="font-medium text-lg">{toastMessage}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Plan d'action minimaliste */}
          {actionPlan.length > 0 && (
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-t border-amber-500/30 px-6 py-2 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-400">Plan d'action :</div>
                  <div className="flex items-center gap-2">
                    {actionPlan.filter(a => a.priority === 'critical').length > 0 && (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-900/30 border border-red-500/40">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-xs font-bold text-red-400">
                          {actionPlan.filter(a => a.priority === 'critical').length} NON-CONF.
                        </span>
                      </div>
                    )}
                    {actionPlan.filter(a => a.priority === 'high').length > 0 && (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-orange-900/30 border border-orange-500/40">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="text-xs font-bold text-orange-400">
                          {actionPlan.filter(a => a.priority === 'high').length} PRIORITÉ
                        </span>
                      </div>
                    )}
                    {actionPlan.filter(a => a.priority === 'medium').length > 0 && (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-yellow-900/30 border border-yellow-500/40">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <span className="text-xs font-bold text-yellow-400">
                          {actionPlan.filter(a => a.priority === 'medium').length}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-500">{actionPlan.length} levier(s)</span>
              </div>
            </div>
          )}

          {/* Footer fixe avec boutons d'action */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-t-2 border-gray-700/50 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                Annuler
              </button>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-400">
                  {totalAnswered}/{totalQuestions} questions répondues • {completedComponents}/5 composants terminés
                </div>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-8 py-2.5 rounded-lg font-medium shadow-lg transition-all bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white hover:shadow-xl"
                >
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
