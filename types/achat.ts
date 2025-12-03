/**
 * Types pour la gestion des achats
 */

export type Plateforme = 'vinted' | 'leboncoin' | 'vide_grenier' | 'autre'

export type StatutAchat = 'en_attente' | 'expedie' | 'recu' | 'en_stock' | 'revendu'

export interface Achat {
  id: string
  numeroTransaction: string
  nomArticle: string
  marque: string
  taille: string
  prixAchat: number
  fraisPort: number
  coutTotal: number
  dateAchat: string
  plateforme: Plateforme
  vendeur?: string
  statut: StatutAchat
  numeroSuivi?: string
  urlSuivi?: string
  prixReventePrevu?: number
  margeEstimee?: number
  photo?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface AchatFormData {
  numeroTransaction: string
  nomArticle: string
  marque: string
  taille: string
  prixAchat: number
  fraisPort: number
  dateAchat: string
  plateforme: Plateforme
  vendeur?: string
  numeroSuivi?: string
  prixReventePrevu?: number
  notes?: string
  photo?: File
}

export interface AchatStats {
  argentDepense: number
  evolutionDepenses: number
  nombreArticles: number
  nouvelleArticles: number
  margeEstimee: number
  roi: number
  enAttente: number
  expedie: number
  recu: number
  enStock: number
  revendu: number
}

export interface FilterOptions {
  searchQuery: string
  statutFilter: StatutAchat | 'tous'
  plateformeFilter: Plateforme | 'toutes'
}
