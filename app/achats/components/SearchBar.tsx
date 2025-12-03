'use client'

import { Search, Plus } from 'lucide-react'
import { Plateforme, StatutAchat } from '@/types/achat'
import Button from '@/components/ui/Button'

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  statutFilter: StatutAchat | 'tous'
  onStatutChange: (statut: StatutAchat | 'tous') => void
  plateformeFilter: Plateforme | 'toutes'
  onPlateformeChange: (plateforme: Plateforme | 'toutes') => void
  onAddClick: () => void
}

/**
 * Barre de recherche avec filtres et bouton d'ajout
 */
export default function SearchBar({
  searchQuery,
  onSearchChange,
  statutFilter,
  onStatutChange,
  plateformeFilter,
  onPlateformeChange,
  onAddClick
}: SearchBarProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Champ de recherche */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un article, vendeur..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            aria-label="Rechercher"
          />
        </div>

        {/* Filtre Statut */}
        <select
          value={statutFilter}
          onChange={(e) => onStatutChange(e.target.value as StatutAchat | 'tous')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white cursor-pointer"
          aria-label="Filtrer par statut"
        >
          <option value="tous">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="expedie">Expédié</option>
          <option value="recu">Reçu</option>
          <option value="en_stock">En stock</option>
          <option value="revendu">Revendu</option>
        </select>

        {/* Filtre Plateforme */}
        <select
          value={plateformeFilter}
          onChange={(e) => onPlateformeChange(e.target.value as Plateforme | 'toutes')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white cursor-pointer"
          aria-label="Filtrer par plateforme"
        >
          <option value="toutes">Toutes les plateformes</option>
          <option value="vinted">Vinted</option>
          <option value="leboncoin">LeBonCoin</option>
          <option value="vide_grenier">Vide-grenier</option>
          <option value="autre">Autre</option>
        </select>

        {/* Bouton Nouvel achat */}
        <Button onClick={onAddClick} variant="primary">
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Nouvel achat</span>
        </Button>
      </div>

      {/* Indicateurs de filtres actifs */}
      {(searchQuery || statutFilter !== 'tous' || plateformeFilter !== 'toutes') && (
        <div className="mt-3 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500">Filtres actifs:</span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
              Recherche: "{searchQuery}"
              <button
                onClick={() => onSearchChange('')}
                className="hover:bg-purple-200 rounded p-0.5"
                aria-label="Effacer la recherche"
              >
                ×
              </button>
            </span>
          )}

          {statutFilter !== 'tous' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
              Statut: {statutFilter}
              <button
                onClick={() => onStatutChange('tous')}
                className="hover:bg-blue-200 rounded p-0.5"
                aria-label="Effacer le filtre statut"
              >
                ×
              </button>
            </span>
          )}

          {plateformeFilter !== 'toutes' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
              Plateforme: {plateformeFilter}
              <button
                onClick={() => onPlateformeChange('toutes')}
                className="hover:bg-orange-200 rounded p-0.5"
                aria-label="Effacer le filtre plateforme"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
