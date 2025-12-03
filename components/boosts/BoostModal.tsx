'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import type { BoostDuration } from '@/lib/types'

interface BoostModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: BoostFormData) => void
}

export interface BoostFormData {
  article: string
  prix: number
  date: string
  duree: BoostDuration
}

/**
 * Composant modale pour ajouter un nouveau boost
 */
export default function BoostModal({ isOpen, onClose, onSubmit }: BoostModalProps) {
  const [formData, setFormData] = useState<BoostFormData>({
    article: '',
    prix: 0.95,
    date: new Date().toISOString().split('T')[0],
    duree: '3j',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof BoostFormData, string>>>({})

  if (!isOpen) return null

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BoostFormData, string>> = {}

    if (!formData.article.trim()) {
      newErrors.article = 'Le nom de l\'article est requis'
    }

    if (formData.prix < 0.95) {
      newErrors.prix = 'Le prix minimum est de 0,95€'
    }

    if (!formData.date) {
      newErrors.date = 'La date est requise'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
      // Reset form
      setFormData({
        article: '',
        prix: 0.95,
        date: new Date().toISOString().split('T')[0],
        duree: '3j',
      })
      onClose()
    }
  }

  const handleClose = () => {
    setErrors({})
    setFormData({
      article: '',
      prix: 0.95,
      date: new Date().toISOString().split('T')[0],
      duree: '3j',
    })
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full transform transition-all animate-in fade-in zoom-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Nouveau boost
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4">
            <div className="space-y-4">
              {/* Article */}
              <div>
                <label
                  htmlFor="article"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Article <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="article"
                  value={formData.article}
                  onChange={(e) => setFormData({ ...formData, article: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    errors.article
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Ex: Jean Levi's 501"
                />
                {errors.article && (
                  <p className="mt-1 text-sm text-red-500">{errors.article}</p>
                )}
              </div>

              {/* Prix */}
              <div>
                <label
                  htmlFor="prix"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Prix <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="prix"
                    step="0.01"
                    min="0.95"
                    value={formData.prix}
                    onChange={(e) =>
                      setFormData({ ...formData, prix: parseFloat(e.target.value) })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.prix
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    €
                  </span>
                </div>
                {errors.prix && <p className="mt-1 text-sm text-red-500">{errors.prix}</p>}
                <p className="mt-1 text-xs text-gray-500">Prix minimum : 0,95€</p>
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    errors.date
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
              </div>

              {/* Durée */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Durée <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, duree: '3j' })}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      formData.duree === '3j'
                        ? 'border-purple-600 bg-purple-50 text-purple-600 font-medium'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-sm font-semibold">3 jours</div>
                    <div className="text-xs opacity-75">0,95€</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, duree: '7j' })}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      formData.duree === '7j'
                        ? 'border-purple-600 bg-purple-50 text-purple-600 font-medium'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-sm font-semibold">7 jours</div>
                    <div className="text-xs opacity-75">1,95€</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
