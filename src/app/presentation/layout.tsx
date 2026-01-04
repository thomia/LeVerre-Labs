/**
 * Layout pour le Mode Présentation
 * Avec AuthProvider pour la protection
 */

import { AuthProvider } from '@/contexts/AuthContext'

export default function PresentationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
