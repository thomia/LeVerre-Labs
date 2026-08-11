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
import { Reorder, useDragControls } from 'framer-motion'
import { CheckCircle2, Loader2, GripVertical, ArrowUp, ArrowDown } from 'lucide-react'
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 rounded-xl border border-blue-400/30 bg-blue-500/10 p-3">
        <ArrowUp className="h-5 w-5 shrink-0 text-blue-300" />
        <div>
          <p className="text-base font-bold uppercase tracking-wide text-blue-300">
            Classe les aspects du Robinet
          </p>
          <p className="text-xs text-slate-400">
            Glisse-dépose du plus important (en haut) au moins important (en
            bas) pour ta tâche. On s&apos;occupe du calcul.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        <span className="flex items-center gap-1 text-blue-300">
          <ArrowUp className="h-3 w-3" /> Le plus important
        </span>
        <span className="flex items-center gap-1">
          Le moins <ArrowDown className="h-3 w-3" />
        </span>
      </div>

      <Reorder.Group
        axis="y"
        values={order}
        onReorder={setOrder}
        className="flex flex-col gap-2"
      >
        {order.map((key, index) => (
          <RankItem key={key} weightKey={key} rank={index} />
        ))}
      </Reorder.Group>

      <button
        onClick={handleValidate}
        disabled={isSaving}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
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
  const controls = useDragControls()

  return (
    <Reorder.Item
      value={weightKey}
      dragListener={false}
      dragControls={controls}
      className="flex touch-none items-center gap-3 rounded-xl border border-white/10 bg-slate-900/60 p-3 shadow-sm"
      whileDrag={{ scale: 1.03, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-sm font-bold tabular-nums text-blue-300">
        {rank + 1}
      </span>
      <p className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
        {aspect?.label ?? weightKey}
      </p>
      <button
        type="button"
        aria-label="Réordonner"
        onPointerDown={(event) => controls.start(event)}
        className="flex shrink-0 cursor-grab touch-none items-center text-slate-500 transition hover:text-slate-300 active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5" />
      </button>
    </Reorder.Item>
  )
}
