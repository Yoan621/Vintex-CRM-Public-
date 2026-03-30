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
  const iconStyles = {
    primary: 'bg-primary shadow-[0_4px_16px_rgba(0,60,243,0.4)]',
    secondary: 'bg-secondary shadow-[0_4px_16px_rgba(233,233,233,0.2)]',
    success: 'bg-success shadow-[0_4px_16px_rgba(0,217,142,0.4)]',
    warning: 'bg-[#FF9500] shadow-[0_4px_16px_rgba(255,149,0,0.4)]',
    info: 'bg-info shadow-[0_4px_16px_rgba(0,102,255,0.4)]'
  }

  return (
    <div className="bg-dark rounded-xl border border-[#1A1A1A] hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 p-6">
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-full flex-shrink-0 ${iconStyles[iconColor]}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-medium text-secondary/60 mb-2 tracking-tight">
            {label}
          </p>

          {/* Valeur principale — toujours neutre, seul l'indicateur de tendance est coloré */}
          <p className="text-[32px] font-bold mb-3 leading-[1.2] text-secondary">
            {value}
          </p>

          {trend ? (
            <div className="flex items-center gap-1.5 text-[13px]">
              {trend.isPositive !== false ? (
                <TrendingUp className="w-4 h-4 text-success flex-shrink-0" />
              ) : (
                <TrendingDown className="w-4 h-4 text-error flex-shrink-0" />
              )}
              <span className={`font-semibold ${trend.isPositive !== false ? 'text-success' : 'text-error'}`}>
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
