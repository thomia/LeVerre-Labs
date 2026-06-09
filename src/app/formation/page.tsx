/**
 * PAGE FORMATION (ancienne route d'accueil formateur)
 * Route : /formation
 * Le lancement de session vit désormais dans l'espace formateur.
 * On redirige vers l'onglet sensibilisation.
 */

import { redirect } from 'next/navigation'

export default function FormationPage() {
  redirect('/espace-formateur?onglet=sensibilisation')
}
