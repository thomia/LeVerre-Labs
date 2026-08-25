'use client'

import { usePathname } from 'next/navigation'
import Navbar from './navbar'
import Footer from './footer'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isSandbox = pathname?.startsWith('/sandbox')
  const isEssaiVideo = pathname?.startsWith('/essai-60s')
  const sansChrome = isSandbox || isEssaiVideo

  return (
    <>
      {!sansChrome && <Navbar />}
      <main className="min-h-screen">
        {children}
      </main>
      {!sansChrome && <Footer />}
    </>
  )
}
