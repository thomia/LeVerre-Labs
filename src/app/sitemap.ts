import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/site'

/**
 * Génère /sitemap.xml automatiquement (convention App Router).
 * Ne liste que les pages publiques destinées à être indexées : les
 * espaces privés (formation, sessions en cours, espace-formateur, sandbox,
 * dev) en sont volontairement exclus.
 *
 * `/session` fait exception : c'est l'adresse de secours que les participants
 * tapent (ou cherchent) pour rejoindre une session, elle doit être trouvable.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const pages: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.9, changeFrequency: 'yearly' },
    { path: '/fondements', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/recherche-scientifique', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/statistiques', priority: 0.7, changeFrequency: 'yearly' },
    { path: '/collaborer', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/session', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/mentions-legales', priority: 0.2, changeFrequency: 'yearly' },
    { path: '/politique-de-confidentialite', priority: 0.2, changeFrequency: 'yearly' },
  ]

  return pages.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}
