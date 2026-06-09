'use client'

/**
 * 4 KPI cards en haut de la console : AT, TJ, MP, TMS.
 *
 * Pour chaque indicateur on affiche :
 *   - la valeur principale (nb 1er reglement / nb MP / total TMS)
 *   - la variation par rapport a l'annee precedente
 *   - une mini-progression visuelle
 *
 * GLOW ROUGE : automatique sur la carte TMS (= risque activite physique).
 * Sur l'indicateur AT/TJ/MP, glow plus discret seulement quand la carte
 * est selectionnee dans les filtres (pour montrer "tu regardes ce KPI").
 */

import { motion } from 'framer-motion'
import NumberFlow from '@number-flow/react'
import type { StatsAnnee, CtnCode } from '@/data/stats-am/types'
import { formaterNombre, formaterDecimal, getCtn } from '@/lib/stats-am'
import {
  COULEUR_RISQUE_PHYSIQUE,
  STYLE_GLOW_TEXTE,
} from '@/lib/stats-am/glow'
import { useFiltresStats } from '@/lib/stats-am/use-filtres-stats'

interface ConsoleKpiCardsProps {
  toutesAnnees: StatsAnnee[]
}

export function ConsoleKpiCards({ toutesAnnees }: ConsoleKpiCardsProps) {
  const { annee, ctn, indicateur, setIndicateur } = useFiltresStats()

  const anneeData = toutesAnnees.find((a) => a.annee === annee)
  const anneePrec = toutesAnnees.find((a) => a.annee === annee - 1)
  const ctnData = anneeData ? getCtn(anneeData, ctn) : null
  const ctnPrec = anneePrec ? getCtn(anneePrec, ctn) : null

  if (!ctnData) return null

  // Construction des 4 KPIs
  const kpis: KpiData[] = [
    {
      id: 'at',
      libelle: 'Accidents du travail',
      valeur: ctnData.at.nb1erReglement,
      valeurPrec: ctnPrec?.at.nb1erReglement ?? null,
      sousLibelle: 'avec 1er règlement',
      complement:
        ctnData.at.indiceFrequence !== null
          ? `IF ${formaterDecimal(ctnData.at.indiceFrequence)}`
          : null,
    },
    {
      id: 'tj',
      libelle: 'Accidents de trajet',
      valeur: ctnData.tj.nb1erReglement,
      valeurPrec: ctnPrec?.tj.nb1erReglement ?? null,
      sousLibelle: 'avec 1er règlement',
      complement: null,
    },
    {
      id: 'mp',
      libelle: 'Maladies professionnelles',
      valeur: ctnData.mp.nbAvec1erReglement,
      valeurPrec: ctnPrec?.mp.nbAvec1erReglement ?? null,
      sousLibelle: 'avec 1er règlement',
      complement: null,
    },
    {
      id: 'tms',
      libelle: 'Troubles musculo-squelettiques',
      valeur: ctnData.focusTms?.totalTms ?? 0,
      valeurPrec: ctnPrec?.focusTms?.totalTms ?? null,
      sousLibelle: 'TMS reconnus (1er règl.)',
      complement: null,
      risquePhysique: true,
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <KpiCard
            key={k.id}
            kpi={k}
            anneeReference={annee - 1}
            actif={indicateur === k.id}
            onClick={() => setIndicateur(k.id)}
          />
        ))}
      </div>
    </div>
  )
}

/* ---------- Sous-composants ---------- */

interface KpiData {
  id: 'at' | 'tj' | 'mp' | 'tms'
  libelle: string
  valeur: number
  valeurPrec: number | null
  sousLibelle: string
  complement: string | null
  risquePhysique?: boolean
}

interface KpiCardProps {
  kpi: KpiData
  /** Annee de reference pour le calcul de variation (= annee - 1). */
  anneeReference: number
  actif: boolean
  onClick: () => void
}

function KpiCard({ kpi, anneeReference, actif, onClick }: KpiCardProps) {
  const variation =
    kpi.valeurPrec && kpi.valeurPrec > 0
      ? ((kpi.valeur - kpi.valeurPrec) / kpi.valeurPrec) * 100
      : null

  // Style de carte selon : risque physique (glow rouge fort) + actif
  // (border rouge accent quand selectionne).
  const borderClass = kpi.risquePhysique
    ? 'border-[rgb(255,30,90)]/30'
    : actif
      ? 'border-[rgb(255,30,90)]/50'
      : 'border-white/10'

  const bgClass = kpi.risquePhysique
    ? 'bg-gradient-to-br from-[rgb(255,30,90)]/[0.08] to-transparent'
    : actif
      ? 'bg-white/[0.04]'
      : 'bg-white/[0.02]'

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className={`
        group relative overflow-hidden rounded-lg border ${borderClass} ${bgClass}
        p-5 text-left transition-colors
        hover:border-white/30
      `}
      style={
        kpi.risquePhysique
          ? {
              boxShadow:
                '0 0 32px rgba(255,30,90,0.18), inset 0 0 24px rgba(255,30,90,0.05)',
            }
          : undefined
      }
      aria-pressed={actif}
    >
      {/* Indicateur de selection en haut (barre rouge) */}
      {actif && (
        <span
          aria-hidden
          className="absolute left-0 right-0 top-0 h-[2px]"
          style={{ backgroundColor: COULEUR_RISQUE_PHYSIQUE }}
        />
      )}

      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
          {kpi.libelle}
        </p>
        {kpi.complement && (
          <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium text-gray-300">
            {kpi.complement}
          </span>
        )}
      </div>

      <p
        className="text-3xl font-bold text-white sm:text-4xl"
        style={kpi.risquePhysique ? STYLE_GLOW_TEXTE : undefined}
      >
        {kpi.valeur > 0 ? (
          <NumberFlow
            value={kpi.valeur}
            format={{ useGrouping: true }}
            locales="fr-FR"
          />
        ) : (
          <span className="text-gray-600">—</span>
        )}
      </p>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs">
        <span className="text-gray-500">{kpi.sousLibelle}</span>
        {variation !== null && Math.abs(variation) >= 0.1 ? (
          // Affichage "▲ +5,2 % vs 2023" : la fleche + chiffre dans le
          // badge coloré, l'année de comparaison en petit gris a côté.
          <span className="flex items-center gap-1.5">
            <VariationBadge variation={variation} />
            <span className="text-[10px] text-gray-500">vs {anneeReference}</span>
          </span>
        ) : kpi.valeurPrec !== null ? (
          // Pas de variation significative : on indique quand même que
          // c'est stable vs N-1 (pour expliciter le calcul).
          <span className="text-[10px] text-gray-500">stable vs {anneeReference}</span>
        ) : null}
      </div>
    </motion.button>
  )
}

function VariationBadge({ variation }: { variation: number }) {
  const positif = variation > 0
  return (
    <span
      className={`
        inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium
        ${
          positif
            ? 'bg-[rgb(255,30,90)]/15 text-[rgb(255,30,90)]'
            : 'bg-emerald-500/15 text-emerald-400'
        }
      `}
      aria-label={`${positif ? 'hausse' : 'baisse'} de ${Math.abs(variation).toFixed(1)} pourcent par rapport à l'année précédente`}
    >
      <span aria-hidden>{positif ? '▲' : '▼'}</span>
      {formaterDecimal(Math.abs(variation), 1)}
      {'\u00a0%'}
    </span>
  )
}

// Helper non utilise actuellement, mais conserve pour debug / future
// utilisation : permet d'afficher la valeur brute en tooltip.
export function libelleVariation(actuel: number, prec: number | null): string {
  if (prec === null || prec === 0) return ''
  const diff = actuel - prec
  return `${diff > 0 ? '+' : ''}${formaterNombre(diff)} vs ${formaterNombre(prec)}`
}
