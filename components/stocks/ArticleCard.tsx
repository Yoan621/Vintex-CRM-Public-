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
  const margeColor = margePercent > 100 ? 'text-success' : margePercent > 50 ? 'text-primary' : 'text-foreground/40'

  return (
    <div className="bg-[#0E0E0E] rounded-xl border border-[#1A1A1A] hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group">
      {/* Photo */}
      <div className="relative aspect-[4/3] bg-[#18181b] overflow-hidden">
        {article.photo ? (
          <Image
            src={article.photo}
            alt={article.nom}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-foreground/20">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-[11px]">Pas de photo</p>
            </div>
          </div>
        )}

        {/* Badge stock dormant */}
        {isDormant && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 bg-[#FF9500] text-white text-[11px] font-semibold rounded-md flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Stock dormant
            </span>
          </div>
        )}

        {/* Stats vues/favoris */}
        {article.statut === 'en_vente' && (article.nombreVues || article.nombreFavoris) && (
          <div className="absolute bottom-2 right-2 flex gap-1.5">
            {article.nombreVues && (
              <span className="px-2 py-1 bg-black/70 text-white text-[11px] rounded-md flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {article.nombreVues}
              </span>
            )}
            {article.nombreFavoris && (
              <span className="px-2 py-1 bg-black/70 text-white text-[11px] rounded-md flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {article.nombreFavoris}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className="font-semibold text-[14px] text-foreground mb-0.5 line-clamp-1">
          {article.nom}
        </h3>
        <p className="text-[12px] text-foreground/40 mb-3">
          {article.marque} · Taille {article.taille}
        </p>

        {/* Prix */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-foreground/40">Acheté :</span>
            <span className="font-medium text-foreground">{formatCurrency(article.prixAchat)}</span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-foreground/40">Vente :</span>
            <span className="font-medium text-foreground">{formatCurrency(article.prixVente)}</span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-foreground/40">Marge :</span>
            <span className={`font-bold ${margeColor}`}>
              {formatCurrency(marge.margeNette)} ({marge.pourcentage})
            </span>
          </div>
        </div>

        {/* Statut */}
        <div className="mb-3">
          <span className={`px-2.5 py-1 inline-flex text-[11px] font-semibold rounded-full border ${getArticleStatutColor(article.statut)}`}>
            {getArticleStatutLabel(article.statut)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-[#1A1A1A]">
          <button
            onClick={() => onEdit?.(article)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[13px] text-foreground/50 bg-[#18181b] rounded-[8px] hover:bg-primary hover:text-white hover:shadow-[0_4px_12px_rgba(0,60,243,0.3)] transition-all duration-200"
          >
            <Edit className="w-3.5 h-3.5" />
            Modifier
          </button>
          <button
            onClick={() => onDelete?.(article.id)}
            className="p-2 text-foreground/40 bg-[#18181b] rounded-[8px] hover:bg-red-500/15 hover:text-red-400 transition-all duration-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
