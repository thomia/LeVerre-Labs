/**
 * API Route : Récupérer l'utilisateur courant
 * GET /api/auth/me
 */

import { NextRequest, NextResponse } from 'next/server'
import { getUserById } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Récupérer l'ID utilisateur depuis les headers
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer l'utilisateur
    const user = await getUserById(userId)

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
