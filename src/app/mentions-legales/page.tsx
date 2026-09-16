/**
 * PAGE MENTIONS LÉGALES
 * Route : /mentions-legales
 *
 * Obligation de la LCEN (article 6-III) pour tout site professionnel.
 * Les informations affichées viennent de `src/lib/editeur.ts`.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { buildOpenGraph } from '@/lib/seo/site'
import { DERNIERE_MISE_A_JOUR, EDITEUR, HEBERGEUR } from '@/lib/editeur'
import { EMAIL_CONTACT } from '@/lib/contact'
import { SITE_NAME, SITE_URL } from '@/lib/seo/site'
import { PageLegale, SectionLegale } from '@/components/layout/page-legale'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description:
    "Éditeur, directeur de publication, hébergeur et propriété intellectuelle du site LeVerre Labs.",
  alternates: {
    canonical: '/mentions-legales',
  },
  openGraph: buildOpenGraph({
    title: 'Mentions légales | LeVerre Labs',
    description: 'Informations légales du site LeVerre Labs.',
    url: '/mentions-legales',
  }),
}

export default function MentionsLegalesPage() {
  return (
    <PageLegale titre="Mentions légales" miseAJour={DERNIERE_MISE_A_JOUR}>
      <SectionLegale titre="Éditeur du site">
        <dl className="space-y-2">
          <Ligne intitule="Nom" valeur={EDITEUR.nom} />
          <Ligne intitule="Statut juridique" valeur={EDITEUR.statutJuridique} />
          <Ligne intitule="Immatriculation" valeur={EDITEUR.immatriculation} />
          <Ligne intitule="Adresse" valeur={EDITEUR.adressePostale} />
          <Ligne intitule="Contact" valeur={EMAIL_CONTACT} />
          <Ligne
            intitule="Directeur de la publication"
            valeur={EDITEUR.directeurPublication}
          />
          {EDITEUR.declarationActivite && (
            <Ligne
              intitule="Déclaration d'activité de formation"
              valeur={EDITEUR.declarationActivite}
            />
          )}
        </dl>
      </SectionLegale>

      <SectionLegale titre="Hébergeur">
        <p>
          {HEBERGEUR.nom}, {HEBERGEUR.adresse} —{' '}
          <a
            href={HEBERGEUR.site}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
          >
            {HEBERGEUR.site}
          </a>
        </p>
      </SectionLegale>

      <SectionLegale titre="Propriété intellectuelle">
        <p>
          L&apos;ensemble du site {SITE_NAME} ({SITE_URL}) — sa structure, ses
          textes, son code, le modèle visuel du verre et les illustrations qui
          l&apos;accompagnent — est protégé par le droit d&apos;auteur. Toute
          reproduction ou réutilisation, totale ou partielle, sans autorisation
          écrite préalable est interdite.
        </p>
        <p>
          Les données de sinistralité présentées dans la rubrique{' '}
          <Link
            href="/statistiques"
            className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
          >
            Statistiques nationales AT/MP
          </Link>{' '}
          proviennent des publications de l&apos;Assurance Maladie – Risques
          professionnels (CNAM) et restent la propriété de leur auteur.
        </p>
      </SectionLegale>

      <SectionLegale titre="Données personnelles">
        <p>
          Le traitement des données collectées sur le site est détaillé dans
          notre{' '}
          <Link
            href="/politique-de-confidentialite"
            className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
          >
            politique de confidentialité
          </Link>
          .
        </p>
      </SectionLegale>

      <SectionLegale titre="Responsabilité">
        <p>
          Le modèle proposé sur ce site est un outil de sensibilisation et de
          dialogue. Il ne constitue ni un diagnostic médical, ni une évaluation
          réglementaire des risques professionnels, et ne remplace pas
          l&apos;évaluation qui incombe à l&apos;employeur au titre du document
          unique (article R. 4121-1 du Code du travail).
        </p>
      </SectionLegale>
    </PageLegale>
  )
}

/* ---------- Sous-composants ---------- */

function Ligne({ intitule, valeur }: { intitule: string; valeur: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
      <dt className="min-w-[260px] font-medium text-gray-400">{intitule}</dt>
      <dd className="text-gray-200">{valeur}</dd>
    </div>
  )
}
