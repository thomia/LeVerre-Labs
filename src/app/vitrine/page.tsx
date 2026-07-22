/**
 * PAGE VITRINE - PRÉSENTATION DU MODÈLE
 * Route: /vitrine
 * Présentation complète du modèle LeVerre Labs avec explications scientifiques.
 *
 * Server Component : porte les metadata SEO et envoie le HTML complet au
 * premier chargement. L'interactivité (scroll, animations) vit dans
 * <VitrineClient>.
 */

import type { Metadata } from 'next'
import { buildOpenGraph } from '@/lib/seo/site'
import VitrineClient from './vitrine-client'

export const metadata: Metadata = {
  title: 'Prévention des TMS en entreprise',
  description:
    "LeVerre Labs transforme la prévention des troubles musculosquelettiques (TMS) au travail grâce à une métaphore visuelle innovante, pensée pour la formation en entreprise.",
  alternates: {
    canonical: '/vitrine',
  },
  openGraph: buildOpenGraph({
    title: 'Prévention des TMS en entreprise | LeVerre Labs',
    description:
      "Une métaphore visuelle innovante pour former et sensibiliser vos équipes à la prévention des troubles musculosquelettiques.",
    url: '/vitrine',
  }),
}

export default function VitrinePage() {
  return <VitrineClient />
}
