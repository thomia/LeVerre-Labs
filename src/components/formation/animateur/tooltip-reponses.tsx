"use client"

/**
 * ReponsesTooltip — infobulle formateur sur le score d'un élément.
 *
 * Au survol du score d'un élément d'un participant, on affiche le détail de ses
 * réponses en clair (via `resumeReponses`). Fonctionne pour les 5 éléments :
 * QCM (option choisie), curseurs Robinet (valeur), et texte libre Orage (titres
 * des imprévus, regroupés par section).
 */

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { resumeReponses, type ResumeReponse } from '@/lib/questions'
import { ELEMENT_THEME } from '@/lib/element-theme'
import type { ElementId } from '@/lib/supabase/types'

interface ReponsesTooltipProps {
  element: ElementId
  answers: Record<string, unknown>
  children: React.ReactNode
}

export function ReponsesTooltip({ element, answers, children }: ReponsesTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const resume = resumeReponses(element, answers)
  const theme = ELEMENT_THEME[element]

  if (resume.length === 0) return <div className="flex">{children}</div>

  const groupes = groupBySection(resume)

  return (
    <div
      className="relative flex"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-80 max-w-[85vw] -translate-x-1/2 rounded-xl border border-white/15 bg-slate-950/95 p-3 text-left shadow-2xl backdrop-blur"
          >
            <p className={`mb-2 text-[10px] font-bold uppercase tracking-wider ${theme.titleClass}`}>
              {theme.name} — réponses
            </p>
            <div className="flex flex-col gap-2">
              {groupes.map((groupe, gIdx) => (
                <div key={gIdx} className={groupe.section ? 'border-l-2 border-white/15 pl-2' : ''}>
                  {groupe.section && (
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {groupe.section}
                    </p>
                  )}
                  {groupe.items.map((item, iIdx) => (
                    <div key={iIdx} className="py-1">
                      {/* Question en entier (pas de troncature), en gris discret… */}
                      <p className="text-[11px] font-normal leading-snug text-slate-500">
                        {item.label}
                      </p>
                      {/* …puis la réponse, bien plus contrastée (blanc, gras, plus grande). */}
                      <p className="text-sm font-bold leading-snug text-white">
                        {item.valeur}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface GroupeReponses {
  section?: string
  items: ResumeReponse[]
}

function groupBySection(resume: ResumeReponse[]): GroupeReponses[] {
  const groupes: GroupeReponses[] = []
  for (const item of resume) {
    const last = groupes[groupes.length - 1]
    if (last && last.section === item.section) {
      last.items.push(item)
    } else {
      groupes.push({ section: item.section, items: [item] })
    }
  }
  return groupes
}
