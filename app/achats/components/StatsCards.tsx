import { AchatStats } from '@/types/achat'
import { DollarSign, Package, TrendingUp } from 'lucide-react'
import StatsCard from '@/components/shared/StatsCard'

interface StatsCardsProps {
  stats: AchatStats
}

/**
 * Composant affichant les 3 cartes KPI en haut de la page
 * Design harmonisé avec le Dashboard
 */
export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {/* Card 1: Argent dépensé */}
      <StatsCard
        label="Argent dépensé"
        value={`${stats.argentDepense.toLocaleString('fr-FR')} €`}
        icon={DollarSign}
        iconColor="primary"
        trend={{
          value: Math.abs(stats.evolutionDepenses),
          label: 'vs mois dernier',
          isPositive: stats.evolutionDepenses >= 0
        }}
      />

      {/* Card 2: Articles achetés */}
      <StatsCard
        label="Articles achetés"
        value={`${stats.nombreArticles} articles`}
        icon={Package}
        iconColor="primary"
        subtitle={`+${stats.nouvelleArticles} ce mois-ci`}
      />

      {/* Card 3: Marge estimée */}
      <StatsCard
        label="Marge estimée"
        value={`${stats.margeEstimee.toLocaleString('fr-FR')} €`}
        icon={TrendingUp}
        iconColor="primary"
        subtitle={`ROI: +${stats.roi}%`}
      />
    </div>
  )
}
