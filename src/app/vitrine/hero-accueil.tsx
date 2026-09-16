/**
 * PREMIER ÉCRAN DE L'ACCUEIL
 * Rendu par la route `/` (voir `src/app/page.tsx`).
 *
 * Server Component volontairement : c'est le contenu que le visiteur doit voir
 * immédiatement (titre, promesse, boutons). Il part dans le HTML et s'affiche
 * sans attendre le moindre JavaScript.
 *
 * Il porte le <h1> unique de la page : tous les autres titres de l'accueil sont
 * des <h2>, ce qui donne une hiérarchie correcte pour Google et les lecteurs
 * d'écran.
 */

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Award, Smartphone, Users } from 'lucide-react'

export function HeroAccueil() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-black pt-28 pb-16">
      {/* Photo de fond : servie par next/image, donc convertie en AVIF/WebP et
          redimensionnée. `priority` car c'est l'élément le plus visible. */}
      <Image
        src="/medias/atelier-industriel.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-40"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-[rgb(255,30,90)]/40 bg-[rgb(255,30,90)]/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-[rgb(255,120,160)]">
            <Award className="h-3.5 w-3.5" />
            Méthode primée à ModACT 2026
          </p>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Formez vos équipes aux TMS{' '}
            <span className="block text-[rgb(255,30,90)]">
              sans un seul diaporama
            </span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-gray-300 sm:text-xl">
            Vos collaborateurs manipulent un modèle visuel depuis leur téléphone,
            règlent les curseurs de leur propre poste de travail et voient le verre
            déborder. La prévention devient concrète en une séance collective.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[rgb(255,30,90)] px-8 py-4 text-base font-semibold text-white shadow-[0_0_30px_rgba(255,30,90,0.35)] transition-all hover:bg-[rgb(255,60,120)] hover:shadow-[0_0_45px_rgba(255,30,90,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Organiser une session
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#le-modele"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-8 py-4 text-base font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Découvrir la méthode
            </Link>
          </div>

          <ul className="mt-14 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
            {PREUVES.map((preuve) => (
              <li key={preuve.libelle} className="flex items-start gap-3">
                <preuve.icone
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-[rgb(255,30,90)]"
                  aria-hidden
                />
                <span className="text-base leading-snug text-gray-200">
                  {preuve.libelle}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ---------- Contenu statique ---------- */

const PREUVES = [
  {
    icone: Users,
    libelle: 'Une séance collective : chacun modélise son propre poste',
  },
  {
    icone: Smartphone,
    libelle: 'Aucune installation : les participants rejoignent par QR code',
  },
  {
    icone: Award,
    libelle: 'Modèle adossé à la littérature scientifique sur les TMS',
  },
] as const
