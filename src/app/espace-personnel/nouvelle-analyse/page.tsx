"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function NouvelleAnalysePage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirection vers la nouvelle interface d'analyse unifiée
    router.push("/analysis")
  }, [router])
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
      <div className="text-white text-lg">Redirection vers l'analyse...</div>
    </div>
  )
}
