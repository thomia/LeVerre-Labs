/**
 * PAGE RECHERCHE SCIENTIFIQUE
 * Route : /recherche-scientifique (rubrique Ressources)
 * Présente la démarche académique de LeVerre Labs + le poster ModACT 2026.
 */

import { RechercheScientifique } from '@/components/ressources/recherche-scientifique'

export const metadata = {
  title: 'Recherche scientifique | LeVerre Labs',
  description:
    'Les travaux académiques, conférences et recherches de LeVerre Labs, dont le poster scientifique présenté à ModACT 2026.',
}

export default function RechercheScientifiquePage() {
  return <RechercheScientifique />
}
