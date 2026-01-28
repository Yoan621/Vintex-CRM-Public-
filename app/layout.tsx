import type { Metadata } from 'next'
import { Archivo, Inter } from 'next/font/google'
import LayoutClient from '@/components/layout/LayoutClient'
import './globals.css'

const interTight = Inter({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
})

const archivoExpanded = Archivo({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Vintex CRM - Gestion Vinted',
  description: 'CRM pour gérer votre activité de revente sur Vinted',
}

/**
 * Layout principal de l'application
 * Contient la navigation et le conteneur pour toutes les pages
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${interTight.variable} ${archivoExpanded.variable}`}>
      <body className={interTight.className}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
