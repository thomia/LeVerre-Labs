"use client"

/**
 * Écran de pondération du Robinet (participant).
 *
 * Le participant répartit 100 points entre les 5 aspects du Robinet. Les
 * curseurs sont AUTO-ÉQUILIBRÉS : quand on en bouge un, les autres s'ajustent
 * proportionnellement pour que le total reste toujours à 100 (pas de réglage
 * fastidieux). Les poids sont sauvegardés dans `answers` (clés `robinet_w_*`).
 */

import { useState } from 'react'
import { CheckCircle2, Loader2, RotateCcw, Scale } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Slider from '@/components/ui/slider-number-flow'
import {
  ROBINET_ASPECTS,
  ROBINET_PONDERATION_TOTAL,
} from '@/lib/questions/robinet'
import type { AnswersMap } from '@/lib/questions'

interface PonderationPanelProps {
  participantId: string
  initialAnswers: AnswersMap
  /** Appelé après sauvegarde, avec les poids saisis (clés `robinet_w_*`). */
  onValidated: (weights: Record<string, number>) => void
}

const WEIGHT_KEYS = ROBINET_ASPECTS.map((a) => a.weightKey)
const EQUAL_WEIGHT = ROBINET_PONDERATION_TOTAL / ROBINET_ASPECTS.length

export function PonderationPanel({
  participantId,
  initialAnswers,
  onValidated,
}: PonderationPanelProps) {
  const [weights, setWeights] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {}
    for (const aspect of ROBINET_ASPECTS) {
      const raw = initialAnswers[aspect.weightKey]
      init[aspect.weightKey] = typeof raw === 'number' ? raw : EQUAL_WEIGHT
    }
    return init
  })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(changedKey: string, rawValue: number) {
    setWeights((prev) => redistribute(prev, changedKey, rawValue))
  }

  function handleReset() {
    const reset: Record<string, number> = {}
    for (const key of WEIGHT_KEYS) reset[key] = EQUAL_WEIGHT
    setWeights(reset)
  }

  async function handleValidate() {
    if (isSaving) return
    setIsSaving(true)
    setError(null)

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
      console.error('[ponderation] Erreur sauvegarde:', updateError)
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
        <Scale className="h-5 w-5 shrink-0 text-blue-300" />
        <div>
          <p className="text-base font-bold uppercase tracking-wide text-blue-300">
            Pondération du Robinet
          </p>
          <p className="text-xs text-slate-400">
            Ajuste l&apos;importance de chaque aspect dans ta tâche. Les autres
            s&apos;équilibrent tout seuls — le total reste à 100.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-2 text-sm text-green-200">
        <span className="font-semibold">Total : 100 / 100</span>
        <span className="text-xs">Équilibrage automatique</span>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {ROBINET_ASPECTS.map((aspect) => {
          const current = weights[aspect.weightKey] ?? 0
          return (
            <div
              key={aspect.weightKey}
              className="rounded-xl border border-white/10 bg-slate-900/60 p-4"
            >
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <h4 className="text-sm font-semibold text-white">
                  {aspect.label}
                </h4>
                <span className="text-2xl font-bold tabular-nums text-blue-400">
                  {current}
                </span>
              </div>
              <div className="px-1 pt-1">
                <Slider
                  value={[current]}
                  min={0}
                  max={100}
                  step={5}
                  hideThumbValue
                  onValueChange={(v) => handleChange(aspect.weightKey, v[0] ?? 0)}
                  className="w-full"
                  style={
                    {
                      '--slider-range-bg': 'rgb(96 165 250)',
                      '--slider-thumb-ring': 'rgb(96 165 250 / 0.2)',
                    } as React.CSSProperties
                  }
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleReset}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-700 disabled:opacity-60"
        >
          <RotateCcw className="h-4 w-4" />
          Égaliser
        </button>
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
          Valider
        </button>
      </div>
    </div>
  )
}

/**
 * Réajuste les poids pour que le total reste à 100 : la valeur modifiée est
 * fixée, le reste (100 - valeur) est réparti proportionnellement sur les autres
 * aspects. Arrondi entier avec correction du reliquat.
 */
function redistribute(
  weights: Record<string, number>,
  changedKey: string,
  rawValue: number
): Record<string, number> {
  const newValue = Math.max(0, Math.min(ROBINET_PONDERATION_TOTAL, rawValue))
  const others = WEIGHT_KEYS.filter((k) => k !== changedKey)
  const remaining = ROBINET_PONDERATION_TOTAL - newValue
  const othersSum = others.reduce((sum, k) => sum + (weights[k] ?? 0), 0)

  const result: Record<string, number> = { [changedKey]: newValue }
  if (othersSum <= 0) {
    const each = remaining / others.length
    for (const k of others) result[k] = each
  } else {
    for (const k of others) result[k] = remaining * ((weights[k] ?? 0) / othersSum)
  }

  return roundTo100(result, changedKey)
}

function roundTo100(
  values: Record<string, number>,
  fixedKey: string
): Record<string, number> {
  const rounded: Record<string, number> = {}
  for (const k of WEIGHT_KEYS) rounded[k] = Math.round(values[k] ?? 0)

  let diff = ROBINET_PONDERATION_TOTAL - WEIGHT_KEYS.reduce((s, k) => s + rounded[k], 0)
  if (diff !== 0) {
    const adjustable = WEIGHT_KEYS.filter((k) => k !== fixedKey).sort(
      (a, b) => rounded[b] - rounded[a]
    )
    const step = diff > 0 ? 1 : -1
    for (const k of adjustable) {
      if (diff === 0) break
      if (rounded[k] + step < 0) continue
      rounded[k] += step
      diff -= step
    }
    if (diff !== 0) rounded[fixedKey] = Math.max(0, rounded[fixedKey] + diff)
  }

  return rounded
}
