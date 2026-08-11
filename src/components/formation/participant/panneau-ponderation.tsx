"use client"

/**
 * Écran de classement du Robinet (participant) — étape 1/2.
 *
 * Le participant CLASSE les 5 aspects du Robinet du plus au moins important
 * pour sa tâche. Le rang détermine le poids wᵢ utilisé dans le score
 * (1er = 3, puis 2,5 / 2 / 1,5 / 1). Les poids sont sauvegardés dans `answers`
 * (clés `robinet_w_*`). Les curseurs (défaveurs xᵢ) viennent ensuite.
 */

import { useState } from 'react'
import { CheckCircle2, ChevronDown, ChevronUp, Loader2, ListOrdered } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ROBINET_ASPECTS, RANK_WEIGHTS } from '@/lib/questions/robinet'
import type { AnswersMap } from '@/lib/questions'

type Aspect = (typeof ROBINET_ASPECTS)[number]

interface PonderationPanelProps {
  participantId: string
  initialAnswers: AnswersMap
  /** Appelé après sauvegarde, avec les poids déduits du classement. */
  onValidated: (weights: Record<string, number>) => void
}

/** Ordre initial : dérivé des poids déjà saisis (desc), sinon ordre par défaut. */
function initialOrder(answers: AnswersMap): Aspect[] {
  const hasWeights = ROBINET_ASPECTS.every(
    (a) => typeof answers[a.weightKey] === 'number'
  )
  if (!hasWeights) return [...ROBINET_ASPECTS]

  return [...ROBINET_ASPECTS].sort(
    (a, b) => (answers[b.weightKey] as number) - (answers[a.weightKey] as number)
  )
}

export function PonderationPanel({
  participantId,
  initialAnswers,
  onValidated,
}: PonderationPanelProps) {
  const [order, setOrder] = useState<Aspect[]>(() => initialOrder(initialAnswers))
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= order.length) return
    setOrder((prev) => {
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  async function handleValidate() {
    if (isSaving) return
    setIsSaving(true)
    setError(null)

    const weights: Record<string, number> = {}
    order.forEach((aspect, index) => {
      weights[aspect.weightKey] = RANK_WEIGHTS[index] ?? 1
    })

    const supabase = createClient()
    const { data: current } = await supabase
      .from('participants')
      .select('answers')
      .eq('id', participantId)
      .maybeSingle()

    const currentAnswers = (current?.answers ?? {}) as AnswersMap
    const mergedAnswers = { ...currentAnswers, ...weights }

    const { error: updateError } = await supabase
      .from('participants')
      .update({ answers: mergedAnswers })
      .eq('id', participantId)

    if (updateError) {
      console.error('[classement] Erreur sauvegarde:', updateError)
      setError('Impossible de sauvegarder. On réessaie ?')
      setIsSaving(false)
      return
    }

    setIsSaving(false)
    onValidated(weights)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 rounded-xl border border-blue-400/30 bg-blue-500/10 p-3">
        <ListOrdered className="h-5 w-5 shrink-0 text-blue-300" />
        <div>
          <p className="text-base font-bold uppercase tracking-wide text-blue-300">
            Classe les aspects du Robinet
          </p>
          <p className="text-xs text-slate-400">
            Du plus important (en haut) au moins important pour ta tâche. Ce
            classement définit le poids de chaque aspect dans ton score.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {order.map((aspect, index) => (
          <div
            key={aspect.weightKey}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/60 p-3"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-sm font-bold text-blue-300">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {aspect.label}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                poids ×{RANK_WEIGHTS[index] ?? 1}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-1">
              <button
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Monter"
                className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-slate-800 text-slate-200 transition hover:bg-slate-700 disabled:opacity-30"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => move(index, 1)}
                disabled={index === order.length - 1}
                aria-label="Descendre"
                className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-slate-800 text-slate-200 transition hover:bg-slate-700 disabled:opacity-30"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleValidate}
        disabled={isSaving}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}
        Valider le classement
      </button>
    </div>
  )
}
