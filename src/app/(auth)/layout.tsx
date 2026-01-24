/**
 * Layout pour les pages d'authentification
 * Sans navbar/footer, juste l'AuthProvider
 */

import { AuthProvider } from '@/contexts/AuthContext'
import '@/styles/globals.css'

export default function AuthLayout({
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
