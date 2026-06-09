/**
 * Page Statistiques : console d'exploration interactive des donnees
 * publiques de sinistralite au travail (AT, MP, TMS).
 *
 * Server Component : charge les annees disponibles cote serveur puis
 * delegue le rendu interactif au composant client <ConsoleStats>.
 *
 * Mise en page :
 *   <ConsoleIntro>  -> contexte (source, mise en lisibilite, se situer)
 *   <ConsoleStats>  -> la console interactive (lit les query params)
 *   <FooterSource>  -> mention de source discrete
 *
 * Les filtres de la console sont persistes dans l'URL via `nuqs`
 * (?annee=2024&ctn=A...), ce qui permet de partager une "vue".
 */

import { Suspense } from 'react'
import { chargerToutesAnnees } from '@/lib/stats-am'
import { ConsoleIntro } from '@/components/statistiques/console-intro'
import { ConsoleStats } from '@/components/statistiques/console-stats'

export const metadata = {
  title: 'Statistiques AT/MP | LeVerre Labs',
  description:
    "Console d'exploration des donnees publiques de sinistralite au travail en France (Accidents du Travail, Maladies Professionnelles, TMS). Source : Assurance Maladie - Risques professionnels.",
}

export default async function StatistiquesPage() {
  const toutesAnnees = await chargerToutesAnnees()

  return (
    <>
      <ConsoleIntro />
      <Suspense fallback={<ChargementConsole />}>
        <ConsoleStats toutesAnnees={toutesAnnees} />
      </Suspense>
      <FooterSource />
    </>
  )
}

/* ---------- Fallback de chargement (le temps de lire l'URL) ---------- */

function ChargementConsole() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center bg-black">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-[rgb(255,30,90)] border-t-transparent" />
    </div>
  )
}

/* ---------- Mention de source (discrete, sans argumentaire) ---------- */

function FooterSource() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-10 text-center text-sm text-gray-500">
      <p className="mx-auto max-w-2xl">
        Source : Assurance Maladie, Direction des Risques Professionnels.
        Données publiques (2015 à 2024), consultables sur{' '}
        <a
          href="https://www.assurance-maladie.ameli.fr/etudes-et-donnees/sinistralite-atmp-secteur-activite-ctn-details"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[rgb(255,30,90)] hover:underline"
        >
          assurance-maladie.ameli.fr
        </a>
        .
      </p>
    </footer>
  )
}
