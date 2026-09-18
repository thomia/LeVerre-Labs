/**
 * PRÉVISUALISATION — premier écran, mise au point du visuel d'appui.
 *
 * Page de travail temporaire, servie uniquement en développement (voir
 * `src/app/dev/layout.tsx`). Le texte est identique dans les trois variantes :
 * seul le visuel de droite change. À supprimer une fois la direction choisie.
 */

import Image from 'next/image'
import Link from 'next/link'
import { SchemaModele } from '@/app/vitrine/schema-modele'

export default function HeroVariantesPage() {
  return (
    <>
      <VariantePhoto />
      <VarianteSchema />
      <VarianteTexte />
      <BlocCitations />
    </>
  )
}

/* ---------- Texte commun aux trois variantes ---------- */

const MANIFESTE =
  "Parce que le cerveau humain intègre et retient ce qu'il peut visualiser, la métaphore est au cœur de l'approche : un levier cognitif et pédagogique."

function Texte({ manifesteAffiche = true }: { manifesteAffiche?: boolean }) {
  return (
    <>
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-[rgb(255,30,90)]">
        Ergonomie et prévention des risques professionnels
      </p>

      <h1 className="mt-5 text-4xl font-semibold leading-[1.15] tracking-tight text-white sm:text-5xl">
        Faire naître la prise de conscience du risque
      </h1>

      {manifesteAffiche && (
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300">{MANIFESTE}</p>
      )}

      <dl className="mt-9 max-w-xl space-y-5 border-l border-white/15 pl-6">
        <div>
          <dt className="font-medium text-white">Sensibilisation collective</dt>
          <dd className="mt-1.5 leading-relaxed text-gray-300">
            Une séance de 45 minutes pendant laquelle chaque participant modélise
            sa propre situation de travail depuis son téléphone.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-white">Analyse de poste</dt>
          <dd className="mt-1.5 leading-relaxed text-gray-300">
            Une évaluation structurée des contraintes d&apos;un poste, restituée
            sous forme d&apos;un état des lieux exploitable.
          </dd>
        </div>
      </dl>

      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-md bg-[rgb(255,30,90)] px-7 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-[rgb(255,60,120)]"
        >
          Nous contacter
        </Link>
        <Link
          href="#le-modele"
          className="inline-flex items-center justify-center rounded-md border border-white/20 px-7 py-3.5 text-[15px] font-medium text-white transition-colors hover:border-white/50 hover:bg-white/5"
        >
          Découvrir l&apos;approche
        </Link>
      </div>
    </>
  )
}

/* ---------- A — la photo de présentation ---------- */

function VariantePhoto() {
  return (
    <Cadre etiquette="A — photo de présentation">
      <div className="max-w-2xl">
        <Texte />
      </div>
      <figure className="m-0 hidden w-full lg:block">
        <div className="relative overflow-hidden rounded-lg border border-white/10">
          <Image
            src="/medias/presentation-poster.jpg"
            alt="Thomas Relot présentant le poster de recherche à l'origine du modèle du verre"
            width={1340}
            height={1992}
            priority
            className="h-auto w-full"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
        <figcaption className="mt-3 text-sm leading-relaxed text-gray-500">
          Présentation du poster de recherche à l&apos;origine du modèle.
        </figcaption>
      </figure>
    </Cadre>
  )
}

/* ---------- B — le schéma au trait ---------- */

function VarianteSchema() {
  return (
    <Cadre etiquette="B — schéma au trait">
      <div className="max-w-2xl">
        <Texte />
      </div>
      <div className="hidden lg:block">
        <SchemaModele />
      </div>
    </Cadre>
  )
}

/* ---------- C — aucun visuel, la phrase tient la page ---------- */

function VarianteTexte() {
  return (
    <Cadre etiquette="C — sans visuel">
      <div className="max-w-2xl">
        <Texte manifesteAffiche={false} />
      </div>
      <div className="hidden lg:block">
        <p className="border-l-2 border-[rgb(255,30,90)]/70 pl-6 text-xl leading-relaxed text-gray-200">
          {MANIFESTE}
        </p>
      </div>
    </Cadre>
  )
}

/* ---------- Bloc citations, à placer sous le premier écran ---------- */

function BlocCitations() {
  return (
    <section className="border-y border-white/10 bg-black py-24">
      <Etiquette>D — bandeau de citations (textes à valider)</Etiquette>
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500">
          Ce qu&apos;en disent les participants
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {CITATIONS.map((citation) => (
            <figure key={citation.id} className="m-0 border-l border-white/15 pl-6">
              <blockquote className="text-lg leading-relaxed text-gray-200">
                « {citation.texte} »
              </blockquote>
              <figcaption className="mt-4 text-sm text-gray-500">{citation.auteur}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

const CITATIONS = [
  {
    id: 'terrain-angle',
    texte: "Je n'avais jamais vu les choses sous cet angle",
    auteur: 'Participant, séance de sensibilisation — verbatim à confirmer',
  },
  {
    id: 'terrain-musculation',
    texte:
      "Ma séance de musculation avant le travail, ça veut dire que j'ai déjà rempli le verre ?",
    auteur: 'Participant, séance de sensibilisation — verbatim à confirmer',
  },
  {
    id: 'valeo',
    texte: 'Retour Valeo à insérer ici, deux lignes maximum',
    auteur: 'Fonction, site — accord de citation à obtenir',
  },
]

/* ---------- Éléments partagés ---------- */

function Cadre({ etiquette, children }: { etiquette: string; children: React.ReactNode }) {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden border-b border-white/10 bg-black">
      <Etiquette>{etiquette}</Etiquette>
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-[minmax(0,1fr)_26rem]">
        {children}
      </div>
    </section>
  )
}

function Etiquette({ children }: { children: React.ReactNode }) {
  return (
    <p className="absolute left-6 top-6 z-10 rounded bg-white/10 px-2.5 py-1 font-mono text-xs text-gray-400">
      {children}
    </p>
  )
}
