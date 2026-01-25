/**
 * PAGE SANDBOX - BAC À SABLE PUBLIC
 * Route: /sandbox
 * Environnement d'expérimentation pour le grand public
 * Accessible via QR code pour démonstrations et tests
 * Le viewport est défini dans layout.tsx
 */

'use client'

import { SandboxInteractive } from '@/components/sandbox/sandbox-interactive'

export default function SandboxPage() {
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
