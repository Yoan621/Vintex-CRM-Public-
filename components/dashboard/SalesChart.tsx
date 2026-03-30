'use client'

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
import type { ChartData } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

interface SalesChartProps {
  data: ChartData[]
}

/**
 * Composant de graphique des ventes
 */
export default function SalesChart({ data }: SalesChartProps) {

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark border border-primary/40 p-4 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-secondary mb-2">
            {payload[0].payload.date}
          </p>
          <div className="space-y-1">
            <p className="text-sm text-primary">
              CA: {formatCurrency(payload[0].value)}
            </p>
            <p className="text-sm text-success">
              Bénéfice: {formatCurrency(payload[1].value)}
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-[#0E0E0E] rounded-xl border border-[#1A1A1A] p-7">
      {/* En-tête */}
      <div className="mb-5">
        <h2 className="text-[18px] font-semibold text-secondary tracking-tight">
          Évolution du chiffre d&apos;affaires
        </h2>
      </div>

      {/* Graphique */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="0" stroke="#1A1A1A" />
            <XAxis
              dataKey="date"
              stroke="#1A1A1A"
              tick={{ fill: '#E9E9E9', fontSize: 12 }}
            />
            <YAxis
              stroke="#1A1A1A"
              tick={{ fill: '#E9E9E9', fontSize: 12 }}
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
              stroke="#003CF3"
              strokeWidth={3}
              name="Chiffre d'affaires"
              dot={{ fill: '#003CF3', r: 6 }}
              activeDot={{ r: 8, fill: '#003CF3' }}
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#00D98E"
              strokeWidth={3}
              name="Bénéfices"
              dot={{ fill: '#00D98E', r: 6 }}
              activeDot={{ r: 8, fill: '#00D98E' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
