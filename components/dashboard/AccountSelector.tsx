'use client'

import { useState, useRef, useEffect } from 'react'
import { User, ChevronDown, Search, Check } from 'lucide-react'

export type AccountOption = 'all' | string

interface AccountSelectorProps {
  selectedAccount: AccountOption
  onAccountChange: (account: AccountOption) => void
  accounts?: string[]
}

/**
 * Sélecteur de compte multi-compte avec recherche
 * Permet de filtrer les données par compte ou voir tous les comptes
 */
export default function AccountSelector({
  selectedAccount,
  onAccountChange,
  accounts = ['@vintex_shop', '@compte2', '@compte3']
}: AccountSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filtrer les comptes selon la recherche
  const filteredAccounts = accounts.filter(account =>
    account.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Toutes les options (Tous les comptes + comptes individuels)
  const allOptions = ['all', ...accounts]
  const filteredOptions = searchTerm
    ? ['all', ...filteredAccounts]
    : allOptions

  // Obtenir le label d'affichage
  const getDisplayLabel = (account: AccountOption) => {
    if (account === 'all') return 'Tous les comptes'
    return account
  }

  // Gérer la sélection d'un compte
  const handleSelect = (account: AccountOption) => {
    onAccountChange(account)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-10 px-4 bg-[#18181b] border border-[#27272a] rounded-[10px] text-white hover:bg-[#1f1f23] hover:border-[#003CF3]/40 transition-all duration-250"
      >
        <User size={16} className="text-white/70" />
        <span className="text-[14px] font-medium tracking-tight">
          {getDisplayLabel(selectedAccount)}
        </span>
        <ChevronDown
          size={16}
          className={`text-white/70 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-[#0E0E0E] border border-[#1A1A1A] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Barre de recherche (si plus de 5 comptes) */}
          {accounts.length > 5 && (
            <div className="p-3 border-b border-[#1A1A1A]">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#E9E9E9]/40" />
                <input
                  type="text"
                  placeholder="Rechercher un compte..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-9 pl-10 pr-3 bg-[#18181b] border border-[#27272a] rounded-lg text-[13px] text-white placeholder:text-[#E9E9E9]/40 focus:outline-none focus:border-[#003CF3]/40 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Liste des comptes */}
          <div className="max-h-64 overflow-y-auto py-2">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((account) => (
                <button
                  key={account}
                  onClick={() => handleSelect(account)}
                  className={`w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-[#003CF3]/10 transition-colors ${
                    selectedAccount === account ? 'bg-[#003CF3]/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <User size={16} className={account === 'all' ? 'text-[#003CF3]' : 'text-white/70'} />
                    <span className={`text-[14px] ${
                      selectedAccount === account ? 'text-[#003CF3] font-semibold' : 'text-[#E9E9E9]'
                    }`}>
                      {getDisplayLabel(account)}
                    </span>
                  </div>
                  {selectedAccount === account && (
                    <Check size={16} className="text-[#003CF3]" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-[#E9E9E9]/60 text-[13px]">
                Aucun compte trouvé
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
