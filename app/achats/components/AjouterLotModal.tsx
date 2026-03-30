'use client'

import { useState } from 'react'
import { X, Info, Plus } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface LotFormData {
  nomLot: string
  sku: string
  memeSkuPourTous: boolean
  nombreArticles: string
  prixTotal: string
  dateAchat: string
  fournisseur: string
  notesInternes: string
}

interface AjouterLotModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: LotFormData) => void
}

/**
 * Modal pour ajouter un lot d'achats
 * Permet de créer plusieurs articles identiques en une seule fois
 */
export default function AjouterLotModal({ isOpen, onClose, onSubmit }: AjouterLotModalProps) {
  const [formData, setFormData] = useState<LotFormData>({
    nomLot: '',
    sku: '',
    memeSkuPourTous: false,
    nombreArticles: '',
    prixTotal: '',
    dateAchat: '',
    fournisseur: '',
    notesInternes: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.nomLot.trim()) {
      alert('Veuillez entrer un nom de lot')
      return
    }
    if (!formData.nombreArticles || parseInt(formData.nombreArticles) <= 0) {
      alert('Veuillez entrer un nombre d\'articles valide')
      return
    }
    if (!formData.prixTotal || parseFloat(formData.prixTotal) <= 0) {
      alert('Veuillez entrer un prix total valide')
      return
    }
    if (!formData.dateAchat) {
      alert('Veuillez sélectionner une date d\'achat')
      return
    }
    if (!formData.fournisseur) {
      alert('Veuillez sélectionner un fournisseur')
      return
    }

    onSubmit(formData)

    // Reset form
    setFormData({
      nomLot: '',
      sku: '',
      memeSkuPourTous: false,
      nombreArticles: '',
      prixTotal: '',
      dateAchat: '',
      fournisseur: '',
      notesInternes: ''
    })
  }

  const handleClose = () => {
    setFormData({
      nomLot: '',
      sku: '',
      memeSkuPourTous: false,
      nombreArticles: '',
      prixTotal: '',
      dateAchat: '',
      fournisseur: '',
      notesInternes: ''
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Ajouter un lot d'achat"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bandeau informatif */}
        <div className="flex gap-3 p-4 bg-[#003CF3]/10 border border-[#003CF3]/20 rounded-xl">
          <Info className="w-5 h-5 text-[#003CF3] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-white/80">
            Un lot est un groupe d'articles identiques. Si vous avez un lot de 100 jeans avec différentes tailles,
            vous devez créer un lot pour chaque taille.
          </p>
        </div>

        {/* Nom du lot et SKU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Nom du lot<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              name="nomLot"
              value={formData.nomLot}
              onChange={handleChange}
              placeholder="Ex: jeans Levi's"
              className="w-full px-4 py-2.5 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
              required
            />
            <p className="text-xs text-orange-400 mt-1.5 flex items-start gap-1">
              <span>⚠️</span>
              <span>Le nom du lot sera utilisé pour créer les articles individuels</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              SKU (optionnel)
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="Ex: JEANS"
              className="w-full px-4 py-2.5 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
            />
            <p className="text-xs text-white/50 mt-1.5">
              Si vide, un SKU unique sera généré automatiquement
            </p>
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex items-start gap-3 p-4 bg-[#0E0E0E] border border-[#1A1A1A] rounded-lg">
          <input
            type="checkbox"
            id="memeSkuPourTous"
            name="memeSkuPourTous"
            checked={formData.memeSkuPourTous}
            onChange={handleChange}
            className="mt-0.5 w-4 h-4 text-primary bg-[#18181b] border-[#27272a] rounded focus:ring-2 focus:ring-primary/40"
          />
          <div className="flex-1">
            <label htmlFor="memeSkuPourTous" className="text-sm font-medium text-white/90 cursor-pointer">
              Utiliser le même SKU pour tous les articles du lot
            </label>
            <p className="text-xs text-white/50 mt-1">
              Si coché, tous les articles auront le même SKU. Sinon, numérotation automatique (#JEANS0001, #JEANS0002, etc.)
            </p>
          </div>
        </div>

        {/* 3 colonnes : Nombre, Prix, Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Nombre d'articles<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="number"
              name="nombreArticles"
              value={formData.nombreArticles}
              onChange={handleChange}
              placeholder="Ex: 10"
              min="1"
              className="w-full px-4 py-2.5 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Prix total du lot (€)<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="number"
              name="prixTotal"
              value={formData.prixTotal}
              onChange={handleChange}
              placeholder="Ex: 100"
              min="0"
              step="0.01"
              className="w-full px-4 py-2.5 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Date d'achat<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="date"
              name="dateAchat"
              value={formData.dateAchat}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-[#18181b] border border-[#27272a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
              required
            />
          </div>
        </div>

        {/* Fournisseur */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Fournisseur<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex gap-2">
            <select
              name="fournisseur"
              value={formData.fournisseur}
              onChange={handleChange}
              className="flex-1 px-4 py-2.5 bg-[#18181b] border border-[#27272a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all cursor-pointer"
              required
            >
              <option value="" className="bg-[#0E0E0E]">---------</option>
              <option value="fournisseur1" className="bg-[#0E0E0E]">Fournisseur 1</option>
              <option value="fournisseur2" className="bg-[#0E0E0E]">Fournisseur 2</option>
              <option value="vinted" className="bg-[#0E0E0E]">Vinted</option>
              <option value="leboncoin" className="bg-[#0E0E0E]">LeBonCoin</option>
              <option value="vide_grenier" className="bg-[#0E0E0E]">Vide-grenier</option>
            </select>
            <button
              type="button"
              className="px-3 py-2.5 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-all flex items-center justify-center"
              title="Ajouter un nouveau fournisseur"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notes internes */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Notes internes
          </label>
          <textarea
            name="notesInternes"
            value={formData.notesInternes}
            onChange={handleChange}
            placeholder="Notes internes (optionnel)"
            rows={4}
            className="w-full px-4 py-2.5 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all resize-none"
          />
        </div>

        {/* Footer avec boutons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#1A1A1A]">
          <Button type="button" onClick={handleClose} variant="secondary">
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
