"use client"

/**
 * OrageScoreTooltip — infobulle formateur sur le score Orage.
 *
 * Au survol du score Orage d'un participant, on affiche le détail des 2
 * imprévus qu'il a nommés (titre libre + fréquence + impact). Les titres sont
 * saisis côté participant (questions de type `text` de l'élément Orage).
 */

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getOrageImprevus } from '@/lib/questions/orage'

interface OrageScoreTooltipProps {
  answers: Record<string, unknown>
  children: React.ReactNode
}

export function OrageScoreTooltip({ answers, children }: OrageScoreTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const imprevus = getOrageImprevus(answers)
  const hasContent = imprevus.some((i) => i.titre || i.frequence || i.impact)

  return (
    <div
      className="relative flex"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}

      <AnimatePresence>
        {isOpen && hasContent && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded-xl border border-amber-400/30 bg-slate-950/95 p-3 text-left shadow-2xl backdrop-blur"
          >
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-amber-300">
              Imprévus nommés
            </p>
            <div className="flex flex-col gap-2">
              {imprevus.map((imprevu, idx) => (
                <div key={idx} className="border-l-2 border-amber-400/40 pl-2">
                  <p className="truncate text-xs font-semibold text-white">
                    {imprevu.titre ?? `Imprévu ${idx + 1}`}
                  </p>
                  {(imprevu.frequence || imprevu.impact) && (
                    <p className="text-[10px] leading-snug text-slate-400">
                      {[imprevu.frequence, imprevu.impact]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
