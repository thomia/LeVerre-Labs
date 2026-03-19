/**
 * PAGE SANDBOX - BAC À SABLE PUBLIC
 * Route: /sandbox
 * Environnement d'expérimentation pour le grand public
 * Accessible via QR code pour démonstrations et tests
 * Viewport forcé desktop : width=1280, initial-scale=0.5, maximum-scale=0.5
 */

'use client'

import { useEffect, useState } from 'react'
import { SandboxInteractive } from '@/components/sandbox/sandbox-interactive'

export default function SandboxPage() {
  const [showInstructions, setShowInstructions] = useState(true)

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
      
      {/* Popup d'instructions */}
      {showInstructions && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <img 
                  src="/photo%20video/logo_noir-removebg-preview.png" 
                  alt="LeVerre Labs Logo" 
                  className="h-8 w-8 object-contain brightness-0 invert"
                />
                <h2 className="text-2xl font-bold">
                  <span className="text-[rgb(255,30,90)]">LeVerre</span>{' '}
                  <span className="text-white">Labs</span>
                </h2>
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[rgb(255,30,90)] to-transparent mx-auto mb-4"></div>
            </div>
            
            <div className="space-y-4 mb-6">
              <p className="text-white text-base leading-relaxed">
                Pour une expérience optimale :
              </p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[rgb(255,30,90)] mt-1">•</span>
                  <span>Mettez votre téléphone en <strong className="text-white">mode ordinateur</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[rgb(255,30,90)] mt-1">•</span>
                  <span>Réglez le zoom à <strong className="text-white">100%</strong></span>
                </li>
              </ul>
            </div>
            
            <button
              onClick={() => setShowInstructions(false)}
              className="w-full py-3 px-6 rounded-lg bg-[rgb(255,30,90)] hover:bg-[rgb(255,30,90)]/90 text-white font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              OK
            </button>
          </div>
        </div>
      )}
      
      <SandboxInteractive />
    </>
  )
}
