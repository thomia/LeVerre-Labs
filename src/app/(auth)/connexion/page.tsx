/**
 * Page de connexion pour les béta testeurs
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogIn, Loader2, Mail, Lock } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export default function ConnexionPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Erreur lors de la connexion')
        setLoading(false)
        return
      }

      // Connexion réussie
      login(data.user)
      toast.success('Connexion réussie ! 🎉')
      
      // Redirection vers le dashboard
      setTimeout(() => {
        router.push('/dashboard')
      }, 500)
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur de connexion au serveur')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 relative overflow-hidden">
      <Toaster position="top-center" />
      
      {/* Background Effects - Style LeVerre Labs */}
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
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[rgb(255,30,90)]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] animate-pulse" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card - Style LeVerre Labs */}
        <div className="relative group">
          {/* Glow effect on hover */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[rgb(255,30,90)] via-purple-500 to-[rgb(255,30,90)] rounded-3xl opacity-20 group-hover:opacity-40 blur-xl transition-all duration-500" />
          
          {/* Main card */}
          <div className="relative bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-black/95 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            {/* Top highlight bar */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-[rgb(255,30,90)] to-transparent rounded-full" />
            
            {/* Header */}
            <div className="text-center mb-8">
              {/* Logo */}
              <div className="mb-6">
                <img 
                  src="/photo%20video/logo_noir-removebg-preview.png" 
                  alt="LeVerre Labs" 
                  className="h-20 w-20 mx-auto object-contain brightness-0 invert"
                />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-2">
                Bienvenue sur{' '}
                <span className="text-[rgb(255,30,90)]">ProtoVerreTMS</span>
              </h1>
              <p className="text-gray-400">
                Connectez-vous à votre compte <span className="text-white font-semibold">béta</span>
              </p>
            </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="jean.dupont@entreprise.fr"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Bouton Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[rgb(255,30,90)] to-purple-500 hover:from-[rgb(255,30,90)]/90 hover:to-purple-600 text-white font-medium py-6 transition-all duration-300 shadow-lg shadow-[rgb(255,30,90)]/20"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Se connecter
                </>
              )}
            </Button>
          </form>

          {/* Lien vers inscription */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Vous n'avez pas encore de compte ?{' '}
              <Link
                href="/inscription"
                className="text-[rgb(255,30,90)] hover:text-[rgb(255,30,90)]/80 font-medium transition-colors"
              >
                S'inscrire
              </Link>
            </p>
          </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            <span className="text-white font-semibold">LeVerre Labs</span> - Programme Béta Testeur
          </p>
        </div>
      </motion.div>
    </div>
  )
}
