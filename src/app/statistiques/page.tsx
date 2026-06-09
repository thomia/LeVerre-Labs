/**
 * Page Statistiques : console d'exploration interactive des donnees
 * publiques de sinistralite au travail (AT, MP, TMS).
 *
 * Server Component : charge les 9 annees disponibles cote serveur puis
 * delegue tout le rendu interactif au composant client <ConsoleStats>.
 *
 * Architecture :
 *   /statistiques (cette page)
 *     -> <ConsoleStats>                  (orchestration, lit URL params)
 *         -> <ConsoleFiltres>            (sticky : vue + annee + CTN + indicateur)
 *         -> <ConsoleKpiCards>           (4 chiffres cles avec glow TMS)
 *         -> <ConsoleVueXxx>             (selon la vue active)
 *
 * Tous les filtres sont persistes dans l'URL via `nuqs` (?annee=2024&ctn=A...).
 * Cela permet le partage de "vues" et l'utilisation du retour-arriere
 * comme dans une vraie application data.
 */

import { Suspense } from 'react'
import { chargerToutesAnnees } from '@/lib/stats-am'
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
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-[rgb(255,30,90)] border-t-transparent" />
    </div>
  )
}

/* ---------- Footer source (statique, server-side) ---------- */

function FooterSource() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-12 text-center text-sm text-gray-500">
      <p className="mx-auto max-w-2xl">
        Source : <span className="text-gray-300">Assurance Maladie</span> —
        Direction des Risques Professionnels. Données extraites des rapports
        annuels publiés par la CNAM (2015-2024), consultables sur{' '}
        <a
          href="https://assurance-maladie.ameli.fr"
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
