"use client"

/**
 * Formulaire mobile-first : un participant rejoint une session en saisissant
 * son pseudo. Aucune authentification requise.
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, LogIn } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ParticipantJoinProps {
  sessionCode: string
  onJoined: (participantId: string, pseudo: string) => void
}

export function ParticipantJoin({ sessionCode, onJoined }: ParticipantJoinProps) {
  const [pseudo, setPseudo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const cleanPseudo = pseudo.trim()
    if (cleanPseudo.length < 2 || cleanPseudo.length > 20) {
      setError('Le pseudo doit contenir entre 2 et 20 caractères')
      return
    }

    setIsLoading(true)

    const supabase = createClient()
    const { data, error: insertError } = await supabase
      .from('participants')
      .insert({
        session_code: sessionCode,
        pseudo: cleanPseudo,
        scores: {},
        answers: {},
      })
      .select('id, pseudo')
      .single()

    if (insertError || !data) {
      // Log détaillé car l'objet error de Supabase a des propriétés non-énumérables
      console.error('[participant-join] Erreur insertion:', {
        message: insertError?.message,
        code: insertError?.code,
        details: insertError?.details,
        hint: insertError?.hint,
        stringified: JSON.stringify(insertError),
        hasData: !!data,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      })
      setError(
        insertError?.message ??
          'Impossible de rejoindre la session. Réessaie.'
      )
      setIsLoading(false)
      return
    }

    onJoined(data.id as string, data.pseudo as string)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl backdrop-blur"
    >
      <h1 className="mb-1 text-2xl font-semibold text-white">
        Rejoindre la session
      </h1>
      <p className="mb-6 text-sm text-slate-400">
        Code :{' '}
        <span className="font-mono text-lg font-bold text-blue-400">
          {sessionCode}
        </span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">
            Ton pseudo
          </label>
          <input
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            required
            minLength={2}
            maxLength={20}
            autoFocus
            autoComplete="nickname"
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="ex: Alice"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !pseudo.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LogIn className="h-5 w-5" />
          )}
          Rejoindre
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-slate-500">
        Aucune donnée personnelle n&apos;est stockée.
      </p>
    </motion.div>
  )
}
