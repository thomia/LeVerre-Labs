"use client"

/**
 * Notation rapide d'un moment.
 *
 * Il s'ouvre dès qu'un moment est fermé (clic fin), sous le modèle et la barre
 * des 5 éléments : pendant qu'on note, on voit le verre réagir juste au-dessus.
 * Cinq lignes de critères maximum par élément — soit une dizaine de gestes pour
 * noter un moment complet, contre une quarantaine avec une checklist.
 */

import { Check, Trash2, X } from 'lucide-react'
import { ELEMENT_THEME } from '@/lib/element-theme'
import type { ElementId } from '@/lib/supabase/types'
import {
  CRITERES_PAR_ELEMENT,
  DIRECTION_ELEMENT,
  formateDuree,
  formateTemps,
  notationParDefaut,
  type MomentAnalyse,
  type NotationCritere,
} from '@/lib/analyse-rapide'
import { LigneCritere } from './ligne-critere'

interface PanneauNotationProps {
  moment: MomentAnalyse
  elementActif: ElementId
  onChange: (moment: MomentAnalyse) => void
  onSupprimer: () => void
  onFermer: () => void
}

export function PanneauNotation({
  moment,
  elementActif,
  onChange,
  onSupprimer,
  onFermer,
}: PanneauNotationProps) {
  const theme = ELEMENT_THEME[elementActif]

  function majNotation(critereId: string, notation: NotationCritere) {
    onChange({ ...moment, notations: { ...moment.notations, [critereId]: notation } })
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col rounded-2xl border border-white/10 bg-slate-950/70 backdrop-blur">
      <header className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
        <input
          value={moment.nom}
          onChange={(event) => onChange({ ...moment, nom: event.target.value })}
          className="min-w-0 flex-1 rounded-lg border border-transparent bg-white/5 px-2 py-1.5 text-sm font-semibold text-white outline-none transition-colors focus:border-white/20 focus:bg-white/10"
          placeholder="Nom du moment"
        />
        <span className="shrink-0 text-[11px] tabular-nums text-white/35">
          {formateTemps(moment.debut)} → {formateTemps(moment.fin)} ·{' '}
          {formateDuree(moment.fin - moment.debut)}
        </span>
        <button
          type="button"
          onClick={onSupprimer}
          title="Supprimer ce moment"
          className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-red-500/15 hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onFermer}
          title="Fermer (Échap)"
          className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-2">
        <p className="text-[11px] leading-snug text-white/35">
          <span style={{ color: theme.color }}>{theme.officialName}</span> — le{' '}
          <span className="text-white/60">curseur</span> dit ce que tu observes (0 rien à signaler →
          100 le pire), les <span className="text-white/60">carrés</span> disent combien ce critère
          compte dans le score de l&apos;élément.
          {DIRECTION_ELEMENT[elementActif] === 'positive' && ' Ici, score élevé = favorable.'}
        </p>

        {CRITERES_PAR_ELEMENT[elementActif].map((critere) => (
          <LigneCritere
            key={critere.id}
            critere={critere}
            couleur={theme.color}
            notation={moment.notations[critere.id] ?? notationParDefaut(critere)}
            onChange={(notation) => majNotation(critere.id, notation)}
          />
        ))}

        <textarea
          value={moment.commentaire}
          onChange={(event) => onChange({ ...moment, commentaire: event.target.value })}
          placeholder="Justification, mesure citée, zone anatomique concernée…"
          rows={2}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-[12px] text-white/80 outline-none transition-colors placeholder:text-white/25 focus:border-white/25"
        />
      </div>

      <footer className="border-t border-white/10 p-2">
        <button
          type="button"
          onClick={onFermer}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[rgb(255,30,90)] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[rgb(255,60,120)]"
        >
          <Check className="h-4 w-4" />
          Valider et reprendre la lecture
        </button>
      </footer>
    </section>
  )
}
