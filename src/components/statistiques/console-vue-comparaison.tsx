'use client'

/**
 * Vue "Comparaison" : voir les 9 CTN côte à côte sur l'année sélectionnée.
 *
 * Layout : tableau type "heatmap" simple
 *   colonnes = AT, IF (indice fréquence), TJ, MP, TMS, % TMS / MP
 *   lignes   = les 10 CTN (tous + A..I)
 *
 * Pour chaque cellule numérique :
 *   - Valeur en clair
 *   - Background avec opacité proportionnelle au pourcentage du max de la colonne
 *   - Couleur = blanc/gris pour AT/TJ/MP, rouge pour TMS et % TMS
 *
 * Permet de spotter rapidement quel secteur a le plus de TMS, etc.
 */

import { motion } from 'framer-motion'
import type { StatsAnnee, CtnCode } from '@/data/stats-am/types'
import { formaterNombre, formaterDecimal, getCtn } from '@/lib/stats-am'
import { CTN_INFO, ORDRE_CTN } from '@/lib/stats-am/constants'
import { COULEUR_RISQUE_PHYSIQUE } from '@/lib/stats-am/glow'
import { useFiltresStats } from '@/lib/stats-am/use-filtres-stats'
import { CarteAnalyse } from './console-carte-analyse'

interface ConsoleVueComparaisonProps {
  toutesAnnees: StatsAnnee[]
}

interface LigneCtn {
  code: CtnCode
  libelle: string
  salaries: number
  at: number
  if_: number | null
  tj: number
  mp: number
  tms: number
  pctTms: number | null
}

export function ConsoleVueComparaison({
  toutesAnnees,
}: ConsoleVueComparaisonProps) {
  const { annee, ctn: ctnActuel, setCtn } = useFiltresStats()
  const anneeData = toutesAnnees.find((a) => a.annee === annee)
  if (!anneeData) return null

  // Construit une ligne par CTN.
  const lignes: LigneCtn[] = ORDRE_CTN.map((code) => {
    const c = getCtn(anneeData, code)!
    return {
      code,
      libelle: CTN_INFO[code].libelleCourt,
      salaries: c.nbSalariesActivite,
      at: c.at.nb1erReglement,
      if_: c.at.indiceFrequence,
      tj: c.tj.nb1erReglement,
      mp: c.mp.nbAvec1erReglement,
      tms: c.focusTms?.totalTms ?? 0,
      pctTms:
        c.mp.nbAvec1erReglement > 0
          ? ((c.focusTms?.totalTms ?? 0) / c.mp.nbAvec1erReglement) * 100
          : null,
    }
  })

  // Maximas (en excluant la ligne "tous" pour l'échelle de couleur,
  // sinon "tous" écrase tout).
  const sansTous = lignes.filter((l) => l.code !== 'tous')
  const max = {
    at: Math.max(...sansTous.map((l) => l.at)),
    if: Math.max(...sansTous.map((l) => l.if_ ?? 0)),
    tj: Math.max(...sansTous.map((l) => l.tj)),
    mp: Math.max(...sansTous.map((l) => l.mp)),
    tms: Math.max(...sansTous.map((l) => l.tms)),
    pctTms: Math.max(...sansTous.map((l) => l.pctTms ?? 0)),
  }

  return (
    <motion.div
      key={`compare-${annee}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-7xl px-4 pb-12 sm:px-6"
    >
      <CarteAnalyse
        titre="Comparaison des secteurs"
        sousTitre={`Année ${annee}`}
        note="Les colonnes TMS et % TMS sont mises en valeur (rouge) car elles concernent l'activité physique. Clique sur une ligne pour basculer ce secteur dans les autres vues."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                <th className="px-3 py-2 text-left font-medium">Secteur</th>
                <th className="px-3 py-2 text-right font-medium">Salariés</th>
                <th className="px-3 py-2 text-right font-medium">AT</th>
                <th className="px-3 py-2 text-right font-medium" title="Indice de fréquence : nb AT pour 1000 salariés">
                  IF
                </th>
                <th className="px-3 py-2 text-right font-medium">TJ</th>
                <th className="px-3 py-2 text-right font-medium">MP</th>
                <th
                  className="px-3 py-2 text-right font-semibold"
                  style={{ color: COULEUR_RISQUE_PHYSIQUE }}
                >
                  TMS
                </th>
                <th
                  className="px-3 py-2 text-right font-semibold"
                  style={{ color: COULEUR_RISQUE_PHYSIQUE }}
                >
                  % TMS / MP
                </th>
              </tr>
            </thead>
            <tbody>
              {lignes.map((l) => {
                const estTous = l.code === 'tous'
                const estActif = l.code === ctnActuel
                return (
                  <tr
                    key={l.code}
                    onClick={() => setCtn(l.code)}
                    className={`
                      cursor-pointer border-b border-white/5 transition-colors
                      ${estTous ? 'bg-white/[0.04] font-medium' : ''}
                      ${estActif ? 'ring-1 ring-inset ring-[rgb(255,30,90)]/30' : ''}
                      hover:bg-white/[0.06]
                    `}
                  >
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        {!estTous && (
                          <span className="font-mono text-xs text-gray-500">
                            {l.code}
                          </span>
                        )}
                        <span className="text-white">{l.libelle}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-gray-400">
                      {formaterNombre(l.salaries)}
                    </td>
                    <Cellule
                      valeur={l.at}
                      max={max.at}
                      desactiveeFond={estTous}
                      formater={formaterNombre}
                    />
                    <Cellule
                      valeur={l.if_}
                      max={max.if}
                      desactiveeFond={estTous}
                      formater={(v) => formaterDecimal(v, 1)}
                    />
                    <Cellule
                      valeur={l.tj}
                      max={max.tj}
                      desactiveeFond={estTous}
                      formater={formaterNombre}
                    />
                    <Cellule
                      valeur={l.mp}
                      max={max.mp}
                      desactiveeFond={estTous}
                      formater={formaterNombre}
                    />
                    <Cellule
                      valeur={l.tms}
                      max={max.tms}
                      desactiveeFond={estTous}
                      formater={formaterNombre}
                      glowRouge
                    />
                    <Cellule
                      valeur={l.pctTms}
                      max={max.pctTms}
                      desactiveeFond={estTous}
                      formater={(v) => `${formaterDecimal(v, 0)} %`}
                      glowRouge
                    />
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CarteAnalyse>
    </motion.div>
  )
}

/* ---------- Cellule heatmap ---------- */

interface CelluleProps {
  valeur: number | null
  max: number
  desactiveeFond?: boolean
  formater: (v: number) => string
  glowRouge?: boolean
}

function Cellule({
  valeur,
  max,
  desactiveeFond = false,
  formater,
  glowRouge = false,
}: CelluleProps) {
  if (valeur === null || valeur === 0) {
    return (
      <td className="px-3 py-2.5 text-right tabular-nums text-gray-600">—</td>
    )
  }
  const ratio = max > 0 ? valeur / max : 0
  // Ratio borné entre 0 et 1, avec un floor pour les très petites valeurs
  const opacite = desactiveeFond ? 0 : Math.min(ratio, 1) * 0.35

  const couleurFond = glowRouge
    ? `rgba(255, 30, 90, ${opacite})`
    : `rgba(255, 255, 255, ${opacite * 0.6})`

  return (
    <td
      className="px-3 py-2.5 text-right tabular-nums"
      style={{
        background: couleurFond,
        color: glowRouge && !desactiveeFond && ratio > 0.6 ? 'rgb(255,180,200)' : 'white',
        textShadow:
          glowRouge && ratio > 0.6
            ? `0 0 8px rgba(255,30,90,${0.4 * ratio})`
            : undefined,
      }}
    >
      {formater(valeur)}
    </td>
  )
}
