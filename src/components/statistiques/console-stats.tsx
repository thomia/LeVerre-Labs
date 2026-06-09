'use client'

/**
 * Container principal de la console `/statistiques`.
 *
 * Recoit les donnees deja chargees (Server Component cote page) et
 * orchestre :
 *   - barre de filtres sticky
 *   - 4 KPI cards
 *   - vue active (Synthese, Demographie, ...) selon l'URL
 *
 * C'est un client component (a cause des hooks nuqs + animations
 * framer-motion sur les transitions de vue).
 */

import { AnimatePresence } from 'framer-motion'
import type { StatsAnnee } from '@/data/stats-am/types'
import { CTN_INFO } from '@/lib/stats-am/constants'
import { useFiltresStats } from '@/lib/stats-am/use-filtres-stats'
import { ConsoleFiltres } from './console-filtres'
import { ConsoleKpiCards } from './console-kpi-cards'
import { ConsoleVueSynthese } from './console-vue-synthese'
import { ConsoleVueDemographie } from './console-vue-demographie'
import { ConsoleVueCauses } from './console-vue-causes'
import { ConsoleVueLesions } from './console-vue-lesions'
import { ConsoleVueEvolution } from './console-vue-evolution'
import { ConsoleVueComparaison } from './console-vue-comparaison'
import { ConsoleVueTms } from './console-vue-tms'

interface ConsoleStatsProps {
  toutesAnnees: StatsAnnee[]
}

export function ConsoleStats({ toutesAnnees }: ConsoleStatsProps) {
  const { vue, ctn, annee } = useFiltresStats()

  return (
    <div className="min-h-screen border-t border-white/10 bg-black">
      {/* En-tete contextuel : breadcrumb / titre dynamique.
          La navbar est deja degagee par <ConsoleIntro> au-dessus, donc
          on garde juste une respiration legere ici. */}
      <header className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          {CTN_INFO[ctn].libelle}{' '}
          <span className="text-gray-500">·</span>{' '}
          <span className="text-gray-400">{annee}</span>
        </h1>
      </header>

      <ConsoleFiltres />

      <ConsoleKpiCards toutesAnnees={toutesAnnees} />

      {/* Zone d'analyse : vue active. AnimatePresence garde la sortie
          d'une vue le temps que la suivante apparaisse (cross-fade). */}
      <main>
        <AnimatePresence mode="wait">
          {vue === 'synthese' && (
            <ConsoleVueSynthese key="synthese" toutesAnnees={toutesAnnees} />
          )}
          {vue === 'demographie' && (
            <ConsoleVueDemographie key="demographie" toutesAnnees={toutesAnnees} />
          )}
          {vue === 'causes' && (
            <ConsoleVueCauses key="causes" toutesAnnees={toutesAnnees} />
          )}
          {vue === 'lesions' && (
            <ConsoleVueLesions key="lesions" toutesAnnees={toutesAnnees} />
          )}
          {vue === 'evolution' && (
            <ConsoleVueEvolution key="evolution" toutesAnnees={toutesAnnees} />
          )}
          {vue === 'comparaison' && (
            <ConsoleVueComparaison key="comparaison" toutesAnnees={toutesAnnees} />
          )}
          {vue === 'tms' && (
            <ConsoleVueTms key="tms" toutesAnnees={toutesAnnees} />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
