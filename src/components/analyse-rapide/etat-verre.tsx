"use client"

/**
 * Ce que le verre affiche à l'instant T, en une ligne : le niveau, le sens
 * dans lequel ça va, et le moment traversé.
 *
 * Rien de plus : les projections chiffrées ("déborde après X h") sont trop
 * théoriques pour être commentées en direct, le niveau et sa tendance suffisent
 * à raconter ce qui se passe à l'écran.
 */

import { TrendingDown, TrendingUp } from 'lucide-react'
import { couleurNiveau } from '@/lib/analyse-rapide'

interface EtatVerreProps {
  niveau: number
  /** % de verre par minute de travail : ne sert qu'au sens de la flèche. */
  taux: number
  /** Nom du moment traversé, `null` entre deux moments. */
  momentActif: string | null
}

export function EtatVerre({ niveau, taux, momentActif }: EtatVerreProps) {
  const couleur = couleurNiveau(niveau)
  const seRemplit = taux > 0.01
  const seVide = taux < -0.01

  return (
    <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2">
      <p className="text-3xl font-bold tabular-nums leading-none" style={{ color: couleur }}>
        {Math.round(niveau)}
        <span className="text-base font-medium text-white/40"> %</span>
      </p>

      {(seRemplit || seVide) && (
        <span style={{ color: seRemplit ? couleur : '#4ade80' }}>
          {seRemplit ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
        </span>
      )}

      <p className="min-w-0 flex-1 truncate text-right text-[12px] text-white/45">
        {momentActif ?? 'Hors moment'}
      </p>
    </div>
  )
}
