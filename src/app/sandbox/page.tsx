/**
 * PAGE SANDBOX - BAC À SABLE PUBLIC
 * Route: /sandbox
 * Environnement d'expérimentation pour le grand public
 * Accessible via QR code pour démonstrations et tests
 * Viewport forcé desktop : width=1280, initial-scale=0.5, maximum-scale=0.5
 */

'use client'

import { useEffect } from 'react'
import { SandboxInteractive } from '@/components/sandbox/sandbox-interactive'

export default function SandboxPage() {
  useEffect(() => {
    // Forcer le viewport desktop
    const viewport = document.querySelector('meta[name="viewport"]')
    if (viewport) {
      viewport.setAttribute('content', 'width=1280, initial-scale=0.5, maximum-scale=0.5, user-scalable=no')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'viewport'
      meta.content = 'width=1280, initial-scale=0.5, maximum-scale=0.5, user-scalable=no'
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
