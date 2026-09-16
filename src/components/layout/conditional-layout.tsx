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
      {/* Lien d'évitement : invisible à la souris, il apparaît au premier Tab
          et permet de sauter la navigation pour atteindre le contenu. */}
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[rgb(255,30,90)] focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Aller au contenu principal
      </a>
      <Navbar />
      <main id="contenu" className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}
