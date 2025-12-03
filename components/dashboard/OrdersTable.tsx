'use client'

import { useState } from 'react'
import { Download, Package } from 'lucide-react'
import type { Order, OrderStatus } from '@/lib/types'
import { formatDate, formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils'

interface OrdersTableProps {
  orders: Order[]
}

type TabFilter = 'all' | OrderStatus

/**
 * Composant de tableau des commandes avec filtres par onglets
 */
export default function OrdersTable({ orders }: OrdersTableProps) {
  const [activeTab, setActiveTab] = useState<TabFilter>('all')

  // Filtrage des commandes selon l'onglet actif
  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'all') return true
    return order.status === activeTab
  })

  // Configuration des onglets
  const tabs: { value: TabFilter; label: string; count: number }[] = [
    { value: 'all', label: 'Toutes', count: orders.length },
    {
      value: 'en_cours',
      label: 'En cours',
      count: orders.filter((o) => o.status === 'en_cours').length,
    },
    {
      value: 'validée',
      label: 'Validées',
      count: orders.filter((o) => o.status === 'validée').length,
    },
    {
      value: 'annulée',
      label: 'Annulées',
      count: orders.filter((o) => o.status === 'annulée').length,
    },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* En-tête avec onglets */}
      <div className="border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">
            Suivi des commandes
          </h2>
        </div>

        {/* Onglets */}
        <div className="flex gap-1 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.value
                  ? 'border-violet-600 text-violet-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Article
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix achat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix vente
              </th>
              {activeTab === 'en_cours' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° suivi
                </th>
              )}
              {activeTab === 'annulée' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Raison
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">
                    Aucune commande à afficher
                  </p>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(order.saleDate)}
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
                  {activeTab === 'en_cours' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.trackingNumber || '-'}
                    </td>
                  )}
                  {activeTab === 'annulée' && (
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.cancellationReason || '-'}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      {order.shippingLabel && (
                        <button
                          className="p-2 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded transition-colors"
                          title="Télécharger le bordereau"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
