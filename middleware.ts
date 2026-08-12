import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isSandboxBranch = process.env.VERCEL_GIT_COMMIT_REF === 'sandbox'
  
  if (isSandboxBranch) {
    const pathname = request.nextUrl.pathname
    
    if (!pathname.startsWith('/sandbox') && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/sandbox', request.url))
    }
  }

  // Redirection permanente 301 de l'ancienne URL /vitrine vers l'accueil /.
  // Le contenu d'accueil est désormais servi directement sur / (URL canonique
  // unique) ; /vitrine ne doit plus être indexée ni considérée comme un doublon.
  if (request.nextUrl.pathname === '/vitrine') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.search = ''
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
