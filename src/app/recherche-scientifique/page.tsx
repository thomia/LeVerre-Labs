/**
 * PAGE RECHERCHE SCIENTIFIQUE
 * Route : /recherche-scientifique (rubrique Ressources)
 * Présente la démarche académique de LeVerre Labs + le poster ModACT 2026.
 */

import type { Metadata } from 'next'
import { buildOpenGraph } from '@/lib/seo/site'
import { RechercheScientifique } from '@/components/ressources/recherche-scientifique'

export const metadata: Metadata = {
  title: 'Recherche scientifique en prévention des TMS',
  description:
    'Les travaux académiques, conférences et recherches de LeVerre Labs sur la prévention des TMS, dont le poster scientifique présenté à ModACT 2026.',
  alternates: {
    canonical: '/recherche-scientifique',
  },
  openGraph: buildOpenGraph({
    title: 'Recherche scientifique en prévention des TMS | LeVerre Labs',
    description:
      'Les travaux académiques et recherches qui fondent la démarche LeVerre Labs en prévention des TMS.',
    url: '/recherche-scientifique',
  }),
}

export default function RechercheScientifiquePage() {
  return <RechercheScientifique />
}
