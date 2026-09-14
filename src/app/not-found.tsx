import Link from 'next/link'
import { Home, LogIn } from 'lucide-react'

/**
 * Page 404 du site.
 *
 * Le 404 par défaut de Next.js (« This page could not be found ») laissait un
 * participant qui a mal recopié l'adresse sans aucune porte de sortie : on
 * propose l'accueil et l'accès direct à une session.
 */
export default function PageIntrouvable() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gradient-to-br from-black via-slate-950 to-slate-900 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-8 text-center shadow-2xl backdrop-blur">
        <p className="text-5xl font-bold text-[rgb(255,30,90)]">404</p>
        <h1 className="mt-3 text-xl font-semibold text-white">
          Cette page n&apos;existe pas
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          L&apos;adresse est peut-être incomplète ou mal recopiée.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/session"
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500"
          >
            <LogIn className="h-5 w-5" />
            Rejoindre une session
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-white/30 hover:text-white"
          >
            <Home className="h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
