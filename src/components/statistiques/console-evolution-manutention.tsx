'use client'

/**
 * Carte d'évolution du risque "Manutention manuelle" pour TOUS les CTN.
 *
 * Utilisée dans la vue Comparaison : 1 courbe par CTN sur les années
 * disponibles, ce qui permet de répondre à la question "quels secteurs
 * sont les plus exposés à l'activité physique, et est-ce que ça évolue ?"
 *
 * UX :
 *   - La courbe du CTN actuellement sélectionné est rouge avec glow.
 *   - Le CTN "tous" (national) est en blanc/épais (référence).
 *   - Les autres CTN sont en gris discret. Au hover sur la légende,
 *     on highlight la courbe (les autres se dégradent).
 *   - Click sur un CTN dans la légende = on bascule ce CTN dans
 *     `useFiltresStats` (= devient l'actif rouge).
 */

import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { StatsAnnee, CtnCode } from '@/data/stats-am/types'
import { formaterPourcent, getCtn } from '@/lib/stats-am'
import { CTN_INFO, ORDRE_CTN } from '@/lib/stats-am/constants'
import { COULEUR_RISQUE_PHYSIQUE } from '@/lib/stats-am/glow'
import { useFiltresStats } from '@/lib/stats-am/use-filtres-stats'
import { CarteAnalyse } from './console-carte-analyse'

interface ConsoleEvolutionManutentionProps {
  toutesAnnees: StatsAnnee[]
}

/** Libellé exact du risque dans les JSON (issu du PDF AM). */
const LIBELLE_RISQUE = 'Manutention manuelle'

export function ConsoleEvolutionManutention({
  toutesAnnees,
}: ConsoleEvolutionManutentionProps) {
  const { ctn: ctnActif, setCtn } = useFiltresStats()
  /** CTN survolé dans la légende (pour highlight temporaire). */
  const [ctnSurvole, setCtnSurvole] = useState<CtnCode | null>(null)

  /**
   * Construit la table de données Recharts au format :
   *   [{ annee: 2015, tous: 53, A: 48, B: 42, ... }, ...]
   * Chaque CTN devient une "série" du LineChart.
   */
  const donnees = useMemo(() => {
    return toutesAnnees.map((a) => {
      const point: Record<string, number | null> & { annee: number } = {
        annee: a.annee,
      }
      for (const code of ORDRE_CTN) {
        const c = getCtn(a, code)
        const ligne = c?.repartitionsSynthese?.parRisque.find(
          (r) => r.libelle === LIBELLE_RISQUE
        )
        point[code] = ligne?.pourcentage ?? null
      }
      return point
    })
  }, [toutesAnnees])

  /**
   * Détermine le style d'une courbe selon son état :
   *  - actif    : rouge épais avec glow
   *  - tous     : blanc épais (référence nationale)
   *  - survolé  : blanc moyen
   *  - normal   : gris discret
   *  - estompé  : très transparent (quand un autre est survolé)
   */
  function getStyleSerie(code: CtnCode) {
    const estActif = code === ctnActif
    const estTous = code === 'tous'
    const estSurvole = code === ctnSurvole
    const autreSurvole = ctnSurvole !== null && ctnSurvole !== code

    if (estActif)
      return {
        couleur: COULEUR_RISQUE_PHYSIQUE,
        epaisseur: 3,
        opacite: 1,
        glow: true,
        zIndex: 30,
      }
    if (estTous)
      return {
        couleur: 'rgba(255,255,255,0.85)',
        epaisseur: 2.5,
        opacite: autreSurvole ? 0.5 : 1,
        glow: false,
        zIndex: 20,
      }
    if (estSurvole)
      return {
        couleur: 'rgba(255,255,255,0.85)',
        epaisseur: 2,
        opacite: 1,
        glow: false,
        zIndex: 25,
      }
    return {
      couleur: 'rgba(255,255,255,0.35)',
      epaisseur: 1.5,
      opacite: autreSurvole ? 0.15 : 0.6,
      glow: false,
      zIndex: 10,
    }
  }

  return (
    <CarteAnalyse
      titre="Évolution de la manutention manuelle par secteur"
      sousTitre={`Part des AT liés à la manutention · ${toutesAnnees[0].annee}–${toutesAnnees[toutesAnnees.length - 1].annee}`}
      glowRouge
      note="Clique sur un secteur dans la légende pour le mettre en avant (rouge). Survole pour highlight temporaire."
    >
      {/* Légende cliquable + highlight au hover */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {ORDRE_CTN.map((code) => {
          const estActif = code === ctnActif
          return (
            <button
              key={code}
              type="button"
              onClick={() => setCtn(code)}
              onMouseEnter={() => setCtnSurvole(code)}
              onMouseLeave={() => setCtnSurvole(null)}
              className={`
                flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition
                ${
                  estActif
                    ? 'border-[rgb(255,30,90)]/50 bg-[rgb(255,30,90)]/10 text-white'
                    : code === 'tous'
                      ? 'border-white/30 bg-white/5 text-white'
                      : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200'
                }
              `}
              style={
                estActif
                  ? { boxShadow: '0 0 12px rgba(255,30,90,0.3)' }
                  : undefined
              }
            >
              <span
                aria-hidden
                className="h-2 w-2 rounded-full"
                style={{
                  background: estActif
                    ? COULEUR_RISQUE_PHYSIQUE
                    : code === 'tous'
                      ? 'rgba(255,255,255,0.9)'
                      : 'rgba(255,255,255,0.4)',
                }}
              />
              {code === 'tous' ? 'Tous CTN' : code}
            </button>
          )
        })}
      </div>

      {/* Chart */}
      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={donnees}
            margin={{ top: 16, right: 16, bottom: 8, left: 8 }}
          >
            <defs>
              <filter
                id="glow-manutention-multi"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid
              stroke="rgba(255,255,255,0.05)"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="annee"
              stroke="rgba(255,255,255,0.4)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.4)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}\u00a0%`}
              width={50}
              domain={[0, (dataMax: number) => Math.ceil((dataMax + 5) / 10) * 10]}
            />
            <Tooltip
              cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
              content={<TooltipPerso ctnActif={ctnActif} ctnSurvole={ctnSurvole} />}
            />

            {ORDRE_CTN.map((code) => {
              const style = getStyleSerie(code)
              return (
                <Line
                  key={code}
                  type="monotone"
                  dataKey={code}
                  name={CTN_INFO[code].libelleCourt}
                  stroke={style.couleur}
                  strokeWidth={style.epaisseur}
                  strokeOpacity={style.opacite}
                  dot={false}
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    stroke: '#000',
                    fill: style.couleur,
                  }}
                  connectNulls={false}
                  filter={style.glow ? 'url(#glow-manutention-multi)' : undefined}
                  isAnimationActive
                  animationDuration={500}
                />
              )
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CarteAnalyse>
  )
}

/* ---------- Tooltip personnalisé ---------- */

interface PayloadItem {
  dataKey?: string | number
  value?: number | string | null
}
interface TooltipPersoProps {
  active?: boolean
  payload?: PayloadItem[]
  label?: string | number
  ctnActif: CtnCode
  ctnSurvole: CtnCode | null
}

function TooltipPerso({
  active,
  payload,
  label,
  ctnActif,
  ctnSurvole,
}: TooltipPersoProps) {
  if (!active || !payload?.length) return null

  /* Trie les valeurs décroissantes, met l'actif et le survolé en premier. */
  const lignes = payload
    .filter((p): p is PayloadItem & { value: number } => typeof p.value === 'number')
    .map((p) => ({
      code: p.dataKey as CtnCode,
      valeur: p.value,
    }))
    .sort((a, b) => {
      if (a.code === ctnActif) return -1
      if (b.code === ctnActif) return 1
      if (a.code === ctnSurvole) return -1
      if (b.code === ctnSurvole) return 1
      if (a.code === 'tous') return -1
      if (b.code === 'tous') return 1
      return b.valeur - a.valeur
    })

  return (
    <div className="max-h-[280px] overflow-auto rounded-lg border border-white/15 bg-black/95 px-3 py-2.5 text-xs shadow-2xl backdrop-blur">
      <p className="mb-1.5 font-semibold text-gray-200">Année {label}</p>
      <ul className="space-y-0.5">
        {lignes.map(({ code, valeur }) => {
          const estActif = code === ctnActif
          return (
            <li
              key={code}
              className="flex items-center justify-between gap-4"
              style={{
                color: estActif
                  ? COULEUR_RISQUE_PHYSIQUE
                  : code === 'tous'
                    ? 'white'
                    : 'rgba(255,255,255,0.6)',
              }}
            >
              <span className="font-medium">
                {code === 'tous' ? 'Tous CTN' : code} ·{' '}
                <span className="text-gray-500">
                  {CTN_INFO[code].libelleCourt}
                </span>
              </span>
              <span className="font-semibold tabular-nums">
                {formaterPourcent(valeur)}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
