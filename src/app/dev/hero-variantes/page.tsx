/**
 * PRÉVISUALISATION — premier écran, mise au point du fond animé.
 *
 * Page de travail temporaire, servie uniquement en développement (voir
 * `src/app/dev/layout.tsx`). Le texte est identique dans les trois variantes :
 * seul le fond change. À supprimer une fois la direction choisie.
 */

import Link from 'next/link'
import { FondGouttes } from '@/app/vitrine/fond-gouttes'
import { FondNiveau } from '@/app/vitrine/fond-niveau'
import { FondVerreFiligrane } from '@/app/vitrine/fond-verre-filigrane'

export default function HeroVariantesPage() {
  return (
    <>
      <Cadre etiquette="1 — la goutte d'eau (cliquez dans le fond)">
        <FondGouttes />
      </Cadre>
      <Cadre etiquette="2 — le niveau qui monte">
        <FondNiveau />
      </Cadre>
      <Cadre etiquette="3 — le verre en filigrane">
        <FondVerreFiligrane />
      </Cadre>
    </>
  )
}

/* ---------- Texte commun aux trois variantes ---------- */

function Texte() {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-[rgb(255,30,90)]">
        Ergonomie et prévention des risques professionnels
      </p>

      <h1 className="mt-5 text-4xl font-semibold leading-[1.15] tracking-tight text-white sm:text-5xl">
        Faire naître la prise de conscience du risque
      </h1>

      <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300">
        Parce que le cerveau humain intègre et retient ce qu&apos;il peut
        visualiser, la métaphore est au cœur de l&apos;approche : un levier
        cognitif et pédagogique.
      </p>

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
    </div>
  )
}

/* ---------- Éléments partagés ---------- */

function Cadre({ etiquette, children }: { etiquette: string; children: React.ReactNode }) {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden border-b border-white/10 bg-black">
      {children}
      <p className="absolute left-6 top-6 z-10 rounded bg-white/10 px-2.5 py-1 font-mono text-xs text-gray-400">
        {etiquette}
      </p>
      <div className="relative mx-auto w-full max-w-7xl px-6 py-24">
        <Texte />
      </div>
    </section>
  )
}
