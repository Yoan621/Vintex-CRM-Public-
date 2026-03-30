'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, ShoppingBag, ShoppingCart, Zap, Package, Settings, ShieldCheck } from 'lucide-react'
import { useSidebar } from '@/contexts/SidebarContext'
import { useEffect, useState } from 'react'

interface NavItem {
  href: string
  label: string
  icon: typeof LayoutDashboard
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/achats', label: 'Mes Achats', icon: ShoppingCart },
  { href: '/ventes', label: 'Mes Ventes', icon: ShoppingBag },
  { href: '/boosts', label: 'Gestion Boosts', icon: Zap },
  { href: '/stocks', label: 'Gestion Stocks', icon: Package },
]

/**
 * Sidebar noir premium avec interactions cyan
 * Design Vintod avec hover effects et état actif
 */
export default function Sidebar() {
  const pathname = usePathname()
  const { isSidebarOpen, isCollapsed } = useSidebar()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetch('/api/admin/me')
      .then(r => r.json())
      .then(d => setIsAdmin(d.isAdmin === true))
      .catch(() => {})
  }, [])

  const isActive = (href: string) => pathname === href

  if (!isSidebarOpen || pathname === '/') return null

  return (
    <aside className={`bg-black fixed h-screen z-50 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-60'}`}>
      {/* Zone logo */}
      <div className="pt-5 pb-6 flex items-center justify-center border-b border-[#1A1A1A]">
        {isCollapsed ? (
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
            VC
          </div>
        ) : (
          <Image
            src="/logo.png"
            alt="VintedCRM Logo"
            width={180}
            height={36}
            className="object-contain"
            priority
          />
        )}
      </div>

      {/* Navigation */}
      <nav className={`pt-6 space-y-1.5 ${isCollapsed ? 'px-2' : 'px-3'}`}>
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : ''}
              className={`
                group flex items-center rounded-[10px]
                transition-all duration-250 ease-out
                ${isCollapsed ? 'justify-center px-3 py-3.5' : 'gap-4 px-5 py-3.5'}
                ${
                  active
                    ? 'bg-primary shadow-[0_4px_16px_rgba(0,60,243,0.4)]'
                    : 'hover:bg-primary/10 hover:translate-x-1'
                }
              `}
            >
              <Icon
                className={`
                  w-5 h-5 transition-all duration-250 flex-shrink-0
                  ${active ? 'text-white' : 'text-secondary/60 group-hover:scale-105 group-hover:text-white'}
                `}
                strokeWidth={2}
              />
              {!isCollapsed && (
                <span
                  className={`
                    text-[15px] font-medium tracking-tight transition-all duration-250
                    ${active ? 'text-white' : 'text-secondary/60 group-hover:text-white group-hover:translate-x-0.5'}
                  `}
                >
                  {item.label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Admin (bas de sidebar, visible uniquement si session admin active) */}
      {isAdmin && (
        <div className={`absolute bottom-[88px] left-0 right-0 ${isCollapsed ? 'px-2' : 'px-3'}`}>
          {(() => {
            const active = isActive('/admin')
            return (
              <Link
                href="/admin"
                title={isCollapsed ? 'Admin' : ''}
                className={`
                  group flex items-center rounded-[10px]
                  transition-all duration-250 ease-out
                  ${isCollapsed ? 'justify-center px-3 py-3.5' : 'gap-4 px-5 py-3.5'}
                  ${active
                    ? 'bg-primary shadow-[0_4px_16px_rgba(0,60,243,0.4)]'
                    : 'hover:bg-primary/10 hover:translate-x-1'
                  }
                `}
              >
                <ShieldCheck
                  className={`w-5 h-5 transition-all duration-250 flex-shrink-0 ${active ? 'text-white' : 'text-secondary/60 group-hover:scale-105 group-hover:text-white'}`}
                  strokeWidth={2}
                />
                {!isCollapsed && (
                  <span className={`text-[15px] font-medium tracking-tight transition-all duration-250 ${active ? 'text-white' : 'text-secondary/60 group-hover:text-white group-hover:translate-x-0.5'}`}>
                    Admin
                  </span>
                )}
              </Link>
            )
          })()}
        </div>
      )}

      {/* Paramètres (bas de sidebar) */}
      <div className={`absolute bottom-0 left-0 right-0 border-t border-[#1A1A1A] ${isCollapsed ? 'px-2 py-3' : 'px-3 py-3'}`}>
        {(() => {
          const active = isActive('/parametres')
          return (
            <Link
              href="/parametres"
              title={isCollapsed ? 'Paramètres' : ''}
              className={`
                group flex items-center rounded-[10px]
                transition-all duration-250 ease-out
                ${isCollapsed ? 'justify-center px-3 py-3.5' : 'gap-4 px-5 py-3.5'}
                ${active
                  ? 'bg-primary shadow-[0_4px_16px_rgba(0,60,243,0.4)]'
                  : 'hover:bg-primary/10 hover:translate-x-1'
                }
              `}
            >
              <Settings
                className={`w-5 h-5 transition-all duration-250 flex-shrink-0 ${active ? 'text-white' : 'text-secondary/60 group-hover:scale-105 group-hover:text-white'}`}
                strokeWidth={2}
              />
              {!isCollapsed && (
                <span className={`text-[15px] font-medium tracking-tight transition-all duration-250 ${active ? 'text-white' : 'text-secondary/60 group-hover:text-white group-hover:translate-x-0.5'}`}>
                  Paramètres
                </span>
              )}
            </Link>
          )
        })()}
        {!isCollapsed && (
          <p className="text-xs text-center text-secondary/20 mt-3">© 2025 Vintex CRM</p>
        )}
      </div>
    </aside>
  )
}
