'use client'

/**
 * Vue "Synthese" : presente les chiffres cles du CTN/annee selectionne
 * + la repartition des AT par risque (= ou la manutention manuelle
 * apparait comme principal facteur d'activite physique).
 *
 * Layout : 2 colonnes desktop (1 colonne mobile)
 *   Gauche  : bar chart horizontal "Repartition AT par risque"
 *             (glow rouge sur "Manutention manuelle")
 *   Droite  : top MP avec leurs codes tableau (glow rouge sur 057A, 098A)
 */

import { motion } from 'framer-motion'
import type { StatsAnnee } from '@/data/stats-am/types'
import { formaterNombre, formaterPourcent, getCtn } from '@/lib/stats-am'
import { CTN_INFO } from '@/lib/stats-am/constants'
import {
  COULEUR_RISQUE_PHYSIQUE,
  estCodeMpTms,
  estRisquePhysique,
} from '@/lib/stats-am/glow'
import { useFiltresStats } from '@/lib/stats-am/use-filtres-stats'
import { CarteAnalyse } from './console-carte-analyse'
import { BarHorizontale } from './console-bar-horizontale'

interface ConsoleVueSyntheseProps {
  toutesAnnees: StatsAnnee[]
}

export function ConsoleVueSynthese({ toutesAnnees }: ConsoleVueSyntheseProps) {
  const { annee, ctn } = useFiltresStats()
  const anneeData = toutesAnnees.find((a) => a.annee === annee)
  const ctnData = anneeData ? getCtn(anneeData, ctn) : null

  if (!ctnData) {
    return <EmptyState message="Donnees indisponibles" />
  }

  const parRisque = ctnData.repartitionsSynthese?.parRisque ?? []
  const topMp = ctnData.topMp ?? []

  return (
    <motion.div
      key={`synthese-${annee}-${ctn}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-2"
    >
      {/* Bar chart : repartition AT par risque a l'origine */}
      <CarteAnalyse
        titre="AT par risque à l'origine"
        sousTitre={`${CTN_INFO[ctn].libelleCourt} · ${annee}`}
        note="Les barres rouges signalent un risque d'activité physique."
      >
        {parRisque.length > 0 ? (
          <ul className="space-y-3">
            {parRisque
              .slice()
              .sort((a, b) => b.pourcentage - a.pourcentage)
              .map((ligne) => (
                <BarHorizontale
                  key={ligne.libelle}
                  libelle={ligne.libelle}
                  valeur={ligne.pourcentage}
                  maxValeur={100}
                  unite="%"
                  glow={estRisquePhysique(ligne.libelle)}
                />
              ))}
          </ul>
        ) : (
          <EmptyState message="Pas de donnees de répartition par risque" />
        )}
      </CarteAnalyse>

      {/* Liste des principales MP */}
      <CarteAnalyse
        titre="Principales maladies professionnelles"
        sousTitre={`${CTN_INFO[ctn].libelleCourt} · ${annee}`}
        note="Le code TMS (057A) et les lombalgies (098A) sont mis en valeur."
      >
        {topMp.length > 0 ? (
          <ul className="space-y-2">
            {topMp.map((mp) => {
              const glow = estCodeMpTms(mp.codeTableau)
              return (
                <li
                  key={mp.codeTableau + mp.libelle}
                  className={`
                    flex items-center justify-between rounded-md border px-3 py-2.5
                    ${glow ? 'border-[rgb(255,30,90)]/40 bg-[rgb(255,30,90)]/[0.06]' : 'border-white/5 bg-white/[0.02]'}
                  `}
                  style={
                    glow
                      ? { boxShadow: '0 0 18px rgba(255,30,90,0.15)' }
                      : undefined
                  }
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="rounded-md px-2 py-0.5 font-mono text-xs font-semibold"
                      style={{
                        color: glow ? COULEUR_RISQUE_PHYSIQUE : 'rgb(156,163,175)',
                        background: glow ? 'rgba(255,30,90,0.12)' : 'rgba(255,255,255,0.06)',
                      }}
                    >
                      {mp.codeTableau}
                    </span>
                    <span className="truncate text-sm text-white">
                      {mp.libelle}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-sm">
                    <span className="font-semibold text-white">
                      {formaterNombre(mp.nbMp)}
                    </span>
                    <span className="text-gray-500">{formaterPourcent(mp.pourcentage)}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <EmptyState message="Pas de top MP disponible" />
        )}
      </CarteAnalyse>
    </motion.div>
  )
}

/* ---------- Sous-composants ---------- */

function EmptyState({ message }: { message: string }) {
  return (
    <p className="py-12 text-center text-sm text-gray-500">{message}</p>
  )
}
