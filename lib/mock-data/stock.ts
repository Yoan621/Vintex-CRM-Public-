import { Article, ArticleStatut, ArticleEtat } from '@/lib/types'
import { Achat } from '@/types/achat'

/**
 * Gestion du stock d'articles
 * En production, ce serait dans une base de données
 */

let stockArticles: Article[] = []

/**
 * Récupérer tous les articles en stock
 */
export function getStockArticles(): Article[] {
  return stockArticles
}

/**
 * Générer un SKU unique pour un article
 * Format: {MARQUE-3LETTRES}{CATEGORIE-2LETTRES}{TIMESTAMP-6CHARS}
 * Exemple: LEV-PA-A3B9F2
 */
function generateSKU(marque: string, categorie: string): string {
  // Extraire les 3 premières lettres de la marque
  const marqueCode = marque.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X')

  // Code de catégorie (2 lettres)
  const categorieMap: Record<string, string> = {
    'Pantalons': 'PA',
    'Hauts': 'HA',
    'Robes': 'RO',
    'Jupes': 'JU',
    'Vestes & Manteaux': 'VM',
    'Pulls & Sweats': 'PS',
    'Chaussures': 'CH',
    'Sacs': 'SA',
    'Montres & Bijoux': 'MB',
    'Autres': 'AU'
  }
  const categorieCode = categorieMap[categorie] || 'AU'

  // Timestamp unique (6 caractères)
  const timestamp = Date.now().toString(36).slice(-6).toUpperCase()

  return `${marqueCode}-${categorieCode}-${timestamp}`
}

/**
 * Ajouter un article au stock depuis un achat
 */
export function addArticleFromAchat(achat: Achat): Article {
  // Déterminer l'état de l'article (par défaut 'bon')
  const etat: ArticleEtat = 'bon'

  // Déterminer la catégorie
  const categorie = determinerCategorie(achat.nomArticle)

  // Générer un SKU unique
  const sku = generateSKU(achat.marque, categorie)

  // Créer l'article pour le stock
  const newArticle: Article = {
    id: Math.random().toString(36).substring(2, 11),
    nom: achat.nomArticle,
    marque: achat.marque,
    categorie: categorie,
    taille: achat.taille,
    couleur: 'Non spécifié', // Pourrait être extrait des notes ou ajouté au formulaire
    etat: etat,
    prixAchat: achat.coutTotal,
    prixVente: achat.prixReventePrevu || achat.coutTotal * 1.5, // Prix de vente suggéré
    dateAjout: new Date(),
    statut: 'non_mise_en_ligne', // Nouveau statut par défaut
    photo: achat.photo,
    description: achat.notes || `${achat.marque} ${achat.nomArticle} taille ${achat.taille}`,
    sku: sku,
    nombreVues: 0,
    nombreFavoris: 0
  }

  stockArticles = [...stockArticles, newArticle]
  console.log('Article ajouté au stock:', newArticle)

  return newArticle
}

/**
 * Ajouter plusieurs articles au stock en une fois
 */
export function addMultipleArticlesFromAchats(achats: Achat[]): Article[] {
  const articlesAjoutes = achats.map(achat => addArticleFromAchat(achat))
  console.log(`✅ ${articlesAjoutes.length} article(s) ajouté(s) au stock`)
  return articlesAjoutes
}

/**
 * Déterminer la catégorie d'un article selon son nom
 * Cette fonction pourrait être améliorée avec de l'IA ou une liste de mots-clés
 */
function determinerCategorie(nomArticle: string): string {
  const nom = nomArticle.toLowerCase()

  if (nom.includes('jean') || nom.includes('pantalon')) return 'Pantalons'
  if (nom.includes('chemise') || nom.includes('blouse')) return 'Hauts'
  if (nom.includes('robe')) return 'Robes'
  if (nom.includes('jupe')) return 'Jupes'
  if (nom.includes('veste') || nom.includes('manteau') || nom.includes('blouson')) return 'Vestes & Manteaux'
  if (nom.includes('pull') || nom.includes('sweat')) return 'Pulls & Sweats'
  if (nom.includes('chaussure') || nom.includes('basket') || nom.includes('sneaker')) return 'Chaussures'
  if (nom.includes('sac')) return 'Sacs'
  if (nom.includes('montre')) return 'Montres & Bijoux'

  return 'Autres'
}

/**
 * Supprimer un article du stock
 */
export function removeArticleFromStock(id: string): boolean {
  const initialLength = stockArticles.length
  stockArticles = stockArticles.filter(a => a.id !== id)
  return stockArticles.length < initialLength
}

/**
 * Mettre à jour le statut d'un article
 */
export function updateArticleStatus(id: string, statut: ArticleStatut): Article | null {
  const articleIndex = stockArticles.findIndex(a => a.id === id)

  if (articleIndex === -1) return null

  stockArticles[articleIndex] = {
    ...stockArticles[articleIndex],
    statut
  }

  return stockArticles[articleIndex]
}

/**
 * Compter les articles par statut
 */
export function countArticlesByStatus(): Record<ArticleStatut, number> {
  return {
    disponible: stockArticles.filter(a => a.statut === 'disponible').length,
    en_vente: stockArticles.filter(a => a.statut === 'en_vente').length,
    vendu: stockArticles.filter(a => a.statut === 'vendu').length,
    reserve: stockArticles.filter(a => a.statut === 'reserve').length
  }
}

/**
 * Réinitialiser le stock (utile pour le développement)
 */
export function resetStock(): void {
  stockArticles = []
}
