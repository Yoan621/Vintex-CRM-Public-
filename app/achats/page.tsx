'use client'

import { useState, useMemo } from 'react'
import { mockAchats, filterAchatsByPeriod, calculateStats } from '@/lib/mock-data/achats'
import { getComptesUsernames } from '@/lib/mock-data/comptes-vinted'
import { addMultipleArticlesFromAchats } from '@/lib/mock-data/stock'
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

/**
 * Page principale "Mes Achats"
 * Gestion complète des achats avec filtres, recherche et modales
 */
export default function AchatsPage() {
  // État des achats
  const [achats, setAchats] = useState<Achat[]>(mockAchats)

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

  // Récupérer la liste des comptes Vinted depuis le système de gestion des comptes
  const uniqueAccounts = getComptesUsernames()

  // Filtrer les achats selon le compte sélectionné
  const achatsByAccount = selectedAccount === 'all'
    ? achats
    : achats.filter(achat => achat.compteVinted === selectedAccount)

  // Filtrage par période temporelle
  const achatsByPeriod = useMemo(() => {
    return filterAchatsByPeriod(achatsByAccount, timePeriod)
  }, [achatsByAccount, timePeriod])

  // Calcul des statistiques à partir des achats filtrés par période
  const stats = useMemo(() => {
    return calculateStats(achatsByPeriod)
  }, [achatsByPeriod])

  // Filtrage des achats (recherche, statut, plateforme)
  const filteredAchats = achatsByPeriod.filter((achat) => {
    // Filtre recherche
    const matchSearch =
      searchQuery === '' ||
      achat.nomArticle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achat.marque.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achat.vendeur?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achat.numeroTransaction.toLowerCase().includes(searchQuery.toLowerCase())

    // Filtre statut
    const matchStatut = statutFilter === 'tous' || achat.statut === statutFilter

    // Filtre plateforme
    const matchPlateforme = plateformeFilter === 'toutes' || achat.plateforme === plateformeFilter

    return matchSearch && matchStatut && matchPlateforme
  })

  // Handler: Ajouter un achat
  const handleAddAchat = (data: AchatFormData) => {
    // TODO: Connecter à l'API
    // await fetch('/api/achats', { method: 'POST', body: JSON.stringify(data) })

    // Simulation: Ajout local
    const newAchat: Achat = {
      id: Math.random().toString(36).substring(2, 11),
      numeroTransaction: data.numeroTransaction,
      nomArticle: data.nomArticle,
      marque: data.marque,
      taille: data.taille,
      prixAchat: data.prixAchat,
      fraisPort: data.fraisPort,
      coutTotal: data.prixAchat + data.fraisPort,
      dateAchat: data.dateAchat,
      plateforme: data.plateforme,
      vendeur: data.vendeur,
      compteVinted: data.compteVinted,
      statut: 'en_attente',
      numeroSuivi: data.numeroSuivi,
      prixReventePrevu: data.prixReventePrevu,
      margeEstimee: data.prixReventePrevu ? data.prixReventePrevu - (data.prixAchat + data.fraisPort) : 0,
      notes: data.notes,
      photo: data.photo ? URL.createObjectURL(data.photo) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setAchats([newAchat, ...achats])
    console.log('Achat ajouté (mode démo):', newAchat)
  }

  // Handler: Modifier un achat
  const handleEditAchat = (achat: Achat) => {
    setSelectedAchat(achat)
    setIsEditModalOpen(true)
  }

  // Handler: Mettre à jour un achat
  const handleUpdateAchat = (id: string, data: AchatFormData) => {
    // TODO: Connecter à l'API
    // await fetch(`/api/achats/${id}`, { method: 'PUT', body: JSON.stringify(data) })

    // Simulation: Mise à jour locale
    setAchats(
      achats.map((achat) =>
        achat.id === id
          ? {
              ...achat,
              numeroTransaction: data.numeroTransaction,
              nomArticle: data.nomArticle,
              marque: data.marque,
              taille: data.taille,
              prixAchat: data.prixAchat,
              fraisPort: data.fraisPort,
              coutTotal: data.prixAchat + data.fraisPort,
              dateAchat: data.dateAchat,
              plateforme: data.plateforme,
              vendeur: data.vendeur,
              compteVinted: data.compteVinted,
              numeroSuivi: data.numeroSuivi,
              prixReventePrevu: data.prixReventePrevu,
              margeEstimee: data.prixReventePrevu ? data.prixReventePrevu - (data.prixAchat + data.fraisPort) : 0,
              notes: data.notes,
              updatedAt: new Date().toISOString()
            }
          : achat
      )
    )
    console.log('Achat modifié (mode démo):', id, data)
  }

  // Handler: Supprimer un achat
  const handleDeleteAchat = (id: string) => {
    // TODO: Connecter à l'API
    // await fetch(`/api/achats/${id}`, { method: 'DELETE' })

    setAchats(achats.filter((a) => a.id !== id))
    console.log('Achat supprimé (mode démo):', id)
  }

  // Handler: Voir détail
  const handleDetailClick = (achat: Achat) => {
    setSelectedAchat(achat)
    setIsDetailModalOpen(true)
  }

  // Handler: Ajouter plusieurs achats au stock (depuis la modale)
  const handleAddMultipleToStock = (achatsIds: string[]) => {
    // Récupérer les achats sélectionnés
    const achatsToAdd = achats.filter(a => achatsIds.includes(a.id))

    // Ajouter tous les articles au stock
    const articlesAjoutes = addMultipleArticlesFromAchats(achatsToAdd)

    // Mettre à jour le statut de tous les achats concernés
    setAchats(
      achats.map((a) =>
        achatsIds.includes(a.id)
          ? { ...a, statut: 'en_stock' as StatutAchat, updatedAt: new Date().toISOString() }
          : a
      )
    )

    console.log(`✅ ${articlesAjoutes.length} article(s) ajouté(s) au stock`)
  }

  const hasActiveFilters = searchQuery !== '' || statutFilter !== 'tous' || plateformeFilter !== 'toutes'

  return (
    <div className="min-h-screen">
      {/* Header noir avec fil d'Ariane et actions */}
      <DashboardHeader
        title="Mes Achats"
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        selectedAccount={selectedAccount}
        onAccountChange={setSelectedAccount}
        accounts={uniqueAccounts}
      />

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* KPI Cards */}
        <div className="mb-6">
          <StatsCards stats={stats} />
        </div>

        {/* Barre de recherche et filtres */}
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

        {/* Tableau des achats */}
        <AchatsTable
          achats={filteredAchats}
          onDetailClick={handleDetailClick}
          onEdit={handleEditAchat}
          onDelete={handleDeleteAchat}
          isFiltered={hasActiveFilters}
        />

        {/* Modale ajout */}
        <AddAchatModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddAchat}
        />

        {/* Modale édition */}
        <EditAchatModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedAchat(null)
          }}
          achat={selectedAchat}
          onUpdate={handleUpdateAchat}
        />

        {/* Modale détail */}
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

        {/* Modale ajout au stock (multi-sélection) */}
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
