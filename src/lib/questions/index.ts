/**
 * Registre des définitions d'éléments.
 * Permet à un composant de récupérer les questions + scoring d'un élément
 * sans connaître son implémentation interne.
 */

import type { ElementId } from '@/lib/supabase/types'
import type { ElementDefinition } from './types'
import { verreDefinition } from './verre'
import { robinetDefinition } from './robinet'
import { bulleDefinition } from './bulle'
import { orageDefinition } from './orage'
import { pailleDefinition } from './paille'

export const ELEMENT_DEFINITIONS: Record<ElementId, ElementDefinition> = {
  verre: verreDefinition,
  robinet: robinetDefinition,
  bulle: bulleDefinition,
  orage: orageDefinition,
  paille: pailleDefinition,
}

export function getElementDefinition(id: ElementId): ElementDefinition {
  return ELEMENT_DEFINITIONS[id]
}

export type { Question, QuestionOption, AnswersMap, ElementDefinition } from './types'
