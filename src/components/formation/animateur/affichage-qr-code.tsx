"use client"

/**
 * Affiche le QR code menant à la page de la session pour les participants.
 * Les participants scannent → `/session/[code]` → saisissent leur pseudo.
 */

import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'

interface QRCodeDisplayProps {
  code: string
  size?: number
}

export function QRCodeDisplay({ code, size = 220 }: QRCodeDisplayProps) {
  const [sessionUrl, setSessionUrl] = useState('')

  useEffect(() => {
    // window n'existe qu'au client : on construit l'URL après hydratation
    setSessionUrl(`${window.location.origin}/session/${code}`)
  }, [code])

  if (!sessionUrl) {
    // placeholder de la bonne taille pour éviter le layout shift
    return <div style={{ width: size, height: size }} className="rounded-xl bg-slate-800" />
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-xl bg-white p-3 shadow-lg">
        <QRCodeSVG
          value={sessionUrl}
          size={size}
          level="M"
          bgColor="#ffffff"
          fgColor="#0f172a"
        />
      </div>
      <a
        href={sessionUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-slate-400 underline-offset-2 hover:text-blue-400 hover:underline"
      >
        {sessionUrl}
      </a>
    </div>
  )
}
