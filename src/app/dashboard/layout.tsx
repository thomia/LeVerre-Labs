/**
 * Layout pour le Dashboard (routes protégées)
 * Sans navbar/footer - avec AuthProvider
 */

import { AuthProvider } from '@/contexts/AuthContext'
import '@/styles/globals.css'

export default function DashboardLayout({
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
