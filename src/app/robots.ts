import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/site'

/**
 * Génère /robots.txt automatiquement (convention App Router).
 * Autorise l'indexation des pages publiques et bloque les zones
 * privées / fonctionnelles (session en cours, espace formateur,
 * sandbox de démo, outils internes de dev, routes API).
 *
 * `/session` (saisie du code) reste indexable : quand un participant tape
 * l'adresse dans sa barre de recherche, le navigateur lance souvent une
 * recherche web — encore faut-il que la page soit trouvable. Les sessions
 * elles-mêmes (`/session/LV-ABCD`) restent hors index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/formation', '/session/', '/espace-formateur', '/sandbox', '/dev', '/api'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
