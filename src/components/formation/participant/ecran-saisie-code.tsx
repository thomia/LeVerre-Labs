"use client"

/**
 * Saisie manuelle du code de session, pour les participants qui ne scannent
 * pas le QR code et tapent l'adresse à la main.
 *
 * Sans cet écran, il fallait taper l'URL complète `.../session/LV-ABCD` sans
 * aucune faute : la moindre erreur menait à un 404 brut, sans moyen de se
 * rattraper. Ici, l'adresse courte `/session` suffit et le code est corrigé
 * automatiquement (minuscules, espaces, tiret ou préfixe oubliés).
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, QrCode } from 'lucide-react'
import { isValidSessionCode, normalizeSessionCode } from '@/lib/session/generate-code'

interface EcranSaisieCodeProps {
  /** Message affiché au-dessus du formulaire (ex. code introuvable). */
  avertissement?: string
  /** Pré-remplit le champ, par exemple avec le code erroné déjà tapé. */
  codeInitial?: string
}

export function EcranSaisieCode({ avertissement, codeInitial = '' }: EcranSaisieCodeProps) {
  const router = useRouter()
  const [saisie, setSaisie] = useState(codeInitial)
  const [erreur, setErreur] = useState<string | null>(null)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const code = normalizeSessionCode(saisie)
    if (!isValidSessionCode(code)) {
      setErreur(
        'Ce code ne ressemble pas à un code de session. Il a la forme LV-ABCD (4 caractères après le tiret).'
      )
      return
    }

    setErreur(null)
    router.push(`/session/${code}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl backdrop-blur"
    >
      <h1 className="mb-1 text-2xl font-semibold text-white">
        Rejoindre une session
      </h1>
      <p className="mb-6 text-sm text-slate-400">
        Saisis le code affiché par ton formateur.
      </p>

      {avertissement && (
        <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          {avertissement}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="code-session"
            className="mb-1 block text-sm font-medium text-slate-300"
          >
            Code de session
          </label>
          <input
            id="code-session"
            type="text"
            value={saisie}
            onChange={(event) => setSaisie(event.target.value)}
            required
            autoFocus
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            inputMode="text"
            placeholder="LV-ABCD"
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-center font-mono text-xl uppercase tracking-widest text-white placeholder:tracking-normal placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-slate-500">
            Majuscules, tiret et espaces : on s&apos;en occupe.
          </p>
        </div>

        {erreur && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {erreur}
          </div>
        )}

        <button
          type="submit"
          disabled={!saisie.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowRight className="h-5 w-5" />
          Continuer
        </button>
      </form>

      <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
        <QrCode className="h-4 w-4 shrink-0" />
        Plus rapide : scanne le QR code projeté par ton formateur.
      </p>
    </motion.div>
  )
}
