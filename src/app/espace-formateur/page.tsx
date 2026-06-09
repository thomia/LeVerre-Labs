/**
 * PAGE ESPACE FORMATEUR
 * Route : /espace-formateur
 * Zone privée de l'animateur (mot de passe formateur requis).
 * Regroupe la sensibilisation collective et l'analyse vidéo en onglets.
 */

import { VerrouAccesFormateur } from '@/components/formation/animateur/verrou-acces-formateur'
import { EspaceFormateur } from '@/components/formation/animateur/espace-formateur'

export default function EspaceFormateurPage() {
  return (
    <VerrouAccesFormateur>
      <EspaceFormateur />
    </VerrouAccesFormateur>
  )
}
