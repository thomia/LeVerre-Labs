/**
 * API Route : POST /api/contact
 * Enregistre une demande de contact commercial envoyée depuis /contact.
 *
 * Les demandes vont dans la table `demandes_contact` (migration 005), écrite
 * avec la clé service_role : rien n'est exposé au navigateur.
 */

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

/** Longueurs maximales acceptées, alignées sur ce qu'un humain écrit. */
const LIMITES = {
  nom: 120,
  organisation: 160,
  email: 200,
  telephone: 40,
  effectif: 40,
  besoin: 4000,
  origine: 200,
} as const

interface CorpsDemande {
  nom?: unknown
  organisation?: unknown
  email?: unknown
  telephone?: unknown
  effectif?: unknown
  besoin?: unknown
  origine?: unknown
  /** Champ piège invisible : seuls les robots le remplissent. */
  siteWeb?: unknown
}

export async function POST(request: Request) {
  let corps: CorpsDemande

  try {
    corps = await request.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }

  // Piège à robots : on répond comme si tout allait bien, sans rien stocker.
  if (typeof corps.siteWeb === 'string' && corps.siteWeb.length > 0) {
    return NextResponse.json({ ok: true }, { status: 201 })
  }

  const nom = nettoyer(corps.nom, LIMITES.nom)
  const organisation = nettoyer(corps.organisation, LIMITES.organisation)
  const email = nettoyer(corps.email, LIMITES.email)
  const besoin = nettoyer(corps.besoin, LIMITES.besoin)

  const manquants = [
    !nom && 'votre nom',
    !organisation && 'votre organisation',
    !email && 'votre email',
    !besoin && 'votre besoin',
  ].filter(Boolean)

  if (manquants.length > 0) {
    return NextResponse.json(
      { error: `Merci de renseigner ${manquants.join(', ')}.` },
      { status: 422 }
    )
  }

  if (!estEmailPlausible(email)) {
    return NextResponse.json(
      { error: "Cette adresse email ne semble pas valide." },
      { status: 422 }
    )
  }

  // Même logique que l'accès formateur : on distingue « mal configuré » de
  // « refusé », sinon on fait chercher l'utilisateur au mauvais endroit.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[contact] Supabase non configuré : demande perdue', { organisation })
    return NextResponse.json(
      {
        error:
          "Le formulaire n'est pas configuré sur cet environnement. Écrivez-nous directement par email.",
      },
      { status: 500 }
    )
  }

  const supabase = createAdminClient()

  const { error } = await supabase.from('demandes_contact').insert({
    nom,
    organisation,
    email,
    telephone: nettoyer(corps.telephone, LIMITES.telephone) || null,
    effectif: nettoyer(corps.effectif, LIMITES.effectif) || null,
    besoin,
    origine: nettoyer(corps.origine, LIMITES.origine) || null,
  })

  if (error) {
    console.error('[contact] Supabase error:', error)
    return NextResponse.json(
      { error: "Envoi impossible pour le moment. Réessayez dans un instant." },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}

/* ---------- Helpers ---------- */

function nettoyer(valeur: unknown, longueurMax: number): string {
  if (typeof valeur !== 'string') return ''
  return valeur.trim().slice(0, longueurMax)
}

function estEmailPlausible(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}
