import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isSandboxBranch = process.env.VERCEL_GIT_COMMIT_REF === 'sandbox'
  
  if (isSandboxBranch) {
    const pathname = request.nextUrl.pathname
    
    if (!pathname.startsWith('/sandbox') && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/sandbox', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
