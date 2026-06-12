'use client'

/**
 * Barre de filtres sticky de la console `/statistiques`.
 *
 * Toute la selection (annee, CTN, indicateur, vue) est persistee dans
 * l'URL via `nuqs` -> partageable + retour-arriere navigateur.
 *
 * Layout (mobile-first, mais essentiellement utilise en desktop) :
 *
 *   Ligne 1 : selecteur de VUE (tabs horizontales).
 *   Ligne 2 : selecteurs Annee | Secteur | Indicateur (selects).
 *
 * Le composant n'affiche pas de donnees : il modifie juste les query
 * params. Les composants soeurs (KPI cards, vues) lisent ces params
 * via les memes hooks `nuqs`.
 */

import { useFiltresStats } from '@/lib/stats-am/use-filtres-stats'
import {
  CTN_INFO,
  INDICATEURS,
  ORDRE_CTN,
  ORDRE_INDICATEURS,
  ORDRE_VUES,
  VUES,
  type VueId,
  type IndicateurId,
} from '@/lib/stats-am/constants'
import { ANNEES_DISPONIBLES } from '@/lib/stats-am'
import type { CtnCode } from '@/data/stats-am/types'

export function ConsoleFiltres() {
  const { annee, ctn, indicateur, vue, setAnnee, setCtn, setIndicateur, setVue } =
    useFiltresStats()

  return (
    // `top-20` = 80px = hauteur de la navbar globale (h-20) ; la barre
    // de filtres se colle juste en dessous quand on scroll.
    <div className="sticky top-20 z-30 border-b border-white/10 bg-black/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Ligne 1 : onglets de VUE (centres) */}
        <nav
          role="tablist"
          aria-label="Choix de la vue"
          className="flex flex-wrap justify-center gap-2 pb-5"
        >
          {ORDRE_VUES.map((id) => (
            <OngletVue
              key={id}
              id={id}
              actif={vue === id}
              onClick={() => setVue(id)}
            />
          ))}
        </nav>

        {/* Ligne 2 : selecteurs annee / secteur / indicateur (centres) */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <SelectFiltre
            label="Année"
            value={String(annee)}
            onChange={(v) => setAnnee(parseInt(v, 10))}
            options={ANNEES_DISPONIBLES.map((a) => ({
              value: String(a),
              libelle: String(a),
            }))}
          />
          <SelectFiltre
            label="Secteur"
            value={ctn}
            onChange={(v) => setCtn(v as CtnCode)}
            options={ORDRE_CTN.map((code) => ({
              value: code,
              libelle:
                code === 'tous'
                  ? 'France entière'
                  : `${CTN_INFO[code].libelleCourt} (CTN ${code})`,
            }))}
          />
          <SelectFiltre
            label="Indicateur"
            value={indicateur}
            onChange={(v) => setIndicateur(v as IndicateurId)}
            options={ORDRE_INDICATEURS.map((id) => ({
              value: id,
              libelle: INDICATEURS[id].libelleCourt,
            }))}
          />
        </div>
      </div>
    </div>
  )
}

/* ---------- Sous-composants ---------- */

interface OngletVueProps {
  id: VueId
  actif: boolean
  onClick: () => void
}

function OngletVue({ id, actif, onClick }: OngletVueProps) {
  const { libelle, description } = VUES[id]
  return (
    <button
      type="button"
      role="tab"
      aria-selected={actif}
      title={description}
      onClick={onClick}
      className={`
        whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition
        ${
          actif
            ? 'bg-[rgb(255,30,90)]/15 text-white ring-1 ring-[rgb(255,30,90)]/50'
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }
      `}
    >
      {libelle}
    </button>
  )
}

interface SelectFiltreProps {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; libelle: string }[]
}

function SelectFiltre({ label, value, onChange, options }: SelectFiltreProps) {
  return (
    <label
      className="
        flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5
        text-sm transition hover:border-[rgb(255,30,90)]/40 focus-within:border-[rgb(255,30,90)]/60
      "
    >
      <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer border-none bg-transparent text-base font-medium text-white outline-none [&>option]:bg-black"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.libelle}
          </option>
        ))}
      </select>
    </label>
  )
}
