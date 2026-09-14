'use client'

import { usePathname } from 'next/navigation'
import Navbar from './navbar'
import Footer from './footer'

/**
 * Navbar + footer vitrine autour des pages du site.
 *
 * Les routes « application » en sont exclues : elles occupent tout l'écran et
 * pilotent elles-mêmes leur mise en page. Sur mobile, la navbar `fixed h-20`
 * recouvrait le haut de la vue participant et le footer marketing s'ajoutait
 * sous un contenu déjà en `100dvh` — le participant scrollait dans la vitrine
 * au lieu de répondre à ses questions.
 */
const ROUTES_APPLICATION = ['/sandbox', '/session', '/formation']

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isApplication = ROUTES_APPLICATION.some((route) =>
    pathname?.startsWith(route)
  )

  if (isApplication) return <main className="min-h-[100dvh]">{children}</main>

  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
