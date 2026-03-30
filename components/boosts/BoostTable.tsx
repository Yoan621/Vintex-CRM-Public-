'use client'

import { useState, useMemo } from 'react'
import { Eye, X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import type { Boost, BoostStatus } from '@/lib/types'
import {
  formatDate,
  formatCurrency,
  getBoostStatusColor,
  getBoostStatusLabel,
  isBoostExpiringSoon,
} from '@/lib/utils'

interface BoostTableProps {
  boosts: Boost[]
  onCancelBoost?: (boostId: string) => void
}

type SortKey = 'date' | 'article' | 'prix' | 'status'
type SortDirection = 'asc' | 'desc'

/**
 * Composant de tableau des boosts avec tri et pagination
 */
export default function BoostTable({ boosts, onCancelBoost }: BoostTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Tri des données
  const sortedBoosts = useMemo(() => {
    const sorted = [...boosts].sort((a, b) => {
      let aValue: any
      let bValue: any

      if (sortKey === 'date') {
        aValue = new Date(a[sortKey]).getTime()
        bValue = new Date(b[sortKey]).getTime()
      } else {
        aValue = a[sortKey]
        bValue = b[sortKey]
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  }, [boosts, sortKey, sortDirection])

  // Pagination
  const totalPages = Math.ceil(sortedBoosts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBoosts = sortedBoosts.slice(startIndex, endIndex)

  // Calcul du total dépensé (pour les boosts affichés)
  const totalSpent = currentBoosts.reduce((sum, boost) => sum + boost.prix, 0)

  // Gestion du tri
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  // Icône de tri
  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return null
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    )
  }

  return (
    <div className="bg-[#0E0E0E] rounded-xl shadow-sm border border-[#1A1A1A] overflow-hidden">
      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#0E0E0E]">
            <tr>
              <th
                onClick={() => handleSort('date')}
                className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider cursor-pointer hover:bg-[#18181b] transition-colors"
              >
                <div className="flex items-center gap-2">
                  Date
                  <SortIcon columnKey="date" />
                </div>
              </th>
              <th
                onClick={() => handleSort('article')}
                className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider cursor-pointer hover:bg-[#18181b] transition-colors"
              >
                <div className="flex items-center gap-2">
                  Article
                  <SortIcon columnKey="article" />
                </div>
              </th>
              <th
                onClick={() => handleSort('prix')}
                className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider cursor-pointer hover:bg-[#18181b] transition-colors"
              >
                <div className="flex items-center gap-2">
                  Prix
                  <SortIcon columnKey="prix" />
                </div>
              </th>
              <th
                onClick={() => handleSort('status')}
                className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider cursor-pointer hover:bg-[#18181b] transition-colors"
              >
                <div className="flex items-center gap-2">
                  Statut
                  <SortIcon columnKey="status" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                Expiration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#0E0E0E] divide-y divide-[#1A1A1A]">
            {currentBoosts.map((boost) => {
              const expiringSoon = isBoostExpiringSoon(boost)

              return (
                <tr
                  key={boost.id}
                  className="hover:bg-[#18181b] transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {formatDate(boost.date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    <div className="flex items-center gap-2">
                      {boost.article}
                      {expiringSoon && (
                        <div title="Expire dans moins de 24h">
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {formatCurrency(boost.prix)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getBoostStatusColor(
                        boost.status
                      )}`}
                    >
                      {getBoostStatusLabel(boost.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                    {boost.dateExpiration ? formatDate(boost.dateExpiration) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 text-white/60 hover:text-[#003CF3] hover:bg-[#003CF3]/10 rounded transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {boost.status === 'actif' && onCancelBoost && (
                        <button
                          onClick={() => onCancelBoost(boost.id)}
                          className="p-2 text-white/60 hover:text-red-600 hover:bg-red-600/10 rounded transition-colors"
                          title="Annuler le boost"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot className="bg-[#0E0E0E] border-t border-[#1A1A1A]">
            <tr>
              <td
                colSpan={2}
                className="px-6 py-4 text-sm font-medium text-white"
              >
                Total (page actuelle)
              </td>
              <td className="px-6 py-4 text-sm font-bold text-white">
                {formatCurrency(totalSpent)}
              </td>
              <td colSpan={3}></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-[#1A1A1A]">
          <div className="flex items-center justify-between">
            <div className="text-sm text-white/60">
              Page {currentPage} sur {totalPages} • {sortedBoosts.length} boost(s) au total
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 text-white/60 hover:text-[#003CF3] disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-[#003CF3] text-white'
                        : 'text-white/60 hover:bg-[#18181b]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-white/60 hover:text-[#003CF3] disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
