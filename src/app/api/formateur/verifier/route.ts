/**
 * API Route : POST /api/formateur/verifier
 * Vérifie le mot de passe formateur sans créer de session.
 * Sert de garde-fou pour l'accès à l'espace formateur.
 */

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (password !== process.env.FORMATEUR_PASSWORD) {
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }
}
