'use client'

/**
 * Hook qui expose l'etat partage de la console `/statistiques`.
 *
 * Tous les filtres sont persistes dans l'URL via `nuqs` :
 *   - `?annee=2024`         (int, defaut = annee la plus recente)
 *   - `?ctn=tous`           (string, defaut = "tous")
 *   - `?indicateur=at`      (string, defaut = "at")
 *   - `?vue=synthese`       (string, defaut = "synthese")
 *
 * Avantages de `nuqs` ici :
 *   - URL partageable et bookmarkable (= chaque vue est une "page")
 *   - Bouton retour-arriere du navigateur fonctionne naturellement
 *   - Pas besoin de Context React (un hook = une source de verite)
 */

import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import { ANNEES_DISPONIBLES, ANNEE_RECENTE } from '@/lib/stats-am'
import {
  INDICATEURS,
  ORDRE_CTN,
  VUES,
  type IndicateurId,
  type VueId,
} from '@/lib/stats-am/constants'
import type { CtnCode } from '@/data/stats-am/types'

/**
 * Lit/ecrit les 4 filtres dans l'URL. Les setters sont stables d'un
 * render a l'autre (gestion interne par nuqs).
 */
export function useFiltresStats() {
  const [params, setParams] = useQueryStates(
    {
      annee: parseAsInteger.withDefault(ANNEE_RECENTE),
      ctn: parseAsString.withDefault('tous'),
      indicateur: parseAsString.withDefault('at'),
      vue: parseAsString.withDefault('synthese'),
    },
    {
      // `history: 'push'` cree une entree dans l'historique a chaque
      // changement -> bouton retour utile. Pour des filtres mineurs on
      // pourrait passer a 'replace', mais ici l'utilisateur veut creuser.
      history: 'push',
    }
  )

  // Validation defensive : si l'URL contient une valeur inconnue, on
  // retombe sur les defauts. Cela evite les bugs si un utilisateur
  // partage un URL avec des params corrompus.
  const annee = (ANNEES_DISPONIBLES as readonly number[]).includes(params.annee)
    ? (params.annee as (typeof ANNEES_DISPONIBLES)[number])
    : ANNEE_RECENTE
  const ctn: CtnCode = ORDRE_CTN.includes(params.ctn as CtnCode)
    ? (params.ctn as CtnCode)
    : 'tous'
  const indicateur: IndicateurId =
    params.indicateur in INDICATEURS
      ? (params.indicateur as IndicateurId)
      : 'at'
  const vue: VueId = params.vue in VUES ? (params.vue as VueId) : 'synthese'

  return {
    annee,
    ctn,
    indicateur,
    vue,
    setAnnee: (a: number) => setParams({ annee: a }),
    setCtn: (c: CtnCode) => setParams({ ctn: c }),
    setIndicateur: (i: IndicateurId) => setParams({ indicateur: i }),
    setVue: (v: VueId) => setParams({ vue: v }),
  }
}
