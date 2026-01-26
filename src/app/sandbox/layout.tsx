/**
 * Layout pour la page Sandbox
 * Sans navbar/footer - interface isolée pour QR code public
 */

import { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  title: 'LeVerre Labs - Sandbox',
  description: 'Explorez le modèle du verre en mode interactif',
}

export default function SandboxLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
