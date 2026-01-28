'use client'

import { usePathname } from 'next/navigation'
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext'
import Sidebar from './Sidebar'

interface LayoutClientProps {
  children: React.ReactNode
}

function LayoutContent({ children }: LayoutClientProps) {
  const { isSidebarOpen } = useSidebar()
  const pathname = usePathname()
  const isLanding = pathname === '/'

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main
        className={`flex-1 bg-[#1a1f23] min-h-screen transition-all duration-300 ${
          isSidebarOpen && !isLanding ? 'ml-60' : 'ml-0'
        }`}
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
