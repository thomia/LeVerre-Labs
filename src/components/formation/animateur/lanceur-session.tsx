"use client"

/**
 * Onglet « Sensibilisation » de l'espace formateur.
 * Lance une session de sensibilisation collective (style Kahoot) :
 * choix de la durée par élément + bouton de lancement.
 * Le mot de passe est déjà validé en amont (verrou de l'espace), on le
 * récupère depuis sessionStorage pour appeler l'API de création.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, PlayCircle } from 'lucide-react'
import { getFormateurPassword } from '@/hooks/use-formateur-control'

export function LanceurSession() {
  const router = useRouter()
  const [timerDuration, setTimerDuration] = useState(120)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const password = getFormateurPassword()
    if (!password) {
      setError('Session expirée. Recharge la page pour te reconnecter.')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/formation/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, timerDuration }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error ?? 'Erreur inconnue')
        setIsLoading(false)
        return
      }

      router.push(`/formation/${data.code}`)
    } catch {
      setError('Impossible de contacter le serveur')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl backdrop-blur"
      >
        <h2 className="mb-2 text-2xl font-semibold text-white">
          Session sensibilisation collective
        </h2>
        <p className="mb-6 text-sm text-slate-400">
          Lance une session en direct pour tes participants. Ils pourront
          rejoindre via un QR code.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">
              Durée par élément (secondes)
            </label>
            <input
              type="number"
              min={30}
              max={600}
              step={10}
              value={timerDuration}
              onChange={(e) => setTimerDuration(Number(e.target.value))}
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-slate-500">
              Tu pourras aussi passer manuellement à l&apos;élément suivant.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <PlayCircle className="h-5 w-5" />
            )}
            Lancer la session
          </button>
        </form>
      </motion.div>
    </div>
  )
}
