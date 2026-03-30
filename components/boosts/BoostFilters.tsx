'use client'

import { Search, Download, Plus } from 'lucide-react'
import type { BoostStatus, BoostPeriodFilter } from '@/lib/types'

interface BoostFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: BoostStatus | 'tous'
  onStatusFilterChange: (status: BoostStatus | 'tous') => void
  periodFilter: BoostPeriodFilter
  onPeriodFilterChange: (period: BoostPeriodFilter) => void
  onExportCSV?: () => void
  onAddBoost?: () => void
}

export default function BoostFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  periodFilter,
  onPeriodFilterChange,
  onExportCSV,
  onAddBoost,
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
    <div className="bg-[#0E0E0E] border border-[#27272a] rounded-xl shadow-soft p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recherche */}
        <div className="lg:col-span-2">
          <label className="block text-[13px] font-medium text-white/70 mb-2">
            Rechercher
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
              <Search className="w-4 h-4 text-white/60" />
            </div>
            <input
              type="text"
              placeholder="Rechercher : article, marque, n° commande, client, compte…"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-10 pl-10 pr-10 bg-[#18181b] border border-[#27272a] rounded-[10px] text-[14px] text-white placeholder:text-secondary/40 focus:outline-none focus:border-primary/40 transition-colors"
            />
          </div>
        </div>

        {/* Statut */}
        <div>
          <label className="block text-[13px] font-medium text-white/70 mb-2">
            Statut
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as BoostStatus | 'tous')}
            className="w-full h-10 px-4 bg-[#18181b] border border-[#27272a] rounded-[10px] text-[14px] text-white focus:outline-none focus:border-[#003CF3]/40 focus:ring-0 transition-colors appearance-none cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-[#18181b] text-white">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Période */}
        <div>
          <label className="block text-[13px] font-medium text-white/70 mb-2">
            Période
          </label>
          <select
            value={periodFilter}
            onChange={(e) => onPeriodFilterChange(e.target.value as BoostPeriodFilter)}
            className="w-full h-10 px-4 bg-[#18181b] border border-[#27272a] rounded-[10px] text-[14px] text-white focus:outline-none focus:border-[#003CF3]/40 focus:ring-0 transition-colors appearance-none cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-[#18181b] text-white">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      {(onAddBoost || onExportCSV) && (
        <div className="mt-5 flex justify-between items-center">
          {/* Bouton Ajouter un boost */}
          {onAddBoost && (
            <button
              onClick={onAddBoost}
              className="flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-[#003CF3] to-[#0052CC] text-white rounded-[10px] font-semibold text-[14px] tracking-tight shadow-[0_4px_16px_rgba(0,60,243,0.4)] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,60,243,0.5)] transition-all duration-250"
            >
              <Plus className="w-4 h-4" />
              Ajouter un boost
            </button>
          )}

          {/* Bouton Export CSV */}
          {onExportCSV && (
            <button
              onClick={onExportCSV}
              className="flex items-center gap-3 px-5 py-2.5 bg-[#1a1f23] border border-[#27272a] rounded-[10px] text-white text-[14px] font-medium tracking-tight hover:border-[#003CF3]/40 hover:bg-[#1f1f23] transition-all duration-250"
            >
              <div className="p-1.5 rounded-full bg-[#003CF3] shadow-[0_4px_16px_rgba(0,60,243,0.4)] flex items-center justify-center">
                <Download className="w-3.5 h-3.5 text-white" />
              </div>
              Exporter en CSV
            </button>
          )}
        </div>
      )}
    </div>
  )
}
