'use client'

import { useState, useMemo, useEffect } from 'react'
import { Download, Package, Archive, Search, X } from 'lucide-react'
import type { Order, OrderStatus } from '@/lib/types'
import { formatDate, formatCurrency, getStatusLabel, getCarrierLabel, getTimeUntilArchive } from '@/lib/utils'

interface OrdersTableProps {
  orders: Order[]
}

type TabFilter = 'all' | OrderStatus | 'archived'

/**
 * Fonction locale pour les couleurs de statut du Dashboard uniquement
 */
const getDashboardStatusColor = (status: Order['status']): string => {
  switch (status) {
    case 'non_traite':
      return 'bg-[#E9E9E9] text-black' // Gris
    case 'validée':
      return 'bg-[#00D98E] text-white' // Vert
    case 'en_cours':
      return 'bg-[#0066FF] text-white' // Bleu
    case 'litige':
      return 'bg-[#FF9500] text-white' // Orange
    case 'annulée':
      return 'bg-[#FF0000] text-white' // Rouge
    default:
      return 'bg-secondary/20 text-secondary'
  }
}

/**
 * Composant de tableau des commandes avec filtres par onglets
 */
export default function OrdersTable({ orders }: OrdersTableProps) {
  const [activeTab, setActiveTab] = useState<TabFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  // Debounce du terme de recherche (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fonction de recherche globale
  const searchInOrder = (order: Order, term: string): boolean => {
    if (!term || term.length < 2) return true

    const searchLower = term.toLowerCase()

    // Recherche dans tous les champs pertinents
    return (
      order.articleName?.toLowerCase().includes(searchLower) ||
      order.brandName?.toLowerCase().includes(searchLower) ||
      order.transactionNumber?.toLowerCase().includes(searchLower) ||
      order.customerName?.toLowerCase().includes(searchLower) ||
      order.vintedAccount?.toLowerCase().includes(searchLower) ||
      order.trackingNumber?.toLowerCase().includes(searchLower)
    )
  }

  // Filtrage ET tri des commandes
  // 1. Filtrage selon l'onglet actif ET recherche
  const isSearchActive = debouncedSearchTerm && debouncedSearchTerm.length >= 2

  const filteredOrders = orders
    // Filtre par recherche (s'applique à TOUTES les commandes, y compris archivées)
    .filter(order => searchInOrder(order, debouncedSearchTerm))
    .filter((order) => {
      // Si recherche active : afficher TOUS les résultats (ignorer les filtres d'onglets)
      if (isSearchActive) return true

      // Sinon, filtrer selon l'onglet actif
      // Onglet "Archives" : seulement les commandes archivées
      if (activeTab === 'archived') return order.archived === true

      // Onglet "Validées" : seulement les validées NON archivées
      if (activeTab === 'validée') return order.status === 'validée' && !order.archived

      // Onglet "Toutes" : toutes les commandes NON archivées
      if (activeTab === 'all') return !order.archived

      // Autres onglets : filtrer par statut (non archivées uniquement)
      return order.status === activeTab && !order.archived
    })
    // 2. Tri par date de vente (plus récent d'abord) ou date d'archivage pour les archives
    .sort((a, b) => {
      if (activeTab === 'archived' && a.archivedDate && b.archivedDate) {
        return new Date(b.archivedDate).getTime() - new Date(a.archivedDate).getTime()
      }
      const dateA = new Date(a.saleDate).getTime()
      const dateB = new Date(b.saleDate).getTime()
      return dateB - dateA // Descendant : plus récent en premier
    })

  // Configuration des onglets
  const tabs: { value: TabFilter; label: string; count: number; icon?: any }[] = [
    {
      value: 'all',
      label: 'Toutes',
      count: orders.filter((o) => !o.archived).length
    },
    {
      value: 'non_traite',
      label: 'Non traitées',
      count: orders.filter((o) => o.status === 'non_traite' && !o.archived).length,
    },
    {
      value: 'en_cours',
      label: 'En cours',
      count: orders.filter((o) => o.status === 'en_cours' && !o.archived).length,
    },
    {
      value: 'litige',
      label: 'Litiges',
      count: orders.filter((o) => o.status === 'litige' && !o.archived).length,
    },
    {
      value: 'validée',
      label: 'Validées',
      count: orders.filter((o) => o.status === 'validée' && !o.archived).length,
    },
    {
      value: 'annulée',
      label: 'Annulées',
      count: orders.filter((o) => o.status === 'annulée' && !o.archived).length,
    },
    {
      value: 'archived',
      label: 'Archives',
      count: orders.filter((o) => o.archived === true).length,
      icon: Archive,
    },
  ]

  return (
    <div className="bg-[#0E0E0E] rounded-xl border border-[#1A1A1A] overflow-hidden">
      {/* En-tête avec onglets */}
      <div className="border-b border-[#1A1A1A]">
        <div className="flex items-center justify-between px-7 py-5">
          <h2 className="text-[18px] font-semibold text-secondary tracking-tight">
            Suivi des commandes
          </h2>

          {/* Barre de recherche */}
          <div className="flex flex-col items-end gap-1">
            <div className="relative w-96">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
              <input
                type="text"
                placeholder="Rechercher : article, marque, ref commande, pseudo client…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-10 bg-[#18181b] border border-[#27272a] rounded-[10px] text-[14px] text-white placeholder:text-secondary/40 focus:outline-none focus:border-primary/40 transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary transition-colors"
                  title="Réinitialiser la recherche"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {debouncedSearchTerm && debouncedSearchTerm.length >= 2 && (
              <div className="flex items-center gap-2">
                <p className="text-[12px] text-secondary/60">
                  {filteredOrders.length} résultat{filteredOrders.length > 1 ? 's' : ''} trouvé{filteredOrders.length > 1 ? 's' : ''}
                </p>
                <span className="text-[11px] text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md">
                  Recherche globale
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Onglets */}
        <div className="flex gap-1 px-7 pb-1">
          {tabs.map((tab) => {
            const isArchived = tab.value === 'archived'
            const Icon = tab.icon
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2.5 text-[15px] font-medium rounded-t-lg transition-all duration-250 tracking-tight flex items-center gap-2 ${
                  activeTab === tab.value
                    ? isArchived
                      ? 'bg-gray-500/10 text-gray-400 border-b-2 border-gray-400'
                      : 'bg-primary/10 text-primary border-b-2 border-primary'
                    : isArchived
                    ? 'bg-transparent text-gray-500/60 hover:text-gray-400 hover:bg-gray-500/5'
                    : 'bg-transparent text-secondary/60 hover:text-secondary hover:bg-primary/5'
                }`}
              >
                {Icon && <Icon size={16} />}
                {tab.label} ({tab.count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black/40">
            <tr>
              <th className="px-3 py-4 text-left text-[13px] font-medium text-secondary/60 tracking-tight">
                Mise en ligne
              </th>
              <th className="px-3 py-4 text-left text-[13px] font-medium text-secondary/60 tracking-tight">
                Date vente
              </th>
              {activeTab === 'archived' && (
                <th className="px-3 py-4 text-left text-[13px] font-medium text-secondary/60 tracking-tight">
                  Date archivage
                </th>
              )}
              <th className="px-3 py-4 text-left text-[13px] font-medium text-secondary/60 tracking-tight">
                Article
              </th>
              <th className="px-3 py-4 text-left text-[13px] font-medium text-secondary/60 tracking-tight">
                Marque
              </th>
              <th className="px-3 py-4 text-left text-[13px] font-medium text-secondary/60 tracking-tight">
                Compte
              </th>
              <th className="px-3 py-4 text-left text-[13px] font-medium text-secondary/60 tracking-tight">
                Statut
              </th>
              {activeTab === 'validée' && (
                <th className="px-3 py-4 text-left text-[13px] font-medium text-secondary/60 tracking-tight">
                  Archivage
                </th>
              )}
              <th className="px-3 py-4 text-left text-[13px] font-medium text-secondary/60 tracking-tight">
                Prix achat
              </th>
              <th className="px-3 py-4 text-left text-[13px] font-medium text-secondary/60 tracking-tight">
                Prix vente
              </th>
              <th className="px-3 py-4 text-left text-[13px] font-medium text-secondary/60 tracking-tight">
                Suivi colis
              </th>
              <th className="px-3 py-4 text-left text-[13px] font-medium text-secondary/60 tracking-tight">
                Transporteur
              </th>
              <th className="px-3 py-4 text-left text-[13px] font-medium text-secondary/60 tracking-tight">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#0E0E0E] divide-y divide-[#1A1A1A]">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={activeTab === 'archived' ? 12 : activeTab === 'validée' ? 12 : 11} className="px-6 py-12 text-center">
                  {debouncedSearchTerm && debouncedSearchTerm.length >= 2 ? (
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
                        {activeTab === 'archived' ? 'Aucune commande archivée' : 'Aucune commande à afficher'}
                      </p>
                    </>
                  )}
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const timeUntilArchive = getTimeUntilArchive(order)
                const isArchived = order.archived

                return (
                  <tr
                    key={order.id}
                    className={`hover:bg-primary/5 transition-[background-color] duration-150 ease-in-out ${isArchived ? 'opacity-70' : ''}`}
                  >
                    <td className="px-3 py-4 whitespace-nowrap text-[13px] text-secondary/80">
                      {order.purchaseDate ? formatDate(order.purchaseDate) : '-'}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-[13px] text-secondary/80">
                      {formatDate(order.saleDate)}
                    </td>
                    {activeTab === 'archived' && (
                      <td className="px-3 py-4 whitespace-nowrap text-[13px] text-gray-400">
                        {order.archivedDate ? formatDate(order.archivedDate) : '-'}
                      </td>
                    )}
                    <td className="px-3 py-4 text-[13px] text-secondary">
                      <span className="font-medium">{order.articleName}</span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-[13px] text-secondary/80">
                      {order.brandName || '-'}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-[13px] text-secondary/80">
                      {order.vintedAccount || '-'}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1.5 inline-flex text-[12px] leading-5 font-medium rounded-md tracking-tight ${
                          isArchived
                            ? 'bg-gray-500/20 text-gray-400'
                            : getDashboardStatusColor(order.status)
                        }`}
                      >
                        {isArchived ? 'Archivée' : getStatusLabel(order.status)}
                      </span>
                    </td>
                    {activeTab === 'validée' && (
                      <td className="px-3 py-4 whitespace-nowrap text-[11px]">
                        {timeUntilArchive && (
                          <span className="px-2 py-1 bg-orange-500/10 text-orange-400 rounded-md font-medium">
                            {timeUntilArchive}
                          </span>
                        )}
                      </td>
                    )}
                    <td className="px-3 py-4 whitespace-nowrap text-[13px] text-secondary/80">
                      {formatCurrency(order.purchasePrice)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-[13px] font-semibold text-secondary">
                      {formatCurrency(order.salePrice)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-[13px] text-secondary/60 font-mono">
                      {order.trackingNumber || '-'}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-[13px] text-secondary/80">
                      {getCarrierLabel(order.carrier)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-[13px]">
                      <div className="flex items-center gap-2">
                        {order.shippingLabel && (
                          <button
                            className="p-2 text-secondary/60 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-150"
                            title="Télécharger le bordereau"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
