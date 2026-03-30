'use client'

export type TimePeriod = 'day' | 'week' | 'month' | 'year'

interface TimeFilterProps {
  activePeriod: TimePeriod
  onChange: (period: TimePeriod) => void
}

/**
 * Composant de filtres temporels harmonisé avec la sidebar
 */
export default function TimeFilter({ activePeriod, onChange }: TimeFilterProps) {
  const periods: { value: TimePeriod; label: string }[] = [
    { value: 'day', label: 'Jour' },
    { value: 'week', label: 'Semaine' },
    { value: 'month', label: 'Mois' },
    { value: 'year', label: 'Année' },
  ]

  return (
    <div className="inline-flex items-center bg-[#18181b] border border-[#27272a] rounded-lg p-1 gap-1 h-10">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={`
            px-3.5 py-2 rounded-[10px] text-[15px] font-medium tracking-tight transition-all duration-250 ease-out h-8 min-w-[70px]
            ${
              activePeriod === period.value
                ? 'bg-primary text-white shadow-[0_4px_16px_rgba(0,60,243,0.4)]'
                : 'bg-transparent text-secondary/60 hover:bg-primary/10 hover:text-white'
            }
          `}
        >
          {period.label}
        </button>
      ))}
    </div>
  )
}
