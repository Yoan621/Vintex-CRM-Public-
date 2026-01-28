'use client'

import { useState, useRef, useEffect } from 'react'
import { MoreVertical, Edit, FileText, Trash2 } from 'lucide-react'

interface ActionMenuProps {
  onEdit: () => void
  onViewInvoice: () => void
  onDelete: () => void
}

/**
 * Menu kebab (⋮) avec actions pour chaque achat
 * Design harmonisé avec le Dashboard (fond sombre)
 */
export default function ActionMenu({ onEdit, onViewInvoice, onDelete }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleAction = (action: () => void) => {
    action()
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
        aria-label="Actions"
        aria-expanded={isOpen}
      >
        <MoreVertical className="w-5 h-5 text-secondary/60" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#0E0E0E] rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.4)] border border-[#1A1A1A] py-1 z-10 animate-in fade-in zoom-in duration-150">
          <button
            onClick={() => handleAction(onEdit)}
            className="w-full px-4 py-2 text-left text-sm text-secondary hover:bg-[#1A1A1A] flex items-center gap-2 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Modifier
          </button>

          <button
            onClick={() => handleAction(onViewInvoice)}
            className="w-full px-4 py-2 text-left text-sm text-secondary hover:bg-[#1A1A1A] flex items-center gap-2 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Voir facture
          </button>

          <div className="border-t border-[#1A1A1A] my-1" />

          <button
            onClick={() => handleAction(onDelete)}
            className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </button>
        </div>
      )}
    </div>
  )
}
