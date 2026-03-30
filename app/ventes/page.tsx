'use client'

import { useState, useMemo, useEffect } from 'react'
import OrdersTable from '@/components/dashboard/OrdersTable'
import StatsCard from '@/components/shared/StatsCard'
import { getOrders, addOrder, getUniqueAccounts } from '@/lib/store/ordersStore'
import { calculateProfit } from '@/lib/utils'
import { DollarSign, TrendingUp, Package, Clock, Plus } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { TimePeriod } from '@/components/shared/TimeFilter'
import { AccountOption } from '@/components/dashboard/AccountSelector'
import AddSaleModal, { SaleFormData } from '@/components/ventes/AddSaleModal'
import Button from '@/components/ui/Button'
import type { Order } from '@/lib/types'

export default function VentesPage() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month')
  const [selectedAccount, setSelectedAccount] = useState<AccountOption>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [dbOrders, setDbOrders] = useState<Order[] | null>(null)

  // Charger les ventes depuis la DB au montage
  useEffect(() => {
    fetch('/api/ventes')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.ventes.length > 0) {
          const mapped: Order[] = data.ventes.map((v: any) => ({
            id: v.id,
            transactionNumber: v.transactionNumber,
            articleName: v.articleName,
            brandName: v.brandName || 'Inconnu',
            vintedAccount: v.vintedAccount,
            status: v.status as Order['status'],
            purchaseDate: v.purchaseDate ? new Date(v.purchaseDate) : undefined,
            saleDate: new Date(v.saleDate),
            purchasePrice: v.purchasePrice,
            salePrice: v.salePrice,
            trackingNumber: v.trackingNumber || undefined,
            carrier: v.carrier || undefined,
            customerName: v.customerName,
            invoice: v.invoice || undefined,
            shippingLabel: v.shippingLabel || undefined,
            articleImage: v.articleImage || undefined,
            cancellationReason: v.cancellationReason || undefined,
            cancellationDate: v.cancellationDate ? new Date(v.cancellationDate) : undefined,
            validationDate: v.validationDate ? new Date(v.validationDate) : undefined,
            shippingDate: v.shippingDate ? new Date(v.shippingDate) : undefined,
            disputeReason: v.disputeReason || undefined,
            disputeDate: v.disputeDate ? new Date(v.disputeDate) : undefined,
            disputeResolved: v.disputeResolved === 1 || v.disputeResolved === true,
            archived: v.archived === 1 || v.archived === true,
            archivedDate: v.archivedDate ? new Date(v.archivedDate) : undefined,
          }))
          setDbOrders(mapped)
        }
      })
      .catch(() => {/* garde mock data */})
  }, [refreshKey])

  // Utiliser les données DB si disponibles, sinon fallback mock
  const orders: Order[] = dbOrders !== null ? dbOrders : (getOrders() as unknown as Order[])

  // Comptes uniques depuis les données actuelles
  const uniqueAccounts = dbOrders !== null
    ? Array.from(new Set(dbOrders.map(o => o.vintedAccount).filter(Boolean)))
    : getUniqueAccounts()

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
      vintedAccount: data.platform === 'vinted' ? data.vintedAccount : `${data.platform} - ${data.vintedAccount}`,
      status: data.status,
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
        <OrdersTable orders={ordersByPeriod} onAddClick={() => setIsAddModalOpen(true)} />

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
