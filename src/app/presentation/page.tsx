/**
 * Page Mode Présentation
 * Outil pédagogique pour formateurs basé sur le workflow de formation
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PresentationTrainer } from '@/components/presentation/presentation-trainer'

export default function PresentationPage() {
  const router = useRouter()
  const { user, loading, isAuthenticated } = useAuth()
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Protection de la route
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/connexion')
    }
  }, [loading, isAuthenticated, router])

  // Gestion du plein écran
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Écouter les changements de plein écran
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-white text-lg">Chargement...</div>
      </div>
    )
  }

  // Si pas authentifié
  if (!user) {
    return null
  }

  return (
    <div className="h-screen bg-black relative overflow-hidden">
      {/* Bouton retour (overlay discret) */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          onClick={() => router.push('/dashboard')}
          variant="ghost"
          size="sm"
          className="bg-gray-900/80 backdrop-blur-sm border border-white/10 text-white hover:text-[rgb(255,30,90)] hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
      </div>

      {/* Composant de présentation pour formateur */}
      <PresentationTrainer 
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />
    </div>
  )
}
