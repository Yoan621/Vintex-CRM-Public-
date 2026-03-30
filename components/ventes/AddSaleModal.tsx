'use client'

import { useState, useCallback } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { Upload, Calculator } from 'lucide-react'
import { OrderStatus, Carrier } from '@/lib/types'

interface AddSaleModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (data: SaleFormData) => void
}

export interface SaleFormData {
  transactionNumber: string
  articleName: string
  brandName: string
  vintedAccount: string
  platform: 'vinted' | 'leboncoin' | 'ebay' | 'facebook' | 'autre'
  status: OrderStatus
  saleDate: string
  purchasePrice: number
  salePrice: number
  trackingNumber?: string
  carrier?: Carrier
  customerName: string
  articleImage?: File
}

/**
 * Modale pour ajouter une vente manuellement
 * Avec upload drag & drop, calcul automatique et validation
 */
export default function AddSaleModal({ isOpen, onClose, onAdd }: AddSaleModalProps) {
  const [formData, setFormData] = useState<Partial<SaleFormData>>({
    transactionNumber: '',
    articleName: '',
    brandName: '',
    vintedAccount: '',
    platform: 'vinted',
    status: 'non_traite',
    saleDate: new Date().toISOString().split('T')[0],
    purchasePrice: 0,
    salePrice: 0,
    trackingNumber: '',
    carrier: undefined,
    customerName: ''
  })

  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Calculs automatiques
  const benefice = (formData.salePrice || 0) - (formData.purchasePrice || 0)
  const margePercentage = formData.purchasePrice && formData.purchasePrice > 0
    ? Math.round((benefice / formData.purchasePrice) * 100)
    : 0

  const handleChange = (field: keyof SaleFormData, value: string | number) => {
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
        console.log('Image uploadée:', file.name)
      }
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setUploadedFile(file)
      console.log('Image uploadée:', file.name)
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.transactionNumber) newErrors.transactionNumber = 'Requis'
    if (!formData.articleName) newErrors.articleName = 'Requis'
    if (!formData.brandName) newErrors.brandName = 'Requis'
    if (!formData.vintedAccount) newErrors.vintedAccount = 'Requis'
    if (!formData.customerName) newErrors.customerName = 'Requis'
    if (!formData.purchasePrice || formData.purchasePrice < 0) newErrors.purchasePrice = 'Prix invalide'
    if (!formData.salePrice || formData.salePrice <= 0) newErrors.salePrice = 'Prix invalide'
    if (!formData.saleDate) newErrors.saleDate = 'Requis'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    console.log('Vente ajoutée:', { ...formData, articleImage: uploadedFile })
    onAdd({ ...formData, articleImage: uploadedFile } as SaleFormData)

    // Reset form
    setFormData({
      transactionNumber: '',
      articleName: '',
      brandName: '',
      vintedAccount: '',
      platform: 'vinted',
      status: 'non_traite',
      saleDate: new Date().toISOString().split('T')[0],
      purchasePrice: 0,
      salePrice: 0,
      trackingNumber: '',
      carrier: undefined,
      customerName: ''
    })
    setUploadedFile(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter une vente" size="xl">
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
            id="file-upload-sale"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          <label htmlFor="file-upload-sale" className="cursor-pointer">
            <Upload className="w-12 h-12 mx-auto text-secondary/40 mb-4" />
            {uploadedFile ? (
              <p className="text-primary font-medium">{uploadedFile.name}</p>
            ) : (
              <>
                <p className="text-secondary/80 mb-1">Glissez une photo de l'article ou cliquez pour uploader</p>
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
              value={formData.transactionNumber}
              onChange={(e) => handleChange('transactionNumber', e.target.value)}
              className={`w-full px-3 py-2 bg-[#18181b] border rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-transparent text-white placeholder:text-secondary/40 ${
                errors.transactionNumber ? 'border-red-500' : 'border-[#27272a]'
              }`}
              placeholder="#VNT-2024-XXX"
            />
            {errors.transactionNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.transactionNumber}</p>
            )}
          </div>

          {/* Compte Vinted */}
          <div>
            <label className="block text-sm font-medium text-secondary/80 mb-1">
              Compte vendeur <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.vintedAccount}
              onChange={(e) => handleChange('vintedAccount', e.target.value)}
              className={`w-full px-3 py-2 bg-[#18181b] border rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-transparent text-white placeholder:text-secondary/40 ${
                errors.vintedAccount ? 'border-red-500' : 'border-[#27272a]'
              }`}
              placeholder="@nom_compte"
            />
            {errors.vintedAccount && (
              <p className="text-red-500 text-xs mt-1">{errors.vintedAccount}</p>
            )}
          </div>

          {/* Plateforme */}
          <div>
            <label className="block text-sm font-medium text-secondary/80 mb-1">
              Plateforme <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.platform}
              onChange={(e) => handleChange('platform', e.target.value)}
              className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-transparent text-white"
            >
              <option value="vinted">Vinted</option>
              <option value="leboncoin">LeBonCoin</option>
              <option value="ebay">eBay</option>
              <option value="facebook">Facebook Marketplace</option>
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
              value={formData.articleName}
              onChange={(e) => handleChange('articleName', e.target.value)}
              className={`w-full px-3 py-2 bg-[#18181b] border rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-transparent text-white placeholder:text-secondary/40 ${
                errors.articleName ? 'border-red-500' : 'border-[#27272a]'
              }`}
              placeholder="Ex: Jean Levi's 501"
            />
            {errors.articleName && <p className="text-red-500 text-xs mt-1">{errors.articleName}</p>}
          </div>

          {/* Marque */}
          <div>
            <label className="block text-sm font-medium text-secondary/80 mb-1">
              Marque <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.brandName}
              onChange={(e) => handleChange('brandName', e.target.value)}
              className={`w-full px-3 py-2 bg-[#18181b] border rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-transparent text-white placeholder:text-secondary/40 ${
                errors.brandName ? 'border-red-500' : 'border-[#27272a]'
              }`}
              placeholder="Ex: Levi's"
            />
            {errors.brandName && <p className="text-red-500 text-xs mt-1">{errors.brandName}</p>}
          </div>

          {/* Nom du client */}
          <div>
            <label className="block text-sm font-medium text-secondary/80 mb-1">
              Nom du client <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => handleChange('customerName', e.target.value)}
              className={`w-full px-3 py-2 bg-[#18181b] border rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-transparent text-white placeholder:text-secondary/40 ${
                errors.customerName ? 'border-red-500' : 'border-[#27272a]'
              }`}
              placeholder="Pseudo client"
            />
            {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
          </div>

          {/* Date de vente */}
          <div>
            <label className="block text-sm font-medium text-secondary/80 mb-1">
              Date de vente <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.saleDate}
              onChange={(e) => handleChange('saleDate', e.target.value)}
              className={`w-full px-3 py-2 bg-[#18181b] border rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-transparent text-white ${
                errors.saleDate ? 'border-red-500' : 'border-[#27272a]'
              }`}
            />
            {errors.saleDate && <p className="text-red-500 text-xs mt-1">{errors.saleDate}</p>}
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
                value={formData.purchasePrice || ''}
                onChange={(e) => handleChange('purchasePrice', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 bg-[#18181b] border rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-transparent text-white placeholder:text-secondary/40 ${
                  errors.purchasePrice ? 'border-red-500' : 'border-[#27272a]'
                }`}
                placeholder="0.00"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/60">€</span>
            </div>
            {errors.purchasePrice && <p className="text-red-500 text-xs mt-1">{errors.purchasePrice}</p>}
          </div>

          {/* Prix de vente */}
          <div>
            <label className="block text-sm font-medium text-secondary/80 mb-1">
              Prix de vente <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.salePrice || ''}
                onChange={(e) => handleChange('salePrice', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 bg-[#18181b] border rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-transparent text-white placeholder:text-secondary/40 ${
                  errors.salePrice ? 'border-red-500' : 'border-[#27272a]'
                }`}
                placeholder="0.00"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/60">€</span>
            </div>
            {errors.salePrice && <p className="text-red-500 text-xs mt-1">{errors.salePrice}</p>}
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-secondary/80 mb-1">
              Statut <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as OrderStatus)}
              className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-transparent text-white"
            >
              <option value="non_traite">Non traitée</option>
              <option value="en_cours">En cours</option>
              <option value="validée">Validée</option>
              <option value="litige">Litige</option>
              <option value="annulée">Annulée</option>
            </select>
          </div>

          {/* Transporteur */}
          <div>
            <label className="block text-sm font-medium text-secondary/80 mb-1">Transporteur</label>
            <select
              value={formData.carrier || ''}
              onChange={(e) => handleChange('carrier', e.target.value as Carrier)}
              className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-transparent text-white"
            >
              <option value="">Sélectionner</option>
              <option value="mondial_relay">Mondial Relay</option>
              <option value="vinted_go">Vinted Go</option>
              <option value="chronopost">Chronopost</option>
              <option value="colissimo">Colissimo</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          {/* N° de suivi */}
          <div>
            <label className="block text-sm font-medium text-secondary/80 mb-1">N° de suivi</label>
            <input
              type="text"
              value={formData.trackingNumber}
              onChange={(e) => handleChange('trackingNumber', e.target.value)}
              className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-transparent text-white placeholder:text-secondary/40"
              placeholder="LA123456789"
            />
          </div>
        </div>

        {/* Calculs automatiques */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-5 h-5 text-primary" />
            <h4 className="font-semibold text-secondary">Calcul automatique</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-secondary/80">Bénéfice:</span>
              <span
                className={`font-bold ${
                  benefice >= 0 ? 'text-[#00D98E]' : 'text-red-500'
                }`}
              >
                {benefice >= 0 ? '+' : ''}
                {benefice.toFixed(2)} € ({margePercentage >= 0 ? '+' : ''}
                {margePercentage}%)
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#1A1A1A]">
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary">
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  )
}
