/**
 * Layout pour la page Sandbox
 * Sans navbar/footer - interface isolée pour QR code public
 * Force l'affichage desktop même sur mobile
 */

import { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  width: 1200,
  initialScale: 0.5,
  minimumScale: 0.3,
  maximumScale: 2,
  userScalable: true,
}

export default function SandboxLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
