import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '@/lib/seo/site'

/**
 * Données structurées JSON-LD (schema.org) injectées globalement.
 *
 * - `Organization` : décrit la marque LeVerre Labs (aide Google à
 *   constituer le « Knowledge Panel » et à relier le site à son auteur).
 * - `WebSite` : décrit le site et déclare son nom officiel.
 *
 * Server Component : le <script> part dans le HTML au premier rendu,
 * donc directement lisible par les robots d'indexation.
 */
export function JsonLd() {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: DEFAULT_OG_IMAGE,
    description:
      "LeVerre Labs transforme la prévention des troubles musculosquelettiques (TMS) au travail grâce à une métaphore visuelle innovante : le modèle du verre.",
    founder: {
      '@type': 'Person',
      name: 'Thomas Relot',
    },
    areaServed: 'FR',
    knowsAbout: [
      'Prévention des TMS',
      'Ergonomie',
      'Troubles musculosquelettiques',
      'Santé au travail',
      'Formation gestes et postures',
    ],
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'fr-FR',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  )
}
