'use client'

import { Achat } from '@/types/achat'
import Badge from '@/components/ui/Badge'
import ActionMenu from './ActionMenu'
import { ExternalLink } from 'lucide-react'

interface AchatRowProps {
  achat: Achat
  onDetailClick: (achat: Achat) => void
  onEdit: (achat: Achat) => void
  onDelete: (id: string) => void
}

/**
 * Ligne du tableau des achats (version desktop)
 * Sur mobile, affiche une card
 */
export default function AchatRow({ achat, onDetailClick, onEdit, onDelete }: AchatRowProps) {
  const handleViewInvoice = () => {
    console.log('TODO: Voir facture', achat.id)
    // TODO: Connecter à l'API pour récupérer la facture
  }

  const handleAddToStock = () => {
    console.log('TODO: Ajouter au stock', achat.id)
    // TODO: Connecter à l'API pour ajouter au stock
  }

  return (
    <>
      {/* Version Desktop - Ligne de tableau */}
      <tr className="hidden lg:table-row hover:bg-gray-50 transition-colors border-b border-gray-200">
        <td className="px-6 py-4">
          <button
            onClick={() => onDetailClick(achat)}
            className="text-purple-600 hover:text-purple-800 font-medium hover:underline"
          >
            {achat.numeroTransaction}
          </button>
        </td>

        <td className="px-6 py-4">
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{achat.nomArticle}</span>
            <span className="text-sm text-gray-500">
              {achat.marque} • Taille {achat.taille}
            </span>
          </div>
        </td>

        <td className="px-6 py-4 text-gray-900">
          {achat.prixAchat.toLocaleString('fr-FR', {
            style: 'currency',
            currency: 'EUR'
          })}
        </td>

        <td className="px-6 py-4 text-gray-900">
          {achat.fraisPort.toLocaleString('fr-FR', {
            style: 'currency',
            currency: 'EUR'
          })}
        </td>

        <td className="px-6 py-4">
          <span className="font-bold text-gray-900">
            {achat.coutTotal.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            })}
          </span>
        </td>

        <td className="px-6 py-4">
          <Badge variant="plateforme" value={achat.plateforme} />
        </td>

        <td className="px-6 py-4">
          <Badge variant="statut" value={achat.statut} />
        </td>

        <td className="px-6 py-4">
          {achat.numeroSuivi ? (
            <a
              href={achat.urlSuivi}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline text-sm"
            >
              {achat.numeroSuivi}
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-gray-400 text-sm">-</span>
          )}
        </td>

        <td className="px-6 py-4">
          <ActionMenu
            onEdit={() => onEdit(achat)}
            onViewInvoice={handleViewInvoice}
            onAddToStock={handleAddToStock}
            onDelete={() => onDelete(achat.id)}
          />
        </td>
      </tr>

      {/* Version Mobile - Card */}
      <div className="lg:hidden bg-white rounded-lg border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <button
            onClick={() => onDetailClick(achat)}
            className="text-purple-600 hover:text-purple-800 font-medium hover:underline"
          >
            {achat.numeroTransaction}
          </button>
          <ActionMenu
            onEdit={() => onEdit(achat)}
            onViewInvoice={handleViewInvoice}
            onAddToStock={handleAddToStock}
            onDelete={() => onDelete(achat.id)}
          />
        </div>

        <div className="space-y-2">
          <div>
            <p className="font-medium text-gray-900">{achat.nomArticle}</p>
            <p className="text-sm text-gray-500">
              {achat.marque} • Taille {achat.taille}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="plateforme" value={achat.plateforme} />
            <Badge variant="statut" value={achat.statut} />
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-gray-200">
            <div>
              <span className="text-gray-500">Prix:</span>
              <span className="ml-1 text-gray-900">{achat.prixAchat}€</span>
            </div>
            <div>
              <span className="text-gray-500">Frais:</span>
              <span className="ml-1 text-gray-900">{achat.fraisPort}€</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">Total:</span>
              <span className="ml-1 font-bold text-gray-900">{achat.coutTotal}€</span>
            </div>
          </div>

          {achat.numeroSuivi && (
            <a
              href={achat.urlSuivi}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline text-sm"
            >
              Suivi: {achat.numeroSuivi}
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </>
  )
}
