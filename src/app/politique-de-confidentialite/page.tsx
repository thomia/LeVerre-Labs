/**
 * PAGE POLITIQUE DE CONFIDENTIALITÉ
 * Route : /politique-de-confidentialite
 *
 * Décrit les deux seuls traitements de données du site : les sessions de
 * formation et les demandes de contact. Le contenu doit rester le reflet exact
 * de ce que fait le code — si un traitement est ajouté, cette page bouge aussi.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { buildOpenGraph } from '@/lib/seo/site'
import { DERNIERE_MISE_A_JOUR, EDITEUR } from '@/lib/editeur'
import { EMAIL_CONTACT } from '@/lib/contact'
import { PageLegale, SectionLegale } from '@/components/layout/page-legale'

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description:
    "Quelles données LeVerre Labs collecte, pourquoi, combien de temps, et comment exercer vos droits.",
  alternates: {
    canonical: '/politique-de-confidentialite',
  },
  openGraph: buildOpenGraph({
    title: 'Politique de confidentialité | LeVerre Labs',
    description:
      'Traitement des données personnelles sur le site LeVerre Labs.',
    url: '/politique-de-confidentialite',
  }),
}

export default function PolitiqueConfidentialitePage() {
  return (
    <PageLegale
      titre="Politique de confidentialité"
      miseAJour={DERNIERE_MISE_A_JOUR}
    >
      <SectionLegale titre="En résumé">
        <p>
          Ce site ne dépose aucun cookie publicitaire, n&apos;utilise aucun outil
          de mesure d&apos;audience et ne revend aucune donnée. Deux situations
          seulement donnent lieu à une collecte : quand vous nous écrivez via le
          formulaire de contact, et quand vous participez à une séance de
          sensibilisation.
        </p>
      </SectionLegale>

      <SectionLegale titre="Responsable du traitement">
        <p>
          {EDITEUR.nom} — {EDITEUR.statutJuridique}. Pour toute question ou
          demande relative à vos données :{' '}
          <a
            href={`mailto:${EMAIL_CONTACT}`}
            className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
          >
            {EMAIL_CONTACT}
          </a>
          .
        </p>
      </SectionLegale>

      <SectionLegale titre="Quand vous nous contactez">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-white">Données :</strong> nom, organisation,
            email professionnel, téléphone si vous le renseignez, effectif
            concerné, et le message que vous rédigez.
          </li>
          <li>
            <strong className="text-white">Pourquoi :</strong> répondre à votre
            demande et, le cas échéant, établir une proposition.
          </li>
          <li>
            <strong className="text-white">Base légale :</strong> mesures
            précontractuelles prises à votre demande.
          </li>
          <li>
            <strong className="text-white">Durée :</strong> trois ans après le
            dernier échange, puis suppression.
          </li>
        </ul>
      </SectionLegale>

      <SectionLegale titre="Quand vous participez à une séance">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-white">Données :</strong> le pseudo que vous
            choisissez, le nom libre de votre tâche de référence, vos réponses aux
            questionnaires et les scores calculés. Nous ne demandons ni nom, ni
            email, ni aucune donnée de santé nominative.
          </li>
          <li>
            <strong className="text-white">Pourquoi :</strong> afficher votre
            modèle pendant la séance et permettre l&apos;échange collectif animé
            par le formateur.
          </li>
          <li>
            <strong className="text-white">Base légale :</strong> intérêt
            légitime à conduire l&apos;action de sensibilisation, dans le cadre
            convenu avec votre employeur.
          </li>
          <li>
            <strong className="text-white">Durée :</strong> le temps nécessaire à
            l&apos;animation et à sa restitution. Les données d&apos;une session
            sont supprimées à tout moment sur simple demande de
            l&apos;organisation concernée.
          </li>
        </ul>
        <p>
          Le pseudo étant libre, rien ne vous oblige à être identifiable par vos
          collègues.
        </p>
      </SectionLegale>

      <SectionLegale titre="Où sont hébergées les données">
        <p>
          Les données applicatives sont stockées chez Supabase, prestataire
          d&apos;hébergement de base de données. Le site lui-même est hébergé par
          Vercel (voir les{' '}
          <Link
            href="/mentions-legales"
            className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
          >
            mentions légales
          </Link>
          ).
        </p>
      </SectionLegale>

      <SectionLegale titre="Cookies et mesure d'audience">
        <p>
          Aucun cookie de suivi n&apos;est déposé. Le site utilise uniquement le
          stockage local de votre navigateur pour retenir des réglages
          d&apos;affichage pendant une séance ; ces informations restent sur
          votre appareil et ne nous sont jamais transmises. C&apos;est la raison
          pour laquelle aucun bandeau de consentement ne vous est imposé.
        </p>
      </SectionLegale>

      <SectionLegale titre="Vos droits">
        <p>
          Vous disposez d&apos;un droit d&apos;accès, de rectification,
          d&apos;effacement, de limitation et d&apos;opposition sur vos données.
          Écrivez à{' '}
          <a
            href={`mailto:${EMAIL_CONTACT}`}
            className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
          >
            {EMAIL_CONTACT}
          </a>{' '}
          : nous répondons sous un mois. Si la réponse ne vous satisfait pas,
          vous pouvez saisir la CNIL (
          <a
            href="https://www.cnil.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
          >
            cnil.fr
          </a>
          ).
        </p>
      </SectionLegale>
    </PageLegale>
  )
}
