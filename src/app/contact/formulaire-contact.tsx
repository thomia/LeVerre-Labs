/**
 * FORMULAIRE DE CONTACT COMMERCIAL
 * Rendu par la route `/contact` (voir `page.tsx`).
 *
 * Composant client : il gère la saisie et l'état d'envoi. Les champs demandés
 * sont ceux qui permettent de répondre utilement du premier coup (organisation
 * et effectif concerné), sans transformer la prise de contact en formalité.
 */

'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { DELAI_REPONSE, EMAIL_CONTACT } from '@/lib/contact'

type EtatEnvoi = 'saisie' | 'envoi' | 'envoye'

export function FormulaireContact() {
  const [etat, setEtat] = useState<EtatEnvoi>('saisie')
  const [messageErreur, setMessageErreur] = useState<string | null>(null)

  const isEnvoi = etat === 'envoi'

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessageErreur(null)
    setEtat('envoi')

    const donnees = Object.fromEntries(new FormData(event.currentTarget))

    try {
      const reponse = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...donnees, origine: window.location.pathname }),
      })

      if (!reponse.ok) {
        const { error } = await reponse.json().catch(() => ({ error: null }))
        setMessageErreur(error ?? "Envoi impossible. Réessayez dans un instant.")
        setEtat('saisie')
        return
      }

      setEtat('envoye')
    } catch {
      setMessageErreur(
        "Connexion impossible. Vérifiez votre réseau, ou écrivez-nous directement."
      )
      setEtat('saisie')
    }
  }

  if (etat === 'envoye') {
    return (
      <div
        role="status"
        className="rounded-2xl border border-[rgb(255,30,90)]/30 bg-[rgb(255,30,90)]/5 p-10 text-center"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-[rgb(255,30,90)]" aria-hidden />
        <h2 className="mt-6 text-2xl font-bold text-white">Demande bien reçue</h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-gray-300">
          Nous revenons vers vous sous {DELAI_REPONSE}. Si votre besoin est
          urgent, écrivez-nous directement à{' '}
          <a
            href={`mailto:${EMAIL_CONTACT}`}
            className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
          >
            {EMAIL_CONTACT}
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Champ label="Votre nom" name="nom" autoComplete="name" required />
        <Champ
          label="Organisation"
          name="organisation"
          autoComplete="organization"
          required
        />
        <Champ
          label="Email professionnel"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <Champ
          label="Téléphone"
          name="telephone"
          type="tel"
          autoComplete="tel"
          optionnel
        />
      </div>

      <div>
        <label
          htmlFor="effectif"
          className="mb-2 block text-sm font-medium text-gray-200"
        >
          Personnes à former{' '}
          <span className="font-normal text-gray-500">(facultatif)</span>
        </label>
        <select
          id="effectif"
          name="effectif"
          defaultValue=""
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white transition-colors focus:border-[rgb(255,30,90)] focus:outline-none focus:ring-1 focus:ring-[rgb(255,30,90)]"
        >
          <option value="">Je ne sais pas encore</option>
          {EFFECTIFS.map((effectif) => (
            <option key={effectif} value={effectif} className="bg-gray-900">
              {effectif}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="besoin"
          className="mb-2 block text-sm font-medium text-gray-200"
        >
          Votre contexte et votre besoin
        </label>
        <textarea
          id="besoin"
          name="besoin"
          required
          rows={6}
          placeholder="Vos métiers, les contraintes physiques rencontrées, ce que vous avez déjà mis en place, l'échéance que vous visez…"
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-gray-600 transition-colors focus:border-[rgb(255,30,90)] focus:outline-none focus:ring-1 focus:ring-[rgb(255,30,90)]"
        />
      </div>

      {/* Piège à robots : masqué aux humains, jamais rempli par eux. */}
      <div className="hidden" aria-hidden>
        <label htmlFor="siteWeb">Ne pas remplir</label>
        <input id="siteWeb" name="siteWeb" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {messageErreur && (
        <p role="alert" className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {messageErreur}
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={isEnvoi}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[rgb(255,30,90)] px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-[rgb(255,60,120)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isEnvoi ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              Envoi en cours…
            </>
          ) : (
            <>
              Envoyer ma demande
              <ArrowRight className="h-5 w-5" aria-hidden />
            </>
          )}
        </button>
        <p className="text-sm text-gray-500">
          Réponse sous {DELAI_REPONSE}.
        </p>
      </div>
    </form>
  )
}

/* ---------- Sous-composants ---------- */

interface ChampProps {
  label: string
  name: string
  type?: string
  autoComplete?: string
  required?: boolean
  optionnel?: boolean
}

function Champ({ label, name, type = 'text', autoComplete, required, optionnel }: ChampProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-gray-200">
        {label}
        {optionnel && <span className="font-normal text-gray-500"> (facultatif)</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-gray-600 transition-colors focus:border-[rgb(255,30,90)] focus:outline-none focus:ring-1 focus:ring-[rgb(255,30,90)]"
      />
    </div>
  )
}

/* ---------- Contenu statique ---------- */

const EFFECTIFS = [
  'Moins de 10',
  '10 à 30',
  '30 à 100',
  'Plus de 100',
] as const
