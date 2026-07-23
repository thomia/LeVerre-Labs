import type { Metadata } from 'next'

/**
 * Constantes SEO partagées (URL canonique du site, nom de la marque…).
 * Centralisé ici pour que metadataBase, sitemap.ts, robots.ts et les
 * balises canonical/Open Graph de chaque page restent synchronisés.
 */

/**
 * URL canonique du site. Configurable via `NEXT_PUBLIC_SITE_URL` pour
 * pouvoir basculer facilement sur un domaine personnalisé sans toucher
 * au code. Valeur par défaut : le domaine Vercel actuel.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
  'https://leverre-labs.vercel.app'

export const SITE_NAME = 'LeVerre Labs'

/**
 * Code de vérification Google Search Console (méthode « balise HTML »).
 * À renseigner via `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`. Génère la
 * balise <meta name="google-site-verification" ...> attendue par Google.
 */
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

/** Construit une URL absolue à partir d'un chemin (ex: "/vitrine"). */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString()
}

export const DEFAULT_OG_IMAGE = absoluteUrl('/opengraph-image')

/**
 * Next.js ne fusionne PAS en profondeur l'objet `openGraph` entre layout
 * parent et page enfant (seule la première couche de clés est fusionnée) :
 * si une page définit son propre `openGraph`, les champs communs
 * (type, locale, siteName, image) du layout racine sont perdus. On les
 * réinjecte donc explicitement à chaque appel plutôt que de compter sur
 * un héritage automatique.
 */
export function buildOpenGraph(overrides: {
  title: string
  description: string
  url: string
}): NonNullable<Metadata['openGraph']> {
  return {
    type: 'website',
    locale: 'fr_FR',
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    ...overrides,
  }
}
