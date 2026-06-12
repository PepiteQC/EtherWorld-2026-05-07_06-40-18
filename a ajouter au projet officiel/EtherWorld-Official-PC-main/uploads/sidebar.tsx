'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import type { Profile } from '@/lib/types/database'

interface SidebarProps {
  profile: Profile | null
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'HOME', icon: '&#127968;' },
  { href: '/dashboard/rooms', label: 'ROOMS', icon: '&#128204;' },
  { href: '/dashboard/shop', label: 'SHOP', icon: '&#128722;' },
  { href: '/dashboard/inventory', label: 'INVENTORY', icon: '&#127873;' },
  { href: '/avatar', label: 'AVATAR', icon: '&#128100;' },
  { href: '/play', label: 'PLAY', icon: '&#127918;' },
]

const ADMIN_ITEMS = [
  { href: '/admin', label: 'ADMIN', icon: '&#9881;' },
]

export function DashboardSidebar({ profile }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-col border-r-4 border-border bg-sidebar md:flex">
      {/* Logo */}
      <div className="p-4">
        <Link href="/dashboard">
          <h1 className="neon-glow font-[family-name:var(--font-pixel)] text-xl text-primary">
            ETHERWORLD
          </h1>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`pixel-button flex items-center gap-3 px-4 py-3 font-mono text-sm transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <span dangerouslySetInnerHTML={{ __html: item.icon }} />
                <span>{item.label}</span>
              </motion.div>
            </Link>
          )
        })}

        {/* Admin Section */}
        {profile?.is_admin && (
          <>
            <div className="my-4 border-t-2 border-border" />
            {ADMIN_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`pixel-button flex items-center gap-3 px-4 py-3 font-mono text-sm transition-all ${
                      isActive
                        ? 'bg-destructive text-destructive-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-destructive/50 hover:text-foreground'
                    }`}
                  >
                    <span dangerouslySetInnerHTML={{ __html: item.icon }} />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* Version */}
      <div className="p-4 font-mono text-xs text-muted-foreground">
        v0.1.0 ALPHA
      </div>
    </aside>
  )
}
