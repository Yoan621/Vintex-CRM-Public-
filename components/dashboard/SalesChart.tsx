'use client'

import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { ChartPeriod, ChartData } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

interface SalesChartProps {
  data: ChartData[]
}

/**
 * Composant de graphique des ventes avec filtres de période
 */
export default function SalesChart({ data }: SalesChartProps) {
  const [period, setPeriod] = useState<ChartPeriod>('month')

  const periods: { value: ChartPeriod; label: string }[] = [
    { value: 'day', label: 'Jour' },
    { value: 'week', label: 'Semaine' },
    { value: 'month', label: 'Mois' },
    { value: 'year', label: 'Année' },
  ]

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900 mb-2">
            {payload[0].payload.date}
          </p>
          <div className="space-y-1">
            <p className="text-sm text-violet-600">
              CA: {formatCurrency(payload[0].value)}
            </p>
            <p className="text-sm text-green-600">
              Bénéfice: {formatCurrency(payload[1].value)}
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* En-tête avec filtres */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Évolution du chiffre d&apos;affaires
        </h2>

        {/* Filtres de période */}
        <div className="flex gap-2">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === p.value
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Graphique */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis
              dataKey="date"
              className="text-xs text-gray-600 dark:text-gray-400"
              stroke="currentColor"
            />
            <YAxis
              className="text-xs text-gray-600 dark:text-gray-400"
              stroke="currentColor"
              tickFormatter={(value) => `${value}€`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
              }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#9333ea"
              strokeWidth={2}
              name="Chiffre d'affaires"
              dot={{ fill: '#9333ea', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#10B981"
              strokeWidth={2}
              name="Bénéfices"
              dot={{ fill: '#10B981', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
