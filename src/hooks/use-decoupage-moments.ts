"use client"

/**
 * Gestion des moments découpés dans la vidéo : création, ajustement, héritage.
 *
 * Deux règles structurantes :
 *   - **Aucun chevauchement** : un instant de la vidéo appartient à un seul
 *     moment, sinon la physique du verre n'aurait plus de taux unique à
 *     appliquer. Un moment créé par-dessus un autre est tronqué à l'espace
 *     libre.
 *   - **Héritage du moment précédent** : un nouveau moment reprend les
 *     notations du précédent. Sur un poste réel, l'environnement, la
 *     récupération et le profil de l'opérateur ne changent pas d'une tâche à
 *     l'autre — on n'ajuste que ce qui bouge, ce qui fait gagner l'essentiel du
 *     temps de notation en direct.
 */

import { useCallback, useState } from 'react'
import {
  DUREE_MIN_MOMENT,
  notationsParDefaut,
  type MomentAnalyse,
  type NotationsMoment,
} from '@/lib/analyse-rapide'

function trie(moments: MomentAnalyse[]): MomentAnalyse[] {
  return [...moments].sort((a, b) => a.debut - b.debut)
}

function copieNotations(notations: NotationsMoment): NotationsMoment {
  const copie: NotationsMoment = {}
  for (const [cle, valeur] of Object.entries(notations)) copie[cle] = { ...valeur }
  return copie
}

export function useDecoupageMoments() {
  const [moments, setMoments] = useState<MomentAnalyse[]>([])

  /** Crée un moment dans l'espace libre entre `debut` et `fin`. Renvoie son id. */
  const creeMoment = useCallback(
    (debut: number, fin: number): string | null => {
      const tries = trie(moments)

      let bordDebut = Math.min(debut, fin)
      let bordFin = Math.max(debut, fin)

      for (const moment of tries) {
        if (moment.debut <= bordDebut && moment.fin > bordDebut) bordDebut = moment.fin
      }
      for (const moment of tries) {
        if (moment.debut > bordDebut && moment.debut < bordFin) bordFin = moment.debut
      }

      if (bordFin - bordDebut < DUREE_MIN_MOMENT) return null

      const precedent = tries.filter((moment) => moment.debut < bordDebut).pop()

      const nouveau: MomentAnalyse = {
        id: `moment-${Date.now()}`,
        nom: `Moment ${moments.length + 1}`,
        debut: bordDebut,
        fin: bordFin,
        notations: precedent ? copieNotations(precedent.notations) : notationsParDefaut(),
        commentaire: '',
      }

      setMoments(trie([...moments, nouveau]))

      return nouveau.id
    },
    [moments]
  )

  const majMoment = useCallback((moment: MomentAnalyse) => {
    setMoments((actuels) => actuels.map((item) => (item.id === moment.id ? moment : item)))
  }, [])

  /** Déplace une borne sans jamais empiéter sur les moments voisins. */
  const ajusteBornes = useCallback((id: string, bornes: { debut?: number; fin?: number }) => {
    setMoments((actuels) => {
      const tries = trie(actuels)
      const index = tries.findIndex((moment) => moment.id === id)
      if (index === -1) return actuels

      const moment = tries[index]
      const minimum = index > 0 ? tries[index - 1].fin : 0
      const maximum = index < tries.length - 1 ? tries[index + 1].debut : Number.POSITIVE_INFINITY

      const debut =
        bornes.debut === undefined
          ? moment.debut
          : Math.max(minimum, Math.min(bornes.debut, moment.fin - DUREE_MIN_MOMENT))
      const fin =
        bornes.fin === undefined
          ? moment.fin
          : Math.min(maximum, Math.max(bornes.fin, moment.debut + DUREE_MIN_MOMENT))

      tries[index] = { ...moment, debut, fin }
      return tries
    })
  }, [])

  const supprimeMoment = useCallback((id: string) => {
    setMoments((actuels) => actuels.filter((moment) => moment.id !== id))
  }, [])

  const remplaceMoments = useCallback((nouveaux: MomentAnalyse[]) => {
    setMoments(trie(nouveaux))
  }, [])

  return { moments, creeMoment, majMoment, ajusteBornes, supprimeMoment, remplaceMoments }
}
