'use client'

import { Search, Download } from 'lucide-react'
import type { BoostStatus, BoostPeriodFilter } from '@/lib/types'

interface BoostFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: BoostStatus | 'tous'
  onStatusFilterChange: (status: BoostStatus | 'tous') => void
  periodFilter: BoostPeriodFilter
  onPeriodFilterChange: (period: BoostPeriodFilter) => void
  onExportCSV?: () => void
}

/**
 * Composant de filtres et recherche pour les boosts
 */
export default function BoostFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  periodFilter,
  onPeriodFilterChange,
  onExportCSV,
}: BoostFiltersProps) {
  const statusOptions: { value: BoostStatus | 'tous'; label: string }[] = [
    { value: 'tous', label: 'Tous' },
    { value: 'actif', label: 'Actifs' },
    { value: 'expiré', label: 'Expirés' },
    { value: 'annulé', label: 'Annulés' },
  ]

  const periodOptions: { value: BoostPeriodFilter; label: string }[] = [
    { value: 'currentMonth', label: 'Ce mois' },
    { value: 'lastMonth', label: 'Mois dernier' },
    { value: 'last3Months', label: '3 derniers mois' },
    { value: 'custom', label: 'Personnalisé' },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Barre de recherche */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rechercher
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un article boosté..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
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
            onChange={(e) => onStatusFilterChange(e.target.value as BoostStatus | 'tous')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-colors"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre par période */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Période
          </label>
          <select
            value={periodFilter}
            onChange={(e) => onPeriodFilterChange(e.target.value as BoostPeriodFilter)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-colors"
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bouton Export CSV */}
      {onExportCSV && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exporter en CSV
          </button>
        </div>
      )}
    </div>
  )
}
