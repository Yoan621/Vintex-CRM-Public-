'use client'

import { useState, useMemo } from 'react'
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
} from 'lucide-react'
import type { Order } from '@/lib/types'
import {
  formatDate,
  formatCurrency,
  calculateProfit,
  getStatusColor,
  getStatusLabel,
} from '@/lib/utils'

interface SalesTableProps {
  orders: Order[]
}

type SortKey = 'transactionNumber' | 'articleName' | 'status' | 'saleDate' | 'salePrice' | 'profit'
type SortDirection = 'asc' | 'desc'

/**
 * Composant de tableau des ventes avec recherche, tri et pagination
 */
export default function SalesTable({ orders }: SalesTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('saleDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filtrage et tri des données
  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders]

    // Recherche
    if (searchTerm) {
      result = result.filter(
        (order) =>
          order.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.articleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

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
  }, [orders, searchTerm, sortKey, sortDirection])

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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* En-tête avec recherche */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            Toutes les ventes
          </h2>

          {/* Barre de recherche */}
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une vente..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-colors"
            />
          </div>
        </div>

        {/* Informations de résultats */}
        <div className="mt-4 text-sm text-gray-600">
          {filteredAndSortedOrders.length} résultat(s) trouvé(s)
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort('transactionNumber')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  N° Transaction
                  <SortIcon columnKey="transactionNumber" />
                </div>
              </th>
              <th
                onClick={() => handleSort('articleName')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Article
                  <SortIcon columnKey="articleName" />
                </div>
              </th>
              <th
                onClick={() => handleSort('status')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Statut
                  <SortIcon columnKey="status" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix achat
              </th>
              <th
                onClick={() => handleSort('salePrice')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Prix vente
                  <SortIcon columnKey="salePrice" />
                </div>
              </th>
              <th
                onClick={() => handleSort('profit')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Bénéfice
                  <SortIcon columnKey="profit" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                N° suivi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.map((order) => {
              const profit = calculateProfit(order)
              const isProfit = profit > 0

              return (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-violet-600">
                    {order.transactionNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.articleName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(order.purchasePrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(order.salePrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`font-medium ${
                        isProfit
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {formatCurrency(profit)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {order.trackingNumber || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {order.invoice && (
                        <button
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Télécharger la facture"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      {order.articleImage && (
                        <button
                          className="p-2 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded transition-colors"
                          title="Voir l'article"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                        title="Éditer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} sur {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-600 hover:text-violet-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
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
                        ? 'bg-violet-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-600 hover:text-violet-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
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
