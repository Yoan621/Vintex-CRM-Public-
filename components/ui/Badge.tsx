import { Plateforme, StatutAchat } from '@/types/achat'
import { Clock, Truck, CheckCircle2, Package, DollarSign, RotateCcw, AlertTriangle } from 'lucide-react'

interface BadgeProps {
  variant: 'statut' | 'plateforme'
  value: StatutAchat | Plateforme
}

/**
 * Composant Badge avec styles et icônes appropriés
 * Design harmonisé avec le Dashboard (fond sombre)
 */
export default function Badge({ variant, value }: BadgeProps) {
  if (variant === 'statut') {
    const statutConfig = {
      en_attente: {
        label: 'En attente',
        icon: Clock,
        className: 'bg-info/10 text-info border border-info/20'
      },
      expedie: {
        label: 'Expédié',
        icon: Truck,
        className: 'bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20'
      },
      recu: {
        label: 'Reçu',
        icon: CheckCircle2,
        className: 'bg-success/10 text-success border border-success/20'
      },
      en_stock: {
        label: 'En stock',
        icon: Package,
        className: 'bg-secondary/10 text-secondary border border-secondary/20'
      },
      revendu: {
        label: 'Revendu',
        icon: DollarSign,
        className: 'bg-success/10 text-success border border-success/20'
      },
      retourne: {
        label: 'Retourné',
        icon: RotateCcw,
        className: 'bg-[#FF9500]/10 text-[#FF9500] border border-[#FF9500]/20'
      },
      litige: {
        label: 'Litige',
        icon: AlertTriangle,
        className: 'bg-red-500/10 text-red-500 border border-red-500/20'
      }
    }

    const config = statutConfig[value as StatutAchat]
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    )
  }

  if (variant === 'plateforme') {
    const plateformeConfig = {
      vinted: {
        label: 'Vinted',
        className: 'bg-primary/10 text-primary border border-primary/20'
      },
      leboncoin: {
        label: 'LeBonCoin',
        className: 'bg-[#FF9500]/10 text-[#FF9500] border border-[#FF9500]/20'
      },
      vide_grenier: {
        label: 'Vide-grenier',
        className: 'bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20'
      },
      autre: {
        label: 'Autre',
        className: 'bg-secondary/10 text-secondary border border-secondary/20'
      }
    }

    const config = plateformeConfig[value as Plateforme]

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  return null
}
