import type { Metadata } from 'next'
import { LecteurEssai60s } from '@/components/vitrine/lecteur-essai-60s'

export const metadata: Metadata = {
  title: 'Essai 60 secondes',
  robots: { index: false, follow: false },
}

export default function Essai60sPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-24">
      <p className="mb-8 text-center text-xs tracking-wide text-white/30">
        Essai — l’accueil n’est pas modifié.
      </p>
      <LecteurEssai60s />
    </div>
  )
}
