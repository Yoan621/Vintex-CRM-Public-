import type { Article, MargeCalculation, StockStats, ArticleStatut } from './types'

/**
 * Calcule la marge brute et nette d'un article
 */
export function calculerMarge(prixAchat: number, prixVente: number): MargeCalculation {
  const fraisVinted = prixVente * 0.05 // 5% de commission Vinted
  const fraisProtection = 0.70 // Frais de protection acheteur fixe
  const margeBrute = prixVente - prixAchat
  const margeNette = prixVente - prixAchat - fraisVinted - fraisProtection
  const pourcentage = prixAchat > 0 ? ((margeNette / prixAchat) * 100).toFixed(1) : '0.0'

  return {
    margeBrute,
    margeNette,
    pourcentage: `${pourcentage}%`,
    fraisTotal: fraisVinted + fraisProtection,
    fraisVinted,
    fraisProtection,
  }
}

/**
 * Calcule les statistiques globales du stock
 */
export function calculerStatsStock(articles: Article[]): StockStats {
  const articlesDisponibles = articles.filter(
    (a) => a.statut === 'disponible' || a.statut === 'en_vente'
  )

  const articlesVendus = articles.filter((a) => a.statut === 'vendu')

  const valeurAchat = articlesDisponibles.reduce((sum, a) => sum + a.prixAchat, 0)
  const valeurVente = articlesDisponibles.reduce((sum, a) => sum + a.prixVente, 0)
  const margePotentielle = articlesDisponibles.reduce(
    (sum, a) => sum + (a.prixVente - a.prixAchat),
    0
  )

  // Calcul du taux de rotation (articles vendus ce mois / total articles)
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const articlesVendusCeMois = articlesVendus.filter((a) => {
    const dateAjout = new Date(a.dateAjout)
    return (
      dateAjout.getMonth() === currentMonth && dateAjout.getFullYear() === currentYear
    )
  }).length

  const totalArticles = articles.length
  const tauxRotation = totalArticles > 0 ? (articlesVendusCeMois / totalArticles) * 100 : 0

  return {
    articlesDisponibles: articlesDisponibles.length,
    articlesEnVente: articles.filter((a) => a.statut === 'en_vente').length,
    articlesVendus: articlesVendus.length,
    valeurAchat,
    valeurVente,
    margePotentielle,
    tauxRotation,
  }
}

/**
 * Obtient la couleur du badge selon le statut de l'article
 */
export function getArticleStatutColor(statut: ArticleStatut): string {
  switch (statut) {
    case 'disponible':
      return 'bg-[#00D98E]/10 text-[#00D98E] border-[#00D98E]/20'
    case 'en_vente':
      return 'bg-[#0066FF]/10 text-[#0066FF] border-[#0066FF]/20'
    case 'vendu':
      return 'bg-[#E9E9E9]/10 text-[#E9E9E9]/60 border-[#E9E9E9]/10'
    case 'reserve':
      return 'bg-[#FF9500]/10 text-[#FF9500] border-[#FF9500]/20'
    default:
      return 'bg-[#E9E9E9]/10 text-[#E9E9E9]/60 border-[#E9E9E9]/10'
  }
}

/**
 * Obtient le libellé formaté du statut de l'article
 */
export function getArticleStatutLabel(statut: ArticleStatut): string {
  switch (statut) {
    case 'disponible':
      return 'Disponible'
    case 'en_vente':
      return 'En vente'
    case 'vendu':
      return 'Vendu'
    case 'reserve':
      return 'Réservé'
    default:
      return statut
  }
}

/**
 * Vérifie si un article est en stock dormant (> 90 jours sans vente)
 */
export function isStockDormant(article: Article): boolean {
  if (article.statut === 'vendu') return false

  const now = new Date()
  const dateAjout = new Date(article.dateAjout)
  const joursEnStock = Math.floor(
    (now.getTime() - dateAjout.getTime()) / (1000 * 60 * 60 * 24)
  )

  return joursEnStock > 90
}

/**
 * Suggère un prix de vente basé sur le prix d'achat et l'état
 */
export function suggererPrixVente(prixAchat: number, etat: Article['etat']): number {
  let coefficient = 2.5

  switch (etat) {
    case 'neuf':
      coefficient = 3.0
      break
    case 'tres_bon':
      coefficient = 2.5
      break
    case 'bon':
      coefficient = 2.0
      break
    case 'satisfaisant':
      coefficient = 1.5
      break
  }

  return Math.round(prixAchat * coefficient)
}

/**
 * Groupe les articles par catégorie avec leur valeur
 */
export function grouperParCategorie(articles: Article[]): Record<string, { count: number; value: number }> {
  const groupes: Record<string, { count: number; value: number }> = {}

  articles.forEach((article) => {
    if (!groupes[article.categorie]) {
      groupes[article.categorie] = { count: 0, value: 0 }
    }
    groupes[article.categorie].count++
    groupes[article.categorie].value += article.prixAchat
  })

  return groupes
}

/**
 * Groupe les articles par marque
 */
export function grouperParMarque(articles: Article[]): Record<string, number> {
  const groupes: Record<string, number> = {}

  articles.forEach((article) => {
    groupes[article.marque] = (groupes[article.marque] || 0) + 1
  })

  return groupes
}

/**
 * Exporte les articles en format CSV
 */
export function exporterCSV(articles: Article[]): string {
  const headers = [
    'Nom',
    'Marque',
    'Catégorie',
    'Taille',
    'Couleur',
    'État',
    'Prix d\'achat',
    'Prix de vente',
    'Marge',
    'Statut',
    'Date d\'ajout',
  ]

  const rows = articles.map((article) => {
    const marge = calculerMarge(article.prixAchat, article.prixVente)
    return [
      article.nom,
      article.marque,
      article.categorie,
      article.taille,
      article.couleur,
      article.etat,
      article.prixAchat.toFixed(2),
      article.prixVente.toFixed(2),
      marge.pourcentage,
      article.statut,
      new Date(article.dateAjout).toLocaleDateString('fr-FR'),
    ]
  })

  return [headers, ...rows].map((row) => row.join(',')).join('\n')
}
