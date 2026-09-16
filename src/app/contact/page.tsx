/**
 * PAGE CONTACT
 * Route : /contact
 *
 * Point d'entrée commercial du site. Server Component : le texte et les
 * coordonnées partent dans le HTML, seul le formulaire est un composant client.
 */

import type { Metadata } from 'next'
import { Clock, Mail, MapPin } from 'lucide-react'
import { buildOpenGraph } from '@/lib/seo/site'
import { DELAI_REPONSE, EMAIL_CONTACT } from '@/lib/contact'
import { FormulaireContact } from './formulaire-contact'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    "Organisez une séance de sensibilisation aux TMS dans votre entreprise. Décrivez-nous votre contexte, nous répondons sous 48 heures ouvrées.",
  alternates: {
    canonical: '/contact',
  },
  openGraph: buildOpenGraph({
    title: 'Contact | LeVerre Labs',
    description:
      "Organisez une séance de sensibilisation aux TMS dans votre entreprise. Réponse sous 48 heures ouvrées.",
    url: '/contact',
  }),
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black px-6 pb-24 pt-32">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Parlons de vos équipes
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-300">
            Dites-nous qui vous êtes et ce que vous cherchez à faire bouger. Nous
            vous répondons avec une proposition concrète, pas un catalogue
            générique.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-10">
            <FormulaireContact />
          </div>

          <aside className="space-y-8">
            <InfoContact icone={Mail} titre="Par email">
              <a
                href={`mailto:${EMAIL_CONTACT}`}
                className="text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
              >
                {EMAIL_CONTACT}
              </a>
            </InfoContact>

            <InfoContact icone={Clock} titre="Délai de réponse">
              Sous {DELAI_REPONSE}.
            </InfoContact>

            <InfoContact icone={MapPin} titre="Où nous intervenons">
              En France, directement dans vos locaux. Les séances à distance sont
              possibles : chaque participant se connecte depuis son téléphone.
            </InfoContact>
          </aside>
        </div>
      </div>
    </div>
  )
}

/* ---------- Sous-composants ---------- */

interface InfoContactProps {
  icone: React.ComponentType<{ className?: string }>
  titre: string
  children: React.ReactNode
}

function InfoContact({ icone: Icone, titre, children }: InfoContactProps) {
  return (
    <div>
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
        <Icone className="h-4 w-4 text-[rgb(255,30,90)]" />
        {titre}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-gray-300">{children}</p>
    </div>
  )
}
