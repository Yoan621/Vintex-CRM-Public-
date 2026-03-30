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
  status: 'non_traite' | 'en_cours' | 'litige' | 'validée' | 'annulée'
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
  cancellationReason?: string
  cancellationDate?: Date
  validationDate?: Date
  shippingDate?: Date
  disputeReason?: string
  disputeDate?: Date
  disputeResolved?: boolean
  archived?: boolean
  archivedDate?: Date
}

const daysAgo = (n: number): Date => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

let orders: Order[] = [
  // ──── Non traitées (à expédier) ────
  {
    id: 'nt1',
    transactionNumber: '#VT-2026-NT1',
    articleName: 'Jordan 1 Retro High OG',
    brandName: 'Nike',
    vintedAccount: '@vintex_shop',
    status: 'non_traite',
    purchaseDate: daysAgo(5),
    saleDate: daysAgo(1),
    purchasePrice: 95,
    salePrice: 185,
    trackingNumber: '3X00000000001',
    carrier: 'chronopost',
    customerName: 'Alexandre Petit',
    invoice: '/invoices/nt1.pdf',
    shippingLabel: '/labels/nt1.pdf',
  },
  {
    id: 'nt2',
    transactionNumber: '#VT-2026-NT2',
    articleName: 'Canada Goose Parka Expedition',
    brandName: 'Canada Goose',
    vintedAccount: '@vintex_shop',
    status: 'non_traite',
    purchaseDate: daysAgo(4),
    saleDate: daysAgo(1),
    purchasePrice: 245,
    salePrice: 490,
    trackingNumber: '3X00000000002',
    carrier: 'colissimo',
    customerName: 'Charlotte Rousseau',
    invoice: '/invoices/nt2.pdf',
    shippingLabel: '/labels/nt2.pdf',
  },
  {
    id: 'nt3',
    transactionNumber: '#VT-2026-NT3',
    articleName: 'Ralph Lauren Chemise Oxford',
    brandName: 'Ralph Lauren',
    vintedAccount: '@resell_pro',
    status: 'non_traite',
    purchaseDate: daysAgo(3),
    saleDate: daysAgo(0),
    purchasePrice: 28,
    salePrice: 62,
    trackingNumber: '3X00000000003',
    carrier: 'mondial_relay',
    customerName: 'Louis Martin',
    invoice: '/invoices/nt3.pdf',
    shippingLabel: '/labels/nt3.pdf',
  },
  {
    id: 'nt4',
    transactionNumber: '#VT-2026-NT4',
    articleName: "New Balance 990v5",
    brandName: 'New Balance',
    vintedAccount: '@fashion_paris',
    status: 'non_traite',
    purchaseDate: daysAgo(2),
    saleDate: daysAgo(0),
    purchasePrice: 58,
    salePrice: 115,
    trackingNumber: '3X00000000004',
    carrier: 'vinted_go',
    customerName: 'Chloé Durand',
    invoice: '/invoices/nt4.pdf',
    shippingLabel: '/labels/nt4.pdf',
  },
  // ──── En cours (expédiées) ────
  {
    id: 'ec1',
    transactionNumber: '#VT-2026-EC1',
    articleName: 'Zara Manteau Oversize',
    brandName: 'Zara',
    vintedAccount: '@vintex_shop',
    status: 'en_cours',
    purchaseDate: daysAgo(15),
    saleDate: daysAgo(8),
    purchasePrice: 30,
    salePrice: 68,
    trackingNumber: '3X00000000010',
    carrier: 'colissimo',
    customerName: 'Sophie Martin',
    shippingDate: daysAgo(7),
    invoice: '/invoices/ec1.pdf',
    shippingLabel: '/labels/ec1.pdf',
  },
  {
    id: 'ec2',
    transactionNumber: '#VT-2026-EC2',
    articleName: "Levi's 501 Jean Vintage",
    brandName: "Levi's",
    vintedAccount: '@vintex_shop',
    status: 'en_cours',
    purchaseDate: daysAgo(12),
    saleDate: daysAgo(6),
    purchasePrice: 38,
    salePrice: 82,
    trackingNumber: '3X00000000011',
    carrier: 'chronopost',
    customerName: 'Thomas Bernard',
    shippingDate: daysAgo(5),
    invoice: '/invoices/ec2.pdf',
    shippingLabel: '/labels/ec2.pdf',
  },
  {
    id: 'ec3',
    transactionNumber: '#VT-2026-EC3',
    articleName: 'The North Face Nuptse 700',
    brandName: 'The North Face',
    vintedAccount: '@resell_pro',
    status: 'en_cours',
    purchaseDate: daysAgo(10),
    saleDate: daysAgo(5),
    purchasePrice: 90,
    salePrice: 170,
    trackingNumber: '3X00000000012',
    carrier: 'chronopost',
    customerName: 'Antoine Dupont',
    shippingDate: daysAgo(4),
    invoice: '/invoices/ec3.pdf',
    shippingLabel: '/labels/ec3.pdf',
  },
  {
    id: 'ec4',
    transactionNumber: '#VT-2026-EC4',
    articleName: 'Vans Old Skool Checkerboard',
    brandName: 'Vans',
    vintedAccount: '@fashion_paris',
    status: 'en_cours',
    purchaseDate: daysAgo(9),
    saleDate: daysAgo(4),
    purchasePrice: 35,
    salePrice: 72,
    trackingNumber: '3X00000000013',
    carrier: 'mondial_relay',
    customerName: 'Clara Petit',
    shippingDate: daysAgo(3),
    invoice: '/invoices/ec4.pdf',
    shippingLabel: '/labels/ec4.pdf',
  },
  // ──── Litiges ────
  {
    id: 'lit1',
    transactionNumber: '#VT-2026-LIT1',
    articleName: 'Balenciaga Triple S',
    brandName: 'Balenciaga',
    vintedAccount: '@vintex_shop',
    status: 'litige',
    purchaseDate: daysAgo(20),
    saleDate: daysAgo(14),
    purchasePrice: 180,
    salePrice: 360,
    trackingNumber: '3X00000000020',
    carrier: 'chronopost',
    customerName: 'Pierre Dubois',
    disputeReason: 'Article endommagé pendant le transport',
    disputeDate: daysAgo(8),
    disputeResolved: false,
    invoice: '/invoices/lit1.pdf',
    shippingLabel: '/labels/lit1.pdf',
  },
  {
    id: 'lit2',
    transactionNumber: '#VT-2026-LIT2',
    articleName: 'Moncler Doudoune Maya',
    brandName: 'Moncler',
    vintedAccount: '@resell_pro',
    status: 'litige',
    purchaseDate: daysAgo(18),
    saleDate: daysAgo(12),
    purchasePrice: 310,
    salePrice: 640,
    trackingNumber: '3X00000000021',
    carrier: 'colissimo',
    customerName: 'Sophie Laurent',
    disputeReason: "Ne correspond pas à la description (tache non mentionnée)",
    disputeDate: daysAgo(6),
    disputeResolved: false,
    invoice: '/invoices/lit2.pdf',
    shippingLabel: '/labels/lit2.pdf',
  },
  // ──── Validées (ce mois) ────
  {
    id: 'v1',
    transactionNumber: '#VT-2026-001',
    articleName: 'Nike Air Max 90 Triple White',
    brandName: 'Nike',
    vintedAccount: '@vintex_shop',
    status: 'validée',
    purchaseDate: daysAgo(28),
    saleDate: daysAgo(18),
    purchasePrice: 45,
    salePrice: 92,
    trackingNumber: '3X00000000030',
    carrier: 'mondial_relay',
    customerName: 'Marie Dubois',
    validationDate: daysAgo(15),
    invoice: '/invoices/v1.pdf',
    shippingLabel: '/labels/v1.pdf',
  },
  {
    id: 'v2',
    transactionNumber: '#VT-2026-002',
    articleName: 'Adidas Stan Smith Vert',
    brandName: 'Adidas',
    vintedAccount: '@vintex_shop',
    status: 'validée',
    purchaseDate: daysAgo(25),
    saleDate: daysAgo(16),
    purchasePrice: 32,
    salePrice: 68,
    trackingNumber: '3X00000000031',
    carrier: 'vinted_go',
    customerName: 'Julie Rousseau',
    validationDate: daysAgo(13),
    invoice: '/invoices/v2.pdf',
    shippingLabel: '/labels/v2.pdf',
  },
  {
    id: 'v3',
    transactionNumber: '#VT-2026-003',
    articleName: 'Pull&Bear Sweat Vintage',
    brandName: 'Pull&Bear',
    vintedAccount: '@resell_pro',
    status: 'validée',
    purchaseDate: daysAgo(22),
    saleDate: daysAgo(14),
    purchasePrice: 18,
    salePrice: 42,
    trackingNumber: '3X00000000032',
    carrier: 'mondial_relay',
    customerName: 'Lucas Moreau',
    validationDate: daysAgo(11),
    invoice: '/invoices/v3.pdf',
    shippingLabel: '/labels/v3.pdf',
  },
  {
    id: 'v4',
    transactionNumber: '#VT-2026-004',
    articleName: 'Lacoste Polo Classique',
    brandName: 'Lacoste',
    vintedAccount: '@fashion_paris',
    status: 'validée',
    purchaseDate: daysAgo(20),
    saleDate: daysAgo(12),
    purchasePrice: 35,
    salePrice: 72,
    trackingNumber: '3X00000000033',
    carrier: 'chronopost',
    customerName: 'Nathan Roux',
    validationDate: daysAgo(9),
    invoice: '/invoices/v4.pdf',
    shippingLabel: '/labels/v4.pdf',
  },
  {
    id: 'v5',
    transactionNumber: '#VT-2026-005',
    articleName: 'Mango Chemise Brodée',
    brandName: 'Mango',
    vintedAccount: '@vintex_shop',
    status: 'validée',
    purchaseDate: daysAgo(18),
    saleDate: daysAgo(10),
    purchasePrice: 16,
    salePrice: 35,
    trackingNumber: '3X00000000034',
    carrier: 'mondial_relay',
    customerName: 'Camille Simon',
    validationDate: daysAgo(7),
    invoice: '/invoices/v5.pdf',
    shippingLabel: '/labels/v5.pdf',
  },
  // ──── Annulées ────
  {
    id: 'an1',
    transactionNumber: '#VT-2026-ANN1',
    articleName: 'H&M Robe Fleurie',
    brandName: 'H&M',
    vintedAccount: '@fashion_paris',
    status: 'annulée',
    purchaseDate: daysAgo(16),
    saleDate: daysAgo(9),
    purchasePrice: 14,
    salePrice: 32,
    customerName: 'Emma Leroy',
    cancellationReason: 'Article non conforme à la description',
    cancellationDate: daysAgo(8),
  },
  {
    id: 'an2',
    transactionNumber: '#VT-2026-ANN2',
    articleName: 'Converse Chuck Taylor Hi',
    brandName: 'Converse',
    vintedAccount: '@resell_pro',
    status: 'annulée',
    purchaseDate: daysAgo(22),
    saleDate: daysAgo(13),
    purchasePrice: 28,
    salePrice: 55,
    customerName: 'Hugo Laurent',
    cancellationReason: "Changement d'avis client",
    cancellationDate: daysAgo(12),
  },
  // ──── Validées mois précédent (archivées) ────
  {
    id: 'arch1',
    transactionNumber: '#VT-2026-ARCH1',
    articleName: 'Adidas Yeezy Boost 350 V2',
    brandName: 'Adidas',
    vintedAccount: '@vintex_shop',
    status: 'validée',
    purchaseDate: daysAgo(75),
    saleDate: daysAgo(55),
    purchasePrice: 150,
    salePrice: 290,
    trackingNumber: '3X00000000050',
    carrier: 'chronopost',
    customerName: 'Thomas Bernard',
    validationDate: daysAgo(52),
    archived: true,
    archivedDate: daysAgo(50),
    invoice: '/invoices/arch1.pdf',
    shippingLabel: '/labels/arch1.pdf',
  },
  {
    id: 'arch2',
    transactionNumber: '#VT-2026-ARCH2',
    articleName: 'Supreme Box Logo Hoodie',
    brandName: 'Supreme',
    vintedAccount: '@vintex_shop',
    status: 'validée',
    purchaseDate: daysAgo(85),
    saleDate: daysAgo(62),
    purchasePrice: 195,
    salePrice: 460,
    trackingNumber: '3X00000000051',
    carrier: 'colissimo',
    customerName: 'Lucas Martin',
    validationDate: daysAgo(59),
    archived: true,
    archivedDate: daysAgo(57),
    invoice: '/invoices/arch2.pdf',
    shippingLabel: '/labels/arch2.pdf',
  },
  {
    id: 'arch3',
    transactionNumber: '#VT-2026-ARCH3',
    articleName: 'Louis Vuitton Keepall 50',
    brandName: 'Louis Vuitton',
    vintedAccount: '@resell_pro',
    status: 'validée',
    purchaseDate: daysAgo(95),
    saleDate: daysAgo(72),
    purchasePrice: 380,
    salePrice: 760,
    trackingNumber: '3X00000000052',
    carrier: 'chronopost',
    customerName: 'Emma Rousseau',
    validationDate: daysAgo(69),
    archived: true,
    archivedDate: daysAgo(67),
    invoice: '/invoices/arch3.pdf',
    shippingLabel: '/labels/arch3.pdf',
  },
  {
    id: 'arch4',
    transactionNumber: '#VT-2026-ARCH4',
    articleName: 'Timberland 6-Inch Premium',
    brandName: 'Timberland',
    vintedAccount: '@fashion_paris',
    status: 'validée',
    purchaseDate: daysAgo(100),
    saleDate: daysAgo(80),
    purchasePrice: 62,
    salePrice: 125,
    trackingNumber: '3X00000000053',
    carrier: 'vinted_go',
    customerName: 'Sarah Blanc',
    validationDate: daysAgo(77),
    archived: true,
    archivedDate: daysAgo(75),
    invoice: '/invoices/arch4.pdf',
    shippingLabel: '/labels/arch4.pdf',
  },
  {
    id: 'arch5',
    transactionNumber: '#VT-2026-ARCH5',
    articleName: 'Puma Suede Classic',
    brandName: 'Puma',
    vintedAccount: '@vintex_shop',
    status: 'validée',
    purchaseDate: daysAgo(110),
    saleDate: daysAgo(88),
    purchasePrice: 30,
    salePrice: 58,
    trackingNumber: '3X00000000054',
    carrier: 'vinted_go',
    customerName: 'Léa Garcia',
    validationDate: daysAgo(85),
    archived: true,
    archivedDate: daysAgo(83),
    invoice: '/invoices/arch5.pdf',
    shippingLabel: '/labels/arch5.pdf',
  },
]

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
