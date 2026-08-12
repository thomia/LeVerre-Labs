/**
 * Résumé lisible des réponses d'un participant pour un élément donné.
 *
 * Sert au formateur : au survol du score d'un élément (mosaïque / modale focus),
 * on affiche ce que le participant a réellement répondu, en clair. On reconstruit
 * les libellés à partir des définitions de questions (pour les QCM, on retrouve
 * l'option choisie via ses points ; pour les curseurs, on montre la valeur ;
 * pour le texte libre, on montre le texte saisi).
 */

import type { ElementId } from '@/lib/supabase/types'
import { getElementDefinition } from './index'
import type { Question } from './types'

export interface ResumeReponse {
  /** Regroupement optionnel (ex. "Imprévu 1" pour l'Orage). */
  section?: string
  /** Intitulé court de la question. */
  label: string
  /** Réponse en clair (libellé d'option, valeur du curseur, ou texte). */
  valeur: string
}

function labelFromOptions(question: Question, points: number): string {
  return question.options?.find((o) => o.points === points)?.label ?? String(points)
}

export function resumeReponses(
  element: ElementId,
  answers: Record<string, unknown>
): ResumeReponse[] {
  const definition = getElementDefinition(element)
  const resume: ResumeReponse[] = []

  for (const question of definition.questions) {
    const raw = answers[question.id]
    if (raw === undefined || raw === null) continue

    if (question.type === 'text') {
      if (typeof raw === 'string' && raw.trim()) {
        resume.push({ section: question.section, label: 'Nom', valeur: raw.trim() })
      }
      continue
    }

    if (question.type === 'scale') {
      const value = typeof raw === 'number' ? raw : 0
      // Le curseur porte déjà le nom de l'aspect (section) : on l'utilise en
      // libellé, sans regroupement.
      resume.push({ label: question.section ?? question.question, valeur: `${value} / 100` })
      continue
    }

    if (question.type === 'single' && typeof raw === 'number') {
      resume.push({
        section: question.section,
        label: question.question,
        valeur: labelFromOptions(question, raw),
      })
      continue
    }
  }

  return resume
}
