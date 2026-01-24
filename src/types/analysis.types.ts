/**
 * Types pour les analyses ergonomiques
 */

// ============================================
// ANALYSE COMPLÈTE
// ============================================

export interface Analysis {
  id: string
  userId: string
  createdAt: Date
  updatedAt: Date
  
  // Informations de base
  metadata: AnalysisMetadata
  
  // Scores des 5 éléments
  scores: AnalysisScores
  
  // Résultats calculés
  results: AnalysisResults
  
  // Recommandations générées
  recommendations: string[]
}

export interface AnalysisMetadata {
  poste: string
  tache: string
  duree: number          // En minutes
  date: Date
  operateur?: string
  notes?: string
}

// ============================================
// SCORES DÉTAILLÉS
// ============================================

export interface AnalysisScores {
  robinet: RobinetScore
  verre: VerreScore
  paille: PailleScore
  bulle: BulleScore
  orage: OrageScore
}

// 🚰 ROBINET - Charge de travail (0-100)
export interface RobinetScore {
  total: number              // 0-100
  chargePhysique: number     // 0-20
  postures: number           // 0-20
  frequence: number          // 0-20
  chargeMentale: number      // 0-20
  rps: number                // 0-20 (Risques Psychosociaux)
}

// 🥃 VERRE - Capacité individuelle (30-100)
export interface VerreScore {
  capacite: number           // 30-100
  age: number                // 0-25
  anciennete: number         // 0-25
  formation: number          // 0-25
  antecedents: number        // 0-25
}

// 🥤 PAILLE - Récupération (0-80)
export interface PailleScore {
  total: number              // 0-80
  pausesActives: number      // 0-20
  etirements: number         // 0-20
  relaxation: number         // 0-20
  sommeil: number            // 0-20
}

// 🫧 BULLE - Environnement (0-100)
export interface BulleScore {
  total: number              // 0-100
  temperature: number        // 0-15
  eclairage: number          // 0-15
  bruit: number              // 0-15
  vibrations: number         // 0-10
  hygiene: number            // 0-10
  espace: number             // 0-15
  equipements: number        // 0-20
}

// ⛈️ ORAGE - Aléas et perturbations (0-100)
export interface OrageScore {
  total: number              // 0-100
  impact: number             // 0-50
  duree: number              // 0-30
  frequence: number          // 0-20
}

// ============================================
// RÉSULTATS CALCULÉS
// ============================================

export interface AnalysisResults {
  remplissageMax: number     // % maximum atteint (0-100)
  tempsDebordement?: number  // En minutes (si débordement)
  risqueTMS: number          // 0-100
  risqueAccident: number     // 0-100
  niveauGlobal: RiskLevel    // Niveau de risque global
}

export type RiskLevel = 'normal' | 'vigilance' | 'danger' | 'critique'

// ============================================
// CONFIGURATION FACTEURS
// ============================================

export interface FactorConfig {
  id: string
  element: 'ROBINET' | 'VERRE' | 'PAILLE' | 'BULLE' | 'ORAGE'
  factorId: string
  label: string
  enabled: boolean
  weight: number
  min: number
  max: number
  description?: string
}

// ============================================
// TYPES POUR FORMULAIRES
// ============================================

export interface AnalysisFormData {
  metadata: AnalysisMetadata
  scores: Partial<AnalysisScores>
}

export interface ScoreSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  color: 'blue' | 'green' | 'purple' | 'amber' | 'gray'
  description?: string
}
