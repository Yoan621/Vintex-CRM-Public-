'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
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

const inputClass = "w-full px-4 py-2.5 bg-[#18181b] border border-[#27272a] rounded-[10px] text-[14px] text-foreground placeholder-foreground/25 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,60,243,0.15)] transition-all duration-200"
const inputErrorClass = "w-full px-4 py-2.5 bg-[#18181b] border border-error rounded-[10px] text-[14px] text-foreground placeholder-foreground/25 focus:outline-none focus:border-error focus:shadow-[0_0_0_3px_rgba(255,0,0,0.1)] transition-all duration-200"
const labelClass = "block text-[11px] font-medium text-foreground/40 uppercase tracking-wider mb-1.5"
const selectClass = "w-full px-4 py-2.5 bg-[#18181b] border border-[#27272a] rounded-[10px] text-[14px] text-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,60,243,0.15)] transition-all duration-200 appearance-none cursor-pointer"

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
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis'
    if (!formData.marque.trim()) newErrors.marque = 'La marque est requise'
    if (!formData.taille.trim()) newErrors.taille = 'La taille est requise'
    if (formData.prixAchat <= 0) newErrors.prixAchat = "Le prix d'achat doit être supérieur à 0"
    if (formData.prixVente <= 0) newErrors.prixVente = 'Le prix de vente doit être supérieur à 0'
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

  const handlePrixAchatChange = (value: number) => {
    if (formData.prixVente === 0) {
      const prixSuggere = suggererPrixVente(value, formData.etat)
      setFormData({ ...formData, prixAchat: value, prixVente: prixSuggere })
    } else {
      setFormData({ ...formData, prixAchat: value })
    }
  }

  const marge = calculerMarge(formData.prixAchat, formData.prixVente)

  const categories = ['Vêtements', 'Pantalons', 'Hauts', 'Robes', 'Jupes', 'Vestes', 'Chaussures', 'Accessoires']
  const couleurs = ['Noir', 'Blanc', 'Gris', 'Bleu', 'Rouge', 'Vert', 'Jaune', 'Rose', 'Violet', 'Marron', 'Beige', 'Multicolore']

  const etats: { value: ArticleEtat; label: string }[] = [
    { value: 'neuf', label: 'Neuf' },
    { value: 'tres_bon', label: 'Très bon' },
    { value: 'bon', label: 'Bon' },
    { value: 'satisfaisant', label: 'Satisfaisant' },
  ]

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="bg-[#0E0E0E] border border-[#1A1A1A] rounded-xl shadow-[0_24px_64px_rgba(0,0,0,0.6)] max-w-4xl w-full my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A]">
            <h2 className="font-heading text-[18px] font-semibold text-foreground tracking-tight">
              {article ? "Modifier l'article" : 'Ajouter un article'}
            </h2>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-[#27272a] rounded-[8px] transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Colonne gauche */}
              <div className="space-y-4">
                <p className="text-[11px] font-medium text-foreground/30 uppercase tracking-widest mb-2">
                  Informations générales
                </p>

                {/* Nom */}
                <div>
                  <label className={labelClass}>
                    Nom de l'article <span className="text-error normal-case">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className={errors.nom ? inputErrorClass : inputClass}
                    placeholder="Ex: Jean Levi's 501"
                  />
                  {errors.nom && <p className="mt-1 text-[12px] text-error">{errors.nom}</p>}
                </div>

                {/* Marque */}
                <div>
                  <label className={labelClass}>
                    Marque <span className="text-error normal-case">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.marque}
                    onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
                    className={errors.marque ? inputErrorClass : inputClass}
                    placeholder="Ex: Levi's"
                  />
                  {errors.marque && <p className="mt-1 text-[12px] text-error">{errors.marque}</p>}
                </div>

                {/* Catégorie */}
                <div>
                  <label className={labelClass}>Catégorie</label>
                  <select
                    value={formData.categorie}
                    onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                    className={selectClass}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Taille + Couleur */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>
                      Taille <span className="text-error normal-case">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.taille}
                      onChange={(e) => setFormData({ ...formData, taille: e.target.value })}
                      className={errors.taille ? inputErrorClass : inputClass}
                      placeholder="Ex: M, 38"
                    />
                    {errors.taille && <p className="mt-1 text-[12px] text-error">{errors.taille}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Couleur</label>
                    <select
                      value={formData.couleur}
                      onChange={(e) => setFormData({ ...formData, couleur: e.target.value })}
                      className={selectClass}
                    >
                      <option value="">Sélectionner</option>
                      {couleurs.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* État */}
                <div>
                  <label className={labelClass}>État</label>
                  <div className="grid grid-cols-2 gap-2">
                    {etats.map((etat) => (
                      <button
                        key={etat.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, etat: etat.value })}
                        className={`px-3 py-2 text-[13px] rounded-[10px] border-2 font-medium transition-all duration-200 ${
                          formData.etat === etat.value
                            ? 'border-primary bg-primary/15 text-primary shadow-[0_0_0_0px_rgba(0,60,243,0.2)]'
                            : 'border-[#27272a] text-foreground/50 hover:border-primary/40 hover:text-foreground'
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
                <p className="text-[11px] font-medium text-foreground/30 uppercase tracking-widest mb-2">
                  Prix et stock
                </p>

                {/* Prix d'achat */}
                <div>
                  <label className={labelClass}>
                    Prix d'achat <span className="text-error normal-case">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.prixAchat || ''}
                      onChange={(e) => handlePrixAchatChange(parseFloat(e.target.value) || 0)}
                      className={`${errors.prixAchat ? inputErrorClass : inputClass} pr-8`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-foreground/40">€</span>
                  </div>
                  {errors.prixAchat && <p className="mt-1 text-[12px] text-error">{errors.prixAchat}</p>}
                </div>

                {/* Prix de vente */}
                <div>
                  <label className={labelClass}>
                    Prix de vente <span className="text-error normal-case">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.prixVente || ''}
                      onChange={(e) => setFormData({ ...formData, prixVente: parseFloat(e.target.value) || 0 })}
                      className={`${errors.prixVente ? inputErrorClass : inputClass} pr-8`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-foreground/40">€</span>
                  </div>
                  {errors.prixVente && <p className="mt-1 text-[12px] text-error">{errors.prixVente}</p>}
                </div>

                {/* Calcul de marge */}
                {formData.prixAchat > 0 && formData.prixVente > 0 && (
                  <div className="p-4 bg-primary/5 border border-primary/15 rounded-[10px] space-y-2">
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-foreground/50">Marge brute :</span>
                      <span className="font-medium text-foreground">{formatCurrency(marge.margeBrute)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-foreground/50">Frais Vinted (5%) :</span>
                      <span className="font-medium text-error">-{formatCurrency(marge.fraisVinted)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-foreground/50">Frais protection :</span>
                      <span className="font-medium text-error">-{formatCurrency(0.70)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[14px] font-bold pt-2 border-t border-primary/20">
                      <span className="text-foreground">Bénéfice net :</span>
                      <span className="text-success">
                        {formatCurrency(marge.margeNette)} ({marge.pourcentage})
                      </span>
                    </div>
                  </div>
                )}

                {/* Statut */}
                <div>
                  <label className={labelClass}>Statut</label>
                  <select
                    value={formData.statut}
                    onChange={(e) => setFormData({ ...formData, statut: e.target.value as ArticleStatut })}
                    className={selectClass}
                  >
                    <option value="disponible">Disponible</option>
                    <option value="en_vente">En vente</option>
                    <option value="vendu">Vendu</option>
                    <option value="reserve">Réservé</option>
                  </select>
                </div>

                {/* Emplacement */}
                <div>
                  <label className={labelClass}>Emplacement</label>
                  <input
                    type="text"
                    value={formData.emplacement}
                    onChange={(e) => setFormData({ ...formData, emplacement: e.target.value })}
                    className={inputClass}
                    placeholder="Ex: Étagère A"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className={`${inputClass} resize-none`}
                    placeholder="Description optionnelle..."
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-[#1A1A1A]">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 bg-[#18181b] border border-[#27272a] text-foreground/60 hover:text-foreground rounded-[10px] text-[14px] font-medium transition-all duration-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary text-white rounded-[10px] text-[14px] font-semibold shadow-[0_4px_16px_rgba(0,60,243,0.4)] hover:translate-y-[-1px] hover:shadow-[0_4px_20px_rgba(0,60,243,0.5)] transition-all duration-250"
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
