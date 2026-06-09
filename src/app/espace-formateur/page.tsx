/**
 * PAGE ESPACE FORMATEUR
 * Route : /espace-formateur
 * Zone privée de l'animateur (mot de passe formateur requis).
 * Regroupe la sensibilisation collective et l'analyse vidéo en onglets.
 */

import { Suspense } from 'react'
import { VerrouAccesFormateur } from '@/components/formation/animateur/verrou-acces-formateur'
import { EspaceFormateur } from '@/components/formation/animateur/espace-formateur'

export default function EspaceFormateurPage() {
  return (
    <Suspense fallback={<ChargementEspace />}>
      <VerrouAccesFormateur>
        <EspaceFormateur />
      </VerrouAccesFormateur>
    </Suspense>
  )
}

function ChargementEspace() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-[rgb(255,30,90)] border-t-transparent" />
    </div>
  )
}
