/**
 * API Route : POST /api/formateur/verifier
 * Vérifie le mot de passe formateur sans créer de session.
 * Sert de garde-fou pour l'accès à l'espace formateur.
 */

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    // La variable n'est pas configurée sur cet environnement (ex. Preview
    // Vercel) : on le signale clairement au lieu du trompeur "mot de passe
    // incorrect", qui laisse croire à une erreur de saisie.
    if (!process.env.FORMATEUR_PASSWORD) {
      return NextResponse.json(
        {
          error:
            "Accès formateur non configuré sur cet environnement (variable FORMATEUR_PASSWORD manquante).",
        },
        { status: 500 }
      )
    }

    if (password !== process.env.FORMATEUR_PASSWORD) {
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }
}
