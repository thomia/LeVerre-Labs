/**
 * PAGE COLLABORER
 * Route : /collaborer
 * Server Component : porte les metadata SEO. Le contenu interactif
 * (radar des disciplines, CTA mailto) vit dans <CollaborerClient>.
 */

import type { Metadata } from 'next'
import { buildOpenGraph } from '@/lib/seo/site'
import CollaborerClient from './collaborer-client'

export const metadata: Metadata = {
  title: 'Collaborer avec LeVerre Labs',
  description:
    'Chercheurs, ergonomes, RH ou institutions : échangeons sur la prévention des TMS. Conseil en ergonomie et prévention en Rhône-Alpes.',
  alternates: {
    canonical: '/collaborer',
  },
  openGraph: buildOpenGraph({
    title: 'Collaborer avec LeVerre Labs',
    description:
      'Là où nos disciplines se croisent : chercheurs, ergonomes, RH et institutions, écrivons-nous.',
    url: '/collaborer',
  }),
}

export default function CollaborerPage() {
  return <CollaborerClient />
}
