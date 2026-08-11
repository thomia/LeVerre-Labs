"use client"

/**
 * GraphiqueFilRouge — récap de l'indicateur "temps avant débordement".
 *
 * Une courbe par participant montrant comment l'indicateur évolue à mesure que
 * les éléments s'ajoutent (Robinet → Bulle → Orage → Paille). Support formateur
 * pour repérer l'élément qui fait vraiment basculer le modèle.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
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

// Palette cyclique pour distinguer les participants : uniquement des NUANCES
// DE ROUGE, pour former une famille visuelle distincte des lignes verticales
// d'éléments (qui, elles, gardent la couleur de leur élément). La sélection au
// clic + la légende permettent d'isoler un cas précis si besoin.
const PALETTE = [
  '#ff1e5a', '#dc2626', '#fb7185', '#991b1b', '#f87171',
  '#e11d48', '#fca5a5', '#7f1d1d', '#ff8a8a', '#b91c1c',
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

  // Sélection d'un participant : clic sur sa courbe ou sa légende → on le met
  // en valeur (les autres s'estompent) ; clic ailleurs → on désélectionne.
  const [selectedId, setSelectedId] = useState<string | null>(null)
  // Évite que le clic de sélection (qui remonte jusqu'au conteneur) déclenche
  // aussitôt la désélection.
  const justSelectedRef = useRef(false)

  useEffect(() => {
    if (!isOpen) setSelectedId(null)
  }, [isOpen])

  // Couleur stable par participant (indexée sur l'ordre d'arrivée).
  const colorById = useMemo(() => {
    const map: Record<string, string> = {}
    active.forEach((p, idx) => {
      map[p.id] = PALETTE[idx % PALETTE.length]
    })
    return map
  }, [active])

  function selectParticipant(id: string) {
    justSelectedRef.current = true
    setSelectedId((prev) => (prev === id ? null : id))
  }

  function handleBackgroundClick() {
    if (justSelectedRef.current) {
      justSelectedRef.current = false
      return
    }
    setSelectedId(null)
  }

  // Ordre de rendu : le participant sélectionné en dernier (donc au-dessus).
  const orderedActive = useMemo(() => {
    if (!selectedId) return active
    return [...active].sort((a, b) => {
      const aSel = a.id === selectedId ? 1 : 0
      const bSel = b.id === selectedId ? 1 : 0
      return aSel - bSel
    })
  }, [active, selectedId])

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
              <div onClick={handleBackgroundClick}>
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
                          strokeOpacity={0.9}
                          strokeWidth={2}
                        />
                      ))}
                      {/* padding : on décale la 1re colonne (Robinet) de l'axe Y
                          pour que sa ligne verticale bleue ne se superpose plus à
                          l'axe blanc (sinon le bleu vire au gris). */}
                      <XAxis
                        dataKey="label"
                        stroke="#94a3b8"
                        tick={<ColoredAxisTick />}
                        padding={{ left: 32, right: 24 }}
                      />
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
                      {orderedActive.map((p) => {
                        const isSelected = selectedId === p.id
                        const isDimmed = selectedId !== null && !isSelected
                        return (
                          <Line
                            key={p.id}
                            type="monotone"
                            dataKey={p.id}
                            name={p.pseudo}
                            stroke={colorById[p.id]}
                            strokeWidth={isSelected ? 4 : 2}
                            strokeOpacity={isDimmed ? 0.15 : 1}
                            dot={isDimmed ? false : { r: isSelected ? 4 : 3 }}
                            activeDot={{ r: isSelected ? 6 : 4 }}
                            connectNulls={false}
                            onClick={() => selectParticipant(p.id)}
                            style={{ cursor: 'pointer' }}
                          />
                        )
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Légende cliquable : sélectionne / met en valeur un participant. */}
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  {active.map((p) => {
                    const isSelected = selectedId === p.id
                    const isDimmed = selectedId !== null && !isSelected
                    return (
                      <button
                        key={p.id}
                        onClick={() => selectParticipant(p.id)}
                        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition ${
                          isSelected
                            ? 'border-white/40 bg-white/10 font-semibold text-white'
                            : isDimmed
                              ? 'border-white/10 text-slate-500 hover:text-slate-300'
                              : 'border-white/10 text-slate-200 hover:text-white'
                        }`}
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: colorById[p.id], opacity: isDimmed ? 0.4 : 1 }}
                        />
                        {p.pseudo}
                      </button>
                    )
                  })}
                </div>

                {selectedId && (
                  <p className="mt-2 text-center text-[11px] text-slate-500">
                    Cas mis en avant — clique ailleurs pour tout réafficher.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
