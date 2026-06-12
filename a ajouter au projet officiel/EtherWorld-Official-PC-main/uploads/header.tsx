'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Profile, Avatar } from '@/lib/types/database'
import { useState } from 'react'

interface HeaderProps {
  profile: Profile | null
  avatar: Avatar | null
}

export function DashboardHeader({ profile, avatar }: HeaderProps) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b-4 border-border bg-card/95 px-4 py-3 backdrop-blur">
      {/* Mobile Logo */}
      <Link href="/dashboard" className="md:hidden">
        <h1 className="neon-glow font-[family-name:var(--font-pixel)] text-lg text-primary">
          ETHERWORLD
        </h1>
      </Link>

      {/* Welcome Message */}
      <div className="hidden md:block">
        <p className="font-mono text-sm text-muted-foreground">
          Welcome back, <span className="text-secondary">{profile?.username || 'Player'}</span>
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Currency Display */}
        <div className="flex items-center gap-4">
          {/* Diamonds */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="pixel-border flex items-center gap-2 bg-muted px-3 py-2"
          >
            <span className="text-lg">&#128142;</span>
            <span className="font-mono text-sm text-cyan-400">
              {profile?.diamonds?.toLocaleString() || 0}
            </span>
          </motion.div>

          {/* Credits */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="pixel-border flex items-center gap-2 bg-muted px-3 py-2"
          >
            <span className="text-lg">&#128176;</span>
            <span className="font-mono text-sm text-accent">
              {profile?.credits?.toLocaleString() || 0}
            </span>
          </motion.div>
        </div>

        {/* Avatar & Menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowMenu(!showMenu)}
            className="pixel-border flex items-center gap-2 bg-muted p-2"
          >
            <div 
              className="flex h-8 w-8 items-center justify-center text-2xl"
              style={{ backgroundColor: avatar?.skin_color || '#f5d0c5' }}
            >
              <span>&#128100;</span>
            </div>
          </motion.button>

          {/* Dropdown Menu */}
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pixel-window absolute right-0 top-full mt-2 w-48 p-2"
            >
              <Link
                href="/avatar"
                className="block px-4 py-2 font-mono text-sm text-foreground hover:bg-muted"
                onClick={() => setShowMenu(false)}
              >
                Edit Avatar
              </Link>
              <Link
                href="/dashboard/settings"
                className="block px-4 py-2 font-mono text-sm text-foreground hover:bg-muted"
                onClick={() => setShowMenu(false)}
              >
                Settings
              </Link>
              <div className="my-2 border-t border-border" />
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left font-mono text-sm text-destructive hover:bg-muted"
              >
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  )
}
