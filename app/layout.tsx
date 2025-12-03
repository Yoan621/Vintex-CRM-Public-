import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, ShoppingBag, ShoppingCart, Zap, Package } from 'lucide-react'
import './globals.css'

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
    <html lang="fr">
      <body>
        {/* Navigation latérale */}
        <div className="flex min-h-screen bg-white">
          <aside className="w-64 bg-white border-r border-gray-200 fixed h-full shadow-sm">
            <div className="p-6">
              {/* Logo/Titre */}
              <div className="flex items-center gap-3 mb-8">
                <Image
                  src="/logo.png"
                  alt="Vintex Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Vintex CRM</h1>
                  <p className="text-xs text-gray-500">Gestion Vinted</p>
                </div>
              </div>

              {/* Menu de navigation */}
              <nav className="space-y-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link
                  href="/achats"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-medium">Mes Achats</span>
                </Link>
                <Link
                  href="/ventes"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="font-medium">Mes Ventes</span>
                </Link>
                <Link
                  href="/boosts"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <Zap className="w-5 h-5" />
                  <span className="font-medium">Gestion Boosts</span>
                </Link>
                <Link
                  href="/stocks"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <Package className="w-5 h-5" />
                  <span className="font-medium">Gestion Stocks</span>
                </Link>
              </nav>
            </div>

            {/* Footer de la sidebar */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                © 2025 Vintex CRM
              </p>
            </div>
          </aside>

          {/* Contenu principal */}
          <main className="flex-1 ml-64">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
