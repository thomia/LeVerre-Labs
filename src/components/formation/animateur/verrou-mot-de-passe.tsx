"use client"

/**
 * Garde-fou : s'assure que le formateur a saisi son mot de passe
 * (stocké en sessionStorage) avant de pouvoir utiliser les contrôles.
 *
 * Si sessionStorage est vide (ex : refresh de la page, nouvel onglet,
 * ouverture directe de /formation/[code]), on affiche un modal plein
 * écran qui demande le mot de passe.
 */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { KeyRound, Loader2 } from 'lucide-react'
import { saveFormateurPassword } from '@/hooks/use-formateur-control'

const STORAGE_KEY = 'formateur_password'

interface FormateurAuthGateProps {
  code: string
  children: React.ReactNode
}

export function FormateurAuthGate({ code, children }: FormateurAuthGateProps) {
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      setIsAuthed(!!stored)
    } catch {
      setIsAuthed(false)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!password.trim()) return

    setIsLoading(true)
    setError(null)

    // On vérifie le mot de passe en appelant l'API avec une action
    // "reset" neutre - si le password est bon, ça passe ; sinon 401.
    // Note : reset est idempotent sur une session fraîche (waiting → waiting).
    try {
      const response = await fetch(`/api/formation/${code}/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, action: 'reset' }),
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

  // Phase de check initial : on ne rend rien pour éviter un flash
  if (isAuthed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <>
      {children}

      <AnimatePresence>
        {!isAuthed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <motion.form
              onSubmit={handleSubmit}
              initial={{ y: 20, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-full bg-blue-600/20 p-2">
                  <KeyRound className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Authentification formateur
                  </h2>
                  <p className="text-xs text-slate-400">
                    Session :{' '}
                    <span className="font-mono text-blue-400">{code}</span>
                  </p>
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
                className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <KeyRound className="h-5 w-5" />
                )}
                Valider
              </button>

              <p className="mt-3 text-center text-xs text-slate-500">
                Le mot de passe est mémorisé pour la durée de cet onglet.
              </p>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
