'use client'

import { useState, useCallback, useEffect } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { Achat, AchatFormData, Plateforme } from '@/types/achat'
import { Upload, Calculator } from 'lucide-react'

interface EditAchatModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (id: string, data: AchatFormData) => void
  achat: Achat | null
}

/**
 * Modale pour modifier un achat existant
 * Similaire à AddAchatModal mais avec données pré-remplies
 */
export default function EditAchatModal({ isOpen, onClose, onUpdate, achat }: EditAchatModalProps) {
  const [formData, setFormData] = useState<Partial<AchatFormData>>({
    numeroTransaction: '',
    nomArticle: '',
    marque: '',
    taille: '',
    prixAchat: 0,
    fraisPort: 0,
    dateAchat: new Date().toISOString().split('T')[0],
    plateforme: 'vinted',
    vendeur: '',
    compteVinted: '',
    numeroSuivi: '',
    prixReventePrevu: 0,
    notes: ''
  })

  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Pré-remplir le formulaire quand l'achat change
  useEffect(() => {
    if (achat) {
      setFormData({
        numeroTransaction: achat.numeroTransaction,
        nomArticle: achat.nomArticle,
        marque: achat.marque,
        taille: achat.taille,
        prixAchat: achat.prixAchat,
        fraisPort: achat.fraisPort,
        dateAchat: achat.dateAchat,
        plateforme: achat.plateforme,
        vendeur: achat.vendeur || '',
        compteVinted: achat.compteVinted || '',
        numeroSuivi: achat.numeroSuivi || '',
        prixReventePrevu: achat.prixReventePrevu || 0,
        notes: achat.notes || ''
      })
    }
  }, [achat])

  // Calculs automatiques
  const coutTotal = (formData.prixAchat || 0) + (formData.fraisPort || 0)
  const margeEstimee = (formData.prixReventePrevu || 0) - coutTotal
  const margePercentage = coutTotal > 0 ? Math.round((margeEstimee / coutTotal) * 100) : 0

  const handleChange = (field: keyof AchatFormData, value: string | number) => {
    setFormData({ ...formData, [field]: value })
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        setUploadedFile(file)
        console.log('Fichier uploadé (mode démo):', file.name)
      }
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setUploadedFile(file)
      console.log('Fichier uploadé (mode démo):', file.name)
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.numeroTransaction) newErrors.numeroTransaction = 'Requis'
    if (!formData.nomArticle) newErrors.nomArticle = 'Requis'
    if (!formData.marque) newErrors.marque = 'Requis'
    if (!formData.taille) newErrors.taille = 'Requis'
    if (!formData.prixAchat || formData.prixAchat <= 0) newErrors.prixAchat = 'Prix invalide'
    if (!formData.dateAchat) newErrors.dateAchat = 'Requis'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate() || !achat) return

    console.log('Achat modifié (mode démo):', { ...formData, photo: uploadedFile })
    onUpdate(achat.id, formData as AchatFormData)
    onClose()
  }

  if (!achat) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier l'achat" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Zone upload */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-[#27272a] hover:border-primary/40 bg-[#18181b]'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload-edit"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          <label htmlFor="file-upload-edit" className="cursor-pointer">
            <Upload className="w-12 h-12 mx-auto text-secondary/40 mb-4" />
            {uploadedFile ? (
              <p className="text-primary font-medium">{uploadedFile.name}</p>
            ) : achat.photo ? (
              <p className="text-secondary/80 mb-1">Photo actuelle • Cliquez pour changer</p>
            ) : (
              <>
                <p className="text-secondary/80 mb-1">Glissez une capture d'écran ou cliquez pour uploader</p>
                <p className="text-sm text-secondary/40">PNG, JPG jusqu'à 10MB</p>
              </>
            )}
          </label>
        </div>

        {/* Formulaire en 2 colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* N° Transaction */}
          <div>
            <label className="block text-sm font-medium text-secondary/80 mb-1">
              N° Transaction <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.numeroTransaction}
              onChange={(e) => handleChange('numeroTransaction', e.target.value)}
              className={`w-full px-3 py-2 bg-[#18181b] border rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-transparent text-white placeholder:text-secondary/40 ${
                errors.numeroTransaction ? 'border-red-500' : 'border-[#27272a]'
              }`}
              placeholder="#ACH-2024-XXX"
            />
            {errors.numeroTransaction && (
              <p className="text-red-500 text-xs mt-1">{errors.numeroTransaction}</p>
            )}
          </div>

          {/* Plateforme */}
          <div>
            <label className="block text-sm font-medium text-secondary/80 mb-1">
              Plateforme <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.plateforme}
              onChange={(e) => handleChange('plateforme', e.target.value as Plateforme)}
              className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-transparent text-white"
            >
              <option value="vinted">Vinted</option>
              <option value="leboncoin">LeBonCoin</option>
              <option value="vide_grenier">Vide-grenier</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          {/* Nom article */}
          <div>
            <label className="block text-sm font-medium text-secondary/80 mb-1">
              Nom article <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nomArticle}
              onChange={(e) => handleChange('nomArticle', e.target.value)}
              className={`w-full px-3 py-2 bg-[#18181b] border rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-transparent text-white placeholder:text-secondary/40 ${
                errors.nomArticle ? 'border-red-500' : 'border-[#27272a]'
              }`}
              placeholder="Ex: Jean Levi's 501"
            />
            {errors.nomArticle && <p className="text-red-500 text-xs mt-1">{errors.nomArticle}</p>}
          </div>

          {/* Marque */}
          <div>
            <label className="block text-sm font-medium text-secondary/80 mb-1">
              Marque <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.marque}
              onChange={(e) => handleChange('marque', e.target.value)}
              className={`w-full px-3 py-2 bg-[#18181b] border rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-transparent text-white placeholder:text-secondary/40 ${
                errors.marque ? 'border-red-500' : 'border-[#27272a]'
              }`}
              placeholder="Ex: Levi's"
            />
            {errors.marque && <p className="text-red-500 text-xs mt-1">{errors.marque}</p>}
          </div>

          {/* Taille */}
          <div>
            <label className="block text-sm font-medium text-secondary/80 mb-1">
              Taille <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.taille}
              onChange={(e) => handleChange('taille', e.target.value)}
              className={`w-full px-3 py-2 bg-[#18181b] border rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-transparent text-white placeholder:text-secondary/40 ${
                errors.taille ? 'border-red-500' : 'border-[#27272a]'
              }`}
              placeholder="Ex: M, 38, 42"
            />
            {errors.taille && <p className="text-red-500 text-xs mt-1">{errors.taille}</p>}
          </div>

          {/* Date d'achat */}
          <div>
            <label className="block text-sm font-medium text-secondary/80 mb-1">
              Date d'achat <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.dateAchat}
              onChange={(e) => handleChange('dateAchat', e.target.value)}
              className={`w-full px-3 py-2 bg-[#18181b] border rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-transparent text-white ${
                errors.dateAchat ? 'border-red-500' : 'border-[#27272a]'
              }`}
            />
            {errors.dateAchat && <p className="text-red-500 text-xs mt-1">{errors.dateAchat}</p>}
          </div>

          {/* Prix d'achat */}
          <div>
            <label className="block text-sm font-medium text-secondary/80 mb-1">
              Prix d'achat <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.prixAchat || ''}
                onChange={(e) => handleChange('prixAchat', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 bg-[#18181b] border rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-transparent text-white placeholder:text-secondary/40 ${
                  errors.prixAchat ? 'border-red-500' : 'border-[#27272a]'
                }`}
                placeholder="0.00"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/60">€</span>
            </div>
            {errors.prixAchat && <p className="text-red-500 text-xs mt-1">{errors.prixAchat}</p>}
          </div>

          {/* Frais de port */}
          <div>
            <label className="block text-sm font-medium text-secondary/80 mb-1">Frais de port</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.fraisPort || ''}
                onChange={(e) => handleChange('fraisPort', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-transparent text-white placeholder:text-secondary/40"
                placeholder="0.00"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/60">€</span>
            </div>
          </div>

          {/* Vendeur */}
          <div>
            <label className="block text-sm font-medium text-secondary/80 mb-1">Vendeur</label>
            <input
              type="text"
              value={formData.vendeur}
              onChange={(e) => handleChange('vendeur', e.target.value)}
              className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-transparent text-white placeholder:text-secondary/40"
              placeholder="Pseudo du vendeur"
            />
          </div>

          {/* Compte Vinted */}
          <div>
            <label className="block text-sm font-medium text-secondary/80 mb-1">Compte Vinted</label>
            <input
              type="text"
              value={formData.compteVinted}
              onChange={(e) => handleChange('compteVinted', e.target.value)}
              className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-transparent text-white placeholder:text-secondary/40"
              placeholder="@nom_compte"
            />
          </div>

          {/* N° de suivi */}
          <div>
            <label className="block text-sm font-medium text-secondary/80 mb-1">N° de suivi</label>
            <input
              type="text"
              value={formData.numeroSuivi}
              onChange={(e) => handleChange('numeroSuivi', e.target.value)}
              className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-transparent text-white placeholder:text-secondary/40"
              placeholder="LA123456789"
            />
          </div>
        </div>

        {/* Prix revente prévu */}
        <div>
          <label className="block text-sm font-medium text-secondary/80 mb-1">
            Prix revente prévu (optionnel)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.prixReventePrevu || ''}
              onChange={(e) => handleChange('prixReventePrevu', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-transparent text-white placeholder:text-secondary/40"
              placeholder="0.00"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/60">€</span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-secondary/80 mb-1">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-transparent text-white placeholder:text-secondary/40 resize-none"
            placeholder="Ajoutez des notes sur l'article..."
          />
        </div>

        {/* Calculs automatiques */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-5 h-5 text-primary" />
            <h4 className="font-semibold text-secondary">Calcul automatique</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-secondary/80">Coût total:</span>
              <span className="font-bold text-secondary">{coutTotal.toFixed(2)} €</span>
            </div>
            {formData.prixReventePrevu && formData.prixReventePrevu > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-secondary/80">Marge estimée:</span>
                  <span
                    className={`font-bold ${
                      margeEstimee >= 0 ? 'text-[#00D98E]' : 'text-red-500'
                    }`}
                  >
                    {margeEstimee >= 0 ? '+' : ''}
                    {margeEstimee.toFixed(2)} € ({margePercentage >= 0 ? '+' : ''}
                    {margePercentage}%)
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#1A1A1A]">
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary">
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </Modal>
  )
}
