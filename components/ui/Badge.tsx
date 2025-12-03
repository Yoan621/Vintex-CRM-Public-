import { Plateforme, StatutAchat } from '@/types/achat'
import { Clock, Truck, CheckCircle2, Package, DollarSign } from 'lucide-react'

interface BadgeProps {
  variant: 'statut' | 'plateforme'
  value: StatutAchat | Plateforme
}

/**
 * Composant Badge avec styles et icônes appropriés
 */
export default function Badge({ variant, value }: BadgeProps) {
  if (variant === 'statut') {
    const statutConfig = {
      en_attente: {
        label: 'En attente',
        icon: Clock,
        className: 'bg-gray-100 text-gray-700'
      },
      expedie: {
        label: 'Expédié',
        icon: Truck,
        className: 'bg-blue-100 text-blue-700'
      },
      recu: {
        label: 'Reçu',
        icon: CheckCircle2,
        className: 'bg-green-100 text-green-700'
      },
      en_stock: {
        label: 'En stock',
        icon: Package,
        className: 'bg-yellow-100 text-yellow-700'
      },
      revendu: {
        label: 'Revendu',
        icon: DollarSign,
        className: 'bg-emerald-100 text-emerald-700'
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
        className: 'bg-purple-100 text-purple-700'
      },
      leboncoin: {
        label: 'LeBonCoin',
        className: 'bg-orange-100 text-orange-700'
      },
      vide_grenier: {
        label: 'Vide-grenier',
        className: 'bg-teal-100 text-teal-700'
      },
      autre: {
        label: 'Autre',
        className: 'bg-gray-100 text-gray-700'
      }
    }

    const config = plateformeConfig[value as Plateforme]

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  return null
}
