'use client'

/**
 * Vue "Causes" : qu'est-ce qui provoque les sinistres ?
 *
 * Sections affichées (selon l'indicateur AT/TJ/MP) :
 *   - Déviation à l'origine (= geste/événement déclencheur)
 *   - Agent matériel impliqué
 *   - Activité physique au moment de l'accident  ← TOUTES lignes en glow rouge
 *   - Modalité de la blessure
 *
 * Si l'indicateur est MP : on affiche plutôt Profession + Durée d'exposition.
 */

import { motion } from 'framer-motion'
import type { StatsAnnee, Repartitions } from '@/data/stats-am/types'
import { getCtn } from '@/lib/stats-am'
import { CTN_INFO } from '@/lib/stats-am/constants'
import { useFiltresStats } from '@/lib/stats-am/use-filtres-stats'
import { ConsoleSectionRepartition } from './console-section-repartition'

interface ConsoleVueCausesProps {
  toutesAnnees: StatsAnnee[]
}

export function ConsoleVueCauses({ toutesAnnees }: ConsoleVueCausesProps) {
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

  /* Selection de la fiche selon l'indicateur (TMS rebascule sur MP). */
  const repartitions: Repartitions | undefined =
    indicateur === 'tj'
      ? ctnData.tj.repartitions
      : indicateur === 'mp' || indicateur === 'tms'
        ? ctnData.mp.repartitions
        : ctnData.at.repartitions

  const sousTitreCommun = `${CTN_INFO[ctn].libelleCourt} · ${annee} · ${indicateur.toUpperCase()}`

  return (
    <motion.div
      key={`causes-${annee}-${ctn}-${indicateur}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-2"
    >
      {indicateur === 'mp' || indicateur === 'tms' ? (
        <>
          <ConsoleSectionRepartition
            titre="Profession"
            sousTitre={sousTitreCommun}
            section="parProfession"
            lignes={repartitions?.parProfession}
            note="Catégories professionnelles publiées dans la fiche MP du PDF CNAM."
          />
          <ConsoleSectionRepartition
            titre="Durée d'exposition au risque"
            sousTitre={sousTitreCommun}
            section="parDureeExposition"
            lignes={repartitions?.parDureeExposition}
            note="Temps écoulé entre le début d'exposition et la déclaration de la maladie."
          />
        </>
      ) : (
        <>
          <ConsoleSectionRepartition
            titre="Déviation à l'origine"
            sousTitre={sousTitreCommun}
            section="parDeviation"
            lignes={repartitions?.parDeviation}
            note="« Mouvement du corps avec contrainte » = effort/posture qui déclenche le TMS."
          />
          <ConsoleSectionRepartition
            titre="Activité physique au moment du sinistre"
            sousTitre={sousTitreCommun}
            section="parActivitePhysique"
            lignes={repartitions?.parActivitePhysique}
            note="Toute la section signale une activité physique : glow rouge sur l'ensemble."
          />
          <ConsoleSectionRepartition
            titre="Agent matériel impliqué"
            sousTitre={sousTitreCommun}
            section="parAgentMaterielDeviation"
            lignes={repartitions?.parAgentMaterielDeviation}
            note="Objet, machine ou environnement qui a causé le sinistre."
          />
          <ConsoleSectionRepartition
            titre="Modalité de la blessure"
            sousTitre={sousTitreCommun}
            section="parModaliteBlessure"
            lignes={repartitions?.parModaliteBlessure}
            note="« Contrainte du corps » = TMS sans contact extérieur."
          />
        </>
      )}
    </motion.div>
  )
}
