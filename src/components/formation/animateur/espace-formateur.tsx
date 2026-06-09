"use client"

/**
 * Espace formateur : zone privée regroupant les outils de l'animateur.
 * Deux onglets pour l'instant (sensibilisation collective + analyse vidéo),
 * navigables et persistés dans l'URL via `nuqs` (?onglet=...).
 * Le style des onglets reprend celui de la navbar du site vitrine.
 */

import { useQueryState, parseAsStringLiteral } from 'nuqs'
import { motion } from 'framer-motion'
import { LanceurSession } from '@/components/formation/animateur/lanceur-session'
import VideoTaskEditor from '@/components/analyse-video/video-task-editor'

const ONGLETS = ['sensibilisation', 'analyse-video'] as const
type Onglet = (typeof ONGLETS)[number]

const LABELS: Record<Onglet, string> = {
  sensibilisation: 'Sensibilisation',
  'analyse-video': 'Analyse Vidéo',
}

export function EspaceFormateur() {
  const [onglet, setOnglet] = useQueryState(
    'onglet',
    parseAsStringLiteral(ONGLETS).withDefault('sensibilisation')
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 pt-20">
      <BarreOnglets onglet={onglet} onChange={setOnglet} />

      <main className="container mx-auto">
        {onglet === 'sensibilisation' ? <LanceurSession /> : <VideoTaskEditor />}
      </main>
    </div>
  )
}

interface BarreOngletsProps {
  onglet: Onglet
  onChange: (onglet: Onglet) => void
}

function BarreOnglets({ onglet, onChange }: BarreOngletsProps) {
  return (
    <div className="flex justify-center border-b border-white/10">
      <div className="flex items-center gap-1">
        {ONGLETS.map((value) => {
          const isActive = onglet === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange(value)}
              className="relative px-4 py-3 group"
            >
              <span
                className={`text-sm font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`}
              >
                {LABELS[value]}
              </span>
              {isActive && (
                <motion.div
                  layoutId="espace-formateur-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[rgb(255,30,90)] to-transparent"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
