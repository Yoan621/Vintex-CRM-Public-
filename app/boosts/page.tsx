'use client'

import { useState, useMemo } from 'react'
import { TrendingUp, Zap, DollarSign, Menu, User, ChevronDown, RefreshCw, Crown } from 'lucide-react'
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
import { useSidebar } from '@/contexts/SidebarContext'

type TimeFilter = 'Jour' | 'Semaine' | 'Mois' | 'Année'

export default function BoostsPage() {
  const [boosts, setBoosts] = useState<Boost[]>(mockBoosts)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<BoostStatus | 'tous'>('tous')
  const [periodFilter, setPeriodFilter] = useState<BoostPeriodFilter>('currentMonth')
  const [activeTimeFilter, setActiveTimeFilter] = useState<TimeFilter>('Mois')
  const { toggleSidebar } = useSidebar()

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

  const timeFilters: TimeFilter[] = ['Jour', 'Semaine', 'Mois', 'Année']

  return (
    <div className="min-h-screen">
      {/* ───── TOOLBAR ───── */}
      <div className="bg-black border-b border-[#1A1A1A] sticky top-0 z-40">
      <div className="flex flex-wrap justify-between items-center px-4 sm:px-8 h-auto sm:h-[60px] gap-3 sm:gap-0 py-3 sm:py-0">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            title="Masquer/Afficher la barre latérale"
            className="w-9 h-9 bg-[#18181b] border border-transparent rounded-[10px] flex items-center justify-center text-white hover:bg-[#003CF3] hover:shadow-[0_4px_16px_rgba(0,60,243,0.4)] hover:scale-105 transition-all duration-250"
          >
            <Menu className="w-[18px] h-[18px]" />
          </button>
          <nav className="flex items-center gap-3">
            <span className="text-[15px] font-medium tracking-tight text-white px-1 py-2">Gestion des Boosts</span>
          </nav>
        </div>

        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* Filtres temporels */}
          <div className="inline-flex items-center bg-[#18181b] border border-[#27272a] rounded-lg p-1 gap-1 h-10">
            {timeFilters.map((label) => (
              <button
                key={label}
                onClick={() => setActiveTimeFilter(label)}
                className={`px-3.5 py-2 rounded-[10px] text-[15px] font-medium tracking-tight transition-all duration-250 ease-out h-8 min-w-[70px] ${
                  activeTimeFilter === label
                    ? 'bg-[#003CF3] text-white shadow-[0_4px_16px_rgba(0,60,243,0.4)]'
                    : 'bg-transparent text-[#E9E9E9]/60 hover:bg-[#003CF3]/10 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Sélecteur de compte */}
          <div className="relative">
            <button className="flex items-center gap-2 h-10 px-4 bg-[#18181b] border border-[#27272a] rounded-[10px] text-white hover:bg-[#1f1f23] hover:border-[#003CF3]/40 transition-all duration-250">
              <User className="w-4 h-4 text-white/70" />
              <span className="text-[14px] font-medium tracking-tight">Tous les comptes</span>
              <ChevronDown className="w-4 h-4 text-white/70 transition-transform duration-200" />
            </button>
          </div>

          {/* Bouton refresh */}
          <button
            title="Actualiser"
            className="w-10 h-10 bg-[#18181b] border border-[#27272a] rounded-[10px] flex items-center justify-center text-white/70 hover:bg-[#003CF3] hover:shadow-[0_4px_16px_rgba(0,60,243,0.4)] hover:text-white hover:rotate-180 hover:scale-105 transition-all duration-400"
          >
            <RefreshCw className="w-[18px] h-[18px]" />
          </button>

          {/* CTA Pro */}
          <button className="flex items-center gap-2 bg-gradient-to-r from-[#003CF3] to-[#0052CC] text-white px-5 py-2.5 rounded-[10px] font-semibold text-[14px] tracking-tight h-10 shadow-[0_4px_16px_rgba(0,102,255,0.4)] hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(0,102,255,0.5)] hover:scale-105 transition-all duration-250">
            <Crown className="w-4 h-4" />
            <span>Passer à Pro</span>
          </button>
        </div>
      </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">

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
            iconColor="primary"
            subtitle={`${stats.currentMonth.totalBoosts} ce mois`}
          />
          <StatsCard
            label="Total boosts"
            value={stats.currentMonth.totalBoosts}
            icon={TrendingUp}
            iconColor="primary"
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
          onAddBoost={() => setIsModalOpen(true)}
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
