import SalesChart from '@/components/dashboard/SalesChart'
import OrdersTable from '@/components/dashboard/OrdersTable'
import StatsCard from '@/components/shared/StatsCard'
import { mockOrders, mockChartData } from '@/data/mockData'
import { calculateMonthlyStats } from '@/lib/utils'
import { DollarSign, TrendingUp, ShoppingCart } from 'lucide-react'

/**
 * Page Dashboard - Vue d'ensemble de l'activité Vinted
 * Affiche les KPIs, le graphique des ventes et le suivi des commandes
 */
export default function DashboardPage() {
  // Calcul des statistiques et KPIs
  const stats = calculateMonthlyStats(mockOrders)

  // Calcul des variations en pourcentage
  const revenueChange = stats.previousMonth.revenue > 0
    ? ((stats.currentMonth.revenue - stats.previousMonth.revenue) / stats.previousMonth.revenue) * 100
    : 0
  const profitChange = stats.previousMonth.profit > 0
    ? ((stats.currentMonth.profit - stats.previousMonth.profit) / stats.previousMonth.profit) * 100
    : 0

  // Calcul des commandes complétées
  const completedOrders = mockOrders.filter(o => o.status === 'validée').length

  // Calcul du ROI (Return on Investment)
  const totalCost = mockOrders.reduce((sum, order) => sum + order.purchasePrice, 0)
  const roi = totalCost > 0 ? ((stats.currentMonth.profit / totalCost) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête de la page */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Vue d&apos;ensemble de votre activité de revente Vinted
          </p>
        </div>

        {/* Section KPIs - Nouveau design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            label="Chiffre d'affaires"
            value={`${stats.currentMonth.revenue.toLocaleString('fr-FR')} €`}
            icon={DollarSign}
            iconColor="violet"
            trend={{
              value: Math.abs(revenueChange),
              label: 'vs mois dernier',
              isPositive: revenueChange >= 0
            }}
          />
          <StatsCard
            label="Bénéfices"
            value={`${stats.currentMonth.profit.toLocaleString('fr-FR')} €`}
            icon={TrendingUp}
            iconColor="green"
            trend={{
              value: Math.abs(profitChange),
              label: 'vs mois dernier',
              isPositive: profitChange >= 0
            }}
          />
          <StatsCard
            label="ROI"
            value={`${roi.toFixed(1)}%`}
            icon={TrendingUp}
            iconColor="indigo"
            subtitle="Retour sur investissement"
          />
          <StatsCard
            label="Commandes"
            value={stats.currentMonth.ordersCount}
            icon={ShoppingCart}
            iconColor="blue"
            subtitle={`${completedOrders} livrées`}
          />
        </div>

        {/* Section Graphique */}
        <div className="mb-8">
          <SalesChart data={mockChartData} />
        </div>

        {/* Section Tableau des commandes */}
        <div>
          <OrdersTable orders={mockOrders} />
        </div>
      </div>
    </div>
  )
}
