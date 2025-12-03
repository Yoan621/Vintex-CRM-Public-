import { AchatStats } from '@/types/achat'
import { DollarSign, Package, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react'

interface StatsCardsProps {
  stats: AchatStats
}

/**
 * Composant affichant les 3 cartes KPI en haut de la page
 */
export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Card 1: Argent dépensé */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Argent dépensé</h3>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-3xl font-bold text-gray-900">
            {stats.argentDepense.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            })}
          </p>

          <div className={`flex items-center gap-1 text-sm ${
            stats.evolutionDepenses >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {stats.evolutionDepenses >= 0 ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
            <span className="font-medium">
              {Math.abs(stats.evolutionDepenses)}%
            </span>
            <span className="text-gray-500">vs mois dernier</span>
          </div>
        </div>
      </div>

      {/* Card 2: Nombre d'articles */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Articles achetés</h3>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-3xl font-bold text-gray-900">
            {stats.nombreArticles} articles
          </p>

          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span className="font-medium text-blue-600">
              +{stats.nouvelleArticles}
            </span>
            <span>ce mois-ci</span>
          </div>
        </div>
      </div>

      {/* Card 3: Marge estimée */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Marge estimée</h3>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-3xl font-bold text-gray-900">
            {stats.margeEstimee.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            })}
          </p>

          <div className="flex items-center gap-1 text-sm text-green-600">
            <span className="font-medium">ROI: +{stats.roi}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
