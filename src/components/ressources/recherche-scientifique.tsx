"use client"

/**
 * Page "Recherche scientifique" (rubrique Ressources).
 *
 * Petit titre + texte de presentation (LeVerre Labs se remet en question
 * et evolue a travers des travaux academiques) puis la vignette du poster
 * ModACT 2026, reprise telle quelle de la page Fondements.
 */

import { motion } from 'framer-motion'
import { Award, MoreHorizontal } from 'lucide-react'
import { MagnetizeFrame } from '@/components/ui/magnetize-frame'

export function RechercheScientifique() {
  return (
    <div className="min-h-screen bg-black pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center"
        >
          {/* Barre decorative degradee (motif recurrent du site) */}
          <div className="relative mx-auto mb-10 h-0.5 w-72 max-w-full">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'linear-gradient(to right, transparent 0%, rgb(255,30,90) 50%, transparent 100%)',
              }}
            />
          </div>

          <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl">
            Recherche scientifique
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg font-light leading-relaxed text-slate-300">
            LeVerre Labs se remet en question et évolue à travers des travaux
            académiques, des conférences et des recherches. Une démarche pensée
            pour être partagée et confrontée à l&apos;expertise du terrain comme
            de la science.
          </p>
        </motion.div>

        {/* Bloc poster ModACT 2026 (repris de la page Fondements) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="mt-16 text-center"
        >
          <p className="text-base font-light leading-relaxed text-slate-400">
            Présenté lors de{' '}
            <a
              href="https://www.modact.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
            >
              ModACT 2026
            </a>
            , conférence scientifique réunissant des expertises variées autour de
            la modélisation de l’activité humaine.
          </p>

          <MagnetizeFrame className="mx-auto mt-10 w-full max-w-xs" particleCount={20} spread={220}>
            <motion.a
              href="https://popups.uliege.be/3041-4687/index.php?id=626"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              className="group relative block cursor-pointer"
            >
              {/* Pastille ronde rouge signalant la distinction. */}
              <div
                className="absolute -top-3 -right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[rgb(255,30,90)] text-white"
                style={{ boxShadow: '0 4px 14px rgba(255,30,90,0.45)' }}
                title="Meilleur poster scientifique, ModACT 2026"
              >
                <Award className="h-4 w-4" strokeWidth={2.2} />
              </div>

              <div
                className="relative overflow-hidden rounded-md border border-white/15 transition-all duration-300 group-hover:border-[rgb(255,30,90)]/50"
                style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)' }}
              >
                <img
                  src="/photo%20video/poster.JPG"
                  alt="Poster scientifique LeVerre Labs présenté à ModACT 2026"
                  className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[rgb(255,30,90)]/0 transition-colors duration-300 group-hover:bg-[rgb(255,30,90)]/10" />
              </div>
            </motion.a>
          </MagnetizeFrame>
        </motion.div>

        {/* Teaser : laisse entendre que la rubrique va s'enrichir. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-20 flex flex-col items-center gap-3 text-center"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
            <MoreHorizontal className="h-5 w-5 text-[rgb(255,30,90)]" />
          </span>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">À suivre</p>
          <p className="max-w-md text-sm leading-relaxed text-slate-400">
            D&apos;autres travaux, publications et collaborations viendront
            enrichir cette page au fil de nos recherches.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
