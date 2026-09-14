"use client"

/**
 * Affiche le QR code menant à la page de la session pour les participants.
 * Les participants scannent → `/session/[code]` → saisissent leur pseudo.
 *
 * Le bloc affiche aussi la voie manuelle (adresse courte + code en gros) :
 * c'est ce que le formateur dicte aux participants qui ne scannent pas, et
 * c'est beaucoup plus fiable que de faire recopier l'URL complète.
 */

import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'

interface QRCodeDisplayProps {
  code: string
  size?: number
}

export function QRCodeDisplay({ code, size = 220 }: QRCodeDisplayProps) {
  const [origine, setOrigine] = useState('')

  useEffect(() => {
    // window n'existe qu'au client : on construit l'URL après hydratation
    setOrigine(window.location.origin)
  }, [code])

  if (!origine) {
    // placeholder de la bonne taille pour éviter le layout shift
    return <div style={{ width: size, height: size }} className="rounded-xl bg-slate-800" />
  }

  const sessionUrl = `${origine}/session/${code}`
  // Adresse à dicter : sans le protocole, plus courte à taper sur un téléphone.
  const adresseCourte = `${origine.replace(/^https?:\/\//, '')}/session`

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

      <div className="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-center">
        <p className="text-[11px] uppercase tracking-wider text-slate-500">
          Sans scanner
        </p>
        <p className="font-mono text-sm text-slate-200">{adresseCourte}</p>
        <p className="text-[11px] text-slate-500">puis code</p>
        <p className="font-mono text-2xl font-bold tracking-widest text-blue-400">
          {code}
        </p>
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
