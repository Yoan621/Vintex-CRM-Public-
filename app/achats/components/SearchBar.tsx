'use client'

import { Search, Plus, Package, Layers } from 'lucide-react'
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
  onAddLotClick?: () => void
  onAddToStockClick?: () => void
}

/**
 * Barre de recherche avec filtres et bouton d'ajout
 * Design harmonisé avec le Dashboard
 */
export default function SearchBar({
  searchQuery,
  onSearchChange,
  statutFilter,
  onStatutChange,
  plateformeFilter,
  onPlateformeChange,
  onAddClick,
  onAddLotClick,
  onAddToStockClick
}: SearchBarProps) {
  return (
    <div className="bg-[#0E0E0E] rounded-xl border border-[#1A1A1A] p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Champ de recherche */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
          <input
            type="text"
            placeholder="Rechercher un article, vendeur..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-[#1A1A1A] rounded-lg text-secondary placeholder:text-secondary/40 focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
            aria-label="Rechercher"
          />
        </div>

        {/* Filtre Statut */}
        <select
          value={statutFilter}
          onChange={(e) => onStatutChange(e.target.value as StatutAchat | 'tous')}
          className="px-4 py-2.5 bg-transparent border border-[#1A1A1A] rounded-lg text-secondary focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all cursor-pointer"
          aria-label="Filtrer par statut"
        >
          <option value="tous" className="bg-[#0E0E0E]">Tous les statuts</option>
          <option value="en_attente" className="bg-[#0E0E0E]">En attente</option>
          <option value="expedie" className="bg-[#0E0E0E]">Expédié</option>
          <option value="recu" className="bg-[#0E0E0E]">Reçu</option>
          <option value="en_stock" className="bg-[#0E0E0E]">En stock</option>
          <option value="revendu" className="bg-[#0E0E0E]">Revendu</option>
          <option value="retourne" className="bg-[#0E0E0E]">Retourné</option>
          <option value="litige" className="bg-[#0E0E0E]">Litige</option>
        </select>

        {/* Filtre Plateforme */}
        <select
          value={plateformeFilter}
          onChange={(e) => onPlateformeChange(e.target.value as Plateforme | 'toutes')}
          className="px-4 py-2.5 bg-transparent border border-[#1A1A1A] rounded-lg text-secondary focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all cursor-pointer"
          aria-label="Filtrer par plateforme"
        >
          <option value="toutes" className="bg-[#0E0E0E]">Toutes les plateformes</option>
          <option value="vinted" className="bg-[#0E0E0E]">Vinted</option>
          <option value="leboncoin" className="bg-[#0E0E0E]">LeBonCoin</option>
          <option value="vide_grenier" className="bg-[#0E0E0E]">Vide-grenier</option>
          <option value="autre" className="bg-[#0E0E0E]">Autre</option>
        </select>

        {/* Bouton Ajouter au stock */}
        {onAddToStockClick && (
          <Button onClick={onAddToStockClick} variant="secondary">
            <Package className="w-5 h-5" />
            <span className="hidden sm:inline">Ajouter au stock</span>
          </Button>
        )}

        {/* Bouton Ajouter un lot */}
        {onAddLotClick && (
          <Button onClick={onAddLotClick} variant="secondary">
            <Layers className="w-5 h-5" />
            <span className="hidden sm:inline">Ajouter un lot</span>
          </Button>
        )}

        {/* Bouton Nouvel achat */}
        <Button onClick={onAddClick} variant="primary">
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Nouvel achat</span>
        </Button>
      </div>

      {/* Indicateurs de filtres actifs */}
      {(searchQuery || statutFilter !== 'tous' || plateformeFilter !== 'toutes') && (
        <div className="mt-3 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-secondary/60">Filtres actifs:</span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-xs">
              Recherche: "{searchQuery}"
              <button
                onClick={() => onSearchChange('')}
                className="hover:bg-primary/20 rounded p-0.5 transition-colors"
                aria-label="Effacer la recherche"
              >
                ×
              </button>
            </span>
          )}

          {statutFilter !== 'tous' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-info/10 text-info border border-info/20 rounded text-xs">
              Statut: {statutFilter}
              <button
                onClick={() => onStatutChange('tous')}
                className="hover:bg-info/20 rounded p-0.5 transition-colors"
                aria-label="Effacer le filtre statut"
              >
                ×
              </button>
            </span>
          )}

          {plateformeFilter !== 'toutes' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-success/10 text-success border border-success/20 rounded text-xs">
              Plateforme: {plateformeFilter}
              <button
                onClick={() => onPlateformeChange('toutes')}
                className="hover:bg-success/20 rounded p-0.5 transition-colors"
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
