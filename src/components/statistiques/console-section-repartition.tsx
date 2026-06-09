'use client'

/**
 * Composant utilitaire pour afficher une "section de répartition" :
 * = la liste des libellés d'une catégorie (ex: tranches d'âge,
 *   localisations de lésion, déviations) avec leurs valeurs en barres
 *   horizontales triées par fréquence.
 *
 * Réutilisé dans les vues Démographie, Causes, Lésions.
 *
 * GLOW ROUGE : automatique sur les lignes detectées comme liées au
 * risque d'activité physique, via `ligneEstActivitePhysique(section, libelle)`.
 *
 * Le composant offre 3 modes de mesure (toggle au-dessus du chart) :
 *   - "%"     : pourcentage du total (defaut, plus lisible)
 *   - "cas"   : nombre de cas avec 1er règlement
 *   - "ip"    : nombre de nouvelles incapacités permanentes
 */

import { useMemo, useState } from 'react'
import type { RepartitionLigne } from '@/data/stats-am/types'
import { ligneEstActivitePhysique } from '@/lib/stats-am/glow'
import { BarHorizontale } from './console-bar-horizontale'
import { CarteAnalyse } from './console-carte-analyse'

interface ConsoleSectionRepartitionProps {
  /** Titre affiché sur la carte. */
  titre: string
  /** Sous-titre (contexte CTN/année). */
  sousTitre?: string
  /** Note pédagogique en bas de carte. */
  note?: string
  /** Identifiant de la section (clé dans le type Repartitions). */
  section: string
  /** Lignes de la répartition. */
  lignes: RepartitionLigne[] | undefined
  /** Si true, retire la ligne "Non précisé(e)" / "Indéterminé" du chart. */
  ignorerNonPrecise?: boolean
}

const MESURES = {
  pourcentage: { libelle: '%', sousTitre: 'pourcentage' },
  cas: { libelle: 'Cas', sousTitre: 'nombre de cas (1er règl.)' },
  ip: { libelle: 'IP', sousTitre: 'nouvelles incapacités permanentes' },
} as const
type Mesure = keyof typeof MESURES

export function ConsoleSectionRepartition({
  titre,
  sousTitre,
  note,
  section,
  lignes,
  ignorerNonPrecise = true,
}: ConsoleSectionRepartitionProps) {
  const [mesure, setMesure] = useState<Mesure>('pourcentage')

  /* Filtrage + tri + calcul des valeurs selon la mesure choisie. */
  const lignesAffichees = useMemo(() => {
    if (!lignes || lignes.length === 0) return []

    const filtrees = ignorerNonPrecise
      ? lignes.filter(
          (l) =>
            !/^non\s*pr[ée]cis|^non\s*d[ée]termin|^ind[ée]termin/i.test(
              l.libelle
            )
        )
      : lignes

    const total = filtrees.reduce((s, l) => s + (l.nb1erReglement || 0), 0)
    const totalIp = filtrees.reduce((s, l) => s + (l.nbNouvellesIp || 0), 0)

    return filtrees
      .map((l) => {
        let valeur = 0
        if (mesure === 'pourcentage')
          valeur = total > 0 ? (l.nb1erReglement / total) * 100 : 0
        else if (mesure === 'cas') valeur = l.nb1erReglement
        else valeur = l.nbNouvellesIp
        return { ligne: l, valeur }
      })
      .filter((x) => x.valeur > 0 || mesure === 'pourcentage')
      .sort((a, b) => b.valeur - a.valeur)
      .map((x) => ({
        ...x,
        // Valeur secondaire affichée en gris à côté du chiffre
        // principal pour donner du contexte.
        secondaire:
          mesure === 'pourcentage'
            ? totalIp > 0 && x.ligne.nbNouvellesIp > 0
              ? `${x.ligne.nbNouvellesIp} IP`
              : undefined
            : total > 0
              ? `${((x.ligne.nb1erReglement / total) * 100).toFixed(0)} %`
              : undefined,
      }))
  }, [lignes, ignorerNonPrecise, mesure])

  /* Glow rouge sur la carte si AU MOINS 1 ligne touche au risque physique. */
  const carteAGlow = useMemo(
    () =>
      lignesAffichees.some((x) =>
        ligneEstActivitePhysique(section, x.ligne.libelle)
      ),
    [lignesAffichees, section]
  )

  const maxValeur =
    lignesAffichees.length > 0
      ? Math.max(...lignesAffichees.map((x) => x.valeur))
      : 0

  return (
    <CarteAnalyse
      titre={titre}
      sousTitre={sousTitre}
      note={note}
      glowRouge={carteAGlow}
      actions={
        <div className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 p-0.5 text-xs">
          {(Object.keys(MESURES) as Mesure[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMesure(m)}
              className={`
                rounded px-2 py-0.5 font-medium transition
                ${
                  mesure === m
                    ? 'bg-white/15 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }
              `}
              title={MESURES[m].sousTitre}
            >
              {MESURES[m].libelle}
            </button>
          ))}
        </div>
      }
    >
      {lignesAffichees.length > 0 ? (
        <ul className="space-y-2.5">
          {lignesAffichees.map((x) => (
            <BarHorizontale
              key={x.ligne.libelle}
              libelle={x.ligne.libelle}
              valeur={x.valeur}
              maxValeur={mesure === 'pourcentage' ? 100 : maxValeur}
              unite={mesure === 'pourcentage' ? '%' : ''}
              glow={ligneEstActivitePhysique(section, x.ligne.libelle)}
              valeurSecondaire={x.secondaire}
            />
          ))}
        </ul>
      ) : (
        <p className="py-8 text-center text-sm text-gray-500">
          Pas de données disponibles pour cette section.
        </p>
      )}
    </CarteAnalyse>
  )
}
