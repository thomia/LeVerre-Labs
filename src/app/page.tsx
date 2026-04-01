/**
 * PAGE PRINCIPALE - ACCUEIL
 * Route: /
 * Page d'accueil - Vitrine du projet LeVerre Labs
 * Redirige vers la page vitrine
 */

import { redirect } from 'next/navigation'

export default function HomePage() {
  // Rediriger automatiquement vers la page vitrine
  redirect('/vitrine')
}