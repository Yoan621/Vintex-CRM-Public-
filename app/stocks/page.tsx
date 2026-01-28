'use client'

import { useState, useMemo } from 'react'
import { Plus, Package, DollarSign, TrendingUp, Search, Download, RefreshCw } from 'lucide-react'
import ArticleCard from '@/components/stocks/ArticleCard'
import ArticleModal, { type ArticleFormData } from '@/components/stocks/ArticleModal'
import StatsCard from '@/components/shared/StatsCard'
import { mockArticles } from '@/data/articles'
import type { Article, ArticleStatut } from '@/lib/types'
import { calculerStatsStock, exporterCSV } from '@/lib/calculations'
import { formatCurrency } from '@/lib/utils'

/**
 * Page de gestion des stocks (inventaire)
 */
export default function StocksPage() {
  const [articles, setArticles] = useState<Article[]>(mockArticles)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ArticleStatut | 'tous'>('tous')
  const [categorieFilter, setCategorieFilter] = useState<string>('toutes')
  const [marqueFilter, setMarqueFilter] = useState<string>('toutes')

  // États pour le scraping Vinted
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<{
    success: boolean
    message?: string
    data?: any
  } | null>(null)

  // Calcul des statistiques
  const stats = calculerStatsStock(articles)

  // Liste unique des catégories et marques pour les filtres
  const categories = ['toutes', ...Array.from(new Set(articles.map((a) => a.categorie)))]
  const marques = ['toutes', ...Array.from(new Set(articles.map((a) => a.marque)))]

  // Filtrage des articles
  const filteredArticles = useMemo(() => {
    let result = [...articles]

    // Recherche
    if (searchTerm) {
      result = result.filter(
        (article) =>
          article.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtre par statut
    if (statusFilter !== 'tous') {
      result = result.filter((article) => article.statut === statusFilter)
    }

    // Filtre par catégorie
    if (categorieFilter !== 'toutes') {
      result = result.filter((article) => article.categorie === categorieFilter)
    }

    // Filtre par marque
    if (marqueFilter !== 'toutes') {
      result = result.filter((article) => article.marque === marqueFilter)
    }

    return result
  }, [articles, searchTerm, statusFilter, categorieFilter, marqueFilter])

  // Gestion de l'ajout d'un article
  const handleAddArticle = (data: ArticleFormData) => {
    const newArticle: Article = {
      id: Date.now().toString(),
      ...data,
      dateAjout: new Date(),
    }

    setArticles([newArticle, ...articles])
    alert('Article ajouté avec succès !')
  }

  // Gestion de la modification d'un article
  const handleEditArticle = (article: Article) => {
    setSelectedArticle(article)
    setIsModalOpen(true)
  }

  const handleUpdateArticle = (data: ArticleFormData) => {
    if (selectedArticle) {
      setArticles(
        articles.map((a) =>
          a.id === selectedArticle.id
            ? { ...a, ...data }
            : a
        )
      )
      alert('Article modifié avec succès !')
      setSelectedArticle(null)
    }
  }

  // Gestion de la suppression d'un article
  const handleDeleteArticle = (articleId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      setArticles(articles.filter((a) => a.id !== articleId))
      alert('Article supprimé avec succès !')
    }
  }

  // Synchronisation Vinted
  const handleSyncVinted = async (testMode = false) => {
    setIsSyncing(true)
    setSyncResult(null)

    try {
      const response = await fetch('/api/scraping/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileUrl: 'https://www.vinted.fr/member/178767503',
          testMode
        })
      })

      const data = await response.json()
      setSyncResult(data)

      if (data.success) {
        // Recharger la page pour afficher les nouveaux articles
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }

    } catch (error) {
      setSyncResult({
        success: false,
        message: 'Erreur de connexion au serveur'
      })
    } finally {
      setIsSyncing(false)
    }
  }

  // Export CSV
  const handleExportCSV = () => {
    const csv = exporterCSV(filteredArticles)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `stock_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        {/* En-tête */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-heading text-gray-900 mb-3">
                Gestion des Stocks
              </h1>
              <p className="text-grayMedium text-lg">
                Gérez l'inventaire complet de votre dressing
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Bouton Test Scraping (2 articles) */}
              <button
                onClick={() => handleSyncVinted(true)}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                title="Tester le scraping sur 2 articles"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                Test Sync
              </button>

              {/* Bouton Sync Complète */}
              <button
                onClick={() => handleSyncVinted(false)}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Synchronisation...' : 'Sync Vinted'}
              </button>

              {/* Bouton Ajouter Article */}
              <button
                onClick={() => {
                  setSelectedArticle(null)
                  setIsModalOpen(true)
                }}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5" />
                Ajouter un article
              </button>
            </div>
          </div>
        </div>

        {/* Alerte de résultat de synchronisation */}
        {syncResult && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              syncResult.success
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{syncResult.message}</p>
                {syncResult.data && (
                  <p className="text-sm mt-1">
                    {syncResult.data.nouveaux} nouveaux • {syncResult.data.modifies} modifiés • {syncResult.data.supprimes} supprimés
                    {syncResult.data.duree && ` • ${syncResult.data.duree}s`}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSyncResult(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Statistiques KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            label="Articles en stock"
            value={stats.articlesDisponibles + stats.articlesEnVente}
            icon={Package}
            iconColor="blue"
            subtitle={`${stats.articlesDisponibles} disponibles • ${stats.articlesEnVente} en vente`}
          />
          <StatsCard
            label="Valeur totale"
            value={formatCurrency(stats.valeurAchat)}
            icon={DollarSign}
            iconColor="violet"
            subtitle={`Potentiel: ${formatCurrency(stats.valeurVente)}`}
          />
          <StatsCard
            label="Taux de rotation"
            value={`${stats.tauxRotation.toFixed(1)}%`}
            icon={TrendingUp}
            iconColor="green"
            subtitle={`${stats.articlesVendus} articles vendus`}
          />
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Barre de recherche */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-colors"
                />
              </div>
            </div>

            {/* Filtre par statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ArticleStatut | 'tous')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-colors"
              >
                <option value="tous">Tous</option>
                <option value="disponible">Disponible</option>
                <option value="en_vente">En vente</option>
                <option value="vendu">Vendu</option>
                <option value="reserve">Réservé</option>
              </select>
            </div>

            {/* Filtre par catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={categorieFilter}
                onChange={(e) => setCategorieFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre par marque */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marque
              </label>
              <select
                value={marqueFilter}
                onChange={(e) => setMarqueFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-colors"
              >
                {marques.map((marque) => (
                  <option key={marque} value={marque}>
                    {marque.charAt(0).toUpperCase() + marque.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bouton Export */}
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {filteredArticles.length} article(s) trouvé(s)
            </p>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Exporter CSV
            </button>
          </div>
        </div>

        {/* Vue Grille */}
        {filteredArticles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">
              Aucun article trouvé
            </p>
            <button
              onClick={() => {
                setSelectedArticle(null)
                setIsModalOpen(true)
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Ajouter votre premier article
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onEdit={handleEditArticle}
                onDelete={handleDeleteArticle}
              />
            ))}
          </div>
        )}

        {/* Modale d'ajout/modification */}
        <ArticleModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedArticle(null)
          }}
          onSubmit={selectedArticle ? handleUpdateArticle : handleAddArticle}
          article={selectedArticle}
        />
      </div>
    </div>
  )
}
