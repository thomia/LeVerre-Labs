"use client"

/**
 * Page de test du moteur OWAS (outil interne de validation).
 * Accessible sur /dev/owas en `npm run dev`.
 *
 * Trois blocs :
 *   1. Validation automatique (cas de référence Ergonautas).
 *   2. Codificateur d'une posture (code 4 chiffres + catégorie d'action).
 *   3. Séance test : agrégation par fréquence (Tabla 7) sur plusieurs postures.
 */

import { useMemo, useState } from 'react'
import {
  type CodeDos,
  type CodeBras,
  type CodeJambes,
  type CodeCharge,
  type CodificationOwas,
  LIBELLES_DOS,
  LIBELLES_BRAS,
  LIBELLES_JAMBES,
  LIBELLES_CHARGE,
  INFO_CATEGORIE_ACTION,
  codeOwas,
  categorieActionPosture,
  frequencesDos,
  frequencesBras,
  frequencesJambes,
  categoriesSegments,
  pireCategoriePosture,
  repartitionCharge,
  lancerAutotests,
} from '@/lib/owas'

export default function PageTestOwas() {
  const tests = useMemo(() => lancerAutotests(), [])
  const nbOk = tests.filter((t) => t.ok).length

  const [codif, setCodif] = useState<CodificationOwas>({ dos: 1, bras: 1, jambes: 1, charge: 1 })
  const [seance, setSeance] = useState<CodificationOwas[]>([])

  const acPosture = categorieActionPosture(codif)
  const infoAc = INFO_CATEGORIE_ACTION[acPosture]

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-4xl space-y-10">
        <header>
          <h1 className="text-2xl font-bold">Test du moteur OWAS</h1>
          <p className="text-sm text-slate-400">Outil interne de validation méthodologique.</p>
        </header>

        {/* 1. Validation automatique */}
        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-3 font-semibold">
            1. Validation automatique{' '}
            <span className={nbOk === tests.length ? 'text-emerald-400' : 'text-red-400'}>
              ({nbOk}/{tests.length})
            </span>
          </h2>
          <ul className="space-y-1 text-sm">
            {tests.map((t) => (
              <li key={t.nom} className="flex items-center gap-2">
                <span className={t.ok ? 'text-emerald-400' : 'text-red-400'}>{t.ok ? '✓' : '✗'}</span>
                <span className="flex-1">{t.nom}</span>
                <span className="text-slate-400">
                  {t.obtenu}
                  {!t.ok && <span className="text-red-400"> (attendu {t.attendu})</span>}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* 2. Codificateur d'une posture */}
        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-4 font-semibold">2. Codifier une posture</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Selecteur
              label="Dos"
              libelles={LIBELLES_DOS}
              value={codif.dos}
              onChange={(v) => setCodif((c) => ({ ...c, dos: v as CodeDos }))}
            />
            <Selecteur
              label="Bras"
              libelles={LIBELLES_BRAS}
              value={codif.bras}
              onChange={(v) => setCodif((c) => ({ ...c, bras: v as CodeBras }))}
            />
            <Selecteur
              label="Jambes"
              libelles={LIBELLES_JAMBES}
              value={codif.jambes}
              onChange={(v) => setCodif((c) => ({ ...c, jambes: v as CodeJambes }))}
            />
            <Selecteur
              label="Charge"
              libelles={LIBELLES_CHARGE}
              value={codif.charge}
              onChange={(v) => setCodif((c) => ({ ...c, charge: v as CodeCharge }))}
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <div>
              <div className="text-xs uppercase text-slate-400">Code OWAS</div>
              <div className="font-mono text-xl">{codeOwas(codif)}</div>
            </div>
            <BadgeAc categorie={acPosture} />
            <span className="text-sm text-slate-300">{infoAc.action}</span>
            <button
              onClick={() => setSeance((s) => [...s, codif])}
              className="ml-auto rounded-lg bg-[rgb(255,30,90)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              + Ajouter à la séance test
            </button>
          </div>
        </section>

        {/* 3. Séance test */}
        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">3. Séance test ({seance.length} postures)</h2>
            {seance.length > 0 && (
              <button
                onClick={() => setSeance([])}
                className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-slate-300 hover:bg-white/5"
              >
                Réinitialiser
              </button>
            )}
          </div>

          {seance.length === 0 ? (
            <p className="text-sm text-slate-400">
              Ajoute des postures via le codificateur ci-dessus pour voir l&apos;agrégation par
              fréquence (Tabla 7).
            </p>
          ) : (
            <ResultatSeance seance={seance} />
          )}
        </section>
      </div>
    </div>
  )
}

function ResultatSeance({ seance }: { seance: CodificationOwas[] }) {
  const segments = categoriesSegments(seance)
  const pire = pireCategoriePosture(seance)
  const charge = repartitionCharge(seance)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-6">
        <BlocSegment titre="Dos" categorie={segments.dos} />
        <BlocSegment titre="Bras" categorie={segments.bras} />
        <BlocSegment titre="Jambes" categorie={segments.jambes} />
        <BlocSegment titre="Posture (pire segment)" categorie={pire} accent />
      </div>

      <TableFrequences titre="Dos" lignes={frequencesDos(seance)} libelles={LIBELLES_DOS} />
      <TableFrequences titre="Bras" lignes={frequencesBras(seance)} libelles={LIBELLES_BRAS} />
      <TableFrequences titre="Jambes" lignes={frequencesJambes(seance)} libelles={LIBELLES_JAMBES} />

      <div className="text-sm text-slate-300">
        <span className="text-slate-400">Répartition charge :</span>{' '}
        ≤10 kg {charge[1]}% · 10-20 kg {charge[2]}% · &gt;20 kg {charge[3]}%
      </div>
    </div>
  )
}

function TableFrequences<P extends number>({
  titre,
  lignes,
  libelles,
}: {
  titre: string
  lignes: { position: P; nombre: number; frequencePct: number; categorie: 1 | 2 | 3 | 4 }[]
  libelles: Record<P, string>
}) {
  if (lignes.length === 0) return null
  return (
    <div>
      <div className="mb-1 text-xs uppercase text-slate-400">{titre}</div>
      <div className="space-y-1 text-sm">
        {lignes.map((l) => (
          <div key={l.position} className="flex items-center gap-2">
            <span className="flex-1">{libelles[l.position]}</span>
            <span className="text-slate-400">
              {l.nombre} · {Math.round(l.frequencePct)}%
            </span>
            <BadgeAc categorie={l.categorie} petit />
          </div>
        ))}
      </div>
    </div>
  )
}

function BlocSegment({
  titre,
  categorie,
  accent,
}: {
  titre: string
  categorie: 1 | 2 | 3 | 4
  accent?: boolean
}) {
  return (
    <div className={accent ? 'rounded-lg border border-[rgb(255,30,90)]/40 p-3' : 'p-3'}>
      <div className="text-xs uppercase text-slate-400">{titre}</div>
      <div className="mt-1">
        <BadgeAc categorie={categorie} />
      </div>
    </div>
  )
}

function BadgeAc({ categorie, petit }: { categorie: 1 | 2 | 3 | 4; petit?: boolean }) {
  const info = INFO_CATEGORIE_ACTION[categorie]
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold text-black ${
        petit ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
      style={{ backgroundColor: info.couleur }}
    >
      AC{categorie}
    </span>
  )
}

function Selecteur<V extends number>({
  label,
  libelles,
  value,
  onChange,
}: {
  label: string
  libelles: Record<V, string>
  value: V
  onChange: (v: number) => void
}) {
  const codes = Object.keys(libelles).map(Number)
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs uppercase text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-slate-100"
      >
        {codes.map((code) => (
          <option key={code} value={code}>
            {code} — {libelles[code as V]}
          </option>
        ))}
      </select>
    </label>
  )
}
