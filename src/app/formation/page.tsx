/**
 * PAGE FORMATION - Accueil formateur
 * Route : /formation
 * Permet de lancer une session de sensibilisation collective
 */

import { FormateurLogin } from '@/components/formation/animateur/ecran-connexion'

export default function FormationPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-slate-950 to-slate-900 p-4 pt-24">
      <FormateurLogin />
    </div>
  )
}
