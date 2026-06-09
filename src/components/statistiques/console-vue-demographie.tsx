'use client'

/**
 * Vue "Démographie" : qui sont les personnes touchées ?
 *
 * 4 sections :
 *   - Tranche d'âge
 *   - Sexe
 *   - Qualification (AT/TJ uniquement) ou Profession (MP)
 *   - Type de lieu (AT uniquement)
 */

import { motion } from 'framer-motion'
import type { StatsAnnee, Repartitions } from '@/data/stats-am/types'
import { getCtn } from '@/lib/stats-am'
import { CTN_INFO } from '@/lib/stats-am/constants'
import { useFiltresStats } from '@/lib/stats-am/use-filtres-stats'
import { ConsoleSectionRepartition } from './console-section-repartition'

interface ConsoleVueDemographieProps {
  toutesAnnees: StatsAnnee[]
}

export function ConsoleVueDemographie({
  toutesAnnees,
}: ConsoleVueDemographieProps) {
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

  const repartitions: Repartitions | undefined =
    indicateur === 'tj'
      ? ctnData.tj.repartitions
      : indicateur === 'mp' || indicateur === 'tms'
        ? ctnData.mp.repartitions
        : ctnData.at.repartitions

  const sousTitreCommun = `${CTN_INFO[ctn].libelleCourt} · ${annee} · ${indicateur.toUpperCase()}`
  const estMp = indicateur === 'mp' || indicateur === 'tms'

  return (
    <motion.div
      key={`demo-${annee}-${ctn}-${indicateur}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-2"
    >
      <ConsoleSectionRepartition
        titre="Tranche d'âge"
        sousTitre={sousTitreCommun}
        section="parAge"
        lignes={repartitions?.parAge}
        note="Distribution par tranche d'âge des salariés concernés."
      />
      <ConsoleSectionRepartition
        titre="Sexe"
        sousTitre={sousTitreCommun}
        section="parSexe"
        lignes={repartitions?.parSexe}
        note="Hommes / femmes parmi les sinistres déclarés."
      />
      {estMp ? (
        <ConsoleSectionRepartition
          titre="Profession"
          sousTitre={sousTitreCommun}
          section="parProfession"
          lignes={repartitions?.parProfession}
          note="Catégorie professionnelle (publiée pour les MP)."
        />
      ) : (
        <ConsoleSectionRepartition
          titre="Qualification"
          sousTitre={sousTitreCommun}
          section="parQualification"
          lignes={repartitions?.parQualification}
          note="Niveau de qualification au moment du sinistre."
        />
      )}
      {/* Type de lieu : uniquement présent pour les AT */}
      {indicateur === 'at' && (
        <ConsoleSectionRepartition
          titre="Type de lieu"
          sousTitre={sousTitreCommun}
          section="parTypeLieu"
          lignes={repartitions?.parTypeLieu}
          note="Site industriel, chantier, bureau, etc."
        />
      )}
    </motion.div>
  )
}
