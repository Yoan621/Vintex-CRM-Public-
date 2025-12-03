'use client'

import { useState, useEffect } from 'react'
import { X, Upload } from 'lucide-react'
import type { Article, ArticleEtat, ArticleStatut } from '@/lib/types'
import { calculerMarge, suggererPrixVente } from '@/lib/calculations'
import { formatCurrency } from '@/lib/utils'

interface ArticleModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ArticleFormData) => void
  article?: Article | null
}

export interface ArticleFormData {
  nom: string
  marque: string
  categorie: string
  taille: string
  couleur: string
  etat: ArticleEtat
  prixAchat: number
  prixVente: number
  statut: ArticleStatut
  description?: string
  emplacement?: string
}

/**
 * Composant modale pour ajouter ou modifier un article
 */
export default function ArticleModal({ isOpen, onClose, onSubmit, article }: ArticleModalProps) {
  const [formData, setFormData] = useState<ArticleFormData>({
    nom: '',
    marque: '',
    categorie: 'Vêtements',
    taille: '',
    couleur: '',
    etat: 'tres_bon',
    prixAchat: 0,
    prixVente: 0,
    statut: 'disponible',
    description: '',
    emplacement: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ArticleFormData, string>>>({})

  // Pré-remplir le formulaire si on modifie un article
  useEffect(() => {
    if (article) {
      setFormData({
        nom: article.nom,
        marque: article.marque,
        categorie: article.categorie,
        taille: article.taille,
        couleur: article.couleur,
        etat: article.etat,
        prixAchat: article.prixAchat,
        prixVente: article.prixVente,
        statut: article.statut,
        description: article.description || '',
        emplacement: article.emplacement || '',
      })
    }
  }, [article])

  if (!isOpen) return null

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ArticleFormData, string>> = {}

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis'
    }
    if (!formData.marque.trim()) {
      newErrors.marque = 'La marque est requise'
    }
    if (!formData.taille.trim()) {
      newErrors.taille = 'La taille est requise'
    }
    if (formData.prixAchat <= 0) {
      newErrors.prixAchat = 'Le prix d\'achat doit être supérieur à 0'
    }
    if (formData.prixVente <= 0) {
      newErrors.prixVente = 'Le prix de vente doit être supérieur à 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
      handleClose()
    }
  }

  const handleClose = () => {
    setErrors({})
    setFormData({
      nom: '',
      marque: '',
      categorie: 'Vêtements',
      taille: '',
      couleur: '',
      etat: 'tres_bon',
      prixAchat: 0,
      prixVente: 0,
      statut: 'disponible',
      description: '',
      emplacement: '',
    })
    onClose()
  }

  // Suggérer automatiquement un prix de vente
  const handlePrixAchatChange = (value: number) => {
    setFormData({ ...formData, prixAchat: value })
    // Si le prix de vente n'a pas été modifié manuellement, on suggère
    if (formData.prixVente === 0) {
      const prixSuggere = suggererPrixVente(value, formData.etat)
      setFormData({ ...formData, prixAchat: value, prixVente: prixSuggere })
    }
  }

  const marge = calculerMarge(formData.prixAchat, formData.prixVente)

  const categories = [
    'Vêtements',
    'Pantalons',
    'Hauts',
    'Robes',
    'Jupes',
    'Vestes',
    'Chaussures',
    'Accessoires',
  ]

  const couleurs = [
    'Noir',
    'Blanc',
    'Gris',
    'Bleu',
    'Rouge',
    'Vert',
    'Jaune',
    'Rose',
    'Violet',
    'Marron',
    'Beige',
    'Multicolore',
  ]

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full my-8 transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {article ? 'Modifier l\'article' : 'Ajouter un article'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Colonne gauche */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
                  Informations générales
                </h3>

                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom de l'article <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.nom ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Ex: Jean Levi's 501"
                  />
                  {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
                </div>

                {/* Marque */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Marque <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.marque}
                    onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.marque ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Ex: Levi's"
                  />
                  {errors.marque && <p className="mt-1 text-sm text-red-500">{errors.marque}</p>}
                </div>

                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={formData.categorie}
                    onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Taille et Couleur */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Taille <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.taille}
                      onChange={(e) => setFormData({ ...formData, taille: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white ${
                        errors.taille ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Ex: M, 38"
                    />
                    {errors.taille && <p className="mt-1 text-sm text-red-500">{errors.taille}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Couleur
                    </label>
                    <select
                      value={formData.couleur}
                      onChange={(e) => setFormData({ ...formData, couleur: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Sélectionner</option>
                      {couleurs.map((couleur) => (
                        <option key={couleur} value={couleur}>
                          {couleur}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* État */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    État
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'neuf', label: 'Neuf' },
                      { value: 'tres_bon', label: 'Très bon' },
                      { value: 'bon', label: 'Bon' },
                      { value: 'satisfaisant', label: 'Satisfaisant' },
                    ].map((etat) => (
                      <button
                        key={etat.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, etat: etat.value as ArticleEtat })}
                        className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
                          formData.etat === etat.value
                            ? 'border-purple-600 bg-purple-50 text-purple-600 font-medium'
                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {etat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Colonne droite */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
                  Prix et stock
                </h3>

                {/* Prix d'achat */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Prix d'achat <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.prixAchat}
                      onChange={(e) => handlePrixAchatChange(parseFloat(e.target.value) || 0)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white ${
                        errors.prixAchat ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      €
                    </span>
                  </div>
                  {errors.prixAchat && <p className="mt-1 text-sm text-red-500">{errors.prixAchat}</p>}
                </div>

                {/* Prix de vente */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Prix de vente <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.prixVente}
                      onChange={(e) =>
                        setFormData({ ...formData, prixVente: parseFloat(e.target.value) || 0 })
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white ${
                        errors.prixVente ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      €
                    </span>
                  </div>
                  {errors.prixVente && <p className="mt-1 text-sm text-red-500">{errors.prixVente}</p>}
                </div>

                {/* Calcul de marge */}
                {formData.prixAchat > 0 && formData.prixVente > 0 && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Marge brute :</span>
                      <span className="font-medium">{formatCurrency(marge.margeBrute)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Frais Vinted (5%) :</span>
                      <span className="font-medium text-red-600">
                        -{formatCurrency(marge.fraisVinted)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Frais protection :</span>
                      <span className="font-medium text-red-600">-{formatCurrency(0.70)}</span>
                    </div>
                    <div className="flex items-center justify-between text-base font-bold pt-2 border-t border-blue-200 dark:border-blue-700">
                      <span>Bénéfice net :</span>
                      <span className="text-green-600 dark:text-green-400">
                        {formatCurrency(marge.margeNette)} ({marge.pourcentage})
                      </span>
                    </div>
                  </div>
                )}

                {/* Statut */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Statut
                  </label>
                  <select
                    value={formData.statut}
                    onChange={(e) => setFormData({ ...formData, statut: e.target.value as ArticleStatut })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="en_vente">En vente</option>
                    <option value="vendu">Vendu</option>
                    <option value="reserve">Réservé</option>
                  </select>
                </div>

                {/* Emplacement */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Emplacement
                  </label>
                  <input
                    type="text"
                    value={formData.emplacement}
                    onChange={(e) => setFormData({ ...formData, emplacement: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Ex: Étagère A"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Description optionnelle..."
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {article ? 'Mettre à jour' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
