/**
 * PAGE D'ACCUEIL
 * Route: / (URL canonique unique du site)
 *
 * Le contenu vitrine est désormais servi directement sur `/` (et non plus via
 * une redirection vers `/vitrine`). Server Component : porte les metadata SEO
 * et envoie le HTML complet ; l'interactivité vit dans <VitrineClient>.
 */

import type { Metadata } from 'next'
import { buildOpenGraph } from '@/lib/seo/site'
import VitrineClient from './vitrine/vitrine-client'

export const metadata: Metadata = {
  title: 'Prévention des TMS en entreprise',
  description:
    "LeVerre Labs transforme la prévention des troubles musculosquelettiques (TMS) au travail grâce à une métaphore visuelle innovante, pensée pour la formation en entreprise.",
  alternates: {
    canonical: '/',
  },
  openGraph: buildOpenGraph({
    title: 'Prévention des TMS en entreprise | LeVerre Labs',
    description:
      "Une métaphore visuelle innovante pour former et sensibiliser vos équipes à la prévention des troubles musculosquelettiques.",
    url: '/',
  }),
}

export default function HomePage() {
  return <VitrineClient />
}
