"use client"

/**
 * ScenarioSelector
 * Apparaît côté participant entre la phase "construction" et la phase
 * "simulation". Il choisit la temporalité que représentera son verre :
 *   - une tâche intense   (~1h)
 *   - une journée type    (~8h)
 *   - une semaine chargée (~40h)
 *
 * Le choix est sauvegardé dans la table `participants.simulation_scenario`.
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Loader2, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { SCENARIOS, SCENARIOS_ORDER } from '@/lib/simulation'
import type { SimulationScenario } from '@/lib/supabase/types'

interface ScenarioSelectorProps {
  participantId: string
  currentScenario: SimulationScenario | null
}

export function ScenarioSelector({
  participantId,
  currentScenario,
}: ScenarioSelectorProps) {
  const [selected, setSelected] = useState<SimulationScenario | null>(currentScenario)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSelect(scenario: SimulationScenario) {
    if (isSaving || selected === scenario) return
    setIsSaving(true)
    setError(null)

    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('participants')
      .update({ simulation_scenario: scenario })
      .eq('id', participantId)

    if (updateError) {
      setError(updateError.message)
    } else {
      setSelected(scenario)
    }
    setIsSaving(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4"
    >
      <div className="flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 p-3">
        <Clock className="h-5 w-5 shrink-0 text-blue-300" />
        <div>
          <p className="text-sm font-semibold text-blue-200">
            Choisis ta temporalité
          </p>
          <p className="text-xs text-slate-300">
            Quelle période ton verre va-t-il représenter pendant la simulation ?
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {SCENARIOS_ORDER.map((id) => {
          const meta = SCENARIOS[id]
          const isSelected = selected === id
          return (
            <button
              key={id}
              onClick={() => handleSelect(id)}
              disabled={isSaving}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition disabled:cursor-wait ${
                isSelected
                  ? 'border-blue-400 bg-blue-500/20 shadow-lg shadow-blue-500/20'
                  : 'border-white/10 bg-slate-900/60 hover:border-white/30 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{meta.title}</p>
                <p className="text-xs text-slate-400">{meta.description}</p>
              </div>
              {isSaving && isSelected ? (
                <Loader2 className="h-5 w-5 animate-spin text-blue-300" />
              ) : isSelected ? (
                <Check className="h-5 w-5 text-blue-300" />
              ) : (
                <span className="h-5 w-5 rounded-full border border-white/20" />
              )}
            </button>
          )
        })}
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}

      {selected && (
        <p className="text-center text-xs italic text-slate-400">
          Tu peux changer de scénario tant que le formateur n&apos;a pas lancé la simulation.
        </p>
      )}
    </motion.div>
  )
}
