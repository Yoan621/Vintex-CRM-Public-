import { Package } from 'lucide-react'

interface EmptyStateProps {
  isSearchResult?: boolean
}

export default function EmptyState({ isSearchResult = false }: EmptyStateProps) {
  return (
    <div className="bg-[#0E0E0E] rounded-xl border border-[#1A1A1A] overflow-hidden">
      <div className="px-6 py-12 text-center">
        <Package className="w-12 h-12 mx-auto text-secondary/40 mb-4" />
        <p className="text-secondary/60">
          {isSearchResult ? 'Aucun résultat à afficher' : 'Aucun achat à afficher'}
        </p>
      </div>
    </div>
  )
}
