/**
 * PAGE PRINCIPALE - ACCUEIL
 * Route: /
 * Page d'accueil - Vitrine du projet LeVerre Labs
 */

import { redirect } from 'next/navigation'

export default function HomePage() {
  redirect('/vitrine')
}