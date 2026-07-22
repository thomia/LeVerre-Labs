import type { Metadata } from 'next'
import { buildOpenGraph } from '@/lib/seo/site'
import ParallaxFondementsPage from '@/components/ui/parallax-scrolling-effect'

export const metadata: Metadata = {
  title: 'Nos fondements en formation TMS et ergonomie',
  description:
    "L'histoire, l'approche et la mission de LeVerre Labs : rendre la formation en gestes et postures et la sensibilisation aux TMS accessibles à toute l'entreprise.",
  alternates: {
    canonical: '/fondements',
  },
  openGraph: buildOpenGraph({
    title: 'Nos fondements en formation TMS et ergonomie | LeVerre Labs',
    description:
      "L'histoire, l'approche et la mission de LeVerre Labs en prévention des troubles musculosquelettiques.",
    url: '/fondements',
  }),
}

export default function FondementsPage() {
  return <ParallaxFondementsPage />
}
