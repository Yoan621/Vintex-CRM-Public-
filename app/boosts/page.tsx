'use client'

import { useState, useMemo } from 'react'
import { Plus, TrendingUp, Zap, DollarSign } from 'lucide-react'
import BoostTable from '@/components/boosts/BoostTable'
import BoostFilters from '@/components/boosts/BoostFilters'
import BoostModal, { type BoostFormData } from '@/components/boosts/BoostModal'
import StatsCard from '@/components/shared/StatsCard'
import { mockBoosts } from '@/data/boosts'
import type { Boost, BoostStatus, BoostPeriodFilter } from '@/lib/types'
import {
  formatCurrency,
  calculateBoostMonthlyStats,
  calculatePercentageChange,
} from '@/lib/utils'

/**
 * Page de gestion des boosts Vinted
 */
export default function BoostsPage() {
  const [boosts, setBoosts] = useState<Boost[]>(mockBoosts)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<BoostStatus | 'tous'>('tous')
  const [periodFilter, setPeriodFilter] = useState<BoostPeriodFilter>('currentMonth')

  // Calcul des statistiques
  const stats = calculateBoostMonthlyStats(boosts)
  const spentChange = calculatePercentageChange(
    stats.currentMonth.totalSpent,
    stats.previousMonth.totalSpent
  )
  const isSpentPositive = spentChange >= 0

  // Filtrage des boosts
  const filteredBoosts = useMemo(() => {
    let result = [...boosts]

    // Filtre par recherche
    if (searchTerm) {
      result = result.filter((boost) =>
        boost.article.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtre par statut
    if (statusFilter !== 'tous') {
      result = result.filter((boost) => boost.status === statusFilter)
    }

    // Filtre par période
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    switch (periodFilter) {
      case 'currentMonth':
        result = result.filter((boost) => {
          const boostDate = new Date(boost.date)
          return (
            boostDate.getMonth() === currentMonth &&
            boostDate.getFullYear() === currentYear
          )
        })
        break
      case 'lastMonth':
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
        result = result.filter((boost) => {
          const boostDate = new Date(boost.date)
          return (
            boostDate.getMonth() === lastMonth &&
            boostDate.getFullYear() === lastMonthYear
          )
        })
        break
      case 'last3Months':
        const threeMonthsAgo = new Date()
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
        result = result.filter((boost) => new Date(boost.date) >= threeMonthsAgo)
        break
      case 'custom':
        // À implémenter avec un date picker
        break
    }

    return result
  }, [boosts, searchTerm, statusFilter, periodFilter])

  // Gestion de l'ajout d'un boost
  const handleAddBoost = (data: BoostFormData) => {
    const newBoost: Boost = {
      id: Date.now().toString(),
      date: new Date(data.date),
      article: data.article,
      prix: data.prix,
      status: 'actif',
      duration: data.duree,
      dateExpiration: new Date(
        new Date(data.date).getTime() +
          (data.duree === '3j' ? 3 : 7) * 24 * 60 * 60 * 1000
      ),
    }

    setBoosts([newBoost, ...boosts])

    // Toast de succès (à implémenter avec une bibliothèque de notifications)
    alert('Boost ajouté avec succès !')
  }

  // Gestion de l'annulation d'un boost
  const handleCancelBoost = (boostId: string) => {
    if (confirm('Êtes-vous sûr de vouloir annuler ce boost ?')) {
      setBoosts(
        boosts.map((boost) =>
          boost.id === boostId ? { ...boost, status: 'annulé' as BoostStatus } : boost
        )
      )
      alert('Boost annulé avec succès !')
    }
  }

  // Export en CSV
  const handleExportCSV = () => {
    const csvContent = [
      ['Date', 'Article', 'Prix', 'Statut', 'Expiration'],
      ...filteredBoosts.map((boost) => [
        new Date(boost.date).toLocaleDateString('fr-FR'),
        boost.article,
        boost.prix.toFixed(2),
        boost.status,
        boost.dateExpiration
          ? new Date(boost.dateExpiration).toLocaleDateString('fr-FR')
          : '-',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `boosts_${new Date().toISOString().split('T')[0]}.csv`
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
                Gestion des Boosts
              </h1>
              <p className="text-grayMedium text-lg">
                Suivez et gérez tous vos boosts Vinted
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-primary text-white rounded-lg transition-all duration-300 shadow-soft hover:shadow-soft-md active:scale-[0.98]"
            >
              <Plus className="w-5 h-5" />
              Nouveau boost
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatsCard
            label="Total dépensé ce mois"
            value={formatCurrency(stats.currentMonth.totalSpent)}
            icon={DollarSign}
            iconColor="primary"
            trend={{
              value: Math.abs(spentChange),
              label: 'vs mois précédent',
              isPositive: !isSpentPositive
            }}
          />
          <StatsCard
            label="Boosts actifs"
            value={stats.currentMonth.activeBoosts}
            icon={Zap}
            iconColor="warning"
            subtitle={`${stats.currentMonth.totalBoosts} ce mois`}
          />
          <StatsCard
            label="Total boosts"
            value={stats.currentMonth.totalBoosts}
            icon={TrendingUp}
            iconColor="secondary"
            subtitle="Ce mois"
          />
        </div>

        {/* Filtres */}
        <BoostFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          periodFilter={periodFilter}
          onPeriodFilterChange={setPeriodFilter}
          onExportCSV={handleExportCSV}
        />

        {/* Tableau */}
        <BoostTable boosts={filteredBoosts} onCancelBoost={handleCancelBoost} />

        {/* Modale d'ajout */}
        <BoostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddBoost}
        />
      </div>
    </div>
  )
}
