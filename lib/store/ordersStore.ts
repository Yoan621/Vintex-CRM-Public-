/**
 * Store en mémoire pour les commandes Vinted
 * Stockage temporaire des données récupérées par l'extension navigateur
 */

export interface Order {
  id: string
  transactionNumber: string
  articleName: string
  brandName?: string
  vintedAccount: string
  status: 'non_traite' | 'validee' | 'annulee'
  purchaseDate?: Date
  saleDate: Date
  purchasePrice: number
  salePrice: number
  trackingNumber?: string
  carrier?: string
  customerName: string
  invoice?: string
  shippingLabel?: string
  articleImage?: string
}

let orders: Order[] = []

/**
 * Ajouter une commande
 */
export function addOrder(order: Omit<Order, 'id'>): Order {
  const newOrder: Order = {
    ...order,
    id: Math.random().toString(36).substring(7),
    saleDate: order.saleDate instanceof Date ? order.saleDate : new Date(order.saleDate),
    purchaseDate: order.purchaseDate instanceof Date ? order.purchaseDate : order.purchaseDate ? new Date(order.purchaseDate) : undefined
  }
  
  orders.push(newOrder)
  console.log(`✅ Commande ajoutée: ${order.transactionNumber}`)
  return newOrder
}

/**
 * Ajouter plusieurs commandes à la fois
 */
export function addOrders(newOrders: Omit<Order, 'id'>[]): Order[] {
  const added = newOrders.map(order => {
    const formattedOrder: Order = {
      ...order,
      id: Math.random().toString(36).substring(7),
      saleDate: order.saleDate instanceof Date ? order.saleDate : new Date(order.saleDate),
      purchaseDate: order.purchaseDate instanceof Date ? order.purchaseDate : order.purchaseDate ? new Date(order.purchaseDate) : undefined
    }
    orders.push(formattedOrder)
    return formattedOrder
  })
  
  console.log(`✅ ${added.length} commande(s) ajoutée(s)`)
  return added
}

/**
 * Récupérer toutes les commandes
 */
export function getOrders(): Order[] {
  return orders
}

/**
 * Récupérer les commandes filtrées par statut
 */
export function getOrdersByStatus(status: Order['status']): Order[] {
  return orders.filter(o => o.status === status)
}

/**
 * Récupérer les commandes filtrées par compte Vinted
 */
export function getOrdersByAccount(account: string): Order[] {
  return orders.filter(o => o.vintedAccount === account)
}

/**
 * Récupérer une commande par ID
 */
export function getOrderById(id: string): Order | null {
  return orders.find(o => o.id === id) || null
}

/**
 * Récupérer une commande par numéro de transaction
 */
export function getOrderByTransactionNumber(transactionNumber: string): Order | null {
  return orders.find(o => o.transactionNumber === transactionNumber) || null
}

/**
 * Mettre à jour une commande
 */
export function updateOrder(id: string, updates: Partial<Order>): Order | null {
  const order = orders.find(o => o.id === id)
  
  if (!order) {
    console.warn(`⚠️ Commande ${id} non trouvée`)
    return null
  }

  const updatedOrder = {
    ...order,
    ...updates,
    id: order.id // Garder l'ID original
  }
  
  const index = orders.indexOf(order)
  orders[index] = updatedOrder
  console.log(`✅ Commande ${id} mise à jour`)
  
  return updatedOrder
}

/**
 * Supprimer une commande
 */
export function deleteOrder(id: string): boolean {
  const initialLength = orders.length
  orders = orders.filter(o => o.id !== id)
  
  if (orders.length < initialLength) {
    console.log(`✅ Commande ${id} supprimée`)
    return true
  }
  
  console.warn(`⚠️ Commande ${id} non trouvée`)
  return false
}

/**
 * Récupérer les statistiques
 */
export function getOrdersStats() {
  const total = orders.length
  const nonTraite = orders.filter(o => o.status === 'non_traite').length
  const validee = orders.filter(o => o.status === 'validee').length
  const annulee = orders.filter(o => o.status === 'annulee').length
  
  const totalRevenue = orders.reduce((sum, o) => sum + o.salePrice, 0)
  const totalCost = orders.reduce((sum, o) => sum + o.purchasePrice, 0)
  const totalProfit = totalRevenue - totalCost
  
  const accounts = Array.from(new Set(orders.map(o => o.vintedAccount)))
  
  return {
    total,
    byStatus: { nonTraite, validee, annulee },
    revenue: totalRevenue,
    cost: totalCost,
    profit: totalProfit,
    accounts
  }
}

/**
 * Récupérer les commandes d'une période
 */
export function getOrdersByPeriod(startDate: Date, endDate: Date): Order[] {
  return orders.filter(o => {
    const oDate = o.saleDate instanceof Date ? o.saleDate : new Date(o.saleDate)
    return oDate >= startDate && oDate <= endDate
  })
}

/**
 * Vider tout le store (utile pour réinitialiser)
 */
export function clearOrders(): void {
  orders = []
  console.log('🗑️ Toutes les commandes ont été supprimées')
}

/**
 * Obtenir la liste des comptes uniques
 */
export function getUniqueAccounts(): string[] {
  return Array.from(new Set(orders.map(o => o.vintedAccount)))
}
