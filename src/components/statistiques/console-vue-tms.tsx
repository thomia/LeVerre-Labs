'use client'

/**
 * Vue "Focus TMS" : coeur du projet LeVerre Labs.
 *
 * Layout :
 *   - Hero : total TMS en grand avec glow rouge
 *   - Donut : repartition par localisation anatomique (6 zones)
 *   - Liste : codes MP cibles (057A, 069A, 079A, 097A, 098A, 042A, 030A/B)
 *
 * Tout est mis en valeur en rouge (= activite physique par definition).
 */

import { motion } from 'framer-motion'
import NumberFlow from '@number-flow/react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { StatsAnnee } from '@/data/stats-am/types'
import {
  formaterNombre,
  formaterDecimal,
  formaterPourcent,
  getCtn,
} from '@/lib/stats-am'
import { CTN_INFO } from '@/lib/stats-am/constants'
import {
  COULEUR_RISQUE_PHYSIQUE,
  STYLE_GLOW_TEXTE,
  estCodeMpTms,
} from '@/lib/stats-am/glow'
import { useFiltresStats } from '@/lib/stats-am/use-filtres-stats'
import { CarteAnalyse } from './console-carte-analyse'

interface ConsoleVueTmsProps {
  toutesAnnees: StatsAnnee[]
}

/**
 * Palette pour les 6 localisations anatomiques.
 * Couleurs categorielles distinctes (et non des gradations de rouge) pour
 * que chaque zone se lise clairement, sans se confondre avec le rouge
 * "risque physique" utilise ailleurs dans la console.
 */
const COULEURS_LOCALISATIONS = [
  'rgb(56, 189, 248)',  // bleu ciel
  'rgb(45, 212, 191)',  // turquoise
  'rgb(167, 139, 250)', // violet
  'rgb(251, 191, 36)',  // ambre
  'rgb(244, 114, 182)', // rose clair
  'rgb(148, 163, 184)', // gris ardoise
] as const

export function ConsoleVueTms({ toutesAnnees }: ConsoleVueTmsProps) {
  const { annee, ctn } = useFiltresStats()
  const anneeData = toutesAnnees.find((a) => a.annee === annee)
  const anneePrec = toutesAnnees.find((a) => a.annee === annee - 1)
  const ctnData = anneeData ? getCtn(anneeData, ctn) : null
  const ctnPrec = anneePrec ? getCtn(anneePrec, ctn) : null

  if (!ctnData || !ctnData.focusTms) {
    return (
      <p className="mx-auto max-w-md py-16 text-center text-sm text-gray-500">
        Pas de données TMS pour {CTN_INFO[ctn].libelleCourt} en {annee}.
      </p>
    )
  }

  const focus = ctnData.focusTms
  const total = focus.totalTms
  const totalPrec = ctnPrec?.focusTms?.totalTms ?? null
  const variation =
    totalPrec && totalPrec > 0 ? ((total - totalPrec) / totalPrec) * 100 : null

  const donneesPie = (focus.parLocalisation ?? []).map((l) => ({
    nom: l.localisation,
    valeur: l.pourcentage,
  }))

  const codes = ctnData.mp.listeParTableau ?? []
  const codesTms = codes.filter((c) => estCodeMpTms(c.codeTableau))
  const codesAutres = codes.filter((c) => !estCodeMpTms(c.codeTableau))

  return (
    <motion.div
      key={`tms-${annee}-${ctn}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-7xl space-y-6 px-4 pb-12 sm:px-6"
    >
      {/* HERO : total TMS avec glow */}
      <CarteAnalyse
        titre="Troubles musculo-squelettiques reconnus"
        sousTitre={`${CTN_INFO[ctn].libelleCourt} · ${annee}`}
        glowRouge
        note="Le total inclut le compte spécial des MP non rattachables à un CTN. Lombalgies (098A) comptées à part."
      >
        <div className="flex flex-col items-center justify-center gap-4 py-6 sm:flex-row sm:gap-12">
          <div className="text-center">
            <p
              className="text-6xl font-bold text-white sm:text-7xl"
              style={STYLE_GLOW_TEXTE}
            >
              <NumberFlow
                value={total}
                format={{ useGrouping: true }}
                locales="fr-FR"
              />
            </p>
            <p className="mt-2 text-sm uppercase tracking-wider text-gray-400">
              cas avec 1<sup>er</sup> règlement
            </p>
            {variation !== null && (
              <p className="mt-1 text-xs text-gray-500">
                <span
                  className={
                    variation > 0
                      ? 'text-[rgb(255,30,90)]'
                      : variation < 0
                        ? 'text-emerald-400'
                        : 'text-gray-400'
                  }
                >
                  {variation > 0 ? '▲ +' : variation < 0 ? '▼ ' : ''}
                  {formaterDecimal(Math.abs(variation), 1)}
                  {'\u00a0%'}
                </span>{' '}
                vs {annee - 1}
              </p>
            )}
          </div>

          <div className="hidden h-24 w-px bg-white/10 sm:block" />

          <div className="text-center sm:text-left">
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Sur l’ensemble des MP du secteur
            </p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {ctnData.mp.nbAvec1erReglement > 0
                ? `${formaterDecimal((total / ctnData.mp.nbAvec1erReglement) * 100, 0)} %`
                : '—'}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {formaterNombre(ctnData.mp.nbAvec1erReglement)} MP au total
            </p>
          </div>
        </div>
      </CarteAnalyse>

      {/* GRILLE : donut + codes MP */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Donut localisations */}
        <CarteAnalyse
          titre="Répartition par localisation anatomique"
          sousTitre="6 zones du corps"
          note="Lombalgies (rachis lombaire) non incluses ici, voir code 098A ci-contre."
          glowRouge
        >
          {donneesPie.length > 0 ? (
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
              <div className="h-[260px] w-full max-w-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donneesPie}
                      dataKey="valeur"
                      nameKey="nom"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      stroke="rgba(0,0,0,0.4)"
                      strokeWidth={1}
                      isAnimationActive={true}
                      animationDuration={600}
                    >
                      {donneesPie.map((_, i) => (
                        <Cell
                          key={i}
                          fill={
                            COULEURS_LOCALISATIONS[
                              i % COULEURS_LOCALISATIONS.length
                            ]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null
                        const p = payload[0]
                        return (
                          <div className="rounded-lg border border-white/15 bg-black/95 px-3 py-2 text-xs shadow-2xl backdrop-blur">
                            <p className="font-semibold capitalize text-white">
                              {p.name}
                            </p>
                            <p className="text-white">
                              {formaterPourcent(p.value as number)} ·{' '}
                              <span className="text-gray-400">
                                {formaterNombre(
                                  Math.round(
                                    ((p.value as number) / 100) * total
                                  )
                                )}{' '}
                                cas
                              </span>
                            </p>
                          </div>
                        )
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Légende custom à droite */}
              <ul className="flex-1 space-y-1.5">
                {donneesPie
                  .slice()
                  .sort((a, b) => b.valeur - a.valeur)
                  .map((d) => {
                    const i = donneesPie.findIndex((x) => x.nom === d.nom)
                    return (
                      <li
                        key={d.nom}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <span className="flex items-center gap-2">
                          <span
                            aria-hidden
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                              background:
                                COULEURS_LOCALISATIONS[
                                  i % COULEURS_LOCALISATIONS.length
                                ],
                            }}
                          />
                          <span className="capitalize text-gray-300">
                            {d.nom}
                          </span>
                        </span>
                        <span className="font-semibold text-white">
                          {formaterPourcent(d.valeur)}
                        </span>
                      </li>
                    )
                  })}
              </ul>
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-gray-500">
              Pas de données de répartition par localisation pour cette année.
            </p>
          )}
        </CarteAnalyse>

        {/* Codes MP cibles */}
        <CarteAnalyse
          titre="Codes MP : TMS et lombalgies"
          sousTitre="Tableaux officiels CNAM"
          note="Les codes 057A, 069A, 079A, 097A, 098A correspondent aux pathologies liées à l’activité physique."
          glowRouge
        >
          {codesTms.length > 0 ? (
            <ul className="space-y-2">
              {codesTms.map((c) => (
                <LigneCodeMp
                  key={c.codeTableau}
                  code={c.codeTableau}
                  libelle={c.libelle}
                  nb={c.nbMp}
                  glow
                />
              ))}
              {codesAutres.length > 0 && (
                <li className="pt-3">
                  <p className="mb-2 text-xs uppercase tracking-wider text-gray-500">
                    Autres pathologies remarquables (surdité, amiante)
                  </p>
                  <ul className="space-y-2">
                    {codesAutres.map((c) => (
                      <LigneCodeMp
                        key={c.codeTableau}
                        code={c.codeTableau}
                        libelle={c.libelle}
                        nb={c.nbMp}
                        glow={false}
                      />
                    ))}
                  </ul>
                </li>
              )}
            </ul>
          ) : (
            <p className="py-12 text-center text-sm text-gray-500">
              Pas de codes MP ciblés détectés pour cette année.
            </p>
          )}
        </CarteAnalyse>
      </div>
    </motion.div>
  )
}

/* ---------- Sous-composants ---------- */

interface LigneCodeMpProps {
  code: string
  libelle: string
  nb: number
  glow: boolean
}

function LigneCodeMp({ code, libelle, nb, glow }: LigneCodeMpProps) {
  return (
    <li
      className={`
        flex items-center justify-between rounded-md border px-3 py-2.5
        ${
          glow
            ? 'border-[rgb(255,30,90)]/40 bg-[rgb(255,30,90)]/[0.06]'
            : 'border-white/5 bg-white/[0.02]'
        }
      `}
      style={glow ? { boxShadow: '0 0 18px rgba(255,30,90,0.15)' } : undefined}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="rounded-md px-2 py-0.5 font-mono text-xs font-semibold"
          style={{
            color: glow ? COULEUR_RISQUE_PHYSIQUE : 'rgb(156,163,175)',
            background: glow
              ? 'rgba(255,30,90,0.12)'
              : 'rgba(255,255,255,0.06)',
          }}
        >
          {code}
        </span>
        <span className="truncate text-sm text-white">{libelle}</span>
      </div>
      <span className="font-semibold text-white">{formaterNombre(nb)}</span>
    </li>
  )
}
