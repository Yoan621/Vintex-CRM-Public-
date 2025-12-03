import SalesTable from '@/components/ventes/SalesTable'
import StatsCard from '@/components/shared/StatsCard'
import { mockOrders } from '@/data/mockData'
import { calculateProfit } from '@/lib/utils'
import { DollarSign, TrendingUp, Package, Clock } from 'lucide-react'

/**
 * Page Mes Ventes - Liste complète de toutes les ventes
 * Affiche un tableau détaillé avec recherche, tri et pagination
 */
export default function VentesPage() {
  // Calcul des statistiques globales
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.salePrice, 0)
  const totalProfit = mockOrders.reduce((sum, order) => sum + calculateProfit(order), 0)
  const totalOrders = mockOrders.length
  const pendingOrders = mockOrders.filter(o => o.status === 'en_cours').length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête de la page */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mes Ventes
          </h1>
          <p className="text-gray-600">
            Gérez toutes vos transactions Vinted en un seul endroit
          </p>
        </div>

        {/* KPI Cards - Nouveau design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            label="Chiffre d'affaires"
            value={`${totalRevenue.toLocaleString('fr-FR')} €`}
            icon={DollarSign}
            iconColor="violet"
            trend={{
              value: 18.3,
              label: 'vs mois dernier',
              isPositive: true
            }}
          />
          <StatsCard
            label="Articles vendus"
            value={totalOrders}
            icon={Package}
            iconColor="blue"
            subtitle="+5 cette semaine"
          />
          <StatsCard
            label="Marge totale"
            value={`${totalProfit.toLocaleString('fr-FR')} €`}
            icon={TrendingUp}
            iconColor="green"
            subtitle="ROI: +96%"
          />
          <StatsCard
            label="En attente"
            value={pendingOrders}
            icon={Clock}
            iconColor="yellow"
            subtitle="À expédier"
          />
        </div>

        {/* Tableau des ventes */}
        <SalesTable orders={mockOrders} />
      </div>
    </div>
  )
}
