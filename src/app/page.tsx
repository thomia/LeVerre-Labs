/**
 * PAGE PRINCIPALE - ACCUEIL
 * Route: /
 * Page d'accueil - Vitrine du projet LeVerre Labs
 * Sur la branche sandbox : redirige vers /sandbox
 */

import { redirect } from 'next/navigation'

export default function HomePage() {
  // Rediriger automatiquement vers /sandbox
  redirect('/sandbox')
}