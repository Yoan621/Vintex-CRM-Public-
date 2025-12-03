import Link from 'next/link'
import { ArrowRight, BarChart3, ShoppingCart, TrendingUp } from 'lucide-react'

/**
 * Page d'accueil - Landing page du CRM
 * Présente les fonctionnalités principales et redirige vers le dashboard
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Bienvenue sur{' '}
            <span className="text-primary">Vintex CRM</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Gérez votre activité de revente Vinted comme un pro. Suivez vos ventes,
            analysez vos performances et maximisez vos bénéfices.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Accéder au Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Analytics Détaillées
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Visualisez vos performances avec des graphiques et des KPIs en temps réel.
              Comparez vos résultats mois par mois.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <ShoppingCart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Gestion des Ventes
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Suivez toutes vos transactions, gérez vos commandes et organisez vos
              documents (factures, bordereaux).
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Suivi des Bénéfices
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Calculez automatiquement vos marges et bénéfices. Optimisez votre
              stratégie de prix pour maximiser vos revenus.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-white border border-gray-200 rounded-2xl shadow-xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Prêt à optimiser votre activité ?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Commencez dès maintenant à gérer vos ventes Vinted de manière professionnelle
            avec des outils puissants et intuitifs.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/ventes"
              className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Mes Ventes
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
