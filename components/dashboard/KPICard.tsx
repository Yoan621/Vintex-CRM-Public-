'use client'

import { ArrowUp, ArrowDown, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { KPI } from '@/lib/types'

interface KPICardProps {
  kpi: KPI
  index: number
}

/**
 * Composant de carte KPI avec icône, valeur et pourcentage de variation
 */
export default function KPICard({ kpi, index }: KPICardProps) {
  // Sélection de l'icône en fonction de l'index
  const getIcon = () => {
    const iconClass = 'w-6 h-6'
    switch (index) {
      case 0:
        return <DollarSign className={iconClass} />
      case 1:
        return <TrendingUp className={iconClass} />
      case 2:
        return <ShoppingCart className={iconClass} />
      default:
        return <DollarSign className={iconClass} />
    }
  }

  // Formatage de la valeur selon le type
  const formatValue = (value: number) => {
    if (index === 2) {
      // Pour le nombre de commandes, pas de formatage monétaire
      return value.toString()
    }
    return formatCurrency(value)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* En-tête avec icône et label */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
            {getIcon()}
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {kpi.label}
          </h3>
        </div>
      </div>

      {/* Valeur principale */}
      <div className="mb-3">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {formatValue(kpi.value)}
        </p>
      </div>

      {/* Variation en pourcentage */}
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-medium ${
            kpi.isPositive
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
          }`}
        >
          {kpi.isPositive ? (
            <ArrowUp className="w-4 h-4" />
          ) : (
            <ArrowDown className="w-4 h-4" />
          )}
          <span>{Math.abs(kpi.percentageChange).toFixed(1)}%</span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          vs mois précédent
        </span>
      </div>
    </div>
  )
}
