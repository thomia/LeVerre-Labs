import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ConditionalLayout } from '@/components/layout/conditional-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LeVerre Labs - Une approche visuelle des risques au travail',
  description: 'Transformez votre approche de la prévention avec une métaphore visuelle innovante. LeVerre Labs rend l\'ergonomie accessible et ludique pour tous.',
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