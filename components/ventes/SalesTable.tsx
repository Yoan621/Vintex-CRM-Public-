'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Package,
  Plus,
  MoreVertical,
  ExternalLink,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  XCircle,
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

export default function SalesTable({ orders, onAddClick }: SalesTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('saleDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const searchInOrder = (order: Order, term: string): boolean => {
    if (!term || term.length < 2) return true
    const s = term.toLowerCase()
    return (
      (order.articleName?.toLowerCase().includes(s) ?? false) ||
      (order.brandName?.toLowerCase().includes(s) ?? false) ||
      (order.transactionNumber?.toLowerCase().includes(s) ?? false) ||
      (order.customerName?.toLowerCase().includes(s) ?? false) ||
      (order.vintedAccount?.toLowerCase().includes(s) ?? false) ||
      (order.trackingNumber?.toLowerCase().includes(s) ?? false)
    )
  }

  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders]
    result = result.filter(order => searchInOrder(order, debouncedSearchTerm))
    result.sort((a, b) => {
      let aValue: unknown
      let bValue: unknown
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

  const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentOrders = filteredAndSortedOrders.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return null
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  const isSearchActive = debouncedSearchTerm && debouncedSearchTerm.length >= 2

  /**
   * Fonction locale pour les couleurs de statut (identique à OrdersTable)
   */
  const getDashboardStatusColor = (status: Order['status']): string => {
    switch (status) {
      case 'non_traite':
        return 'bg-status-unprocessed/10 text-status-unprocessed border border-status-unprocessed/20'
      case 'validée':
        return 'bg-status-validated/10 text-status-validated border border-status-validated/20'
      case 'en_cours':
        return 'bg-status-pending/10 text-status-pending border border-status-pending/20'
      case 'litige':
        return 'bg-status-dispute/10 text-status-dispute border border-status-dispute/20'
      case 'annulée':
        return 'bg-status-canceled/10 text-status-canceled border border-status-canceled/20'
      default:
        return 'bg-secondary/10 text-secondary border border-secondary/20'
    }
  }

  /**
   * Fonction pour obtenir l'icône correspondant au statut
   */
  const getStatusIconComponent = (status: Order['status']) => {
    const iconProps = { className: "w-3 h-3" }
    switch (status) {
      case 'non_traite':
        return <Clock {...iconProps} />
      case 'validée':
        return <CheckCircle {...iconProps} />
      case 'en_cours':
        return <Truck {...iconProps} />
      case 'litige':
        return <AlertCircle {...iconProps} />
      case 'annulée':
        return <XCircle {...iconProps} />
      default:
        return <Clock {...iconProps} />
    }
  }

  // Status badge helper — identique à OrdersTable avec icônes
  const StatusBadge = ({ status }: { status: Order['status'] }) => {
    const label = getStatusLabel(status)
    const colorClass = getDashboardStatusColor(status)
    const icon = getStatusIconComponent(status)
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {icon}
        {label}
      </span>
    )
  }

  return (
    <div className="bg-[#0E0E0E] rounded-xl border border-[#1A1A1A] overflow-hidden">
      {/* Header avec recherche */}
      <div className="border-b border-[#1A1A1A]">
        <div className="flex items-center justify-between px-7 py-5">
          <h2 className="text-[18px] font-semibold text-secondary tracking-tight">
            Toutes les ventes
          </h2>
          <div className="flex items-center gap-3">
            {onAddClick && (
              <Button variant="primary" onClick={onAddClick} className="flex items-center gap-2">
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
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
                  className="w-full h-10 pl-10 pr-10 bg-[#18181b] border border-[#27272a] rounded-[10px] text-[14px] text-white placeholder:text-secondary/40 focus:outline-none focus:border-primary/40 transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => { setSearchTerm(''); setCurrentPage(1) }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary transition-colors"
                    title="Réinitialiser"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {isSearchActive && (
                <p className="text-[12px] text-secondary/60">
                  {filteredAndSortedOrders.length} résultat{filteredAndSortedOrders.length > 1 ? 's' : ''} trouvé{filteredAndSortedOrders.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Version Desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#0E0E0E] border-b border-[#1A1A1A]">
            <tr>
              {([
                { key: 'transactionNumber' as SortKey, label: 'N° Transaction', sortable: true },
                { key: 'articleName' as SortKey, label: 'Article', sortable: true },
                { key: null, label: 'Marque', sortable: false },
                { key: null, label: 'Compte', sortable: false },
                { key: 'status' as SortKey, label: 'Statut', sortable: true },
                { key: null, label: 'Prix achat', sortable: false },
                { key: 'salePrice' as SortKey, label: 'Prix vente', sortable: true },
                { key: 'profit' as SortKey, label: 'Bénéfice', sortable: true },
                { key: null, label: 'N° suivi', sortable: false },
                { key: null, label: 'Client', sortable: false },
                { key: null, label: 'Bordereaux', sortable: false },
                { key: null, label: 'Actions', sortable: false },
              ]).map((col, i) => (
                <th
                  key={i}
                  onClick={() => col.sortable && col.key && handleSort(col.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-secondary/60 uppercase tracking-wider ${col.sortable ? 'cursor-pointer hover:bg-primary/5' : ''} transition-colors`}
                >
                  {col.sortable && col.key ? (
                    <div className="flex items-center gap-2">
                      {col.label}
                      <SortIcon columnKey={col.key} />
                    </div>
                  ) : col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-[#0E0E0E] divide-y divide-[#1A1A1A]">
            {filteredAndSortedOrders.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-6 py-12 text-center">
                  {isSearchActive ? (
                    <>
                      <Search className="w-12 h-12 mx-auto text-secondary/40 mb-4" />
                      <p className="text-secondary/60">Aucun résultat pour &quot;{debouncedSearchTerm}&quot;</p>
                    </>
                  ) : (
                    <>
                      <Package className="w-12 h-12 mx-auto text-secondary/40 mb-4" />
                      <p className="text-secondary/60">Aucune vente à afficher</p>
                    </>
                  )}
                </td>
              </tr>
            ) : (
              currentOrders.map((order) => {
                const profit = calculateProfit(order)
                const isProfit = profit > 0
                return (
                  <tr key={order.id} className="hover:bg-[#1A1A1A]/50 transition-colors border-b border-[#1A1A1A]">
                    <td className="px-6 py-4">
                      <button className="text-primary hover:text-primary/80 font-medium hover:underline">
                        {order.transactionNumber}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-secondary">{order.articleName}</span>
                        <span className="text-sm text-secondary/60">{order.brandName || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-secondary/80 text-sm">{order.brandName || '-'}</td>
                    <td className="px-6 py-4 text-secondary/80 text-sm">{order.vintedAccount || '-'}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={order.purchasePrice}
                        className="w-20 px-2 py-1 bg-[#18181b] border border-[#27272a] rounded text-secondary text-sm focus:outline-none focus:border-primary/40"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-secondary">{formatCurrency(order.salePrice)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${isProfit ? 'text-success' : 'text-error'}`}>
                        {formatCurrency(profit)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {order.trackingNumber ? (
                        <span className="inline-flex items-center gap-1 text-info hover:text-info/80 hover:underline text-sm cursor-pointer">
                          {order.trackingNumber}
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="text-secondary/40 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-secondary/80 text-sm">{order.customerName || '-'}</td>
                    <td className="px-6 py-4">
                      <button
                        className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary hover:text-primary/80"
                        aria-label="Générer bordereau"
                        title="Générer bordereau"
                      >
                        <FileText className="w-5 h-5" />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-secondary/60 hover:text-primary"
                        aria-label="Accéder à la conversation"
                        title="Accéder à la conversation"
                      >
                        <MessageSquare className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Version Mobile — Cards */}
      <div className="lg:hidden p-4 space-y-3">
        {filteredAndSortedOrders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Package className="w-12 h-12 mx-auto text-secondary/40 mb-4" />
            <p className="text-secondary/60">
              {isSearchActive ? 'Aucun résultat à afficher' : 'Aucune vente à afficher'}
            </p>
          </div>
        ) : (
          currentOrders.map((order) => {
            const profit = calculateProfit(order)
            const isProfit = profit > 0
            return (
              <div key={order.id} className="bg-[#0E0E0E] rounded-lg border border-[#1A1A1A] p-4 mb-3 hover:border-primary/40 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <button className="text-primary hover:text-primary/80 font-medium hover:underline">
                    {order.transactionNumber}
                  </button>
                  <div className="relative">
                    <button className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors" aria-label="Actions">
                      <MoreVertical className="w-5 h-5 text-secondary/60" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="font-medium text-secondary">{order.articleName}</p>
                    <p className="text-sm text-secondary/60">{order.brandName || '-'} • {order.vintedAccount || '-'}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-[#1A1A1A]">
                    <div>
                      <span className="text-secondary/60">Achat:</span>
                      <span className="ml-1 text-secondary">{formatCurrency(order.purchasePrice)}</span>
                    </div>
                    <div>
                      <span className="text-secondary/60">Vente:</span>
                      <span className="ml-1 text-secondary">{formatCurrency(order.salePrice)}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-secondary/60">Bénéfice:</span>
                      <span className={`ml-1 font-bold ${isProfit ? 'text-[#00D98E]' : 'text-red-500'}`}>
                        {formatCurrency(profit)}
                      </span>
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <span className="inline-flex items-center gap-1 text-info hover:text-info/80 hover:underline text-sm cursor-pointer">
                      Suivi: {order.trackingNumber}
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Pagination */}
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
