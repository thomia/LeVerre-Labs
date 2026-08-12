import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/site'

/**
 * Génère /sitemap.xml automatiquement (convention App Router).
 * Ne liste que les pages publiques destinées à être indexées : les
 * espaces privés (formation, session, espace-formateur, sandbox, dev)
 * en sont volontairement exclus.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const pages: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1, changeFrequency: 'monthly' },
    { path: '/fondements', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/recherche-scientifique', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/statistiques', priority: 0.7, changeFrequency: 'yearly' },
    { path: '/collaborer', priority: 0.6, changeFrequency: 'monthly' },
  ]

  return pages.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}
