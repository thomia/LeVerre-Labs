/**
 * Page Mon Profil (placeholder)
 */

'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProfilPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-white mb-4">
          Mon <span className="text-amber-400">Profil</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Cette fonctionnalité sera disponible prochainement
        </p>
        <Button
          onClick={() => router.push('/dashboard')}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au dashboard
        </Button>
      </div>
    </div>
  )
}
