/**
 * CALCULATEUR DU SCORE R (ROBINET)
 * ==================================
 * 
 * Module de calcul documenté pour le Score R (Charge de travail)
 * Toutes les formules sont explicitées et commentées
 */

// ============================================================================
// SECTION A : CALCUL DES CHARGES
// ============================================================================

/**
 * Calcule le score de la section Charges
 * 
 * FORMULE :
 * Score_Charges_Brut = Points_Base_Poids × (1 + Ajust_Préhension + Ajust_Fréquence)
 * 
 * @param poidPoints - Points de base selon le poids (5 à 100)
 * @param prehension - Ajustement préhension (0 à 0.45)
 * @param frequence - Ajustement fréquence (0 à 0.60)
 * @returns Score brut des charges (normalisé sur 100)
 */
export function calculateScoreCharges(
  presence: number,
  type: number,
  poidPoints: number,
  prehension: number,
  frequence: number
): number {
  // Si pas de charges, retourner 0
  if (presence === 0) return 0

  // Calcul du score brut avec les ajustements multiplicatifs
  // Les ajustements augmentent le score en fonction de la difficulté
  const scoreBrut = poidPoints * (1 + prehension + frequence)
  
  // Le score maximum théorique est 100 × (1 + 0.45 + 0.60) = 205
  // On normalise sur 100
  const scoreNormalise = Math.min(100, (scoreBrut / 205) * 100)
  
  return Math.round(scoreNormalise)
}

// ============================================================================
// SECTION B : CALCUL DES POSTURES
// ============================================================================

/**
 * Calcule le score de la section Postures
 * 
 * FORMULE :
 * Score_Postures = Σ(Points_Postures) × Facteur_Fréquence
 * 
 * @param posturesPoints - Tableau des points des postures sélectionnées
 * @param frequence - Facteur de fréquence (0.5, 1, 1.5, ou 2)
 * @returns Score des postures (normalisé sur 100)
 */
export function calculateScorePostures(
  posturesPoints: number[],
  frequence: number
): number {
  // Somme des points de toutes les postures cochées
  const sommePostures = posturesPoints.reduce((sum, points) => sum + points, 0)
  
  // Application du facteur de fréquence
  const scoreAvecFrequence = sommePostures * frequence
  
  // Score maximum théorique : 165 points (toutes postures) × 2 (fréquence max) = 330
  // On normalise sur 100
  const scoreNormalise = Math.min(100, (scoreAvecFrequence / 330) * 100)
  
  return Math.round(scoreNormalise)
}

// ============================================================================
// SECTION C : CALCUL DE LA CHARGE MENTALE (NASA-TLX)
// ============================================================================

/**
 * Calcule le score de charge mentale NASA-TLX
 * 
 * FORMULE :
 * Score_Mental = (Σ Échelles) / 120 × 100
 * 
 * @param echelles - Tableau des 6 échelles (0-20 chacune)
 * @returns Score de charge mentale (sur 100)
 */
export function calculateScoreMental(echelles: number[]): number {
  // Somme des 6 échelles
  const somme = echelles.reduce((sum, val) => sum + val, 0)
  
  // Score maximum : 6 échelles × 20 points = 120
  // Normalisation sur 100
  const scoreNormalise = (somme / 120) * 100
  
  return Math.round(scoreNormalise)
}

// ============================================================================
// SECTION D : CALCUL DES RISQUES PSYCHOSOCIAUX (Karasek)
// ============================================================================

/**
 * Calcule le score RPS selon le modèle de Karasek
 * 
 * FORMULES :
 * Demande_Psychologique = Q1 + Q2 + Q5 + (5-Q3) + Q4 + Q6 + Q7 + Q8 + Q9
 * Latitude_Décisionnelle = 4×Q10 + 4×(5-Q11) + 4×Q12 + 2×(5-Q13) + 2×Q14 + 2×Q15 + 2×Q16 + 2×Q17 + 2×Q18
 * 
 * Score_RPS = (Demande_Psychologique / Max_Demande) × 50 + (Latitude_Décisionnelle / Max_Latitude) × 50
 * 
 * @param reponses - Tableau des 18 réponses (valeurs 1-4)
 * @returns Score RPS (sur 100)
 */
export function calculateScoreRPS(reponses: number[]): { 
  scoreDemande: number
  scoreLatitude: number
  scoreRPS: number 
} {
  // Extraction des réponses
  const [Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q9, Q10, Q11, Q12, Q13, Q14, Q15, Q16, Q17, Q18] = reponses
  
  // CALCUL AXE DEMANDE PSYCHOLOGIQUE
  // Questions : latitude (3 inversée), utilisation compétences, développement compétences,
  // quantité-rapidité, complexité-intensité, morcellement-prévisibilité
  const demandePsycho = Q1 + Q2 + Q5 + (5 - Q3) + Q4 + Q6 + Q7 + Q8 + Q9
  
  // Score max demande : 9 questions × 4 points = 36
  const scoreDemande = (demandePsycho / 36) * 100
  
  // CALCUL AXE LATITUDE DÉCISIONNELLE
  // Pondération : 4× pour latitude/marges (Q10-Q12), 2× pour le reste (Q13-Q18)
  // Q11 et Q13 sont inversées (5-Q)
  const latitudeDecision = 
    4 * Q10 + 
    4 * (5 - Q11) + 
    4 * Q12 + 
    2 * (5 - Q13) + 
    2 * Q14 + 
    2 * Q15 + 
    2 * Q16 + 
    2 * Q17 + 
    2 * Q18
  
  // Score max latitude : (4×3 + 2×6) × 4 = 72
  const scoreLatitude = (latitudeDecision / 72) * 100
  
  // SCORE RPS COMBINÉ
  // Haute demande + faible latitude = risque élevé
  // On combine les deux axes : demande contribue positivement, latitude négativement
  const scoreRPS = (scoreDemande * 0.6) + ((100 - scoreLatitude) * 0.4)
  
  return {
    scoreDemande: Math.round(scoreDemande),
    scoreLatitude: Math.round(scoreLatitude),
    scoreRPS: Math.round(scoreRPS)
  }
}

// ============================================================================
// CALCUL FINAL DU SCORE R
// ============================================================================

/**
 * Calcule le Score R final (Robinet - Charge de travail)
 * 
 * FORMULE FINALE :
 * Score_R = (Score_Charges × 0.30) + (Score_Postures × 0.30) + 
 *           (Score_Mental × 0.20) + (Score_RPS × 0.20)
 * 
 * Pondérations proposées :
 * - Charges physiques : 30%
 * - Postures : 30%
 * - Charge mentale : 20%
 * - RPS : 20%
 * 
 * @returns Score R final (0-100)
 */
export function calculateScoreRFinal(
  scoreCharges: number,
  scorePostures: number,
  scoreMental: number,
  scoreRPS: number
): number {
  // Pondérations des 4 sections
  const POND_CHARGES = 0.30
  const POND_POSTURES = 0.30
  const POND_MENTAL = 0.20
  const POND_RPS = 0.20
  
  // Calcul pondéré
  const scoreR = 
    (scoreCharges * POND_CHARGES) +
    (scorePostures * POND_POSTURES) +
    (scoreMental * POND_MENTAL) +
    (scoreRPS * POND_RPS)
  
  // Plafonnement entre 0 et 100
  return Math.max(0, Math.min(100, Math.round(scoreR)))
}

/**
 * Catégorise le niveau de charge de travail selon le Score R
 */
export function getScoreRCategory(scoreR: number): {
  label: string
  color: string
  description: string
} {
  if (scoreR < 30) {
    return {
      label: 'Charge faible',
      color: 'text-green-400',
      description: 'Charge de travail acceptable'
    }
  } else if (scoreR < 50) {
    return {
      label: 'Charge modérée',
      color: 'text-blue-400',
      description: 'Charge de travail gérable'
    }
  } else if (scoreR < 70) {
    return {
      label: 'Charge élevée',
      color: 'text-amber-400',
      description: 'Attention requise'
    }
  } else {
    return {
      label: 'Charge très élevée',
      color: 'text-red-400',
      description: 'Intervention nécessaire'
    }
  }
}
