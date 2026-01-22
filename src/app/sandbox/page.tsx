/**
 * PAGE SANDBOX - BAC À SABLE PUBLIC
 * Route: /sandbox
 * Page publique accessible via lien/QR code pour permettre au grand public
 * d'interagir avec le modèle du verre
 */

'use client'

import { SandboxInteractive } from '@/components/sandbox/sandbox-interactive'

export default function SandboxPage() {
  return (
    <div className="h-screen bg-black">
      <SandboxInteractive />
    </div>
  )
}
