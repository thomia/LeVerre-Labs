/**
 * PAGE SANDBOX - BAC À SABLE PUBLIC
 * Route: /sandbox
 * Environnement d'expérimentation pour le grand public
 * Accessible via QR code pour démonstrations et tests
 * Force l'affichage desktop même sur mobile
 */

'use client'

import { useEffect } from 'react'
import { SandboxInteractive } from '@/components/sandbox/sandbox-interactive'

export default function SandboxPage() {
  useEffect(() => {
    // Forcer le viewport en mode desktop avec zoom bloqué à 125%
    const viewport = document.querySelector('meta[name="viewport"]')
    if (viewport) {
      viewport.setAttribute('content', 'width=1200, initial-scale=1.25, minimum-scale=1.25, maximum-scale=1.25, user-scalable=no')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'viewport'
      meta.content = 'width=1200, initial-scale=1.25, minimum-scale=1.25, maximum-scale=1.25, user-scalable=no'
      document.head.appendChild(meta)
    }

    // Restaurer le viewport normal quand on quitte la page
    return () => {
      const viewport = document.querySelector('meta[name="viewport"]')
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1')
      }
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        html, body {
          background-color: #000 !important;
          min-height: 100vh;
        }
      `}</style>
      <SandboxInteractive />
    </>
  )
}
