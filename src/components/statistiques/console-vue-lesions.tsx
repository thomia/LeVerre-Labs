'use client'

/**
 * Vue "Lésions" : siège et nature des blessures.
 *
 * 2 sections principales :
 *   - Siège des lésions (membres sup, dos, ...)  ← glow rouge sur dos+sup
 *   - Nature des lésions (entorses, traumatismes internes...)  ← glow rouge sur entorses+trauma
 *
 * Si l'indicateur sélectionné est MP/TMS : on ne montre rien (les MP
 * n'ont pas de section "lésion" dans le PDF AM, ce sont des pathologies
 * chroniques).
 */

import { motion } from 'framer-motion'
import type { StatsAnnee, Repartitions } from '@/data/stats-am/types'
import { getCtn } from '@/lib/stats-am'
import { CTN_INFO } from '@/lib/stats-am/constants'
import { useFiltresStats } from '@/lib/stats-am/use-filtres-stats'
import { ConsoleSectionRepartition } from './console-section-repartition'

interface ConsoleVueLesionsProps {
  toutesAnnees: StatsAnnee[]
}

export function ConsoleVueLesions({ toutesAnnees }: ConsoleVueLesionsProps) {
  const { annee, ctn, indicateur } = useFiltresStats()
  const anneeData = toutesAnnees.find((a) => a.annee === annee)
  const ctnData = anneeData ? getCtn(anneeData, ctn) : null

  if (!ctnData) {
    return (
      <p className="mx-auto max-w-md py-16 text-center text-sm text-gray-500">
        Pas de données pour {CTN_INFO[ctn].libelleCourt} en {annee}.
      </p>
    )
  }

  if (indicateur === 'mp' || indicateur === 'tms') {
    return (
      <motion.div
        key="lesions-mp"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6"
      >
        <h2 className="mb-3 text-xl font-semibold text-white">
          Pas de section « lésion » pour les MP
        </h2>
        <p className="text-sm text-gray-400">
          Les Maladies Professionnelles sont des pathologies chroniques (TMS,
          surdité, asthme, cancers...). Pour explorer leurs causes, va sur
          l'onglet <span className="text-white">Causes</span> ou{' '}
          <span className="text-white">Focus TMS</span>. Repasse l'indicateur
          sur <span className="text-white">AT</span> ou{' '}
          <span className="text-white">TJ</span> pour voir les lésions.
        </p>
      </motion.div>
    )
  }

  const repartitions: Repartitions | undefined =
    indicateur === 'tj' ? ctnData.tj.repartitions : ctnData.at.repartitions

  const sousTitreCommun = `${CTN_INFO[ctn].libelleCourt} · ${annee} · ${indicateur.toUpperCase()}`

  return (
    <motion.div
      key={`lesions-${annee}-${ctn}-${indicateur}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-2"
    >
      <ConsoleSectionRepartition
        titre="Siège des lésions"
        sousTitre={sousTitreCommun}
        section="parSiegeLesions"
        lignes={repartitions?.parSiegeLesions}
        note="Membres supérieurs et dos en glow rouge : zones touchées par les TMS."
      />
      <ConsoleSectionRepartition
        titre="Nature des lésions"
        sousTitre={sousTitreCommun}
        section="parNatureLesions"
        lignes={repartitions?.parNatureLesions}
        note="Entorses, foulures et traumatismes internes : marqueurs d'effort physique."
      />
    </motion.div>
  )
}
