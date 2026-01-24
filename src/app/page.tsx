/**
 * PAGE PRINCIPALE - ACCUEIL
 * Route: /
 * Page d'accueil - Vitrine du projet LeVerre Labs
 * Sur la branche sandbox : redirige vers /sandbox
 */

import { redirect } from 'next/navigation'

export default function HomePage() {
  // Sur la branche sandbox, rediriger vers /sandbox
  const isSandboxBranch = process.env.VERCEL_GIT_COMMIT_REF === 'sandbox' || 
                          process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF === 'sandbox'
  
  if (isSandboxBranch) {
    redirect('/sandbox')
  }
  
  redirect('/vitrine')
}