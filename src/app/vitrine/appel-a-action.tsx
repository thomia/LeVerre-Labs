/**
 * BLOC D'APPEL À L'ACTION DE FIN DE PAGE
 * Utilisé en bas de l'accueil : le visiteur qui a lu jusqu'ici est le plus
 * chaud du site, c'est le moment de lui proposer de nous écrire.
 *
 * Server Component : aucun état, aucune animation nécessaire.
 */

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface AppelAActionProps {
  /** Titre du bloc. Adapté au contexte de la page qui l'affiche. */
  titre?: string
  /** Phrase d'accompagnement sous le titre. */
  texte?: string
}

export function AppelAAction({
  titre = 'Et si vos équipes voyaient leur propre verre déborder ?',
  texte = "Décrivez-nous votre contexte : effectif, métiers, contraintes. Nous revenons vers vous sous 48 heures ouvrées avec une proposition adaptée.",
}: AppelAActionProps) {
  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-black px-6 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] max-w-full -translate-x-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,30,90,0.14) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
          {titre}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
          {texte}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[rgb(255,30,90)] px-8 py-4 text-base font-semibold text-white shadow-[0_0_30px_rgba(255,30,90,0.35)] transition-all hover:bg-[rgb(255,60,120)] hover:shadow-[0_0_45px_rgba(255,30,90,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Demander une proposition
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/fondements"
            className="inline-flex items-center justify-center rounded-full border border-white/25 px-8 py-4 text-base font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Comprendre notre démarche
          </Link>
        </div>
      </div>
    </section>
  )
}
