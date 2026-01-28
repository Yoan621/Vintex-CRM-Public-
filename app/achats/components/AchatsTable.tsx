'use client'

import { Achat } from '@/types/achat'
import AchatRow from './AchatRow'
import EmptyState from './EmptyState'

interface AchatsTableProps {
  achats: Achat[]
  onDetailClick: (achat: Achat) => void
  onEdit: (achat: Achat) => void
  onDelete: (id: string) => void
  isFiltered?: boolean
}

/**
 * Tableau des achats avec support responsive
 */
export default function AchatsTable({
  achats,
  onDetailClick,
  onEdit,
  onDelete,
  isFiltered = false
}: AchatsTableProps) {
  if (achats.length === 0) {
    return <EmptyState isSearchResult={isFiltered} />
  }

  return (
    <div className="bg-[#0E0E0E] rounded-xl border border-[#1A1A1A] overflow-hidden">
      {/* Version Desktop - Tableau classique */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#0E0E0E] border-b border-[#1A1A1A]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary/60 uppercase tracking-wider">
                N° Transaction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary/60 uppercase tracking-wider">
                Article
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary/60 uppercase tracking-wider">
                Prix
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary/60 uppercase tracking-wider">
                Frais
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary/60 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary/60 uppercase tracking-wider">
                Plateforme
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary/60 uppercase tracking-wider">
                Compte
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary/60 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary/60 uppercase tracking-wider">
                N° Suivi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary/60 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#0E0E0E] divide-y divide-[#1A1A1A]">
            {achats.map((achat) => (
              <AchatRow
                key={achat.id}
                achat={achat}
                onDetailClick={onDetailClick}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Version Mobile - Cards empilées */}
      <div className="lg:hidden p-4 space-y-3">
        {achats.map((achat) => (
          <AchatRow
            key={achat.id}
            achat={achat}
            onDetailClick={onDetailClick}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Footer avec nombre de résultats */}
      <div className="px-6 py-3 bg-[#0E0E0E] border-t border-[#1A1A1A]">
        <p className="text-sm text-secondary/60">
          {achats.length} {achats.length > 1 ? 'achats' : 'achat'} affiché{achats.length > 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
