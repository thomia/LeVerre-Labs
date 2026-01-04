/**
 * Contexte d'authentification pour l'application
 * Gère l'état global de l'utilisateur et les fonctions auth
 */

'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { BetaUser } from '@/types/auth.types'
import { getCurrentUser, saveSession, logout as logoutUser, isAuthenticated } from '@/lib/auth'

interface AuthContextType {
  user: BetaUser | null
  loading: boolean
  login: (user: BetaUser) => void
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<BetaUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    const loadUser = () => {
      try {
        const currentUser = getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = (newUser: BetaUser) => {
    saveSession(newUser)
    setUser(newUser)
  }

  const logout = () => {
    setUser(null)
    logoutUser()
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: user !== null,
    isAdmin: user?.role === 'ADMIN'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
