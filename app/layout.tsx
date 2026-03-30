import type { Metadata } from 'next'
import { Archivo, Inter, Manrope, Cabin, Instrument_Serif } from 'next/font/google'
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

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const cabin = Cabin({
  subsets: ['latin'],
  variable: '--font-cabin',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
  weight: '400',
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
    <html lang="fr" className={`${interTight.variable} ${archivoExpanded.variable} ${manrope.variable} ${cabin.variable} ${instrumentSerif.variable}`}>
      <body className={interTight.className}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
