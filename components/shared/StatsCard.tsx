import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  iconColor: 'violet' | 'blue' | 'green' | 'yellow' | 'indigo' | 'pink' | 'orange' | 'teal'
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  subtitle?: string
}

/**
 * Carte de statistique moderne avec icône colorée et indicateur de variation
 * Suit la nouvelle charte graphique Vintex
 */
export default function StatsCard({
  label,
  value,
  icon: Icon,
  iconColor,
  trend,
  subtitle
}: StatsCardProps) {
  // Configuration des couleurs par type
  const colorConfig = {
    violet: {
      bg: 'bg-violet-100',
      text: 'text-violet-600',
      iconBg: 'bg-violet-100'
    },
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      iconBg: 'bg-blue-100'
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      iconBg: 'bg-green-100'
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-600',
      iconBg: 'bg-yellow-100'
    },
    indigo: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-600',
      iconBg: 'bg-indigo-100'
    },
    pink: {
      bg: 'bg-pink-100',
      text: 'text-pink-600',
      iconBg: 'bg-pink-100'
    },
    orange: {
      bg: 'bg-orange-100',
      text: 'text-orange-600',
      iconBg: 'bg-orange-100'
    },
    teal: {
      bg: 'bg-teal-100',
      text: 'text-teal-600',
      iconBg: 'bg-teal-100'
    }
  }

  const colors = colorConfig[iconColor]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
      {/* Icône avec fond coloré */}
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${colors.iconBg} rounded-lg`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
      </div>

      {/* Label */}
      <p className="text-sm font-medium text-gray-600 mb-1">
        {label}
      </p>

      {/* Valeur principale */}
      <p className="text-2xl font-bold text-gray-900 mb-2">
        {value}
      </p>

      {/* Indicateur de variation ou sous-titre */}
      {trend ? (
        <div className="flex items-center gap-1 text-sm">
          {trend.isPositive !== false ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600" />
          )}
          <span className={`font-medium ${trend.isPositive !== false ? 'text-green-600' : 'text-red-600'}`}>
            {trend.value > 0 ? '+' : ''}{trend.value}%
          </span>
          <span className="text-gray-500">{trend.label}</span>
        </div>
      ) : subtitle ? (
        <p className="text-sm text-gray-500">
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
