/**
 * PRÉVISUALISATION — premier écran sur fond de nappes colorées.
 *
 * Page de travail temporaire, servie uniquement en développement (voir
 * `src/app/dev/layout.tsx`). Le texte est identique dans les trois variantes :
 * seule la disposition change. À supprimer une fois la direction choisie.
 */

import Link from 'next/link'
import { FondDegrade } from '@/app/vitrine/fond-degrade'

const CHAPEAU =
  "Parce que le cerveau humain intègre et retient ce qu'il peut visualiser, la métaphore est au cœur de l'approche : un levier cognitif et pédagogique au service de la prise de conscience du risque."

const SIGNATURE =
  'LeVerre Labs — conseil en ergonomie et prévention des risques professionnels'

const PRESTATIONS = [
  {
    nom: 'Sensibilisation collective',
    detail:
      'Une séance de 45 minutes pendant laquelle chaque participant modélise sa propre situation de travail depuis son téléphone.',
  },
  {
    nom: 'Analyse de poste',
    detail:
      "Une évaluation structurée des contraintes d'un poste, restituée sous forme d'un état des lieux exploitable.",
  },
] as const

export default function HeroVariantesPage() {
  return (
    <>
      <DispositionColonne />
      <DispositionCentree />
      <DispositionEditoriale />
    </>
  )
}

/* ---------- A — colonne de gauche, le dégradé respire à droite ---------- */

function DispositionColonne() {
  return (
    <Section etiquette="A — colonne de gauche">
      <FondDegrade anime />
      <div className="relative mx-auto w-full max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl">
            Rendre le risque visible
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-gray-200">{CHAPEAU}</p>

          <dl className="mt-10 max-w-xl space-y-5 border-l border-white/20 pl-6">
            {PRESTATIONS.map(({ nom, detail }) => (
              <div key={nom}>
                <dt className="font-medium text-white">{nom}</dt>
                <dd className="mt-1.5 leading-relaxed text-gray-300">{detail}</dd>
              </div>
            ))}
          </dl>

          <Boutons />
          <Signature className="mt-12" />
        </div>
      </div>
    </Section>
  )
}

/* ---------- B — composition centrée ---------- */

function DispositionCentree() {
  return (
    <Section etiquette="B — composition centrée">
      <FondDegrade anime voile="centre" />
      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-24 text-center">
        <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl">
          Rendre le risque visible
        </h1>

        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-gray-200">{CHAPEAU}</p>

        <Boutons centre />

        <dl className="mt-14 grid w-full gap-8 border-t border-white/15 pt-8 text-left sm:grid-cols-2">
          {PRESTATIONS.map(({ nom, detail }) => (
            <div key={nom}>
              <dt className="font-medium text-white">{nom}</dt>
              <dd className="mt-1.5 leading-relaxed text-gray-300">{detail}</dd>
            </div>
          ))}
        </dl>

        <Signature className="mt-10" />
      </div>
    </Section>
  )
}

/* ---------- C — titre en haut, prestations en pied d'écran ---------- */

function DispositionEditoriale() {
  return (
    <Section etiquette="C — éditoriale, le dégradé occupe le centre">
      <FondDegrade anime />
      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-between px-6 pb-14 pt-32">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-7xl">
            Rendre le risque
            <br />
            visible
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-gray-200">{CHAPEAU}</p>
          <Boutons />
        </div>

        <div className="mt-16 border-t border-white/15 pt-8">
          <dl className="grid gap-8 sm:grid-cols-2 lg:max-w-4xl">
            {PRESTATIONS.map(({ nom, detail }) => (
              <div key={nom}>
                <dt className="font-medium text-white">{nom}</dt>
                <dd className="mt-1.5 leading-relaxed text-gray-300">{detail}</dd>
              </div>
            ))}
          </dl>
          <Signature className="mt-8" />
        </div>
      </div>
    </Section>
  )
}

/* ---------- Éléments partagés ---------- */

function Boutons({ centre = false }: { centre?: boolean }) {
  return (
    <div className={`mt-10 flex flex-col gap-3 sm:flex-row ${centre ? 'justify-center' : ''}`}>
      <Link
        href="/contact"
        className="inline-flex items-center justify-center rounded-md bg-[rgb(255,30,90)] px-7 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-[rgb(255,60,120)]"
      >
        Nous contacter
      </Link>
      <Link
        href="#le-modele"
        className="inline-flex items-center justify-center rounded-md border border-white/25 bg-white/5 px-7 py-3.5 text-[15px] font-medium text-white backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-white/10"
      >
        Découvrir l&apos;approche
      </Link>
    </div>
  )
}

function Signature({ className = '' }: { className?: string }) {
  return <p className={`text-sm text-gray-400 ${className}`}>{SIGNATURE}</p>
}

function Section({ etiquette, children }: { etiquette: string; children: React.ReactNode }) {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden border-b border-white/10 bg-[#05070D]">
      {children}
      <p className="absolute left-6 top-6 z-10 rounded bg-white/10 px-2.5 py-1 font-mono text-xs text-gray-400">
        {etiquette}
      </p>
    </section>
  )
}
