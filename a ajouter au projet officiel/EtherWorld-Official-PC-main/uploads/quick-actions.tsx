'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const ACTIONS = [
  { href: '/play', label: 'PLAY NOW', icon: '&#127918;', color: 'bg-primary' },
  { href: '/avatar', label: 'EDIT AVATAR', icon: '&#128100;', color: 'bg-secondary' },
  { href: '/dashboard/rooms/create', label: 'CREATE ROOM', icon: '&#10133;', color: 'bg-accent' },
  { href: '/dashboard/shop', label: 'SHOP', icon: '&#128722;', color: 'bg-muted' },
]

export function QuickActions() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {ACTIONS.map((action, i) => (
        <motion.div
          key={action.href}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Link href={action.href}>
            <div className={`pixel-button ${action.color} p-4 text-center transition-all hover:brightness-110`}>
              <div className="mb-2 text-3xl" dangerouslySetInnerHTML={{ __html: action.icon }} />
              <p className="font-[family-name:var(--font-pixel)] text-xs text-foreground">
                {action.label}
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
