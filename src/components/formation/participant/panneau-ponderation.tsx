"use client"

/**
 * Écran de classement du Robinet (participant) — étape 1/2.
 *
 * Le participant CLASSE les 5 aspects du plus important au moins important par
 * glisser-déposer (~10 s). On applique ensuite une pondération prédéfinie selon
 * le rang (`ROBINET_RANK_WEIGHTS`) — il n'a jamais à penser aux poids. Les poids
 * obtenus sont sauvegardés dans `answers` (clés `robinet_w_*`), format inchangé
 * pour `computeScore`.
 */

import { useState } from 'react'
import { Reorder } from 'framer-motion'
import { CheckCircle2, Loader2, GripVertical } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ROBINET_ASPECTS, ROBINET_RANK_WEIGHTS } from '@/lib/questions/robinet'
import type { AnswersMap } from '@/lib/questions'

interface PonderationPanelProps {
  participantId: string
  initialAnswers: AnswersMap
  /** Appelé après sauvegarde, avec les poids déduits du classement. */
  onValidated: (weights: Record<string, number>) => void
}

type RobinetAspect = (typeof ROBINET_ASPECTS)[number]
const ASPECT_BY_KEY = new Map<string, RobinetAspect>(
  ROBINET_ASPECTS.map((a) => [a.weightKey, a])
)
const DEFAULT_ORDER: string[] = ROBINET_ASPECTS.map((a) => a.weightKey)

/**
 * Ordre initial : si une pondération existe déjà en BDD, on reconstruit le
 * classement (poids décroissant) ; sinon on part de l'ordre canonique.
 */
function initialOrder(answers: AnswersMap): string[] {
  const hasAll = ROBINET_ASPECTS.every(
    (a) => typeof answers[a.weightKey] === 'number'
  )
  if (!hasAll) return DEFAULT_ORDER
  return [...DEFAULT_ORDER].sort(
    (a, b) => (answers[b] as number) - (answers[a] as number)
  )
}

export function PonderationPanel({
  participantId,
  initialAnswers,
  onValidated,
}: PonderationPanelProps) {
  const [order, setOrder] = useState<string[]>(() => initialOrder(initialAnswers))
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function computeWeights(currentOrder: string[]): Record<string, number> {
    const weights: Record<string, number> = {}
    currentOrder.forEach((key, index) => {
      weights[key] = ROBINET_RANK_WEIGHTS[index] ?? 0
    })
    return weights
  }

  async function handleValidate() {
    if (isSaving) return
    setIsSaving(true)
    setError(null)

    const weights = computeWeights(order)
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
    // Compact volontairement : sur un écran de téléphone, les 5 lignes à
    // classer et le bouton de validation doivent tenir sans défilement.
    <div className="flex flex-col gap-2.5">
      <div className="rounded-xl border border-blue-400/30 bg-blue-500/10 px-3 py-2">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-300">
          Classe les aspects du Robinet
        </p>
        <p className="text-[11px] leading-snug text-slate-400">
          Glisse-dépose : n° 1 = le plus important pour ta tâche, n° 5 = le
          moins. On s&apos;occupe du calcul.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <Reorder.Group
        axis="y"
        values={order}
        onReorder={setOrder}
        className="flex flex-col gap-1.5"
      >
        {order.map((key, index) => (
          <RankItem key={key} weightKey={key} rank={index} />
        ))}
      </Reorder.Group>

      <button
        onClick={handleValidate}
        disabled={isSaving}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
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

// ---------------------------------------------------------------------------
// Sous-composants
// ---------------------------------------------------------------------------

interface RankItemProps {
  weightKey: string
  rank: number
}

function RankItem({ weightKey, rank }: RankItemProps) {
  const aspect = ASPECT_BY_KEY.get(weightKey)

  // Toute la barre est draggable (dragListener par défaut de Reorder.Item) :
  // le participant attrape n'importe où sur la ligne, pas seulement la poignée.
  return (
    <Reorder.Item
      value={weightKey}
      className="flex cursor-grab touch-none select-none items-center gap-2.5 rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2.5 shadow-sm active:cursor-grabbing"
      whileDrag={{ scale: 1.03, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold tabular-nums text-blue-300">
        {rank + 1}
      </span>
      <p className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
        {aspect?.label ?? weightKey}
      </p>
      <GripVertical className="h-5 w-5 shrink-0 text-slate-500" aria-hidden />
    </Reorder.Item>
  )
}
