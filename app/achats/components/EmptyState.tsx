import { Package, Search } from 'lucide-react'
import Button from '@/components/ui/Button'

interface EmptyStateProps {
  isSearchResult?: boolean
  onAddClick?: () => void
}

/**
 * État vide affiché quand il n'y a pas d'achats ou pas de résultats
 * Design harmonisé avec le Dashboard
 */
export default function EmptyState({ isSearchResult = false, onAddClick }: EmptyStateProps) {
  if (isSearchResult) {
    return (
      <div className="bg-[#0E0E0E] rounded-xl border border-[#1A1A1A] p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-[#1A1A1A] rounded-full">
            <Search className="w-12 h-12 text-secondary/40" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-secondary mb-2">Aucun résultat</h3>
        <p className="text-secondary/60 mb-6">
          Essayez avec d'autres filtres ou une recherche différente
        </p>
      </div>
    )
  }

  return (
    <div className="bg-[#0E0E0E] rounded-xl border border-[#1A1A1A] p-12 text-center">
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-primary/10 rounded-full shadow-[0_4px_16px_rgba(0,60,243,0.2)]">
          <Package className="w-12 h-12 text-primary" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-secondary mb-2">
        Aucun achat enregistré
      </h3>
      <p className="text-secondary/60 mb-6">
        Commencez par ajouter votre premier achat
      </p>
      {onAddClick && (
        <Button onClick={onAddClick} variant="primary">
          Ajouter un achat
        </Button>
      )}
    </div>
  )
}
