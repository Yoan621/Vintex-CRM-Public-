'use client'

import { useState, useCallback } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { AchatFormData, Plateforme } from '@/types/achat'
import { Upload, Calculator } from 'lucide-react'

interface AddAchatModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (data: AchatFormData) => void
}

/**
 * Modale pour ajouter un nouvel achat
 * Avec upload drag & drop, calcul automatique et validation
 */
export default function AddAchatModal({ isOpen, onClose, onAdd }: AddAchatModalProps) {
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
    numeroSuivi: '',
    prixReventePrevu: 0,
    notes: ''
  })

  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

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
        // TODO: Connecter à l'API pour upload réel
      }
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setUploadedFile(file)
      console.log('Fichier uploadé (mode démo):', file.name)
      // TODO: Connecter à l'API pour upload réel
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

    if (!validate()) return

    // TODO: Connecter à l'API
    console.log('Achat ajouté (mode démo):', { ...formData, photo: uploadedFile })
    onAdd(formData as AchatFormData)

    // Reset form
    setFormData({
      numeroTransaction: '',
      nomArticle: '',
      marque: '',
      taille: '',
      prixAchat: 0,
      fraisPort: 0,
      dateAchat: new Date().toISOString().split('T')[0],
      plateforme: 'vinted',
      vendeur: '',
      numeroSuivi: '',
      prixReventePrevu: 0,
      notes: ''
    })
    setUploadedFile(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un achat" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Zone upload */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            {uploadedFile ? (
              <p className="text-green-600 font-medium">{uploadedFile.name}</p>
            ) : (
              <>
                <p className="text-gray-600 mb-1">Glissez une capture d'écran ou cliquez pour uploader</p>
                <p className="text-sm text-gray-400">PNG, JPG jusqu'à 10MB</p>
              </>
            )}
          </label>
        </div>

        {/* Formulaire en 2 colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* N° Transaction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              N° Transaction <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.numeroTransaction}
              onChange={(e) => handleChange('numeroTransaction', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.numeroTransaction ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="#ACH-2024-XXX"
            />
            {errors.numeroTransaction && (
              <p className="text-red-500 text-xs mt-1">{errors.numeroTransaction}</p>
            )}
          </div>

          {/* Plateforme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plateforme <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.plateforme}
              onChange={(e) => handleChange('plateforme', e.target.value as Plateforme)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="vinted">Vinted</option>
              <option value="leboncoin">LeBonCoin</option>
              <option value="vide_grenier">Vide-grenier</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          {/* Nom article */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom article <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nomArticle}
              onChange={(e) => handleChange('nomArticle', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.nomArticle ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Jean Levi's 501"
            />
            {errors.nomArticle && <p className="text-red-500 text-xs mt-1">{errors.nomArticle}</p>}
          </div>

          {/* Marque */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marque <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.marque}
              onChange={(e) => handleChange('marque', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.marque ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Levi's"
            />
            {errors.marque && <p className="text-red-500 text-xs mt-1">{errors.marque}</p>}
          </div>

          {/* Taille */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Taille <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.taille}
              onChange={(e) => handleChange('taille', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.taille ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: M, 38, 42"
            />
            {errors.taille && <p className="text-red-500 text-xs mt-1">{errors.taille}</p>}
          </div>

          {/* Date d'achat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date d'achat <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.dateAchat}
              onChange={(e) => handleChange('dateAchat', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.dateAchat ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.dateAchat && <p className="text-red-500 text-xs mt-1">{errors.dateAchat}</p>}
          </div>

          {/* Prix d'achat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix d'achat <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.prixAchat || ''}
                onChange={(e) => handleChange('prixAchat', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.prixAchat ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
            </div>
            {errors.prixAchat && <p className="text-red-500 text-xs mt-1">{errors.prixAchat}</p>}
          </div>

          {/* Frais de port */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Frais de port</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.fraisPort || ''}
                onChange={(e) => handleChange('fraisPort', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0.00"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
            </div>
          </div>

          {/* Vendeur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vendeur</label>
            <input
              type="text"
              value={formData.vendeur}
              onChange={(e) => handleChange('vendeur', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Pseudo du vendeur"
            />
          </div>

          {/* N° de suivi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">N° de suivi</label>
            <input
              type="text"
              value={formData.numeroSuivi}
              onChange={(e) => handleChange('numeroSuivi', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="LA123456789"
            />
          </div>
        </div>

        {/* Prix revente prévu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prix revente prévu (optionnel)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.prixReventePrevu || ''}
              onChange={(e) => handleChange('prixReventePrevu', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="0.00"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            placeholder="Ajoutez des notes sur l'article..."
          />
        </div>

        {/* Calculs automatiques */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold text-purple-900">Calcul automatique</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">Coût total:</span>
              <span className="font-bold text-gray-900">{coutTotal.toFixed(2)} €</span>
            </div>
            {formData.prixReventePrevu && formData.prixReventePrevu > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-700">Marge estimée:</span>
                  <span
                    className={`font-bold ${
                      margeEstimee >= 0 ? 'text-green-600' : 'text-red-600'
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
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
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
