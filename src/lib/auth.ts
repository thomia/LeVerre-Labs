/**
 * Système d'authentification pour le MVP Béta
 * Utilise bcryptjs pour le hash et localStorage pour la session
 */

import bcrypt from 'bcryptjs'
import prisma from './db'
import { BetaUser, LoginCredentials, RegisterData, AuthSession } from '@/types/auth.types'

// ============================================
// CONSTANTES
// ============================================

const SESSION_KEY = 'beta_session'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 jours en millisecondes

// ============================================
// FONCTIONS D'AUTHENTIFICATION
// ============================================

/**
 * Inscrire un nouveau utilisateur
 */
export async function register(data: RegisterData): Promise<{ success: boolean; error?: string; user?: BetaUser }> {
  try {
    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() }
    })

    if (existingUser) {
      return { success: false, error: 'Cet email est déjà utilisé' }
    }

    // Valider l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return { success: false, error: 'Email invalide' }
    }

    // Valider le mot de passe
    if (data.password.length < 6) {
      return { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères' }
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: hashedPassword,
        role: 'BETA_TESTEUR',
        nom: data.nom,
        prenom: data.prenom,
        entreprise: data.entreprise,
        poste: data.poste
      }
    })

    // Convertir en BetaUser (sans le password)
    const betaUser: BetaUser = {
      id: user.id,
      email: user.email,
      role: user.role as 'BETA_TESTEUR' | 'ADMIN',
      nom: user.nom,
      prenom: user.prenom,
      entreprise: user.entreprise || undefined,
      poste: user.poste || undefined,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }

    return { success: true, user: betaUser }
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
    return { success: false, error: 'Erreur lors de l\'inscription' }
  }
}

/**
 * Connecter un utilisateur
 */
export async function login(credentials: LoginCredentials): Promise<{ success: boolean; error?: string; user?: BetaUser }> {
  try {
    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: credentials.email.toLowerCase() }
    })

    if (!user) {
      return { success: false, error: 'Email ou mot de passe incorrect' }
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

    if (!isPasswordValid) {
      return { success: false, error: 'Email ou mot de passe incorrect' }
    }

    // Mettre à jour la date de dernière connexion
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })

    // Convertir en BetaUser
    const betaUser: BetaUser = {
      id: user.id,
      email: user.email,
      role: user.role as 'BETA_TESTEUR' | 'ADMIN',
      nom: user.nom,
      prenom: user.prenom,
      entreprise: user.entreprise || undefined,
      poste: user.poste || undefined,
      createdAt: user.createdAt,
      lastLogin: new Date()
    }

    return { success: true, user: betaUser }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    return { success: false, error: 'Erreur lors de la connexion' }
  }
}

/**
 * Obtenir l'utilisateur par ID
 */
export async function getUserById(userId: string): Promise<BetaUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      role: user.role as 'BETA_TESTEUR' | 'ADMIN',
      nom: user.nom,
      prenom: user.prenom,
      entreprise: user.entreprise || undefined,
      poste: user.poste || undefined,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error)
    return null
  }
}

// ============================================
// GESTION DE SESSION (Client-side)
// ============================================

/**
 * Sauvegarder la session dans localStorage
 */
export function saveSession(user: BetaUser): void {
  if (typeof window === 'undefined') return

  const session: AuthSession = {
    userId: user.id,
    token: user.id, // Pour MVP, on utilise juste l'ID
    expiresAt: new Date(Date.now() + SESSION_DURATION)
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  localStorage.setItem('beta_user', JSON.stringify(user))
}

/**
 * Récupérer la session depuis localStorage
 */
export function getSession(): AuthSession | null {
  if (typeof window === 'undefined') return null

  try {
    const sessionStr = localStorage.getItem(SESSION_KEY)
    if (!sessionStr) return null

    const session: AuthSession = JSON.parse(sessionStr)

    // Vérifier si la session a expiré
    if (new Date(session.expiresAt) < new Date()) {
      clearSession()
      return null
    }

    return session
  } catch (error) {
    console.error('Erreur lors de la récupération de la session:', error)
    return null
  }
}

/**
 * Récupérer l'utilisateur courant depuis localStorage
 */
export function getCurrentUser(): BetaUser | null {
  if (typeof window === 'undefined') return null

  try {
    const session = getSession()
    if (!session) return null

    const userStr = localStorage.getItem('beta_user')
    if (!userStr) return null

    return JSON.parse(userStr) as BetaUser
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error)
    return null
  }
}

/**
 * Vérifier si l'utilisateur est connecté
 */
export function isAuthenticated(): boolean {
  return getSession() !== null
}

/**
 * Vérifier si l'utilisateur est admin
 */
export function isAdmin(): boolean {
  const user = getCurrentUser()
  return user?.role === 'ADMIN'
}

/**
 * Déconnecter l'utilisateur
 */
export function logout(): void {
  clearSession()
  
  // Rediriger vers la page de connexion
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login'
  }
}

/**
 * Effacer la session
 */
function clearSession(): void {
  if (typeof window === 'undefined') return

  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem('beta_user')
}

/**
 * Rafraîchir les données utilisateur
 */
export async function refreshUser(): Promise<BetaUser | null> {
  const session = getSession()
  if (!session) return null

  const user = await getUserById(session.userId)
  if (user) {
    saveSession(user)
  }

  return user
}
