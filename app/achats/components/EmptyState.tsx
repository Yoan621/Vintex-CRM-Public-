import { Package, Search } from 'lucide-react'
import Button from '@/components/ui/Button'

interface EmptyStateProps {
  isSearchResult?: boolean
  onAddClick?: () => void
}

/**
 * État vide affiché quand il n'y a pas d'achats ou pas de résultats
 */
export default function EmptyState({ isSearchResult = false, onAddClick }: EmptyStateProps) {
  if (isSearchResult) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gray-100 rounded-full">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun résultat</h3>
        <p className="text-gray-500 mb-6">
          Essayez avec d'autres filtres ou une recherche différente
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-purple-100 rounded-full">
          <Package className="w-12 h-12 text-purple-600" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Aucun achat enregistré
      </h3>
      <p className="text-gray-500 mb-6">
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
