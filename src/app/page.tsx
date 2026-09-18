/**
 * PAGE D'ACCUEIL
 * Route: / (URL canonique unique du site)
 *
 * Server Component : porte les metadata SEO, le premier écran (<HeroAccueil>)
 * et le bloc de contact final. Tout cela part dans le HTML au premier rendu.
 * L'interactivité (démos du modèle, sections dépliables) vit dans
 * <VitrineClient>.
 */

import type { Metadata } from 'next'
import { buildOpenGraph } from '@/lib/seo/site'
import { HeroAccueil } from './vitrine/hero-accueil'
import { AppelAAction } from './vitrine/appel-a-action'
import VitrineClient from './vitrine/vitrine-client'

export const metadata: Metadata = {
  title: 'Formation et sensibilisation aux TMS en entreprise',
  description:
    "Formez vos équipes à la prévention des troubles musculosquelettiques avec un modèle visuel que chaque participant manipule depuis son téléphone. Séances collectives en entreprise.",
  alternates: {
    canonical: '/',
  },
  openGraph: buildOpenGraph({
    title: 'Formation et sensibilisation aux TMS en entreprise | LeVerre Labs',
    description:
      "Une séance collective où chaque participant modélise son propre poste de travail et voit le verre déborder. Prévention des TMS rendue concrète.",
    url: '/',
  }),
}

export default function HomePage() {
  return (
    <>
      <HeroAccueil />
      <VitrineClient />
      <AppelAAction />
    </>
  )
}
