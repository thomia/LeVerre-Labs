import type { Metadata } from 'next'
import { EcranSaisieCode } from '@/components/formation/participant/ecran-saisie-code'

/**
 * PAGE PARTICIPANT - Saisie du code de session
 * Route : /session
 *
 * Adresse de secours, courte et dictable en salle (« leverre-labs.com/session »),
 * pour les participants qui ne scannent pas le QR code.
 */
export const metadata: Metadata = {
  title: 'Rejoindre une session',
  description:
    'Saisis le code de session communiqué par ton formateur pour rejoindre une session de sensibilisation LeVerre Labs.',
  alternates: {
    canonical: '/session',
  },
}

export default function SaisieCodeSessionPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gradient-to-br from-black via-slate-950 to-slate-900 p-4">
      <EcranSaisieCode />
    </div>
  )
}
