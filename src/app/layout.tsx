import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ConditionalLayout } from '@/components/layout/conditional-layout'
import { SITE_NAME, SITE_URL, buildOpenGraph } from '@/lib/seo/site'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'LeVerre Labs - Prévention des TMS en entreprise',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "LeVerre Labs transforme la prévention des troubles musculosquelettiques (TMS) au travail grâce à une métaphore visuelle innovante : le modèle du verre.",
  alternates: {
    canonical: '/',
  },
  openGraph: buildOpenGraph({
    title: 'LeVerre Labs - Prévention des TMS en entreprise',
    description:
      "Une approche visuelle et scientifique pour former, sensibiliser et prévenir les troubles musculosquelettiques au travail.",
    url: '/',
  }),
  twitter: {
    card: 'summary_large_image',
    title: 'LeVerre Labs - Prévention des TMS en entreprise',
    description:
      "Une approche visuelle et scientifique pour former, sensibiliser et prévenir les troubles musculosquelettiques au travail.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  )
}