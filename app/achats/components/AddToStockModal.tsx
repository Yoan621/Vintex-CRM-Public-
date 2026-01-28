'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { Achat } from '@/types/achat'
import { Package, CheckCircle2 } from 'lucide-react'
import Badge from '@/components/ui/Badge'

interface AddToStockModalProps {
  isOpen: boolean
  onClose: () => void
  achats: Achat[]
  onAddToStock: (achatsIds: string[]) => void
}

/**
 * Modale pour sélectionner plusieurs achats à ajouter au stock
 * Permet de cocher les articles qu'on souhaite mettre en stock
 */
export default function AddToStockModal({
  isOpen,
  onClose,
  achats,
  onAddToStock
}: AddToStockModalProps) {
  const [selectedAchats, setSelectedAchats] = useState<Set<string>>(new Set())

  // Filtrer uniquement les achats "reçus" ou "en attente" qui ne sont pas encore en stock
  const achatsDisponibles = achats.filter(
    achat => (achat.statut === 'recu' || achat.statut === 'en_attente' || achat.statut === 'expedie') && achat.statut !== 'en_stock'
  )

  const handleToggle = (achatId: string) => {
    const newSelected = new Set(selectedAchats)
    if (newSelected.has(achatId)) {
      newSelected.delete(achatId)
    } else {
      newSelected.add(achatId)
    }
    setSelectedAchats(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedAchats.size === achatsDisponibles.length) {
      setSelectedAchats(new Set())
    } else {
      setSelectedAchats(new Set(achatsDisponibles.map(a => a.id)))
    }
  }

  const handleSubmit = () => {
    if (selectedAchats.size === 0) return

    onAddToStock(Array.from(selectedAchats))
    setSelectedAchats(new Set())
    onClose()
  }

  const handleCancel = () => {
    setSelectedAchats(new Set())
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Ajouter au stock" size="xl">
      <div className="space-y-4">
        {/* Description */}
        <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <Package className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-secondary">
              Sélectionnez les achats que vous souhaitez ajouter au stock.
            </p>
            <p className="text-xs text-secondary/60 mt-1">
              Les articles seront ajoutés avec le statut <strong>"Non mise en ligne"</strong> et recevront automatiquement un <strong>SKU unique</strong>.
            </p>
          </div>
        </div>

        {/* Bouton tout sélectionner */}
        {achatsDisponibles.length > 0 && (
          <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
            <p className="text-sm text-secondary/60">
              {selectedAchats.size} / {achatsDisponibles.length} article(s) sélectionné(s)
            </p>
            <button
              onClick={handleSelectAll}
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {selectedAchats.size === achatsDisponibles.length ? 'Tout désélectionner' : 'Tout sélectionner'}
            </button>
          </div>
        )}

        {/* Liste des achats */}
        <div className="max-h-[400px] overflow-y-auto space-y-2">
          {achatsDisponibles.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-secondary/40 mb-3" />
              <p className="text-secondary/60">Aucun achat disponible</p>
              <p className="text-xs text-secondary/40 mt-1">
                Seuls les achats reçus ou expédiés peuvent être ajoutés au stock
              </p>
            </div>
          ) : (
            achatsDisponibles.map(achat => {
              const isSelected = selectedAchats.has(achat.id)
              return (
                <div
                  key={achat.id}
                  onClick={() => handleToggle(achat.id)}
                  className={`
                    flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-[#27272a] hover:border-primary/40 bg-[#18181b]'
                    }
                  `}
                >
                  {/* Checkbox */}
                  <div className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
                    ${isSelected ? 'bg-primary border-primary' : 'border-secondary/40'}
                  `}>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>

                  {/* Photo */}
                  {achat.photo ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#27272a] flex-shrink-0">
                      <img src={achat.photo} alt={achat.nomArticle} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-[#27272a] flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-secondary/40" />
                    </div>
                  )}

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-secondary truncate">{achat.nomArticle}</h4>
                    <p className="text-sm text-secondary/60 truncate">
                      {achat.marque} • Taille {achat.taille}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="statut" value={achat.statut} />
                      <span className="text-xs text-secondary/60">
                        {achat.numeroTransaction}
                      </span>
                    </div>
                  </div>

                  {/* Prix */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-secondary/60">Coût total</p>
                    <p className="font-semibold text-secondary">
                      {achat.coutTotal.toFixed(2)} €
                    </p>
                    {achat.prixReventePrevu && (
                      <p className="text-xs text-success mt-1">
                        Vente: {achat.prixReventePrevu.toFixed(2)} €
                      </p>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#1A1A1A]">
          <Button type="button" variant="secondary" onClick={handleCancel}>
            Annuler
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            disabled={selectedAchats.size === 0}
          >
            Ajouter {selectedAchats.size > 0 && `(${selectedAchats.size})`} au stock
          </Button>
        </div>
      </div>
    </Modal>
  )
}
