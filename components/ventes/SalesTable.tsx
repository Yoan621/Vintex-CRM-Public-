'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Download,
  Search,
  ChevronUp,
  ChevronDown,
  Edit,
  Trash2,
  Eye,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Package,
  Plus,
} from 'lucide-react'
import type { Order } from '@/lib/types'
import {
  formatCurrency,
  calculateProfit,
  getStatusColor,
  getStatusLabel,
} from '@/lib/utils'
import Button from '@/components/ui/Button'

interface SalesTableProps {
  orders: Order[]
  onAddClick?: () => void
}

type SortKey = 'transactionNumber' | 'articleName' | 'status' | 'saleDate' | 'salePrice' | 'profit'
type SortDirection = 'asc' | 'desc'

/**
 * Composant de tableau des ventes avec recherche améliorée, tri et pagination
 * Design harmonisé avec le Dashboard
 */
export default function SalesTable({ orders, onAddClick }: SalesTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('saleDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Debounce du terme de recherche (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fonction de recherche globale (inspirée du Dashboard)
  const searchInOrder = (order: Order, term: string): boolean => {
    if (!term || term.length < 2) return true

    const searchLower = term.toLowerCase()

    // Recherche dans tous les champs pertinents
    return (
      (order.articleName?.toLowerCase().includes(searchLower) ?? false) ||
      (order.brandName?.toLowerCase().includes(searchLower) ?? false) ||
      (order.transactionNumber?.toLowerCase().includes(searchLower) ?? false) ||
      (order.customerName?.toLowerCase().includes(searchLower) ?? false) ||
      (order.vintedAccount?.toLowerCase().includes(searchLower) ?? false) ||
      (order.trackingNumber?.toLowerCase().includes(searchLower) ?? false)
    )
  }

  // Filtrage et tri des données
  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders]

    // Recherche avec debounce
    result = result.filter(order => searchInOrder(order, debouncedSearchTerm))

    // Tri
    result.sort((a, b) => {
      let aValue: any
      let bValue: any

      if (sortKey === 'profit') {
        aValue = calculateProfit(a)
        bValue = calculateProfit(b)
      } else if (sortKey === 'saleDate') {
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

    return result
  }, [orders, debouncedSearchTerm, sortKey, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentOrders = filteredAndSortedOrders.slice(startIndex, endIndex)

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

  const isSearchActive = debouncedSearchTerm && debouncedSearchTerm.length >= 2

  return (
    <div className="bg-[#0E0E0E] rounded-xl border border-[#1A1A1A] overflow-hidden">
      {/* En-tête avec recherche */}
      <div className="border-b border-[#1A1A1A]">
        <div className="flex items-center justify-between px-7 py-5">
          <h2 className="text-[18px] font-semibold text-secondary tracking-tight">
            Toutes les ventes
          </h2>

          {/* Barre de recherche améliorée + Bouton */}
          <div className="flex items-center gap-3">
            {onAddClick && (
              <Button
                variant="primary"
                onClick={onAddClick}
                className="flex items-center gap-2"
              >
                <Plus size={18} />
                Ajouter une vente
              </Button>
            )}
            <div className="flex flex-col items-end gap-1">
              <div className="relative w-96">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
                <input
                  type="text"
                  placeholder="Rechercher : article, marque, n° commande, client, compte…"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full h-10 pl-10 pr-10 bg-[#18181b] border border-[#27272a] rounded-[10px] text-[14px] text-white placeholder:text-secondary/40 focus:outline-none focus:border-primary/40 transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setCurrentPage(1)
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary transition-colors"
                    title="Réinitialiser la recherche"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {isSearchActive && (
                <div className="flex items-center gap-2">
                  <p className="text-[12px] text-secondary/60">
                    {filteredAndSortedOrders.length} résultat{filteredAndSortedOrders.length > 1 ? 's' : ''} trouvé{filteredAndSortedOrders.length > 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black/40">
            <tr>
              <th
                onClick={() => handleSort('transactionNumber')}
                className="px-6 py-4 text-left text-[13px] font-medium text-secondary/60 tracking-tight cursor-pointer hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  N° Transaction
                  <SortIcon columnKey="transactionNumber" />
                </div>
              </th>
              <th
                onClick={() => handleSort('articleName')}
                className="px-6 py-4 text-left text-[13px] font-medium text-secondary/60 tracking-tight cursor-pointer hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Article
                  <SortIcon columnKey="articleName" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-[13px] font-medium text-secondary/60 tracking-tight">
                Marque
              </th>
              <th className="px-6 py-4 text-left text-[13px] font-medium text-secondary/60 tracking-tight">
                Compte
              </th>
              <th
                onClick={() => handleSort('status')}
                className="px-6 py-4 text-left text-[13px] font-medium text-secondary/60 tracking-tight cursor-pointer hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Statut
                  <SortIcon columnKey="status" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-[13px] font-medium text-secondary/60 tracking-tight">
                Prix achat
              </th>
              <th
                onClick={() => handleSort('salePrice')}
                className="px-6 py-4 text-left text-[13px] font-medium text-secondary/60 tracking-tight cursor-pointer hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Prix vente
                  <SortIcon columnKey="salePrice" />
                </div>
              </th>
              <th
                onClick={() => handleSort('profit')}
                className="px-6 py-4 text-left text-[13px] font-medium text-secondary/60 tracking-tight cursor-pointer hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Bénéfice
                  <SortIcon columnKey="profit" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-[13px] font-medium text-secondary/60 tracking-tight">
                N° suivi
              </th>
              <th className="px-6 py-4 text-left text-[13px] font-medium text-secondary/60 tracking-tight">
                Client
              </th>
              <th className="px-6 py-4 text-left text-[13px] font-medium text-secondary/60 tracking-tight">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#0E0E0E] divide-y divide-[#1A1A1A]">
            {filteredAndSortedOrders.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-6 py-12 text-center">
                  {isSearchActive ? (
                    <>
                      <Search className="w-12 h-12 mx-auto text-secondary/40 mb-4" />
                      <p className="text-secondary/60 mb-2">
                        Aucun résultat pour "{debouncedSearchTerm}"
                      </p>
                      <p className="text-secondary/40 text-[13px]">
                        Essayez avec d'autres mots-clés
                      </p>
                    </>
                  ) : (
                    <>
                      <Package className="w-12 h-12 mx-auto text-secondary/40 mb-4" />
                      <p className="text-secondary/60">
                        Aucune vente à afficher
                      </p>
                    </>
                  )}
                </td>
              </tr>
            ) : (
              currentOrders.map((order) => {
                const profit = calculateProfit(order)
                const isProfit = profit > 0

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-primary/5 transition-[background-color] duration-150 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-[13px] font-medium text-primary">
                      {order.transactionNumber}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-secondary">
                      <span className="font-medium">{order.articleName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[13px] text-secondary/80">
                      {order.brandName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[13px] text-secondary/80">
                      {order.vintedAccount || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1.5 inline-flex text-[12px] leading-5 font-medium rounded-md tracking-tight ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[13px] text-secondary/80">
                      {formatCurrency(order.purchasePrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[13px] font-semibold text-secondary">
                      {formatCurrency(order.salePrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[13px]">
                      <span
                        className={`font-semibold ${
                          isProfit
                            ? 'text-[#00D98E]'
                            : 'text-red-500'
                        }`}
                      >
                        {formatCurrency(profit)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[13px] text-secondary/60 font-mono">
                      {order.trackingNumber || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[13px] text-secondary/80">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[13px]">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 text-secondary/60 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-150"
                          title="Voir les détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {order.invoice && (
                          <button
                            className="p-2 text-secondary/60 hover:text-[#00D98E] hover:bg-[#00D98E]/10 rounded-lg transition-all duration-150"
                            title="Télécharger la facture"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        {order.articleImage && (
                          <button
                            className="p-2 text-secondary/60 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-150"
                            title="Voir l'article"
                          >
                            <ImageIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          className="p-2 text-secondary/60 hover:text-[#FF9500] hover:bg-[#FF9500]/10 rounded-lg transition-all duration-150"
                          title="Éditer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-secondary/60 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-150"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination harmonisée */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-[#1A1A1A]">
          <div className="flex items-center justify-between">
            <div className="text-[13px] text-secondary/60">
              Page {currentPage} sur {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 text-secondary/60 hover:text-primary hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-all duration-150"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                      currentPage === page
                        ? 'bg-primary text-white shadow-[0_4px_16px_rgba(0,60,243,0.3)]'
                        : 'text-secondary/60 hover:bg-primary/10 hover:text-secondary'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-secondary/60 hover:text-primary hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-all duration-150"
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
