"use client"

/**
 * Panneau de notation rapide d'un moment.
 *
 * Il s'ouvre dès qu'un moment est fermé (clic fin) et reste en colonne, entre
 * la vidéo et le verre : pendant qu'on note, on voit toujours l'image ET le
 * modèle réagir. Un onglet par élément, cinq lignes de critères maximum par
 * onglet — soit dix gestes environ pour noter un moment complet, contre une
 * quarantaine avec une checklist.
 */

import { useState } from 'react'
import { Check, Trash2, X } from 'lucide-react'
import { ELEMENT_THEME } from '@/lib/element-theme'
import type { ElementId } from '@/lib/supabase/types'
import {
  CRITERES_PAR_ELEMENT,
  ORDRE_NOTATION,
  formateDuree,
  formateTemps,
  scoresDuMoment,
  type MomentAnalyse,
  type NotationCritere,
} from '@/lib/analyse-rapide'
import { LigneCritere } from './ligne-critere'

interface PanneauNotationProps {
  moment: MomentAnalyse
  onChange: (moment: MomentAnalyse) => void
  onSupprimer: () => void
  onFermer: () => void
}

export function PanneauNotation({ moment, onChange, onSupprimer, onFermer }: PanneauNotationProps) {
  const [elementActif, setElementActif] = useState<ElementId>('robinet')

  const scores = scoresDuMoment(moment.notations)
  const theme = ELEMENT_THEME[elementActif]

  function majNotation(critereId: string, notation: NotationCritere) {
    onChange({ ...moment, notations: { ...moment.notations, [critereId]: notation } })
  }

  return (
    <section className="flex h-full min-h-0 flex-col rounded-2xl border border-white/10 bg-slate-950/70 backdrop-blur">
      <header className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
        <input
          value={moment.nom}
          onChange={(event) => onChange({ ...moment, nom: event.target.value })}
          className="min-w-0 flex-1 rounded-lg border border-transparent bg-white/5 px-2 py-1.5 text-sm font-semibold text-white outline-none transition-colors focus:border-white/20 focus:bg-white/10"
          placeholder="Nom du moment"
        />
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

      <div className="flex items-center justify-between px-3 py-1.5 text-[11px] text-white/40">
        <span className="tabular-nums">
          {formateTemps(moment.debut, true)} → {formateTemps(moment.fin, true)}
        </span>
        <span>{formateDuree(moment.fin - moment.debut)}</span>
      </div>

      <nav className="flex gap-1 px-2 pb-2">
        {ORDRE_NOTATION.map((element) => {
          const isActif = element === elementActif
          const themeElement = ELEMENT_THEME[element]

          return (
            <button
              key={element}
              type="button"
              onClick={() => setElementActif(element)}
              className="flex-1 rounded-lg border px-1 py-1.5 transition-all duration-150"
              style={{
                borderColor: isActif ? themeElement.color : 'rgba(255,255,255,0.08)',
                backgroundColor: isActif ? `${themeElement.color}1f` : 'transparent',
              }}
            >
              <span
                className="block truncate text-[10px] font-medium uppercase tracking-wide"
                style={{ color: isActif ? themeElement.color : 'rgba(255,255,255,0.45)' }}
              >
                {themeElement.name}
              </span>
              <span
                className="block text-sm font-bold tabular-nums"
                style={{ color: isActif ? themeElement.color : 'rgba(255,255,255,0.7)' }}
              >
                {scores[element]}
              </span>
            </button>
          )
        })}
      </nav>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 pb-3">
        <p className="text-[11px] leading-snug text-white/35">
          <span style={{ color: theme.color }}>{theme.officialName}</span> — curseur à 0 = rien à signaler,
          100 = le pire observable. Les 4 cases règlent le poids du critère dans le score {theme.name}.
        </p>

        {CRITERES_PAR_ELEMENT[elementActif].map((critere) => (
          <LigneCritere
            key={critere.id}
            critere={critere}
            couleur={theme.color}
            notation={moment.notations[critere.id] ?? { gravite: 0, niveauPoids: critere.niveauPoidsDefaut }}
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
