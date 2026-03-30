'use client'

import { Menu, RefreshCw, Crown } from 'lucide-react'
import { useState, useEffect } from 'react'
import TimeFilter, { TimePeriod } from '@/components/shared/TimeFilter'
import AccountSelector, { AccountOption } from './AccountSelector'
import { useSidebar } from '@/contexts/SidebarContext'

interface DashboardHeaderProps {
  title?: string
  timePeriod: TimePeriod
  onTimePeriodChange: (period: TimePeriod) => void
  selectedAccount?: AccountOption
  onAccountChange?: (account: AccountOption) => void
  accounts?: string[]
}

/**
 * Header du dashboard avec fil d'Ariane, filtres temporels, sélecteur de compte et boutons d'action
 * Design moderne avec breadcrumb, filtres stylisés et CTA Pro
 */
export default function DashboardHeader({
  title = 'Dashboard',
  timePeriod,
  onTimePeriodChange,
  selectedAccount = 'all',
  onAccountChange = () => {},
  accounts
}: DashboardHeaderProps) {
  const { toggleCollapse } = useSidebar()
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'done' | 'error'>('idle')
  const [syncMessage, setSyncMessage] = useState('')

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (!event.data || event.data.type !== 'VINTEX_SYNC_STATUS') return
      const { status, ventesCount, achatsCount, created, updated, message } = event.data
      if (status === 'started') {
        setSyncStatus('syncing')
        setSyncMessage('Scraping en cours...')
      } else if (status === 'complete') {
        setSyncStatus('done')
        setSyncMessage(`✅ +${created ?? 0} créé(s) — ${ventesCount ?? 0} ventes / ${achatsCount ?? 0} achats`)
        setTimeout(() => { setSyncStatus('idle'); setSyncMessage('') }, 4000)
        window.location.reload()
      } else if (status === 'error') {
        setSyncStatus('error')
        setSyncMessage(`❌ ${message}`)
        setTimeout(() => { setSyncStatus('idle'); setSyncMessage('') }, 5000)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  function triggerSync() {
    if (syncStatus === 'syncing') return
    window.postMessage({ type: 'VINTEX_TRIGGER_SYNC' }, '*')
  }

  return (
    <div className="bg-dark border-b border-[#1A1A1A] sticky top-0 z-40">
      <div className="flex justify-between items-center px-8 h-[60px]">
        {/* Partie gauche : Menu + Breadcrumb */}
        <div className="flex items-center gap-4">
          {/* Icône menu hamburger - Toggle collapse sidebar */}
          <button
            onClick={toggleCollapse}
            className="w-9 h-9 bg-[#18181b] border border-transparent rounded-[10px] flex items-center justify-center text-white hover:bg-[#003CF3] hover:shadow-[0_4px_16px_rgba(0,60,243,0.4)] hover:scale-105 transition-all duration-250"
            title="Réduire/Étendre la barre latérale"
          >
            <Menu size={18} />
          </button>

          {/* Fil d'Ariane */}
          <nav className="flex items-center gap-3">
            <span className="font-heading text-[15px] font-semibold tracking-tight text-white px-1 py-2">
              {title}
            </span>
          </nav>
        </div>

        {/* Partie droite : Filtres + Boutons */}
        <div className="flex items-center gap-3">
          {/* Filtres temporels */}
          <TimeFilter activePeriod={timePeriod} onChange={onTimePeriodChange} />

          {/* Sélecteur de compte */}
          <AccountSelector
            selectedAccount={selectedAccount}
            onAccountChange={onAccountChange}
            accounts={accounts}
          />

          {/* Bouton Refresh + feedback sync */}
          <div className="flex items-center gap-2">
            {syncMessage && (
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${syncStatus === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-[#003CF3]/20 text-blue-300'}`}>
                {syncMessage}
              </span>
            )}
            <button
              onClick={triggerSync}
              disabled={syncStatus === 'syncing'}
              className="w-10 h-10 bg-[#18181b] border border-[#27272a] rounded-[10px] flex items-center justify-center text-white/70 hover:bg-[#003CF3] hover:shadow-[0_4px_16px_rgba(0,60,243,0.4)] hover:text-white hover:rotate-180 hover:scale-105 transition-all duration-400 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Scraper Vinted et synchroniser le CRM"
            >
              <RefreshCw size={18} className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Bouton Passer à Pro */}
          <button className="flex items-center gap-2 bg-gradient-to-r from-[#003CF3] to-[#0052CC] text-white px-5 py-2.5 rounded-[10px] font-semibold text-[14px] tracking-tight h-10 shadow-[0_4px_16px_rgba(0,102,255,0.4)] hover:translate-y-[-1px] hover:shadow-[0_4px_20px_rgba(0,102,255,0.5)] hover:scale-105 transition-all duration-250">
            <Crown size={16} />
            <span>Passer à Pro</span>
          </button>
        </div>
      </div>
    </div>
  )
}
