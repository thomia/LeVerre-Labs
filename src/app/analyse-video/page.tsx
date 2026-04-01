/**
 * PAGE ANALYSE VIDÉO
 * Route: /analyse-video
 * Permet d'analyser une vidéo en créant des tâches temporelles
 * avec des paramètres qui modifient le modèle du verre en temps réel
 */

'use client'

import VideoTaskEditor from '@/components/espace-personnel/video-task-editor'

export default function AnalyseVideoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 pt-20">
      {/* Main Content */}
      <main className="container mx-auto">
        <VideoTaskEditor />
      </main>
    </div>
  )
}
