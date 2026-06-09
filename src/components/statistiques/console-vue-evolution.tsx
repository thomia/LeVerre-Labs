'use client'

/**
 * Vue "Evolution" : line chart Recharts qui montre l'evolution des
 * 4 indicateurs (AT, TJ, MP, TMS) sur les annees disponibles, pour
 * le CTN selectionne.
 *
 * UX :
 *   - 4 toggles en haut pour activer/masquer chaque serie
 *   - L'indicateur TMS a un glow rouge marque (= risque activite physique)
 *   - Tooltip personnalise au hover
 *   - 2022 absent : pas de point sur cette annee, ligne discontinue
 *   - Switch valeurs absolues / indice de frequence (= taux pour 1000 sal.)
 */

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { StatsAnnee } from '@/data/stats-am/types'
import { formaterNombre, formaterDecimal, getCtn } from '@/lib/stats-am'
import { CTN_INFO } from '@/lib/stats-am/constants'
import { COULEUR_RISQUE_PHYSIQUE } from '@/lib/stats-am/glow'
import { useFiltresStats } from '@/lib/stats-am/use-filtres-stats'
import { CarteAnalyse } from './console-carte-analyse'
import { ConsoleEvolutionManutention } from './console-evolution-manutention'

interface ConsoleVueEvolutionProps {
  toutesAnnees: StatsAnnee[]
}

/* Series disponibles avec leurs couleurs et libelles. */
interface Serie {
  cle: 'AT' | 'TJ' | 'MP' | 'TMS'
  libelle: string
  couleur: string
  glow: boolean
}
const SERIES: Serie[] = [
  { cle: 'AT', libelle: 'Accidents du travail', couleur: '#60a5fa', glow: false },
  { cle: 'TJ', libelle: 'Accidents de trajet', couleur: '#a78bfa', glow: false },
  { cle: 'MP', libelle: 'Maladies professionnelles', couleur: '#fbbf24', glow: false },
  { cle: 'TMS', libelle: 'TMS', couleur: COULEUR_RISQUE_PHYSIQUE, glow: true },
]

const MODES = {
  absolu: { libelle: 'Valeurs absolues', sousTitre: 'nombre de cas' },
  if: { libelle: 'Indice de fréquence', sousTitre: 'cas pour 1000 salariés' },
} as const
type Mode = keyof typeof MODES

export function ConsoleVueEvolution({ toutesAnnees }: ConsoleVueEvolutionProps) {
  const { ctn } = useFiltresStats()
  const [seriesActives, setSeriesActives] = useState<Set<Serie['cle']>>(
    () => new Set<Serie['cle']>(['AT', 'TJ', 'MP', 'TMS'])
  )
  const [mode, setMode] = useState<Mode>('absolu')

  // Construction de la table de donnees pour Recharts
  const donnees = useMemo(() => {
    return toutesAnnees.map((a) => {
      const c = getCtn(a, ctn)
      if (!c) return { annee: a.annee }
      if (mode === 'absolu') {
        return {
          annee: a.annee,
          AT: c.at.nb1erReglement || null,
          TJ: c.tj.nb1erReglement || null,
          MP: c.mp.nbAvec1erReglement || null,
          TMS: c.focusTms?.totalTms || null,
        }
      }
      // mode IF : nb pour 1000 salaries (= indice de frequence)
      const sal = c.nbSalariesActivite
      const ratio = sal > 0 ? 1000 / sal : 0
      return {
        annee: a.annee,
        AT: c.at.indiceFrequence ?? (c.at.nb1erReglement * ratio || null),
        TJ: c.tj.nb1erReglement * ratio || null,
        MP: c.mp.nbAvec1erReglement * ratio || null,
        TMS: (c.focusTms?.totalTms ?? 0) * ratio || null,
      }
    })
  }, [toutesAnnees, ctn, mode])

  function toggleSerie(cle: Serie['cle']) {
    setSeriesActives((prev) => {
      const next = new Set(prev)
      if (next.has(cle)) next.delete(cle)
      else next.add(cle)
      return next
    })
  }

  return (
    <motion.div
      key={`evolution-${ctn}-${mode}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto flex max-w-7xl flex-col gap-6 px-4 pb-12 sm:px-6"
    >
      {/* Carte 1 : evolution des 4 indicateurs (AT/TJ/MP/TMS) pour le CTN actif. */}
      <CarteAnalyse
        titre={`Évolution ${MODES[mode].sousTitre}`}
        sousTitre={`${CTN_INFO[ctn].libelleCourt} · ${toutesAnnees[0].annee}-${toutesAnnees[toutesAnnees.length - 1].annee}`}
        note="Données 2022 non publiées par la CNAM (ligne discontinue). Clique sur une légende pour masquer/afficher une série."
        actions={
          <div className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 p-1">
            {(Object.keys(MODES) as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`
                  rounded px-3 py-1 text-xs font-medium transition
                  ${mode === m ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-gray-200'}
                `}
              >
                {MODES[m].libelle}
              </button>
            ))}
          </div>
        }
      >
        {/* Toggles de series : pills avec puce coloree */}
        <div className="mb-4 flex flex-wrap gap-2">
          {SERIES.map((s) => {
            const actif = seriesActives.has(s.cle)
            return (
              <button
                key={s.cle}
                type="button"
                onClick={() => toggleSerie(s.cle)}
                className={`
                  group flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition
                  ${
                    actif
                      ? s.glow
                        ? 'border-[rgb(255,30,90)]/50 bg-[rgb(255,30,90)]/10 text-white'
                        : 'border-white/20 bg-white/10 text-white'
                      : 'border-white/10 bg-transparent text-gray-500 hover:text-gray-300'
                  }
                `}
                style={
                  actif && s.glow
                    ? { boxShadow: '0 0 16px rgba(255,30,90,0.25)' }
                    : undefined
                }
                aria-pressed={actif}
              >
                <span
                  aria-hidden
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: actif ? s.couleur : 'rgba(255,255,255,0.2)',
                    boxShadow: actif && s.glow ? `0 0 8px ${s.couleur}` : undefined,
                  }}
                />
                {s.libelle}
              </button>
            )
          })}
        </div>

        {/* Le chart lui-meme */}
        <div className="h-[420px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={donnees} margin={{ top: 16, right: 16, bottom: 8, left: 8 }}>
              <defs>
                {/* Filtre glow rouge pour la serie TMS */}
                <filter id="glow-tms-line" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
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
                tickFormatter={(v) =>
                  mode === 'absolu' ? formaterNombre(v) : formaterDecimal(v, 1)
                }
                width={60}
              />
              <Tooltip content={<TooltipPerso mode={mode} />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
              <Legend wrapperStyle={{ display: 'none' }} />

              {SERIES.filter((s) => seriesActives.has(s.cle)).map((s) => (
                <Line
                  key={s.cle}
                  type="monotone"
                  dataKey={s.cle}
                  name={s.libelle}
                  stroke={s.couleur}
                  strokeWidth={s.glow ? 2.5 : 2}
                  dot={{ r: 3, strokeWidth: 0, fill: s.couleur }}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: '#000' }}
                  connectNulls={false}
                  filter={s.glow ? 'url(#glow-tms-line)' : undefined}
                  isAnimationActive={true}
                  animationDuration={600}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CarteAnalyse>

      {/* Carte 2 : evolution de la manutention manuelle, comparant les 10 CTN. */}
      <ConsoleEvolutionManutention toutesAnnees={toutesAnnees} />
    </motion.div>
  )
}

/* ---------- Tooltip personnalise (style sombre LeVerre Labs) ---------- */

/**
 * Recharts passe `active`, `payload`, `label` au composant Tooltip.
 * On les type ici de manière permissive (Recharts 3.x a un typage
 * complexe : on prend uniquement ce qu'il nous faut).
 */
interface PayloadItem {
  dataKey?: string | number
  value?: number | string | null
}

interface TooltipPersoProps {
  active?: boolean
  payload?: PayloadItem[]
  label?: string | number
  mode: Mode
}

function TooltipPerso({ active, payload, label, mode }: TooltipPersoProps) {
  if (!active || !payload?.length) return null
  const formater = (v: number) =>
    mode === 'absolu' ? formaterNombre(v) : formaterDecimal(v, 1)

  return (
    <div className="rounded-lg border border-white/15 bg-black/95 px-3 py-2.5 text-xs shadow-2xl backdrop-blur">
      <p className="mb-1.5 font-semibold text-gray-200">Année {label}</p>
      <ul className="space-y-1">
        {payload.map((p) => {
          const serie = SERIES.find((s) => s.cle === p.dataKey)
          if (!serie) return null
          return (
            <li
              key={String(p.dataKey)}
              className="flex items-center justify-between gap-3"
            >
              <span className="flex items-center gap-2 text-gray-400">
                <span
                  aria-hidden
                  className="h-2 w-2 rounded-full"
                  style={{ background: serie.couleur }}
                />
                {serie.libelle}
              </span>
              <span
                className="font-semibold"
                style={{ color: serie.glow ? COULEUR_RISQUE_PHYSIQUE : 'white' }}
              >
                {typeof p.value === 'number' ? formater(p.value) : '—'}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
