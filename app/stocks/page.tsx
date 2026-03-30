'use client'

import { useState, useMemo } from 'react'
import { Plus, Package, DollarSign, TrendingUp, Search, Download, RefreshCw, X } from 'lucide-react'
import ArticleCard from '@/components/stocks/ArticleCard'
import ArticleModal, { type ArticleFormData } from '@/components/stocks/ArticleModal'
import StatsCard from '@/components/shared/StatsCard'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { mockArticles } from '@/data/articles'
import type { Article, ArticleStatut } from '@/lib/types'
import { calculerStatsStock, exporterCSV } from '@/lib/calculations'
import { formatCurrency } from '@/lib/utils'
import { TimePeriod } from '@/components/shared/TimeFilter'
import { AccountOption } from '@/components/dashboard/AccountSelector'

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

  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month')
  const [selectedAccount, setSelectedAccount] = useState<AccountOption>('all')

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

    if (searchTerm) {
      result = result.filter(
        (article) =>
          article.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'tous') {
      result = result.filter((article) => article.statut === statusFilter)
    }

    if (categorieFilter !== 'toutes') {
      result = result.filter((article) => article.categorie === categorieFilter)
    }

    if (marqueFilter !== 'toutes') {
      result = result.filter((article) => article.marque === marqueFilter)
    }

    return result
  }, [articles, searchTerm, statusFilter, categorieFilter, marqueFilter])

  const handleAddArticle = (data: ArticleFormData) => {
    const newArticle: Article = {
      id: Date.now().toString(),
      ...data,
      dateAjout: new Date(),
    }
    setArticles([newArticle, ...articles])
  }

  const handleEditArticle = (article: Article) => {
    setSelectedArticle(article)
    setIsModalOpen(true)
  }

  const handleUpdateArticle = (data: ArticleFormData) => {
    if (selectedArticle) {
      setArticles(articles.map((a) => a.id === selectedArticle.id ? { ...a, ...data } : a))
      setSelectedArticle(null)
    }
  }

  const handleDeleteArticle = (articleId: string) => {
    setArticles(articles.filter((a) => a.id !== articleId))
  }

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
        setTimeout(() => { window.location.reload() }, 2000)
      }
    } catch {
      setSyncResult({ success: false, message: 'Erreur de connexion au serveur' })
    } finally {
      setIsSyncing(false)
    }
  }

  const handleExportCSV = () => {
    const csv = exporterCSV(filteredArticles)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `stock_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const selectClass = "w-full px-4 py-2.5 bg-[#18181b] border border-[#27272a] rounded-[10px] text-[14px] text-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,60,243,0.15)] transition-all duration-200 appearance-none cursor-pointer"

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Gestion des Stocks"
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        selectedAccount={selectedAccount}
        onAccountChange={setSelectedAccount}
      />

      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <StatsCard
            label="Articles en stock"
            value={stats.articlesDisponibles + stats.articlesEnVente}
            icon={Package}
            iconColor="primary"
            subtitle={`${stats.articlesDisponibles} disponibles · ${stats.articlesEnVente} en vente`}
          />
          <StatsCard
            label="Valeur totale"
            value={formatCurrency(stats.valeurAchat)}
            icon={DollarSign}
            iconColor="primary"
            subtitle={`Potentiel : ${formatCurrency(stats.valeurVente)}`}
          />
          <StatsCard
            label="Taux de rotation"
            value={`${stats.tauxRotation.toFixed(1)}%`}
            icon={TrendingUp}
            iconColor="success"
            subtitle={`${stats.articlesVendus} articles vendus`}
          />
        </div>

        {/* Alerte résultat sync */}
        {syncResult && (
          <div className={`mb-6 px-5 py-4 rounded-xl border flex items-start justify-between gap-4 ${
            syncResult.success
              ? 'bg-success/10 border-success/25 text-success'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            <div>
              <p className="text-[14px] font-medium">{syncResult.message}</p>
              {syncResult.data && (
                <p className="text-[13px] opacity-70 mt-1">
                  {syncResult.data.nouveaux} nouveaux · {syncResult.data.modifies} modifiés · {syncResult.data.supprimes} supprimés
                  {syncResult.data.duree && ` · ${syncResult.data.duree}s`}
                </p>
              )}
            </div>
            <button onClick={() => setSyncResult(null)} className="opacity-60 hover:opacity-100 flex-shrink-0 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filtres */}
        <div className="bg-[#0E0E0E] border border-[#1A1A1A] rounded-xl p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Recherche */}
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-medium text-foreground/40 uppercase tracking-wider mb-1.5">
                Rechercher
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                <input
                  type="text"
                  placeholder="Nom, marque, description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#18181b] border border-[#27272a] rounded-[10px] text-[14px] text-foreground placeholder-foreground/25 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,60,243,0.15)] transition-all duration-200"
                />
              </div>
            </div>

            {/* Statut */}
            <div>
              <label className="block text-[11px] font-medium text-foreground/40 uppercase tracking-wider mb-1.5">
                Statut
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ArticleStatut | 'tous')}
                className={selectClass}
              >
                <option value="tous">Tous</option>
                <option value="disponible">Disponible</option>
                <option value="en_vente">En vente</option>
                <option value="vendu">Vendu</option>
                <option value="reserve">Réservé</option>
              </select>
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-[11px] font-medium text-foreground/40 uppercase tracking-wider mb-1.5">
                Catégorie
              </label>
              <select
                value={categorieFilter}
                onChange={(e) => setCategorieFilter(e.target.value)}
                className={selectClass}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Marque */}
            <div>
              <label className="block text-[11px] font-medium text-foreground/40 uppercase tracking-wider mb-1.5">
                Marque
              </label>
              <select
                value={marqueFilter}
                onChange={(e) => setMarqueFilter(e.target.value)}
                className={selectClass}
              >
                {marques.map((marque) => (
                  <option key={marque} value={marque}>
                    {marque.charAt(0).toUpperCase() + marque.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Barre d'actions */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-[13px] text-foreground/40">
              {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSyncVinted(true)}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2 bg-[#18181b] border border-[#27272a] text-foreground/60 hover:border-primary/50 hover:text-foreground rounded-[10px] text-[13px] font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Tester le scraping sur 2 articles"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                Test Sync
              </button>
              <button
                onClick={() => handleSyncVinted(false)}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2 bg-[#18181b] border border-[#27272a] text-foreground/60 hover:border-primary/50 hover:text-foreground rounded-[10px] text-[13px] font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Synchronisation...' : 'Sync Vinted'}
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-[#18181b] border border-[#27272a] text-foreground/60 hover:border-primary/50 hover:text-foreground rounded-[10px] text-[13px] font-medium transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                Exporter CSV
              </button>
              <button
                onClick={() => { setSelectedArticle(null); setIsModalOpen(true) }}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-[10px] text-[13px] font-semibold shadow-[0_4px_16px_rgba(0,60,243,0.4)] hover:translate-y-[-1px] hover:shadow-[0_4px_20px_rgba(0,60,243,0.5)] transition-all duration-250"
              >
                <Plus className="w-4 h-4" />
                Ajouter un article
              </button>
            </div>
          </div>
        </div>

        {/* Grille ou état vide */}
        {filteredArticles.length === 0 ? (
          <div className="bg-[#0E0E0E] border border-[#1A1A1A] rounded-xl p-12 text-center">
            <Package className="w-12 h-12 mx-auto text-foreground/20 mb-4" />
            <p className="text-[15px] text-foreground/40 mb-4">Aucun article trouvé</p>
            <button
              onClick={() => { setSelectedArticle(null); setIsModalOpen(true) }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-[10px] text-[14px] font-semibold shadow-[0_4px_16px_rgba(0,60,243,0.4)] hover:translate-y-[-1px] transition-all duration-250"
            >
              <Plus className="w-4 h-4" />
              Ajouter votre premier article
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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

        <ArticleModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedArticle(null) }}
          onSubmit={selectedArticle ? handleUpdateArticle : handleAddArticle}
          article={selectedArticle}
        />
      </div>
    </div>
  )
}
