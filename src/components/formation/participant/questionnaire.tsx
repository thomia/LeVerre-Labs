"use client"

/**
 * Questionnaire participant - une question à la fois (mobile-first).
 *
 * Flow :
 *   1) Charge les réponses actuelles du participant (fetch initial)
 *   2) Affiche les questions de l'élément courant une par une
 *   3) À chaque réponse, recalcule le score et UPDATE Supabase
 *   4) Quand toutes les questions sont répondues, affiche un écran "Terminé"
 */

import { useEffect, useMemo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, CheckCircle2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getElementDefinition } from '@/lib/questions'
import type {
  AnswersMap,
  Question,
  QuestionOption,
} from '@/lib/questions'
import type { ElementId } from '@/lib/supabase/types'
import { ELEMENT_THEME } from '@/lib/element-theme'
import { ParticipantSlidersPanel } from './panneau-curseurs'

interface ParticipantQuestionnaireProps {
  participantId: string
  element: ElementId
  /**
   * Callback appelé quand le participant a terminé son questionnaire pour
   * cet élément (toutes les questions répondues OU clic sur "Terminer" pour
   * le mode sliders). Le parent peut alors révéler le chip du score.
   */
  onFinished?: () => void
}

export function ParticipantQuestionnaire({
  participantId,
  element,
  onFinished,
}: ParticipantQuestionnaireProps) {
  const definition = useMemo(() => getElementDefinition(element), [element])
  const theme = ELEMENT_THEME[element]

  const [answers, setAnswers] = useState<AnswersMap>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Charge les réponses existantes au mount et à chaque changement d'élément
  useEffect(() => {
    let isMounted = true
    const supabase = createClient()

    async function loadAnswers() {
      setIsLoading(true)
      const { data, error: fetchError } = await supabase
        .from('participants')
        .select('answers')
        .eq('id', participantId)
        .maybeSingle()

      if (!isMounted) return

      if (fetchError) {
        console.error('[questionnaire] Erreur fetch answers:', fetchError)
        setError('Impossible de charger tes réponses')
      } else if (data) {
        const loaded = (data.answers ?? {}) as AnswersMap
        setAnswers(loaded)

        // Positionne sur la première question non répondue
        const firstUnanswered = definition.questions.findIndex(
          (q) => loaded[q.id] === undefined
        )
        setCurrentIndex(firstUnanswered === -1 ? definition.questions.length : firstUnanswered)
      }
      setIsLoading(false)
    }

    loadAnswers()
    return () => {
      isMounted = false
    }
  }, [participantId, element, definition.questions])

  // Sauvegarde une réponse en BDD + recalcule le score
  const saveAnswer = useCallback(
    async (question: Question, value: number) => {
      setIsSaving(true)
      setError(null)

      const nextAnswers: AnswersMap = { ...answers, [question.id]: value }
      const nextScore = definition.computeScore(nextAnswers)

      const supabase = createClient()

      // Fetch les scores courants pour merger proprement
      const { data: current } = await supabase
        .from('participants')
        .select('scores')
        .eq('id', participantId)
        .maybeSingle()

      const currentScores = (current?.scores ?? {}) as Record<string, number>
      const nextScores = { ...currentScores, [element]: nextScore }

      const { error: updateError } = await supabase
        .from('participants')
        .update({ answers: nextAnswers, scores: nextScores })
        .eq('id', participantId)

      if (updateError) {
        console.error('[questionnaire] Erreur sauvegarde:', updateError)
        setError("Impossible de sauvegarder. On retente ?")
        setIsSaving(false)
        return
      }

      setAnswers(nextAnswers)
      setIsSaving(false)

      // Passe à la question suivante automatiquement
      setCurrentIndex((prev) => prev + 1)
    },
    [answers, definition, element, participantId]
  )

  // Calculs dérivés (à faire AVANT tout early return pour respecter
  // les Rules of Hooks - le useEffect ci-dessous doit être appelé sur
  // tous les chemins de rendu, sinon React détecte un changement
  // d'ordre des hooks entre deux renders).
  const total = definition.questions.length
  const isFinished = currentIndex >= total
  const allScale = definition.questions.every((q) => q.type === 'scale')

  // Remonte au parent dès que l'utilisateur arrive sur l'écran "Terminé"
  // (mode question-par-question). Le parent peut alors révéler le chip du
  // score sous le modèle. Le `useEffect` se déclenche à chaque passage
  // false→true ; cette redondance est sans impact (le parent set un boolean).
  // IMPORTANT : ce hook DOIT être appelé avant les `return` conditionnels
  // ci-dessous, sinon le nombre de hooks varie d'un render à l'autre.
  useEffect(() => {
    if (isFinished && !allScale) onFinished?.()
  }, [isFinished, allScale, onFinished])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    )
  }

  // Si TOUTES les questions de l'élément sont des sliders (type 'scale'),
  // on bascule sur le panneau multi-sliders (cas Robinet - version Sensibilisation).
  if (allScale) {
    return (
      <ParticipantSlidersPanel
        participantId={participantId}
        definition={definition}
        initialAnswers={answers}
        onFinished={() => {
          // Bascule l'UI interne en écran "Terminé" + remonte au parent
          // (ParticipantView) pour qu'il révèle le chip du score sous le modèle.
          onFinished?.()
        }}
      />
    )
  }

  const currentQuestion = isFinished ? null : definition.questions[currentIndex]
  const answeredCount = definition.questions.filter(
    (q) => answers[q.id] !== undefined
  ).length

  return (
    <div className="flex w-full flex-col gap-4">
      {/* En-tête : titre coloré + description + progression */}
      <div className={`flex items-center gap-3 rounded-xl border p-3 ${theme.sectionClass}`}>
        <div className="flex-1">
          <p className={`text-base font-bold uppercase tracking-wide ${theme.titleClass}`}>
            {theme.name}
          </p>
          <p className="text-xs text-slate-400">{definition.description}</p>
        </div>
        <div className="text-right">
          <p className={`text-sm font-semibold ${theme.titleClass}`}>
            {answeredCount}/{total}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            questions
          </p>
        </div>
      </div>

      {/* Barre de progression (couleur de l'élément) */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <motion.div
          className={`h-full ${PROGRESS_BAR[element]}`}
          initial={false}
          animate={{ width: `${(answeredCount / total) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {isFinished ? (
          <FinishedCard
            key="finished"
            elementName={definition.name}
            score={definition.computeScore(answers)}
            onReview={() => setCurrentIndex(total - 1)}
          />
        ) : currentQuestion ? (
          <QuestionCard
            key={`${element}-${currentQuestion.id}-${currentIndex}`}
            question={currentQuestion}
            currentValue={answers[currentQuestion.id]}
            isSaving={isSaving}
            onAnswer={(option) => saveAnswer(currentQuestion, option.points)}
            onPrevious={currentIndex > 0 ? () => setCurrentIndex(currentIndex - 1) : null}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sous-composants
// ---------------------------------------------------------------------------

interface QuestionCardProps {
  question: Question
  currentValue: number | number[] | undefined
  isSaving: boolean
  onAnswer: (option: QuestionOption) => void
  onPrevious: (() => void) | null
}

function QuestionCard({
  question,
  currentValue,
  isSaving,
  onAnswer,
  onPrevious,
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-3"
    >
      {question.section && (
        <span className="inline-flex w-fit items-center rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {question.section}
        </span>
      )}

      <h3 className="text-base font-semibold text-white">{question.question}</h3>

      {question.subtitle && (
        <p className="-mt-2 text-xs text-slate-400">{question.subtitle}</p>
      )}

      <div className="flex flex-col gap-2">
        {question.options?.map((option, idx) => {
          const isSelected = currentValue === option.points
          return (
            <button
              key={`${question.id}-${idx}`}
              onClick={() => !isSaving && onAnswer(option)}
              disabled={isSaving}
              className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/20 text-white shadow-lg shadow-blue-500/20'
                  : 'border-white/10 bg-slate-900/60 text-slate-200 hover:border-white/30 hover:bg-slate-800/80'
              } disabled:cursor-wait disabled:opacity-60`}
            >
              <span className="flex-1">{option.label}</span>
              {isSelected && isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isSelected ? (
                <CheckCircle2 className="h-4 w-4 text-blue-300" />
              ) : null}
            </button>
          )
        })}
      </div>

      {onPrevious && (
        <button
          onClick={onPrevious}
          disabled={isSaving}
          className="mt-2 flex items-center gap-1 self-start text-xs text-slate-400 hover:text-white disabled:opacity-50"
        >
          <ChevronLeft className="h-3 w-3" />
          Question précédente
        </button>
      )}
    </motion.div>
  )
}

function FinishedCard({
  elementName,
  score,
  onReview,
}: {
  elementName: string
  score: number
  onReview: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 p-6 text-center"
    >
      <CheckCircle2 className="h-10 w-10 text-green-400" />
      <h3 className="text-lg font-semibold text-white">
        <span className="uppercase tracking-wide">{elementName}</span> terminé !
      </h3>
      <p className="text-sm text-slate-300">
        Score enregistré : <span className="tabular-nums font-semibold">{score}/100</span>
      </p>
      <p className="text-xs text-slate-400">
        En attente du prochain élément...
      </p>
      <button
        onClick={onReview}
        className="mt-1 text-xs text-slate-400 underline hover:text-white"
      >
        Revoir ma dernière réponse
      </button>
    </motion.div>
  )
}

// Couleurs plein-tons pour la barre de progression (par élément)
const PROGRESS_BAR: Record<ElementId, string> = {
  verre: 'bg-gray-400',
  robinet: 'bg-blue-500',
  bulle: 'bg-purple-500',
  orage: 'bg-amber-500',
  paille: 'bg-green-500',
}
