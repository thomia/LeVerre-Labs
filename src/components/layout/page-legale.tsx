/**
 * MISE EN PAGE DES TEXTES LÉGAUX
 * Utilisée par /mentions-legales et /politique-de-confidentialite.
 *
 * Server Components : ces pages sont du texte, elles n'ont besoin d'aucun
 * JavaScript. Objectif de lisibilité : colonne étroite, texte clair sur fond
 * sombre, titres de sections repérables.
 */

interface PageLegaleProps {
  titre: string
  miseAJour: string
  children: React.ReactNode
}

export function PageLegale({ titre, miseAJour, children }: PageLegaleProps) {
  return (
    <div className="min-h-screen bg-black px-6 pb-24 pt-32">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {titre}
        </h1>
        <p className="mt-4 text-sm text-gray-500">
          Dernière mise à jour : {miseAJour}
        </p>

        <div className="mt-16 space-y-14">{children}</div>
      </div>
    </div>
  )
}

interface SectionLegaleProps {
  titre: string
  children: React.ReactNode
}

export function SectionLegale({ titre, children }: SectionLegaleProps) {
  return (
    <section className="space-y-4 text-base leading-relaxed text-gray-300">
      <h2 className="text-xl font-semibold text-white">{titre}</h2>
      {children}
    </section>
  )
}
