'use client'

/**
 * Intro contextuelle de la page `/statistiques`, affichee au-dessus de la
 * console interactive.
 *
 * Objectif : donner du sens aux chiffres avant de plonger dans l'outil.
 *   - d'ou viennent les donnees (source officielle CNAM),
 *   - le travail de mise en lisibilite fait par LeVerre Labs,
 *   - l'angle produit : permettre a une entreprise de se situer face a
 *     un large panel.
 *
 * Style aligne sur le reste du site (fond sombre, accent rose de marque,
 * barre decorative degradee, cartes arrondies).
 */

import { motion } from 'framer-motion'
import { Database, Layers, Target } from 'lucide-react'

export function ConsoleIntro() {
  return (
    <section className="relative overflow-hidden bg-black">
      {/* Halo rouge diffus en fond, coherent avec le glow des cartes TMS */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(255,30,90,0.35) 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-28 pb-12 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto max-w-4xl text-center"
        >
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            La sinistralité au travail en France
          </h1>

          {/* Barre decorative degradee (motif recurrent du site) */}
          <div className="relative mx-auto mt-6 h-0.5 w-72 max-w-full">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'linear-gradient(to right, transparent 0%, rgb(255,30,90) 50%, transparent 100%)',
              }}
            />
          </div>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-gray-400 sm:text-lg">
            Chaque année, l&apos;Assurance Maladie publie les statistiques sur les accidents et maladies professionnelles. 
            Vous pouvez les consulter sur cette page de manière claire et explorable, pour que chacun puisse étudier les données et les comparer.
          </p>
        </motion.div>

        {/* 3 reperes de contexte */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {POINTS.map((point) => (
            <CarteRepere key={point.titre} {...point} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ---------- Sous-composants ---------- */

interface RepereData {
  icon: typeof Database
  titre: string
  texte: string
}

function CarteRepere({ icon: Icon, titre, texte }: RepereData) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 text-center transition-colors hover:border-white/20">
      <div className="mb-2 flex items-center justify-center gap-2">
        <span className="inline-flex rounded-lg bg-[rgb(255,30,90)]/10 p-1.5">
          <Icon className="h-5 w-5 text-[rgb(255,30,90)]" strokeWidth={2} />
        </span>
        <h2 className="text-sm font-semibold text-white">{titre}</h2>
      </div>
      <p className="text-sm leading-relaxed text-gray-400">{texte}</p>
    </div>
  )
}

/* ---------- Contenu statique ---------- */

const POINTS: RepereData[] = [
  {
    icon: Database,
    titre: 'Source officielle',
    texte:
      'Données de l’Assurance Maladie, Risques professionnels (CNAM), de 2015 à 2024.',
  },
  {
    icon: Layers,
    titre: 'Un panel large',
    texte:
      '9 grands secteurs d’activité (CTN) et la France entière, comme point de comparaison représentatif.',
  },
  {
    icon: Target,
    titre: 'Comparer',
    texte:
      'Mettez en regard les secteurs d’activité et les années pour analyser les écarts et les tendances.',
  },
]
