/**
 * Types pour l'authentification et gestion utilisateurs
 */

export interface BetaUser {
  id: string
  email: string
  role: 'BETA_TESTEUR' | 'ADMIN'
  nom: string
  prenom: string
  entreprise?: string
  poste?: string
  createdAt: Date
  lastLogin: Date
}

export interface AuthSession {
  userId: string
  token: string
  expiresAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  nom: string
  prenom: string
  entreprise?: string
  poste?: string
}

export interface AuthResponse {
  success: boolean
  error?: string
  user?: BetaUser
}
