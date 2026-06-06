'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  BookOpen,
  BarChart3,
  Wind,
  MessageCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/journal', label: 'Likho', icon: BookOpen },
  { href: '/insights', label: 'Report', icon: BarChart3 },
  { href: '/breathe', label: 'Saans', icon: Wind },
  { href: '/rancho', label: 'Rancho', icon: MessageCircle },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-full border border-white/70 bg-white/90 px-2 py-2 shadow-lg backdrop-blur-md">
      <ul className="flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 rounded-full px-3 py-2 text-[10px] font-medium transition-colors',
                  isActive
                    ? 'bg-brand-purple text-white'
                    : 'text-brand-text/60 hover:text-brand-purple',
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
