/**
 * PAGE PRINCIPALE - ACCUEIL
 * Route: /
 * Page d'accueil - Vitrine du projet LeVerre Labs
 * Redirige vers /vitrine
 */

import { redirect } from 'next/navigation'

export default function HomePage() {
  // Rediriger automatiquement vers /vitrine
  redirect('/vitrine')
}