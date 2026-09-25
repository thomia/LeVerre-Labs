/**
 * Types du module ANALYSE RAPIDE (découpage vidéo au fil de l'eau).
 *
 * Vocabulaire :
 *   - **Moment** : un segment de la vidéo (clic début → clic fin) correspondant
 *     à une phase de travail observable ("préparer le carton", "charger la
 *     palette", "attente machine"…).
 *   - **Critère** : une ligne de notation à l'intérieur d'un élément du modèle
 *     (ex. pour le Robinet : charge physique, posture, fréquence…).
 *   - **Gravité** : curseur 0-100 du critère. TOUJOURS dans le même sens :
 *     0 = rien à signaler, 100 = le pire observable. Même pour le Verre et la
 *     Paille (éléments "positifs"), on note la défaveur puis le score est
 *     inversé au calcul — l'ergonome n'a jamais à inverser mentalement.
 *   - **Poids** : importance du critère dans le score de son élément, choisie
 *     parmi 4 niveaux (les 4 cases en face de chaque ligne).
 */

import type { ElementId } from '@/lib/supabase/types'

/** Notation d'un critère : gravité 0-100 + niveau de poids (index 0-3). */
export interface NotationCritere {
  gravite: number
  /** Index dans `NIVEAUX_POIDS`. `null` = critère écarté (non observable). */
  niveauPoids: number | null
}

/** Notations d'un moment, indexées par `critereId`. */
export type NotationsMoment = Record<string, NotationCritere>

/** Un segment de vidéo découpé puis noté. */
export interface MomentAnalyse {
  id: string
  nom: string
  /** Bornes en secondes dans la vidéo. */
  debut: number
  fin: number
  notations: NotationsMoment
  /** Note libre de l'observateur (justification, repère anatomique, mesure…). */
  commentaire: string
}

/** Les 5 scores du modèle calculés pour un moment (0-100). */
export type ScoresMoment = Record<ElementId, number>

/**
 * Durée minimale d'un moment, en secondes. En dessous, on considère que le
 * double-clic était involontaire : le moment n'est pas créé et une poignée de
 * redimensionnement ne peut pas écraser le segment.
 */
export const DUREE_MIN_MOMENT = 0.5
