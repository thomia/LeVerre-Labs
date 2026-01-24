/**
 * Dashboard d'Accueil MVP Béta Testeurs
 * Page protégée avec 4 cartes de navigation
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Presentation, BarChart3, User, LogOut, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading, logout, isAuthenticated } = useAuth()

  // Protection de la route
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/connexion')
    }
  }, [loading, isAuthenticated, router])

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-white text-lg">Chargement...</div>
      </div>
    )
  }

  // Si pas authentifié (sécurité supplémentaire)
  if (!user) {
    return null
  }

  const cards = [
    {
      id: 'presentation',
      title: 'Mode Présentation',
      description: 'Utilisez le modèle du verre pour vos formations et sensibilisations',
      icon: Presentation,
      color: 'from-[rgb(255,30,90)] to-purple-500',
      href: '/presentation',
      iconBg: 'bg-gradient-to-br from-[rgb(255,30,90)]/20 to-purple-500/20'
    },
    {
      id: 'analyse',
      title: 'Mode Analyse',
      description: 'Analyse guidée de tous les éléments du modèle ProtoVerreTMS',
      icon: ClipboardList,
      color: 'from-gray-500 to-gray-400',
      href: '/analysis',
      iconBg: 'bg-gradient-to-br from-gray-500/20 to-gray-400/20'
    },
    {
      id: 'historique',
      title: 'Mes Analyses',
      description: 'Consultez et gérez l\'historique de vos analyses',
      icon: BarChart3,
      color: 'from-green-500 to-emerald-500',
      href: '/mes-analyses',
      iconBg: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20'
    },
    {
      id: 'profil',
      title: 'Mon Profil',
      description: 'Gérez vos informations personnelles',
      icon: User,
      color: 'from-amber-500 to-orange-500',
      href: '/profil',
      iconBg: 'bg-gradient-to-br from-amber-500/20 to-orange-500/20'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `
                linear-gradient(to right, rgb(255,255,255) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(255,255,255) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}
          />
        </div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[rgb(255,30,90)]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="/photo%20video/logo_noir-removebg-preview.png" 
              alt="LeVerre Labs" 
              className="h-10 w-10 object-contain brightness-0 invert"
            />
            <div>
              <h1 className="text-xl font-bold text-white">
                LeVerre <span className="text-[rgb(255,30,90)]">Labs</span>
              </h1>
              <p className="text-xs text-gray-400">Programme Béta</p>
            </div>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">
                {user.prenom} {user.nom}
              </p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="bg-transparent border-white/20 hover:bg-white/10 text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Bienvenue, <span className="text-[rgb(255,30,90)]">{user.prenom}</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Que souhaitez-vous faire aujourd'hui ?
          </p>
        </motion.div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {cards.map((card, index) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <button
                  onClick={() => router.push(card.href)}
                  className="relative w-full h-full"
                >
                  {/* Glow effect on hover */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${card.color} rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500`} />
                  
                  {/* Card */}
                  <div className="relative bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-black/95 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl hover:border-white/20 transition-all duration-300 text-left h-full">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${card.iconBg} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-8 h-8 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[rgb(255,30,90)] transition-colors duration-300">
                      {card.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {card.description}
                    </p>

                    {/* Arrow indicator */}
                    <div className="mt-6 flex items-center text-gray-500 group-hover:text-[rgb(255,30,90)] transition-colors duration-300">
                      <span className="text-sm font-medium">Accéder</span>
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              </motion.div>
            )
          })}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4">
            <p className="text-sm text-gray-400">
              Vous êtes inscrit au <span className="text-white font-semibold">programme béta</span> de LeVerre Labs
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
