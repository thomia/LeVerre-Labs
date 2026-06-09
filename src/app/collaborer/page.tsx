/**
 * PAGE COLLABORER — « Là où nos disciplines se croisent »
 * Route : /collaborer
 *
 * Esprit : LeVerre Labs est un projet à l'intersection d'une dizaine
 * de disciplines (ergonomie, psychologie du travail, santé, design,
 * data…). Plutôt qu'une page « partenariats » classique avec des
 * cases corporate (académique / industriel / institutionnel), on
 * met en scène cette interdisciplinarité sous forme d'un radar 360°.
 *
 * Le visiteur scanne les domaines, reconnaît éventuellement le sien,
 * puis nous écrit. Sans filtre, sans formulaire, juste un mailto.
 */

'use client'

import { motion } from 'framer-motion'
import { RadarCompetences } from '@/components/ui/radar-competences'
import { MagnetizeLink } from '@/components/ui/magnetize-link'

/* ---------- Configuration ---------- */

// Email de contact unique du projet.
const EMAIL_CONTACT = 'leverrelabs@gmail.com'

/* ---------- Page ---------- */

export default function CollaborerPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
        {/* Halo rouge subtil en fond */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-20 h-[400px] w-[400px] -translate-x-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,30,90,0.15) 0%, transparent 70%)',
          }}
        />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
          >
            Là où nos disciplines
            <br />
            <span className="text-gray-400">se croisent.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg"
          >
            LeVerre Labs est un projet à l’intersection de nombreuses
            disciplines. Si le projet vous parle en tant
            que chercheur·euse, ergonome, RH, ingénieur·e ou institution,
            écrivons-nous.
          </motion.p>
        </div>
      </section>

      {/* Radar des disciplines : la pièce maîtresse de la page. */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <RadarCompetences />
        </motion.div>
      </section>

      {/* CTA contact — mailto via le bouton magnétique rouge. */}
      <section className="mx-auto max-w-3xl px-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-[0_0_18px_rgba(255,30,90,0.35)] sm:text-5xl lg:text-6xl">
            Une intersection vous parle ?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
            Un simple mail suffit, décrivez ce que vous aimeriez explorer, on vous répond.
          </p>

          <motion.div
            className="mt-12 flex justify-center"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MagnetizeLink
              href={`mailto:${EMAIL_CONTACT}?subject=Échange%20-%20LeVerre%20Labs`}
              className="border-2 border-[rgb(255,30,90)] px-10 py-5 text-lg font-semibold shadow-[0_0_40px_rgba(255,30,90,0.35)] hover:bg-[rgb(255,30,90)]/15 hover:shadow-[0_0_60px_rgba(255,30,90,0.6)]"
            >
              {EMAIL_CONTACT}
            </MagnetizeLink>
          </motion.div>
        </motion.div>
      </section>
    </main>
  )
}
