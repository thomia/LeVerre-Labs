/**
 * Garde des outils internes (/dev/*).
 *
 * Ces pages sont des bancs d'essai destinés au développement local. Elles
 * étaient jusqu'ici servies en production (répondaient 200 à qui connaissait
 * l'adresse) : elles renvoient désormais une 404 hors développement.
 */

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function DevLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === 'production') notFound()

  return <>{children}</>
}
