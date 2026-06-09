"use client"

/**
 * Panneau de sliders pour un élément composé exclusivement de questions
 * de type `scale` (curseurs 0-100).
 *
 * Utilisé principalement par l'élément ROBINET (version Sensibilisation)
 * avec 4 grands curseurs : charge, posture, charge mentale, RPS.
 *
 * UX :
 *   - Tous les sliders sont visibles en même temps sur mobile (scroll)
 *   - Sauvegarde auto debounced (400ms) pour ne pas spammer Supabase
 *   - Bouton "Terminer" pour passer en mode attente
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Slider from '@/components/ui/slider-number-flow'
import type { ElementDefinition, AnswersMap } from '@/lib/questions'
import { ELEMENT_THEME } from '@/lib/element-theme'
import type { ElementId } from '@/lib/supabase/types'

interface ParticipantSlidersPanelProps {
  participantId: string
  definition: ElementDefinition
  initialAnswers: AnswersMap
  onFinished: () => void
}

// Couleurs CSS pour le track/range du slider Radix (variables custom)
const SLIDER_CSS_VARS: Record<ElementId, { range: string; ring: string }> = {
  verre: { range: 'rgb(156 163 175)', ring: 'rgb(156 163 175 / 0.2)' },
  robinet: { range: 'rgb(96 165 250)', ring: 'rgb(96 165 250 / 0.2)' },
  bulle: { range: 'rgb(192 132 252)', ring: 'rgb(192 132 252 / 0.2)' },
  orage: { range: 'rgb(251 191 36)', ring: 'rgb(251 191 36 / 0.2)' },
  paille: { range: 'rgb(74 222 128)', ring: 'rgb(74 222 128 / 0.2)' },
}

// Classe du bouton "Terminer" selon l'élément (cohérent avec le reste)
const FINISH_BUTTON_CLASS: Record<ElementId, string> = {
  verre: 'bg-gray-400 hover:bg-gray-300 shadow-gray-500/30 text-gray-900',
  robinet: 'bg-blue-500 hover:bg-blue-400 shadow-blue-500/30 text-white',
  bulle: 'bg-purple-500 hover:bg-purple-400 shadow-purple-500/30 text-white',
  orage: 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/30 text-black',
  paille: 'bg-green-500 hover:bg-green-400 shadow-green-500/30 text-white',
}

const SAVE_DEBOUNCE_MS = 400

export function ParticipantSlidersPanel({
  participantId,
  definition,
  initialAnswers,
  onFinished,
}: ParticipantSlidersPanelProps) {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {}
    for (const q of definition.questions) {
      const raw = initialAnswers[q.id]
      init[q.id] = typeof raw === 'number' ? raw : 0
    }
    return init
  })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFinished, setIsFinished] = useState(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const saveToSupabase = useCallback(
    async (nextValues: Record<string, number>) => {
      setIsSaving(true)
      setError(null)

      const nextAnswers: AnswersMap = { ...initialAnswers, ...nextValues }
      const nextScore = definition.computeScore(nextAnswers)

      const supabase = createClient()

      const { data: current } = await supabase
        .from('participants')
        .select('scores, answers')
        .eq('id', participantId)
        .maybeSingle()

      const currentScores = (current?.scores ?? {}) as Record<string, number>
      const currentAnswers = (current?.answers ?? {}) as AnswersMap

      const mergedAnswers = { ...currentAnswers, ...nextValues }
      const mergedScores = { ...currentScores, [definition.id]: nextScore }

      const { error: updateError } = await supabase
        .from('participants')
        .update({ answers: mergedAnswers, scores: mergedScores })
        .eq('id', participantId)

      if (updateError) {
        console.error('[sliders] Erreur sauvegarde:', updateError)
        setError('Impossible de sauvegarder. On retente ?')
      }
      setIsSaving(false)
    },
    [definition, initialAnswers, participantId]
  )

  // Debounced save
  const scheduleSave = useCallback(
    (nextValues: Record<string, number>) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(() => {
        saveToSupabase(nextValues)
      }, SAVE_DEBOUNCE_MS)
    },
    [saveToSupabase]
  )

  // Cleanup timer au unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [])

  const handleChange = (questionId: string, newValue: number) => {
    setValues((prev) => {
      const next = { ...prev, [questionId]: newValue }
      scheduleSave(next)
      return next
    })
  }

  const handleFinish = async () => {
    // Flush le timer et force une sauvegarde immédiate
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    await saveToSupabase(values)
    setIsFinished(true)
    onFinished()
  }

  const theme = ELEMENT_THEME[definition.id]
  const sliderVars = SLIDER_CSS_VARS[definition.id]

  if (isFinished) {
    const finalScore = definition.computeScore({ ...initialAnswers, ...values })
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 p-6 text-center"
      >
        <CheckCircle2 className="h-10 w-10 text-green-400" />
        <h3 className="text-lg font-semibold text-white">
          <span className="uppercase tracking-wide">{theme.name}</span> terminé !
        </h3>
        <p className="text-sm text-slate-300">
          Score enregistré : <span className="tabular-nums font-semibold">{finalScore}/100</span>
        </p>
        <p className="text-xs text-slate-400">En attente du prochain élément...</p>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* En-tête : titre coloré + description + statut de sauvegarde */}
      <div className={`flex items-center gap-3 rounded-xl border p-3 ${theme.sectionClass}`}>
        <div className="flex-1">
          <p className={`text-base font-bold uppercase tracking-wide ${theme.titleClass}`}>
            {theme.name}
          </p>
          <p className="text-xs text-slate-400">{definition.description}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          {isSaving ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Sauvegarde…</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-3 w-3 text-green-400" />
              <span>Sauvegardé</span>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Liste des sliders */}
      <div className="flex flex-col gap-5">
        {definition.questions.map((q) => {
          const min = q.minValue ?? 0
          const max = q.maxValue ?? 100
          const current = values[q.id] ?? min
          return (
            <div
              key={q.id}
              className="rounded-xl border border-white/10 bg-slate-900/60 p-4"
            >
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    {q.question}
                  </h4>
                  {q.subtitle && (
                    <p className="text-[11px] text-slate-400">{q.subtitle}</p>
                  )}
                </div>
                <span className={`text-2xl font-bold tabular-nums ${theme.accentClass}`}>
                  {current}
                </span>
              </div>

              {/* Slider radix : on masque le NumberFlow au-dessus du pouce car
                  la valeur est déjà affichée à droite du titre (cf. plus haut). */}
              <div className="px-1 pt-1">
                <Slider
                  value={[current]}
                  min={min}
                  max={max}
                  step={1}
                  hideThumbValue
                  onValueChange={(v) => handleChange(q.id, v[0] ?? 0)}
                  className="w-full"
                  style={
                    {
                      '--slider-range-bg': sliderVars.range,
                      '--slider-thumb-ring': sliderVars.ring,
                    } as React.CSSProperties
                  }
                />
              </div>

              {/* Labels min/max */}
              <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-slate-500">
                <span>{q.minLabel ?? min}</span>
                <span>{q.maxLabel ?? max}</span>
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={handleFinish}
        disabled={isSaving}
        className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold uppercase tracking-wide shadow-lg transition disabled:opacity-60 ${FINISH_BUTTON_CLASS[definition.id]}`}
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}
        Terminer {theme.name}
      </button>
    </div>
  )
}
