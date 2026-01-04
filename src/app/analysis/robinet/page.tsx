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

// Suite dans le prochain fichier...
