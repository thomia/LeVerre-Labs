"use client"

/**
 * GraphiqueFilRouge — récap de l'indicateur "temps avant débordement".
 *
 * Une courbe par participant montrant comment l'indicateur évolue à mesure que
 * les éléments s'ajoutent (Robinet → Bulle → Orage → Paille). Support formateur
 * pour repérer l'élément qui fait vraiment basculer le modèle.
 */

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts'
import type { LiveParticipant } from '@/hooks/use-participants'
import type { ElementId, ParticipantScores } from '@/lib/supabase/types'
import { computeFilRougeSeries } from '@/lib/indicateur'
import { ELEMENT_THEME } from '@/lib/element-theme'

interface GraphiqueFilRougeProps {
  participants: LiveParticipant[]
  isOpen: boolean
  onClose: () => void
}

// Palette cyclique pour distinguer les participants. On évite volontairement
// les teintes des lignes verticales d'éléments (bleu robinet, violet bulle,
// ambre orage, vert paille) : le 1er tracé est le rouge LeVerre, le 2e blanc.
const PALETTE = [
  '#ff1e5a', '#f8fafc', '#f472b6', '#fb923c', '#2dd4bf',
  '#e879f9', '#fca5a5', '#fdba74', '#5eead4', '#f9a8d4',
]

// Étapes de l'axe X : chaque colonne correspond à un élément du modèle
// (dans l'ordre où ils s'empilent sur l'indicateur).
const STAGES: ElementId[] = ['robinet', 'bulle', 'orage', 'paille']

// Tick de l'axe X coloré au code couleur de l'élément.
function ColoredAxisTick({
  x,
  y,
  payload,
}: {
  x?: number
  y?: number
  payload?: { value?: string }
}) {
  const label = payload?.value ?? ''
  const stage = STAGES.find((el) => ELEMENT_THEME[el].name === label)
  const color = stage ? ELEMENT_THEME[stage].color : '#94a3b8'
  return (
    <text
      x={x}
      y={(y ?? 0) + 16}
      textAnchor="middle"
      fill={color}
      fontSize={12}
      fontWeight={600}
    >
      {label}
    </text>
  )
}

export function GraphiqueFilRouge({ participants, isOpen, onClose }: GraphiqueFilRougeProps) {
  // Ne garder que les participants ayant au moins renseigné le Robinet.
  const active = useMemo(
    () =>
      participants.filter(
        (p) => (p.scores as ParticipantScores)?.robinet !== undefined
      ),
    [participants]
  )

  const data = useMemo(() => {
    const rows = STAGES.map(
      (el) => ({ label: ELEMENT_THEME[el].name }) as Record<string, string | number | null>
    )

    for (const p of active) {
      const series = computeFilRougeSeries(p.scores as ParticipantScores)
      series.forEach((point, i) => {
        rows[i][p.id] = point.seconds === null ? null : Math.round(point.seconds)
      })
    }
    return rows
  }, [active])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="graph-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex w-full max-w-4xl flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Récap — temps avant débordement
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Plus la courbe descend, plus le verre déborde vite. Repère
                  l&apos;élément qui fait basculer le modèle.
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition hover:bg-slate-700 hover:text-white"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {active.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-sm text-slate-400">
                Aucune donnée pour l&apos;instant — les courbes apparaîtront dès
                le Robinet renseigné.
              </div>
            ) : (
              <div className="h-[420px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.08)"
                      horizontal
                      vertical={false}
                    />
                    {/* Une ligne verticale par élément, au code couleur de l'élément. */}
                    {STAGES.map((el) => (
                      <ReferenceLine
                        key={el}
                        x={ELEMENT_THEME[el].name}
                        stroke={ELEMENT_THEME[el].color}
                        strokeOpacity={0.5}
                        strokeWidth={2}
                      />
                    ))}
                    <XAxis dataKey="label" stroke="#94a3b8" tick={<ColoredAxisTick />} />
                    <YAxis
                      stroke="#94a3b8"
                      tick={{ fontSize: 12 }}
                      label={{
                        value: 'Secondes',
                        angle: -90,
                        position: 'insideLeft',
                        fill: '#94a3b8',
                        fontSize: 12,
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                      formatter={(value: unknown) => [`${value} s`, ''] as [string, string]}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    {active.map((p, idx) => (
                      <Line
                        key={p.id}
                        type="monotone"
                        dataKey={p.id}
                        name={p.pseudo}
                        stroke={PALETTE[idx % PALETTE.length]}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        connectNulls={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
