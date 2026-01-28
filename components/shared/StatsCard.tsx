import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  iconColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'info'
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  subtitle?: string
}

/**
 * Carte de statistique premium avec la nouvelle charte graphique Vintex
 */
export default function StatsCard({
  label,
  value,
  icon: Icon,
  iconColor = 'primary',
  trend,
  subtitle
}: StatsCardProps) {
  // Configuration des couleurs selon le type d'icône
  const iconStyles = {
    primary: 'bg-[#003CF3] shadow-[0_4px_16px_rgba(0,60,243,0.4)]',
    secondary: 'bg-[#E9E9E9] shadow-[0_4px_16px_rgba(233,233,233,0.2)]',
    success: 'bg-[#00D98E] shadow-[0_4px_16px_rgba(0,217,142,0.4)]',
    warning: 'bg-[#FF9500] shadow-[0_4px_16px_rgba(255,149,0,0.4)]',
    info: 'bg-[#0066FF] shadow-[0_4px_16px_rgba(0,102,255,0.4)]'
  }

  return (
    <div className="bg-[#0E0E0E] rounded-xl border border-[#1A1A1A] hover:border-[#003CF3]/40 hover:-translate-y-0.5 transition-all duration-300 p-6">
      <div className="flex items-start gap-4">
        {/* Icône à gauche avec couleur dynamique */}
        <div className={`p-2.5 rounded-full flex-shrink-0 ${iconStyles[iconColor]}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>

        {/* Contenu à droite */}
        <div className="flex-1 min-w-0">
          {/* Label */}
          <p className="text-[15px] font-medium text-secondary/60 mb-2 tracking-tight">
            {label}
          </p>

          {/* Valeur principale avec couleur conditionnelle */}
          <p className={`text-[32px] font-bold mb-3 leading-[1.2] ${
            trend
              ? trend.isPositive !== false
                ? 'text-[#00D98E]'
                : 'text-red-500'
              : 'text-secondary'
          }`}>
            {value}
          </p>

          {/* Indicateur de variation ou sous-titre */}
          {trend ? (
            <div className="flex items-center gap-1.5 text-[13px]">
              {trend.isPositive !== false ? (
                <TrendingUp className="w-4 h-4 text-[#00D98E] flex-shrink-0" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 flex-shrink-0" />
              )}
              <span className={`font-semibold ${trend.isPositive !== false ? 'text-[#00D98E]' : 'text-red-500'}`}>
                {trend.value > 0 ? '+' : ''}{trend.value.toFixed(1)}%
              </span>
              <span className="text-secondary/40 text-[12px]">{trend.label}</span>
            </div>
          ) : subtitle ? (
            <p className="text-[11px] text-secondary/40">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
