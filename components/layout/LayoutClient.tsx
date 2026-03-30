'use client'

import { usePathname } from 'next/navigation'
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext'
import Sidebar from './Sidebar'

interface LayoutClientProps {
  children: React.ReactNode
}

function LayoutContent({ children }: LayoutClientProps) {
  const { isSidebarOpen, isCollapsed } = useSidebar()
  const pathname = usePathname()
  const isLanding = pathname === '/'

  // Calculer la marge gauche en fonction de l'état de la sidebar
  const getMarginLeft = () => {
    if (!isSidebarOpen || isLanding) return 'ml-0'
    return isCollapsed ? 'ml-20' : 'ml-60'
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main
        className={`bg-background min-h-screen transition-all duration-300 ${getMarginLeft()}`}
      >
        {children}
      </main>
    </div>
  )
}

/**
 * Composant client pour gérer l'état de la sidebar
 * Permet de masquer/afficher la barre latérale via le contexte
 */
export default function LayoutClient({ children }: LayoutClientProps) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  )
}
