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

  return (
    <>
      {/* Version Desktop - Ligne de tableau */}
      <tr className="hidden lg:table-row hover:bg-[#1A1A1A]/50 transition-colors border-b border-[#1A1A1A]">
        <td className="px-6 py-4">
          <button
            onClick={() => onDetailClick(achat)}
            className="text-primary hover:text-primary/80 font-medium hover:underline"
          >
            {achat.numeroTransaction}
          </button>
        </td>

        <td className="px-6 py-4">
          <div className="flex flex-col">
            <span className="font-medium text-secondary">{achat.nomArticle}</span>
            <span className="text-sm text-secondary/60">
              {achat.marque} • Taille {achat.taille}
            </span>
          </div>
        </td>

        <td className="px-6 py-4 text-secondary">
          {achat.prixAchat.toLocaleString('fr-FR', {
            style: 'currency',
            currency: 'EUR'
          })}
        </td>

        <td className="px-6 py-4 text-secondary">
          {achat.fraisPort.toLocaleString('fr-FR', {
            style: 'currency',
            currency: 'EUR'
          })}
        </td>

        <td className="px-6 py-4">
          <span className="font-bold text-secondary">
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
          <span className="text-secondary/80 text-sm">
            {achat.compteVinted || '-'}
          </span>
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
              className="inline-flex items-center gap-1 text-info hover:text-info/80 hover:underline text-sm"
            >
              {achat.numeroSuivi}
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-secondary/40 text-sm">-</span>
          )}
        </td>

        <td className="px-6 py-4">
          <ActionMenu
            onEdit={() => onEdit(achat)}
            onViewInvoice={handleViewInvoice}
            onDelete={() => onDelete(achat.id)}
          />
        </td>
      </tr>

      {/* Version Mobile - Card */}
      <div className="lg:hidden bg-[#0E0E0E] rounded-lg border border-[#1A1A1A] p-4 mb-3 hover:border-primary/40 transition-all">
        <div className="flex justify-between items-start mb-3">
          <button
            onClick={() => onDetailClick(achat)}
            className="text-primary hover:text-primary/80 font-medium hover:underline"
          >
            {achat.numeroTransaction}
          </button>
          <ActionMenu
            onEdit={() => onEdit(achat)}
            onViewInvoice={handleViewInvoice}
            onDelete={() => onDelete(achat.id)}
          />
        </div>

        <div className="space-y-2">
          <div>
            <p className="font-medium text-secondary">{achat.nomArticle}</p>
            <p className="text-sm text-secondary/60">
              {achat.marque} • Taille {achat.taille}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="plateforme" value={achat.plateforme} />
            <Badge variant="statut" value={achat.statut} />
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-[#1A1A1A]">
            <div>
              <span className="text-secondary/60">Prix:</span>
              <span className="ml-1 text-secondary">{achat.prixAchat}€</span>
            </div>
            <div>
              <span className="text-secondary/60">Frais:</span>
              <span className="ml-1 text-secondary">{achat.fraisPort}€</span>
            </div>
            <div className="col-span-2">
              <span className="text-secondary/60">Total:</span>
              <span className="ml-1 font-bold text-secondary">{achat.coutTotal}€</span>
            </div>
          </div>

          {achat.numeroSuivi && (
            <a
              href={achat.urlSuivi}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-info hover:text-info/80 hover:underline text-sm"
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
