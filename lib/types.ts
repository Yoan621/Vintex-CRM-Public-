/**
 * Types pour le CRM Vinted
 */

// Statuts possibles pour une commande
export type OrderStatus = 'en_cours' | 'validée' | 'annulée'

// Interface principale pour une commande
export interface Order {
  id: string
  transactionNumber: string
  articleName: string
  status: OrderStatus
  saleDate: Date
  purchasePrice: number
  salePrice: number
  trackingNumber?: string
  customerName: string
  invoice?: string
  shippingLabel?: string
  cancellationReason?: string
  cancellationDate?: Date
  validationDate?: Date
  shippingDate?: Date
  articleImage?: string
}

// Interface pour les KPIs (indicateurs de performance)
export interface KPI {
  label: string
  value: number
  previousValue: number
  percentageChange: number
  isPositive: boolean
}

// Type pour les périodes du graphique
export type ChartPeriod = 'day' | 'week' | 'month' | 'year'

// Interface pour les données du graphique
export interface ChartData {
  date: string
  revenue: number
  profit: number
}

// Interface pour les statistiques mensuelles
export interface MonthlyStats {
  currentMonth: {
    revenue: number
    profit: number
    ordersCount: number
  }
  previousMonth: {
    revenue: number
    profit: number
    ordersCount: number
  }
}

// Statuts possibles pour un boost
export type BoostStatus = 'actif' | 'expiré' | 'annulé'

// Durée d'un boost Vinted
export type BoostDuration = '3j' | '7j'

// Interface pour un boost
export interface Boost {
  id: string
  date: Date
  article: string
  prix: number
  status: BoostStatus
  dateExpiration?: Date
  duration?: BoostDuration
}

// Interface pour les statistiques mensuelles des boosts
export interface BoostMonthlyStats {
  currentMonth: {
    totalSpent: number
    activeBoosts: number
    totalBoosts: number
  }
  previousMonth: {
    totalSpent: number
    activeBoosts: number
    totalBoosts: number
  }
}

// Type pour le filtre de période des boosts
export type BoostPeriodFilter = 'currentMonth' | 'lastMonth' | 'last3Months' | 'custom'

// État d'un article
export type ArticleEtat = 'neuf' | 'tres_bon' | 'bon' | 'satisfaisant'

// Statut d'un article dans le stock
export type ArticleStatut = 'disponible' | 'en_vente' | 'vendu' | 'reserve'

// Interface pour un article du stock
export interface Article {
  id: string
  nom: string
  marque: string
  categorie: string
  taille: string
  couleur: string
  etat: ArticleEtat
  prixAchat: number
  prixVente: number
  dateAjout: Date
  statut: ArticleStatut
  photo?: string
  description?: string
  emplacement?: string
  nombreVues?: number
  nombreFavoris?: number
}

// Interface pour les statistiques du stock
export interface StockStats {
  articlesDisponibles: number
  articlesEnVente: number
  articlesVendus: number
  valeurAchat: number
  valeurVente: number
  margePotentielle: number
  tauxRotation: number
}

// Interface pour le calcul de marge
export interface MargeCalculation {
  margeBrute: number
  margeNette: number
  pourcentage: string
  fraisTotal: number
  fraisVinted: number
  fraisProtection: number
}
