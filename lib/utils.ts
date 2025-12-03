import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Order, MonthlyStats, KPI, Boost, BoostMonthlyStats, BoostStatus } from './types'

/**
 * Fonction utilitaire pour merger les classes Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formate un montant en euros
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

/**
 * Formate une date au format français
 */
export function formatDate(date: Date): string {
  return format(date, 'dd/MM/yyyy', { locale: fr })
}

/**
 * Formate une date avec l'heure
 */
export function formatDateTime(date: Date): string {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: fr })
}

/**
 * Calcule le bénéfice d'une commande
 */
export function calculateProfit(order: Order): number {
  return order.salePrice - order.purchasePrice
}

/**
 * Calcule le pourcentage de variation entre deux valeurs
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

/**
 * Calcule les statistiques mensuelles à partir des commandes
 */
export function calculateMonthlyStats(orders: Order[]): MonthlyStats {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const currentMonthOrders = orders.filter(order => {
    const orderDate = new Date(order.saleDate)
    return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
  })

  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear

  const previousMonthOrders = orders.filter(order => {
    const orderDate = new Date(order.saleDate)
    return orderDate.getMonth() === previousMonth && orderDate.getFullYear() === previousYear
  })

  const calculateStats = (ordersList: Order[]) => {
    const revenue = ordersList.reduce((sum, order) => sum + order.salePrice, 0)
    const profit = ordersList.reduce((sum, order) => sum + calculateProfit(order), 0)
    return {
      revenue,
      profit,
      ordersCount: ordersList.length,
    }
  }

  return {
    currentMonth: calculateStats(currentMonthOrders),
    previousMonth: calculateStats(previousMonthOrders),
  }
}

/**
 * Génère les KPIs à partir des statistiques mensuelles
 */
export function generateKPIs(stats: MonthlyStats): KPI[] {
  const revenueChange = calculatePercentageChange(
    stats.currentMonth.revenue,
    stats.previousMonth.revenue
  )
  const profitChange = calculatePercentageChange(
    stats.currentMonth.profit,
    stats.previousMonth.profit
  )
  const ordersChange = calculatePercentageChange(
    stats.currentMonth.ordersCount,
    stats.previousMonth.ordersCount
  )

  return [
    {
      label: "Chiffre d'affaires",
      value: stats.currentMonth.revenue,
      previousValue: stats.previousMonth.revenue,
      percentageChange: revenueChange,
      isPositive: revenueChange >= 0,
    },
    {
      label: 'Bénéfices',
      value: stats.currentMonth.profit,
      previousValue: stats.previousMonth.profit,
      percentageChange: profitChange,
      isPositive: profitChange >= 0,
    },
    {
      label: 'Nombre de commandes',
      value: stats.currentMonth.ordersCount,
      previousValue: stats.previousMonth.ordersCount,
      percentageChange: ordersChange,
      isPositive: ordersChange >= 0,
    },
  ]
}

/**
 * Obtient la couleur du badge selon le statut
 */
export function getStatusColor(status: Order['status']): string {
  switch (status) {
    case 'validée':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'en_cours':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'annulée':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

/**
 * Obtient le libellé formaté du statut
 */
export function getStatusLabel(status: Order['status']): string {
  switch (status) {
    case 'validée':
      return 'Validée'
    case 'en_cours':
      return 'En cours'
    case 'annulée':
      return 'Annulée'
    default:
      return status
  }
}

/**
 * Obtient la couleur du badge selon le statut du boost
 */
export function getBoostStatusColor(status: BoostStatus): string {
  switch (status) {
    case 'actif':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'expiré':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    case 'annulé':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

/**
 * Obtient le libellé formaté du statut du boost
 */
export function getBoostStatusLabel(status: BoostStatus): string {
  switch (status) {
    case 'actif':
      return 'Actif'
    case 'expiré':
      return 'Expiré'
    case 'annulé':
      return 'Annulé'
    default:
      return status
  }
}

/**
 * Calcule les statistiques mensuelles des boosts
 */
export function calculateBoostMonthlyStats(boosts: Boost[]): BoostMonthlyStats {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const currentMonthBoosts = boosts.filter(boost => {
    const boostDate = new Date(boost.date)
    return boostDate.getMonth() === currentMonth && boostDate.getFullYear() === currentYear
  })

  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear

  const previousMonthBoosts = boosts.filter(boost => {
    const boostDate = new Date(boost.date)
    return boostDate.getMonth() === previousMonth && boostDate.getFullYear() === previousYear
  })

  const calculateStats = (boostsList: Boost[]) => {
    const totalSpent = boostsList.reduce((sum, boost) => sum + boost.prix, 0)
    const activeBoosts = boostsList.filter(boost => boost.status === 'actif').length
    return {
      totalSpent,
      activeBoosts,
      totalBoosts: boostsList.length,
    }
  }

  return {
    currentMonth: calculateStats(currentMonthBoosts),
    previousMonth: calculateStats(previousMonthBoosts),
  }
}

/**
 * Vérifie si un boost expire bientôt (dans les 24h)
 */
export function isBoostExpiringSoon(boost: Boost): boolean {
  if (!boost.dateExpiration || boost.status !== 'actif') return false

  const now = new Date()
  const expiration = new Date(boost.dateExpiration)
  const hoursUntilExpiration = (expiration.getTime() - now.getTime()) / (1000 * 60 * 60)

  return hoursUntilExpiration <= 24 && hoursUntilExpiration > 0
}
