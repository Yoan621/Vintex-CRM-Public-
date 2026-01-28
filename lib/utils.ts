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
 * Calcule les statistiques pour une période donnée
 */
export function calculatePeriodStats(orders: Order[], period: 'day' | 'week' | 'month' | 'year'): MonthlyStats {
  const now = new Date()

  const getDaysAgo = (days: number): Date => {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date
  }

  let currentPeriodStart: Date
  let previousPeriodStart: Date
  let previousPeriodEnd: Date

  switch (period) {
    case 'day':
      currentPeriodStart = getDaysAgo(1)
      previousPeriodStart = getDaysAgo(2)
      previousPeriodEnd = getDaysAgo(1)
      break
    case 'week':
      currentPeriodStart = getDaysAgo(7)
      previousPeriodStart = getDaysAgo(14)
      previousPeriodEnd = getDaysAgo(7)
      break
    case 'month':
      currentPeriodStart = getDaysAgo(30)
      previousPeriodStart = getDaysAgo(60)
      previousPeriodEnd = getDaysAgo(30)
      break
    case 'year':
      currentPeriodStart = getDaysAgo(365)
      previousPeriodStart = getDaysAgo(730)
      previousPeriodEnd = getDaysAgo(365)
      break
  }

  const currentPeriodOrders = orders.filter(order => {
    const orderDate = new Date(order.saleDate)
    return orderDate >= currentPeriodStart && orderDate <= now
  })

  const previousPeriodOrders = orders.filter(order => {
    const orderDate = new Date(order.saleDate)
    return orderDate >= previousPeriodStart && orderDate < previousPeriodEnd
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
    currentMonth: calculateStats(currentPeriodOrders),
    previousMonth: calculateStats(previousPeriodOrders),
  }
}

/**
 * Calcule les statistiques mensuelles à partir des commandes
 */
export function calculateMonthlyStats(orders: Order[]): MonthlyStats {
  return calculatePeriodStats(orders, 'month')
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
 * Obtient la couleur du badge selon le statut (pour les pages hors Dashboard)
 */
export function getStatusColor(status: Order['status']): string {
  switch (status) {
    case 'non_traite':
      return 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
    case 'validée':
      return 'bg-green-500/10 text-green-500 border border-green-500/20'
    case 'en_cours':
      return 'bg-primary/10 text-primary border border-primary/20'
    case 'litige':
      return 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
    case 'annulée':
      return 'bg-red-500/10 text-red-500 border border-red-500/20'
    default:
      return 'bg-secondary/10 text-secondary border border-secondary/20'
  }
}

/**
 * Obtient le libellé formaté du statut
 */
export function getStatusLabel(status: Order['status']): string {
  switch (status) {
    case 'non_traite':
      return 'Non traité'
    case 'validée':
      return 'Validée'
    case 'en_cours':
      return 'En cours'
    case 'litige':
      return 'Litige'
    case 'annulée':
      return 'Annulée'
    default:
      return status
  }
}

/**
 * Obtient le libellé formaté du transporteur
 */
export function getCarrierLabel(carrier?: string): string {
  if (!carrier) return '-'
  switch (carrier) {
    case 'mondial_relay':
      return 'Mondial Relay'
    case 'vinted_go':
      return 'Vinted Go'
    case 'chronopost':
      return 'Chronopost'
    case 'colissimo':
      return 'Colissimo'
    case 'autre':
      return 'Autre'
    default:
      return carrier
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
 * Calcule les statistiques des boosts pour une période donnée
 */
export function calculateBoostPeriodStats(boosts: Boost[], period: 'day' | 'week' | 'month' | 'year'): BoostMonthlyStats {
  const now = new Date()

  const getDaysAgo = (days: number): Date => {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date
  }

  let currentPeriodStart: Date
  let previousPeriodStart: Date
  let previousPeriodEnd: Date

  switch (period) {
    case 'day':
      currentPeriodStart = getDaysAgo(1)
      previousPeriodStart = getDaysAgo(2)
      previousPeriodEnd = getDaysAgo(1)
      break
    case 'week':
      currentPeriodStart = getDaysAgo(7)
      previousPeriodStart = getDaysAgo(14)
      previousPeriodEnd = getDaysAgo(7)
      break
    case 'month':
      currentPeriodStart = getDaysAgo(30)
      previousPeriodStart = getDaysAgo(60)
      previousPeriodEnd = getDaysAgo(30)
      break
    case 'year':
      currentPeriodStart = getDaysAgo(365)
      previousPeriodStart = getDaysAgo(730)
      previousPeriodEnd = getDaysAgo(365)
      break
  }

  const currentPeriodBoosts = boosts.filter(boost => {
    const boostDate = new Date(boost.date)
    return boostDate >= currentPeriodStart && boostDate <= now
  })

  const previousPeriodBoosts = boosts.filter(boost => {
    const boostDate = new Date(boost.date)
    return boostDate >= previousPeriodStart && boostDate < previousPeriodEnd
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
    currentMonth: calculateStats(currentPeriodBoosts),
    previousMonth: calculateStats(previousPeriodBoosts),
  }
}

/**
 * Calcule les statistiques mensuelles des boosts
 */
export function calculateBoostMonthlyStats(boosts: Boost[]): BoostMonthlyStats {
  return calculateBoostPeriodStats(boosts, 'month')
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

/**
 * Génère les données de graphique filtrées selon la période
 */
export function generateChartData(orders: Order[], period: 'day' | 'week' | 'month' | 'year') {
  const getDaysAgo = (days: number): Date => {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date
  }

  const periodDays = period === 'day' ? 1 : period === 'week' ? 7 : period === 'month' ? 30 : 365
  const startDate = getDaysAgo(periodDays)

  // Filtrer les commandes de la période
  const periodOrders = orders.filter(order => {
    const orderDate = new Date(order.saleDate)
    return orderDate >= startDate
  })

  // Grouper par date
  const dataByDate = new Map<string, { revenue: number; profit: number }>()

  // Initialiser toutes les dates de la période
  for (let i = 0; i < periodDays; i++) {
    const date = getDaysAgo(periodDays - i - 1)
    const dateKey = format(date, 'dd/MM', { locale: fr })
    dataByDate.set(dateKey, { revenue: 0, profit: 0 })
  }

  // Remplir avec les vraies données
  periodOrders.forEach(order => {
    const dateKey = format(new Date(order.saleDate), 'dd/MM', { locale: fr })
    const existing = dataByDate.get(dateKey) || { revenue: 0, profit: 0 }
    const profit = order.salePrice - order.purchasePrice
    dataByDate.set(dateKey, {
      revenue: existing.revenue + order.salePrice,
      profit: existing.profit + profit
    })
  })

  // Convertir en array
  return Array.from(dataByDate.entries()).map(([date, data]) => ({
    date,
    revenue: data.revenue,
    profit: data.profit
  }))
}

/**
 * Vérifie si une commande validée doit être archivée (plus de 48h)
 */
export function shouldBeArchived(order: Order): boolean {
  if (order.status !== 'validée' || order.archived) return false
  if (!order.validationDate) return false

  const now = new Date()
  const validationDate = new Date(order.validationDate)
  const hoursSinceValidation = (now.getTime() - validationDate.getTime()) / (1000 * 60 * 60)

  return hoursSinceValidation >= 48
}

/**
 * Archive automatiquement les commandes validées de plus de 48h
 */
export function autoArchiveOrders(orders: Order[]): Order[] {
  return orders.map(order => {
    if (shouldBeArchived(order)) {
      return {
        ...order,
        archived: true,
        archivedDate: order.archivedDate || new Date()
      }
    }
    return order
  })
}

/**
 * Calcule le temps restant avant archivage automatique
 */
export function getTimeUntilArchive(order: Order): string | null {
  if (order.status !== 'validée' || order.archived || !order.validationDate) return null

  const now = new Date()
  const validationDate = new Date(order.validationDate)
  const archiveDate = new Date(validationDate.getTime() + (48 * 60 * 60 * 1000))
  const timeRemaining = archiveDate.getTime() - now.getTime()
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60))

  if (hoursRemaining <= 0) return '⏰ Archivage imminent'
  if (hoursRemaining < 24) return `⏱️ ${hoursRemaining}h restantes`
  const daysRemaining = Math.floor(hoursRemaining / 24)
  return `📅 ${daysRemaining}j restant${daysRemaining > 1 ? 's' : ''}`
}
