"use client"

/**
 * Carte à deux faces pour lancer un élément depuis la barre formateur.
 *
 * - Face cachée : intitulé scientifique / physiologique (poster ModACT)
 * - Face révélée : nom de l'élément du modèle (Verre, Robinet…)
 *
 * Un clic lance le questionnaire ET retourne la carte. Une fois révélée,
 * la carte reste sur le nom du modèle jusqu'à reset de la session.
 */

import type { ElementId } from '@/lib/supabase/types'
import { ELEMENT_THEME } from '@/lib/element-theme'

interface CarteElementLancementProps {
  elementId: ElementId
  isRevealed: boolean
  isCurrent: boolean
  disabled: boolean
  onLaunch: () => void
}

const ACTIVE_FACE_CLASS: Record<ElementId, string> = {
  verre: 'bg-gray-600/60 text-white ring-2 ring-gray-300',
  robinet: 'bg-blue-600/60 text-white ring-2 ring-blue-300',
  bulle: 'bg-purple-600/60 text-white ring-2 ring-purple-300',
  orage: 'bg-amber-600/60 text-white ring-2 ring-amber-300',
  paille: 'bg-green-600/60 text-white ring-2 ring-green-300',
}

export function CarteElementLancement({
  elementId,
  isRevealed,
  isCurrent,
  disabled,
  onLaunch,
}: CarteElementLancementProps) {
  const theme = ELEMENT_THEME[elementId]

  return (
    <button
      type="button"
      onClick={onLaunch}
      disabled={disabled}
      title={
        isRevealed
          ? `Lancer ${theme.name}`
          : `Révéler ${theme.name} et lancer le questionnaire`
      }
      className="h-16 w-[11.5rem] shrink-0 [perspective:800px] disabled:cursor-not-allowed disabled:opacity-40"
    >
      <span
        className="relative block h-full w-full transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Face officielle (cachée) */}
        <span className="absolute inset-0 flex items-center justify-center rounded-lg border border-white/10 bg-slate-800 px-3 text-center text-sm font-semibold leading-snug text-slate-100 [backface-visibility:hidden]">
          {theme.officialName}
        </span>

        {/* Face modèle (révélée) */}
        <span
          className={`absolute inset-0 flex items-center justify-center rounded-lg px-3 text-base font-bold uppercase tracking-wide [backface-visibility:hidden] [transform:rotateY(180deg)] ${
            isCurrent
              ? ACTIVE_FACE_CLASS[elementId]
              : `bg-slate-800 ${theme.titleClass} hover:bg-slate-700`
          }`}
        >
          {theme.name}
        </span>
      </span>
    </button>
  )
}
