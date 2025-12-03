'use client'

import { useState } from 'react'
import { mockAchats, mockStats } from '@/lib/mock-data/achats'
import { Achat, AchatFormData, Plateforme, StatutAchat } from '@/types/achat'
import StatsCards from './components/StatsCards'
import SearchBar from './components/SearchBar'
import AchatsTable from './components/AchatsTable'
import AddAchatModal from './components/AddAchatModal'
import DetailAchatModal from './components/DetailAchatModal'

/**
 * Page principale "Mes Achats"
 * Gestion complète des achats avec filtres, recherche et modales
 */
export default function AchatsPage() {
  // État des achats
  const [achats, setAchats] = useState<Achat[]>(mockAchats)

  // États des filtres
  const [searchQuery, setSearchQuery] = useState('')
  const [statutFilter, setStatutFilter] = useState<StatutAchat | 'tous'>('tous')
  const [plateformeFilter, setPlateformeFilter] = useState<Plateforme | 'toutes'>('toutes')

  // États des modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedAchat, setSelectedAchat] = useState<Achat | null>(null)

  // Filtrage des achats
  const filteredAchats = achats.filter((achat) => {
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
    // TODO: Ouvrir une modale d'édition (similaire à AddAchatModal)
    console.log('TODO: Modifier achat', achat.id)
    // Pour l'instant, on peut réutiliser AddAchatModal avec les données pré-remplies
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

  // Handler: Ajouter au stock
  const handleAddToStock = (achat: Achat) => {
    // TODO: Connecter à l'API stock
    console.log('TODO: Ajouter au stock', achat.id)

    // Simulation: Mise à jour du statut
    setAchats(
      achats.map((a) =>
        a.id === achat.id
          ? { ...a, statut: 'en_stock' as StatutAchat, updatedAt: new Date().toISOString() }
          : a
      )
    )
  }

  const hasActiveFilters = searchQuery !== '' || statutFilter !== 'tous' || plateformeFilter !== 'toutes'

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Achats</h1>
            <p className="text-gray-600 mt-1">
              Gérez vos achats et suivez vos marges en temps réel
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <StatsCards stats={mockStats} />

        {/* Barre de recherche et filtres */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statutFilter={statutFilter}
          onStatutChange={setStatutFilter}
          plateformeFilter={plateformeFilter}
          onPlateformeChange={setPlateformeFilter}
          onAddClick={() => setIsAddModalOpen(true)}
        />

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
          onAddToStock={handleAddToStock}
        />
      </div>
    </div>
  )
}
