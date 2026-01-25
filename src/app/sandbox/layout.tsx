/**
 * Layout pour la page Sandbox
 * Sans navbar/footer - interface isolée pour QR code public
 * Force l'affichage desktop avec zoom 125% même sur mobile
 */

import { Viewport } from 'next'

export const viewport: Viewport = {
  width: 1200,
  initialScale: 1.25,
  minimumScale: 1.25,
  maximumScale: 1.25,
  userScalable: false,
}

export default function SandboxLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
