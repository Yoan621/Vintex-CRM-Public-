'use client'

import { Edit, Trash2, Eye, Heart, Clock } from 'lucide-react'
import Image from 'next/image'
import type { Article } from '@/lib/types'
import {
  calculerMarge,
  getArticleStatutColor,
  getArticleStatutLabel,
  isStockDormant,
} from '@/lib/calculations'
import { formatCurrency } from '@/lib/utils'

interface ArticleCardProps {
  article: Article
  onEdit?: (article: Article) => void
  onDelete?: (articleId: string) => void
}

/**
 * Composant carte article pour la vue grille
 */
export default function ArticleCard({ article, onEdit, onDelete }: ArticleCardProps) {
  const marge = calculerMarge(article.prixAchat, article.prixVente)
  const isDormant = isStockDormant(article)
  const margePercent = parseFloat(marge.pourcentage)
  const margeColor = margePercent > 100 ? 'text-green-600' : margePercent > 50 ? 'text-blue-600' : 'text-gray-600'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden group">
      {/* Photo */}
      <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {article.photo ? (
          <Image
            src={article.photo}
            alt={article.nom}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg
                className="w-16 h-16 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xs">Pas de photo</p>
            </div>
          </div>
        )}

        {/* Badges en overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {isDormant && (
            <span className="px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded-md flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Stock dormant
            </span>
          )}
        </div>

        {/* Stats en overlay si en vente */}
        {article.statut === 'en_vente' && (article.nombreVues || article.nombreFavoris) && (
          <div className="absolute bottom-2 right-2 flex gap-2">
            {article.nombreVues && (
              <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-md flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {article.nombreVues}
              </span>
            )}
            {article.nombreFavoris && (
              <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-md flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {article.nombreFavoris}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Nom et marque */}
        <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
          {article.nom}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {article.marque} • Taille {article.taille}
        </p>

        {/* Prix */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Acheté :</span>
            <span className="font-medium">{formatCurrency(article.prixAchat)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Vente :</span>
            <span className="font-medium">{formatCurrency(article.prixVente)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Marge :</span>
            <span className={`font-bold ${margeColor}`}>
              {formatCurrency(marge.margeNette)} ({marge.pourcentage})
            </span>
          </div>
        </div>

        {/* Statut */}
        <div className="mb-3">
          <span
            className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getArticleStatutColor(
              article.statut
            )}`}
          >
            {getArticleStatutLabel(article.statut)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => onEdit?.(article)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-violet-50 hover:text-violet-600 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Modifier
          </button>
          <button
            onClick={() => onDelete?.(article.id)}
            className="p-2 text-gray-700 bg-gray-50 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
