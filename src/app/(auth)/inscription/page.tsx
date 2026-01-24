/**
 * Page d'inscription pour les béta testeurs
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
import { UserPlus, Loader2, Mail, Lock, User, Building2, Briefcase } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export default function InscriptionPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
    entreprise: '',
    poste: ''
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

    // Validation côté client
    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nom: formData.nom,
          prenom: formData.prenom,
          entreprise: formData.entreprise || undefined,
          poste: formData.poste || undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Erreur lors de l\'inscription')
        setLoading(false)
        return
      }

      // Connexion automatique après inscription
      login(data.user)
      toast.success('Inscription réussie ! Bienvenue 🎉')
      
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
                Rejoindre le programme{' '}
                <span className="text-[rgb(255,30,90)]">Béta</span>
              </h1>
              <p className="text-gray-400">
                Créez votre compte pour tester <span className="text-white font-semibold">ProtoVerreTMS</span>
              </p>
            </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom et Prénom */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom" className="text-gray-300">
                  Nom *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <Input
                    id="nom"
                    name="nom"
                    type="text"
                    required
                    value={formData.nom}
                    onChange={handleChange}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-gray-500"
                    placeholder="Dupont"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prenom" className="text-gray-300">
                  Prénom *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <Input
                    id="prenom"
                    name="prenom"
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={handleChange}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-gray-500"
                    placeholder="Jean"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email *
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
                  className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-gray-500"
                  placeholder="jean.dupont@entreprise.fr"
                />
              </div>
            </div>

            {/* Entreprise et Poste */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entreprise" className="text-gray-300">
                  Entreprise
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <Input
                    id="entreprise"
                    name="entreprise"
                    type="text"
                    value={formData.entreprise}
                    onChange={handleChange}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-gray-500"
                    placeholder="LeVerre Labs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="poste" className="text-gray-300">
                  Poste
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <Input
                    id="poste"
                    name="poste"
                    type="text"
                    value={formData.poste}
                    onChange={handleChange}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-gray-500"
                    placeholder="Ergonome"
                  />
                </div>
              </div>
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Mot de passe *
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
                  className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-gray-500"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-xs text-gray-500">Minimum 6 caractères</p>
            </div>

            {/* Confirmation mot de passe */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300">
                Confirmer le mot de passe *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-gray-500"
                  placeholder="••••••••"
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
                  Création du compte...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Créer mon compte
                </>
              )}
            </Button>
          </form>

          {/* Lien vers connexion */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Vous avez déjà un compte ?{' '}
              <Link
                href="/connexion"
                className="text-[rgb(255,30,90)] hover:text-[rgb(255,30,90)]/80 font-medium transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            En vous inscrivant, vous acceptez de participer au programme béta de{' '}
            <span className="text-white font-semibold">LeVerre Labs</span>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
