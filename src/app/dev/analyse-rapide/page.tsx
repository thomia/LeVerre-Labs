"use client"

/**
 * Page de validation du moteur de l'analyse rapide (outil interne).
 * Accessible sur /dev/analyse-rapide en `npm run dev`.
 *
 * Affiche les cas de bornes du scoring (poids des 4 cases, neutralisation de
 * l'Orage, inversion Verre/Paille) et de la physique du verre (taux, durées de
 * débordement, déterminisme).
 */

import { useMemo } from 'react'
import { lancerAutotests } from '@/lib/analyse-rapide/auto-test'

export default function PageTestAnalyseRapide() {
  const tests = useMemo(() => lancerAutotests(), [])
  const nbOk = tests.filter((test) => test.ok).length

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Moteur de l&apos;analyse rapide</h1>
          <p className="text-sm text-slate-400">
            Validation méthodologique du scoring pondéré et du remplissage du verre.
          </p>
        </header>

        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-3 font-semibold">
            Cas de bornes{' '}
            <span className={nbOk === tests.length ? 'text-emerald-400' : 'text-red-400'}>
              ({nbOk}/{tests.length})
            </span>
          </h2>

          <ul className="divide-y divide-white/5">
            {tests.map((test) => (
              <li key={test.nom} className="flex items-center gap-3 py-2 text-sm">
                <span className={test.ok ? 'text-emerald-400' : 'text-red-400'}>{test.ok ? '✔' : '✘'}</span>
                <span className="flex-1">{test.nom}</span>
                <span className="text-slate-400">attendu {test.attendu}</span>
                <span className={`w-28 text-right tabular-nums ${test.ok ? 'text-slate-200' : 'text-red-300'}`}>
                  {test.obtenu}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
