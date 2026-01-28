'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, ShoppingBag, ShoppingCart, Zap, Package } from 'lucide-react'
import { useSidebar } from '@/contexts/SidebarContext'

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
  const { isSidebarOpen } = useSidebar()

  const isActive = (href: string) => pathname === href

  if (!isSidebarOpen || pathname === '/') return null

  return (
    <aside className="w-60 bg-black fixed h-screen transition-transform duration-300">
      {/* Zone logo */}
      <div className="pt-5 pb-6 flex items-center justify-center border-b border-[#1A1A1A]">
        <Image
          src="/logo.png"
          alt="VintedCRM Logo"
          width={180}
          height={36}
          className="object-contain"
          priority
        />
      </div>

      {/* Navigation */}
      <nav className="px-3 pt-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group flex items-center gap-4 px-5 py-3.5 rounded-[10px]
                transition-all duration-250 ease-out
                ${
                  active
                    ? 'bg-primary shadow-[0_4px_16px_rgba(0,60,243,0.4)]'
                    : 'hover:bg-primary/10 hover:translate-x-1'
                }
              `}
            >
              <Icon
                className={`
                  w-5 h-5 transition-all duration-250
                  ${active ? 'text-white' : 'text-secondary/60 group-hover:scale-105 group-hover:text-white'}
                `}
                strokeWidth={2}
              />
              <span
                className={`
                  text-[15px] font-medium tracking-tight transition-all duration-250
                  ${active ? 'text-white' : 'text-secondary/60 group-hover:text-white group-hover:translate-x-0.5'}
                `}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-xs text-grayDark text-center">
          © 2025 Vintex CRM
        </p>
      </div>
    </aside>
  )
}
