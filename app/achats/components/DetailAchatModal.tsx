'use client'

import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Achat } from '@/types/achat'
import { DollarSign, Package, FileText, ExternalLink, Edit, Trash2, Calendar } from 'lucide-react'
import Image from 'next/image'

interface DetailAchatModalProps {
  isOpen: boolean
  onClose: () => void
  achat: Achat | null
  onEdit: (achat: Achat) => void
  onDelete: (id: string) => void
}

/**
 * Modale affichant le détail complet d'un achat
 */
export default function DetailAchatModal({
  isOpen,
  onClose,
  achat,
  onEdit,
  onDelete
}: DetailAchatModalProps) {
  if (!achat) return null

  const handleEdit = () => {
    onEdit(achat)
    onClose()
  }

  const handleDelete = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet achat ?')) {
      onDelete(achat.id)
      onClose()
    }
  }

  const handleViewInvoice = () => {
    console.log('TODO: Voir facture', achat.id)
    // TODO: Connecter à l'API pour récupérer la facture
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Détail de l'achat ${achat.numeroTransaction}`} size="lg">
      <div className="space-y-6">
        {/* Photo de l'article */}
        {achat.photo && (
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={achat.photo}
              alt={achat.nomArticle}
              fill
              className="object-cover"
              onError={(e) => {
                // Fallback si l'image n'existe pas
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}

        {/* Informations principales */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{achat.nomArticle}</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="plateforme" value={achat.plateforme} />
            <Badge variant="statut" value={achat.statut} />
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Acheté le {formatDate(achat.dateAchat)}</span>
          </div>
        </div>

        {/* Informations détaillées */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations article */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">
              Informations article
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Marque:</span>
                <span className="font-medium text-gray-900">{achat.marque}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taille:</span>
                <span className="font-medium text-gray-900">{achat.taille}</span>
              </div>
              {achat.vendeur && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Vendeur:</span>
                  <span className="font-medium text-gray-900">{achat.vendeur}</span>
                </div>
              )}
            </div>
          </div>

          {/* Informations financières */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">
                Informations financières
              </h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Prix d'achat:</span>
                <span className="font-medium text-gray-900">
                  {achat.prixAchat.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frais de port:</span>
                <span className="font-medium text-gray-900">
                  {achat.fraisPort.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-900 font-semibold">Total:</span>
                <span className="font-bold text-gray-900">
                  {achat.coutTotal.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Marge estimée */}
        {achat.prixReventePrevu && achat.prixReventePrevu > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Prix revente prévu:</span>
                <span className="font-bold text-gray-900">
                  {achat.prixReventePrevu.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Marge estimée:</span>
                <span className="font-bold text-green-600">
                  +{achat.margeEstimee?.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  })}{' '}
                  (+
                  {achat.margeEstimee && achat.coutTotal > 0
                    ? Math.round((achat.margeEstimee / achat.coutTotal) * 100)
                    : 0}
                  %)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Livraison */}
        {(achat.numeroSuivi || achat.statut !== 'en_attente') && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">
                Livraison
              </h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Statut:</span>
                <Badge variant="statut" value={achat.statut} />
              </div>
              {achat.numeroSuivi && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">N° de suivi:</span>
                  {achat.urlSuivi ? (
                    <a
                      href={achat.urlSuivi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline font-medium"
                    >
                      {achat.numeroSuivi}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="font-medium text-gray-900">{achat.numeroSuivi}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Documents */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-purple-600" />
            <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">
              Documents
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={handleViewInvoice}>
              <FileText className="w-4 h-4" />
              Voir facture
            </Button>
            {achat.photo && (
              <Button variant="secondary" size="sm" onClick={() => window.open(achat.photo, '_blank')}>
                <FileText className="w-4 h-4" />
                Voir capture d'écran
              </Button>
            )}
          </div>
        </div>

        {/* Notes */}
        {achat.notes && (
          <div>
            <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider mb-3">
              Notes
            </h4>
            <p className="text-gray-700 text-sm bg-gray-50 rounded-lg p-3">{achat.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap justify-end gap-3 pt-6 border-t border-gray-200">
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
            Supprimer
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            <Edit className="w-4 h-4" />
            Modifier
          </Button>
        </div>
      </div>
    </Modal>
  )
}
