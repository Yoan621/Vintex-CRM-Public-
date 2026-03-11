'use client'

import { useState, useMemo, useEffect } from 'react'
import { filterAchatsByPeriod, calculateStats } from '@/lib/mock-data/achats'
import { getComptesUsernames } from '@/lib/mock-data/comptes-vinted'
import { Achat, AchatFormData, Plateforme, StatutAchat } from '@/types/achat'
import StatsCards from './components/StatsCards'
import SearchBar from './components/SearchBar'
import AchatsTable from './components/AchatsTable'
import AddAchatModal from './components/AddAchatModal'
import EditAchatModal from './components/EditAchatModal'
import DetailAchatModal from './components/DetailAchatModal'
import AddToStockModal from './components/AddToStockModal'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { TimePeriod } from '@/components/shared/TimeFilter'
import { AccountOption } from '@/components/dashboard/AccountSelector'

export default function AchatsPage() {
  const [achats, setAchats] = useState<Achat[]>([])
  const [loading, setLoading] = useState(true)

  // États des filtres temporels et compte
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month')
  const [selectedAccount, setSelectedAccount] = useState<AccountOption>('all')

  // États des filtres
  const [searchQuery, setSearchQuery] = useState('')
  const [statutFilter, setStatutFilter] = useState<StatutAchat | 'tous'>('tous')
  const [plateformeFilter, setPlateformeFilter] = useState<Plateforme | 'toutes'>('toutes')

  // États des modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isAddToStockModalOpen, setIsAddToStockModalOpen] = useState(false)
  const [selectedAchat, setSelectedAchat] = useState<Achat | null>(null)

  // Charger les achats depuis l'API
  useEffect(() => {
    fetch('/api/achats')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAchats(data)
        else console.error('[achats]', data)
      })
      .finally(() => setLoading(false))
  }, [])

  const uniqueAccounts = getComptesUsernames()

  const achatsByAccount = selectedAccount === 'all'
    ? achats
    : achats.filter(achat => achat.compteVinted === selectedAccount)

  const achatsByPeriod = useMemo(() => {
    return filterAchatsByPeriod(achatsByAccount, timePeriod)
  }, [achatsByAccount, timePeriod])

  const stats = useMemo(() => {
    return calculateStats(achatsByPeriod)
  }, [achatsByPeriod])

  const filteredAchats = achatsByPeriod.filter((achat) => {
    const matchSearch =
      searchQuery === '' ||
      achat.nomArticle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achat.marque.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achat.vendeur?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achat.numeroTransaction.toLowerCase().includes(searchQuery.toLowerCase())

    const matchStatut = statutFilter === 'tous' || achat.statut === statutFilter
    const matchPlateforme = plateformeFilter === 'toutes' || achat.plateforme === plateformeFilter

    return matchSearch && matchStatut && matchPlateforme
  })

  // Handler: Ajouter un achat
  const handleAddAchat = async (data: AchatFormData) => {
    const res = await fetch('/api/achats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    const newAchat = await res.json()
    setAchats([newAchat, ...achats])
  }

  // Handler: Modifier un achat
  const handleEditAchat = (achat: Achat) => {
    setSelectedAchat(achat)
    setIsEditModalOpen(true)
  }

  // Handler: Mettre à jour un achat
  const handleUpdateAchat = async (id: string, data: AchatFormData) => {
    const res = await fetch(`/api/achats/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    const updated = await res.json()
    setAchats(achats.map(a => a.id === id ? updated : a))
  }

  // Handler: Supprimer un achat
  const handleDeleteAchat = async (id: string) => {
    await fetch(`/api/achats/${id}`, { method: 'DELETE' })
    setAchats(achats.filter(a => a.id !== id))
  }

  // Handler: Voir détail
  const handleDetailClick = (achat: Achat) => {
    setSelectedAchat(achat)
    setIsDetailModalOpen(true)
  }

  // Handler: Passer des achats en stock
  const handleAddMultipleToStock = async (achatsIds: string[]) => {
    await Promise.all(
      achatsIds.map(id =>
        fetch(`/api/achats/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ statut: 'en_stock' })
        })
      )
    )
    setAchats(
      achats.map(a =>
        achatsIds.includes(a.id)
          ? { ...a, statut: 'en_stock' as StatutAchat }
          : a
      )
    )
  }

  const hasActiveFilters = searchQuery !== '' || statutFilter !== 'tous' || plateformeFilter !== 'toutes'

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Mes Achats"
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        selectedAccount={selectedAccount}
        onAccountChange={setSelectedAccount}
        accounts={uniqueAccounts}
      />

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-6">
          <StatsCards stats={stats} />
        </div>

        <div className="mb-6">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statutFilter={statutFilter}
            onStatutChange={setStatutFilter}
            plateformeFilter={plateformeFilter}
            onPlateformeChange={setPlateformeFilter}
            onAddClick={() => setIsAddModalOpen(true)}
            onAddToStockClick={() => setIsAddToStockModalOpen(true)}
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Chargement...</div>
        ) : (
          <AchatsTable
            achats={filteredAchats}
            onDetailClick={handleDetailClick}
            onEdit={handleEditAchat}
            onDelete={handleDeleteAchat}
            isFiltered={hasActiveFilters}
          />
        )}

        <AddAchatModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddAchat}
        />

        <EditAchatModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedAchat(null)
          }}
          achat={selectedAchat}
          onUpdate={handleUpdateAchat}
        />

        <DetailAchatModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false)
            setSelectedAchat(null)
          }}
          achat={selectedAchat}
          onEdit={handleEditAchat}
          onDelete={handleDeleteAchat}
        />

        <AddToStockModal
          isOpen={isAddToStockModalOpen}
          onClose={() => setIsAddToStockModalOpen(false)}
          achats={achats}
          onAddToStock={handleAddMultipleToStock}
        />
      </div>
    </div>
  )
}
