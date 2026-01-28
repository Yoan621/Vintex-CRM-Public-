'use client'

import { useState } from 'react'
import SalesChart from '@/components/dashboard/SalesChart'
import OrdersTable from '@/components/dashboard/OrdersTable'
import StatsCard from '@/components/shared/StatsCard'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { TimePeriod } from '@/components/shared/TimeFilter'
import { AccountOption } from '@/components/dashboard/AccountSelector'
import { mockOrders } from '@/data/mockData'
import { mockBoosts } from '@/data/boosts'
import { calculatePeriodStats, calculateBoostPeriodStats, generateChartData } from '@/lib/utils'
import { DollarSign, TrendingUp, ShoppingCart, Zap, ShoppingBag, Clock } from 'lucide-react'

/**
 * Page Dashboard - Refonte complète avec charte Vintod
 * Filtres dynamiques + KPI + Graphiques violet/vert
 */
export default function DashboardPage() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month')
  const [selectedAccount, setSelectedAccount] = useState<AccountOption>('all')
  const [isLoading, setIsLoading] = useState(false)

  // Extraire la liste unique des comptes depuis les commandes
  const uniqueAccounts = Array.from(new Set(mockOrders.map(order => order.vintedAccount).filter(Boolean))) as string[]

  // Filtrer les commandes selon le compte sélectionné
  const filteredOrdersByAccount = selectedAccount === 'all'
    ? mockOrders
    : mockOrders.filter(order => order.vintedAccount === selectedAccount)

  // Calcul des statistiques et KPIs selon la période sélectionnée
  const stats = calculatePeriodStats(filteredOrdersByAccount, timePeriod)
  const boostStats = calculateBoostPeriodStats(mockBoosts, timePeriod)

  // Calcul des bénéfices nets (après déduction des boosts)
  const netProfit = stats.currentMonth.profit - boostStats.currentMonth.totalSpent
  const previousNetProfit = stats.previousMonth.profit - boostStats.previousMonth.totalSpent

  // Calcul des variations en pourcentage
  const revenueChange = stats.previousMonth.revenue > 0
    ? ((stats.currentMonth.revenue - stats.previousMonth.revenue) / stats.previousMonth.revenue) * 100
    : 0
  const netProfitChange = previousNetProfit > 0
    ? ((netProfit - previousNetProfit) / previousNetProfit) * 100
    : 0
  const ordersChange = stats.previousMonth.ordersCount > 0
    ? ((stats.currentMonth.ordersCount - stats.previousMonth.ordersCount) / stats.previousMonth.ordersCount) * 100
    : 0

  // Calcul du panier moyen
  const avgBasket = stats.currentMonth.ordersCount > 0
    ? stats.currentMonth.revenue / stats.currentMonth.ordersCount
    : 0

  // Calcul du ROI (Return on Investment) pour la période
  const getDaysAgo = (days: number): Date => {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date
  }
  const periodDays = timePeriod === 'day' ? 1 : timePeriod === 'week' ? 7 : timePeriod === 'month' ? 30 : 365
  const currentPeriodStart = getDaysAgo(periodDays)
  const previousPeriodStart = getDaysAgo(periodDays * 2)
  const previousPeriodEnd = getDaysAgo(periodDays)

  const currentPeriodOrders = filteredOrdersByAccount.filter(o => {
    const orderDate = new Date(o.saleDate)
    return orderDate >= currentPeriodStart
  })
  const previousPeriodOrders = filteredOrdersByAccount.filter(o => {
    const orderDate = new Date(o.saleDate)
    return orderDate >= previousPeriodStart && orderDate < previousPeriodEnd
  })

  const totalCost = currentPeriodOrders.reduce((sum, order) => sum + order.purchasePrice, 0)
  const roi = totalCost > 0 ? ((stats.currentMonth.profit / totalCost) * 100) : 0
  const previousTotalCost = previousPeriodOrders.reduce((sum, order) => sum + order.purchasePrice, 0)
  const previousRoi = previousTotalCost > 0 ? ((stats.previousMonth.profit / previousTotalCost) * 100) : 0
  const roiChange = previousRoi > 0 ? ((roi - previousRoi) / previousRoi) * 100 : 0

  // Calcul du délai moyen de vente (jours entre achat et vente)
  const calculateAverageSaleDelay = (orders: typeof mockOrders) => {
    const ordersWithPurchaseDate = orders.filter(o => o.purchaseDate)
    if (ordersWithPurchaseDate.length === 0) return 0

    const totalDays = ordersWithPurchaseDate.reduce((sum, order) => {
      const purchaseDate = new Date(order.purchaseDate!).getTime()
      const saleDate = new Date(order.saleDate).getTime()
      const daysDiff = Math.floor((saleDate - purchaseDate) / (1000 * 60 * 60 * 24))
      return sum + daysDiff
    }, 0)

    return totalDays / ordersWithPurchaseDate.length
  }

  const avgSaleDelay = calculateAverageSaleDelay(currentPeriodOrders)
  const previousAvgSaleDelay = calculateAverageSaleDelay(previousPeriodOrders)
  const saleDelayChange = previousAvgSaleDelay > 0
    ? ((avgSaleDelay - previousAvgSaleDelay) / previousAvgSaleDelay) * 100
    : 0

  // Handler pour le changement de période
  const handlePeriodChange = (period: TimePeriod) => {
    setIsLoading(true)
    setTimePeriod(period)

    // Simulation de chargement
    setTimeout(() => {
      setIsLoading(false)
    }, 300)
  }

  // Handler pour le changement de compte
  const handleAccountChange = (account: AccountOption) => {
    setIsLoading(true)
    setSelectedAccount(account)

    // Simulation de chargement
    setTimeout(() => {
      setIsLoading(false)
    }, 300)
  }

  return (
    <div className="min-h-screen">
      {/* Header noir avec fil d'Ariane et actions */}
      <DashboardHeader
        timePeriod={timePeriod}
        onTimePeriodChange={handlePeriodChange}
        selectedAccount={selectedAccount}
        onAccountChange={handleAccountChange}
        accounts={uniqueAccounts}
      />

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center justify-center py-4 mb-6">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Section KPIs - Grille responsive - 2 lignes de 3 cartes */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
          <StatsCard
            label="CA"
            value={`${stats.currentMonth.revenue.toLocaleString('fr-FR')} €`}
            icon={DollarSign}
            iconColor="primary"
            trend={{
              value: Math.abs(revenueChange),
              label: 'vs période précédente',
              isPositive: revenueChange >= 0
            }}
          />
          <StatsCard
            label="Bénéfices"
            value={`${netProfit.toLocaleString('fr-FR')} €`}
            icon={TrendingUp}
            iconColor="primary"
            trend={{
              value: Math.abs(netProfitChange),
              label: 'vs période précédente',
              isPositive: netProfitChange >= 0
            }}
          />
          <StatsCard
            label="Commandes"
            value={stats.currentMonth.ordersCount}
            icon={ShoppingCart}
            iconColor="primary"
            trend={{
              value: Math.abs(ordersChange),
              label: 'vs période précédente',
              isPositive: ordersChange >= 0
            }}
          />
          <StatsCard
            label="ROI"
            value={`${roi.toFixed(1)}%`}
            icon={Zap}
            iconColor="primary"
            trend={{
              value: Math.abs(roiChange),
              label: 'vs période précédente',
              isPositive: roiChange >= 0
            }}
          />
          <StatsCard
            label="Délai moyen de vente"
            value={`${Math.round(avgSaleDelay)} jours`}
            icon={Clock}
            iconColor="primary"
            trend={{
              value: Math.abs(saleDelayChange),
              label: 'Mise en ligne → Vente',
              isPositive: saleDelayChange <= 0
            }}
          />
          <StatsCard
            label="Panier moyen"
            value={`${avgBasket.toFixed(0)} €`}
            icon={ShoppingBag}
            iconColor="primary"
            subtitle="Par commande"
          />
        </div>

        {/* Section Graphique */}
        <div className={`mb-6 transvition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
          <SalesChart data={generateChartData(filteredOrdersByAccount, timePeriod)} />
        </div>

        {/* Section Tableau des commandes */}
        <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
          <OrdersTable orders={filteredOrdersByAccount} />
        </div>
      </div>
    </div>
  )
}
