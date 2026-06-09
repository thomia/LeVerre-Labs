/**
 * PAGE ANALYSE VIDÉO (ancienne route publique)
 * Route : /analyse-video
 * L'analyse vidéo est désormais privée, dans l'espace formateur.
 * On redirige les anciens liens vers l'onglet dédié.
 */

import { redirect } from 'next/navigation'

export default function AnalyseVideoPage() {
  redirect('/espace-formateur?onglet=analyse-video')
}
