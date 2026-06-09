"use client"

/**
 * Garde-fou de l'espace formateur.
 * Tant que le mot de passe formateur n'a pas été validé (et mémorisé en
 * sessionStorage), on n'affiche que l'écran de connexion. Une fois validé,
 * on révèle le contenu (onglets sensibilisation / analyse vidéo).
 *
 * Note : protection légère (mot de passe partagé), identique au reste de
 * l'espace formateur. Pour une vraie gestion de comptes, voir Supabase Auth.
 */

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { KeyRound, Loader2 } from 'lucide-react'
import { saveFormateurPassword } from '@/hooks/use-formateur-control'

const STORAGE_KEY = 'formateur_password'

interface VerrouAccesFormateurProps {
  children: React.ReactNode
}

export function VerrouAccesFormateur({ children }: VerrouAccesFormateurProps) {
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setIsAuthed(!!sessionStorage.getItem(STORAGE_KEY))
    } catch {
      setIsAuthed(false)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!password.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/formateur/verifier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (response.status === 401) {
        setError('Mot de passe incorrect')
        setIsLoading(false)
        return
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setError(data.error ?? 'Erreur serveur')
        setIsLoading(false)
        return
      }

      saveFormateurPassword(password)
      setIsAuthed(true)
    } catch {
      setError('Impossible de contacter le serveur')
      setIsLoading(false)
    }
  }

  if (isAuthed === null)
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[rgb(255,30,90)] border-t-transparent" />
      </div>
    )

  if (isAuthed) return <>{children}</>

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-slate-950 to-slate-900 p-4 pt-24">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl backdrop-blur"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-full bg-[rgb(255,30,90)]/15 p-2">
            <KeyRound className="h-6 w-6 text-[rgb(255,30,90)]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Espace formateur</h1>
            <p className="text-xs text-slate-400">Accès réservé à l&apos;animateur.</p>
          </div>
        </div>

        <label className="mb-1 block text-sm font-medium text-slate-300">
          Mot de passe formateur
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-white placeholder:text-slate-500 focus:border-[rgb(255,30,90)] focus:outline-none focus:ring-1 focus:ring-[rgb(255,30,90)]"
          placeholder="••••••••"
        />

        {error && (
          <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !password.trim()}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[rgb(255,30,90)] px-4 py-3 font-semibold text-white transition hover:bg-[rgb(255,60,120)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <KeyRound className="h-5 w-5" />}
          Accéder
        </button>

        <p className="mt-3 text-center text-xs text-slate-500">
          Le mot de passe est mémorisé pour la durée de cet onglet.
        </p>
      </motion.form>
    </div>
  )
}
