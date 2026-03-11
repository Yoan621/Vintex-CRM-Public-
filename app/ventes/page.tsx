'use client'

import { useState, useMemo, useEffect } from 'react'
import SalesTable from '@/components/ventes/SalesTable'
import StatsCard from '@/components/shared/StatsCard'
import { addOrder } from '@/lib/store/ordersStore'
import { calculateProfit } from '@/lib/utils'
import { DollarSign, TrendingUp, Package, Clock } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { TimePeriod } from '@/components/shared/TimeFilter'
import { AccountOption } from '@/components/dashboard/AccountSelector'
import AddSaleModal, { SaleFormData } from '@/components/ventes/AddSaleModal'
import type { Order } from '@/lib/types'

/**
 * Page Mes Ventes - Liste complète de toutes les ventes
 * Affiche un tableau détaillé avec recherche, tri et pagination
 * 
 * ⚠️ Les données proviennent maintenant du store (ordersStore.ts) au lieu de mockData
 */
export default function VentesPage() {
  // États des filtres temporels et compte
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month')
  const [selectedAccount, setSelectedAccount] = useState<AccountOption>('all')

  // État pour la modale d'ajout
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // Récupérer les commandes depuis l'API (pas directement du store côté client)
  const [orders, setOrders] = useState<Order[]>([])
  useEffect(() => {
    fetch('/api/extension/orders')
      .then(res => res.json())
      .then(data => setOrders(data.orders || []))
      .catch(() => setOrders([]))
  }, [refreshKey])

  // Récupérer la liste des comptes Vinted depuis les commandes
  const uniqueAccounts = Array.from(new Set(orders.map((o: Order) => o.vintedAccount)))

  // Filtrer les commandes selon le compte sélectionné
  const filteredOrdersByAccount = selectedAccount === 'all'
    ? orders
    : orders.filter(order => order.vintedAccount === selectedAccount)

  // Filtrage par période temporelle
  const ordersByPeriod = useMemo(() => {
    const now = new Date()
    const startOfPeriod = new Date()

    switch (timePeriod) {
      case 'day':
        startOfPeriod.setHours(0, 0, 0, 0)
        break
      case 'week':
        startOfPeriod.setDate(now.getDate() - 7)
        break
      case 'month':
        startOfPeriod.setDate(now.getDate() - 30)
        break
      case 'year':
        startOfPeriod.setDate(now.getDate() - 365)
        break
    }

    return filteredOrdersByAccount.filter(order => {
      const orderDate = new Date(order.saleDate)
      return orderDate >= startOfPeriod
    })
  }, [filteredOrdersByAccount, timePeriod])

  // Calcul des statistiques à partir des ventes filtrées par période
  const totalRevenue = ordersByPeriod.reduce((sum, order) => sum + order.salePrice, 0)
  const totalProfit = ordersByPeriod.reduce((sum, order) => sum + calculateProfit(order), 0)
  const totalOrders = ordersByPeriod.length
  const pendingOrders = ordersByPeriod.filter(o => o.status === 'non_traite').length

  // Handler: Ajouter une vente
  const handleAddSale = (data: SaleFormData) => {
    const newOrder = addOrder({
      transactionNumber: data.transactionNumber,
      articleName: data.articleName,
      brandName: data.brandName,
      vintedAccount: data.vintedAccount,
      status: data.status as Order['status'],
      purchaseDate: new Date(data.saleDate),
      saleDate: new Date(data.saleDate),
      purchasePrice: data.purchasePrice,
      salePrice: data.salePrice,
      trackingNumber: data.trackingNumber,
      carrier: data.carrier,
      customerName: data.customerName,
      articleImage: data.articleImage ? URL.createObjectURL(data.articleImage) : undefined,
    })

    // Forcer le re-render en mettant à jour la clé
    setRefreshKey(prev => prev + 1)
    console.log('✅ Vente ajoutée au store:', newOrder)
  }

  return (
    <div className="min-h-screen">
      {/* Header noir avec fil d'Ariane et actions */}
      <DashboardHeader
        title="Mes Ventes"
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        selectedAccount={selectedAccount}
        onAccountChange={setSelectedAccount}
        accounts={uniqueAccounts}
      />

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* KPI Cards - Design harmonisé */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <StatsCard
            label="Chiffre d'affaires"
            value={`${totalRevenue.toLocaleString('fr-FR')} €`}
            icon={DollarSign}
            iconColor="primary"
            trend={{
              value: 18.3,
              label: 'vs période précédente',
              isPositive: true
            }}
          />
          <StatsCard
            label="Articles vendus"
            value={totalOrders}
            icon={Package}
            iconColor="primary"
            subtitle="+5 cette semaine"
          />
          <StatsCard
            label="Marge totale"
            value={`${totalProfit.toLocaleString('fr-FR')} €`}
            icon={TrendingUp}
            iconColor="primary"
            subtitle="ROI: +96%"
          />
          <StatsCard
            label="En attente"
            value={pendingOrders}
            icon={Clock}
            iconColor="primary"
            subtitle="À expédier"
          />
        </div>

        {/* Tableau des ventes */}
        <SalesTable orders={ordersByPeriod} onAddClick={() => setIsAddModalOpen(true)} />

        {/* Modale ajout */}
        <AddSaleModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddSale}
        />
      </div>
    </div>
  )
}
