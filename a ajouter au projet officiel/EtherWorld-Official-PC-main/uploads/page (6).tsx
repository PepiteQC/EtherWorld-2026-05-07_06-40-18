'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingScreen } from '@/components/loading-screen'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HomePage() {
  const [showLoading, setShowLoading] = useState(true)
  const router = useRouter()

  if (showLoading) {
    return <LoadingScreen onComplete={() => setShowLoading(false)} minDuration={5000} />
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="scanlines absolute inset-0 pointer-events-none" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: i % 2 === 0 ? 'var(--neon-red)' : 'var(--biomass-green)',
              boxShadow: i % 2 === 0 
                ? '0 0 15px var(--neon-red-glow)' 
                : '0 0 15px var(--biomass-glow)',
            }}
            animate={{
              y: [0, -200, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="neon-glow glitch font-[family-name:var(--font-pixel)] text-5xl font-bold tracking-wider text-primary md:text-7xl">
            ETHERWORLD
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12 text-center font-mono text-lg text-muted-foreground md:text-xl"
        >
          Build. Create. Connect. <span className="neon-glow-green text-secondary">Enter the Virtual Realm.</span>
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/auth/sign-up"
            className="pixel-button bg-primary px-8 py-4 text-center font-[family-name:var(--font-pixel)] text-sm text-primary-foreground transition-all hover:brightness-110"
          >
            CREATE ACCOUNT
          </Link>
          <Link
            href="/auth/login"
            className="pixel-button bg-secondary px-8 py-4 text-center font-[family-name:var(--font-pixel)] text-sm text-secondary-foreground transition-all hover:brightness-110"
          >
            LOGIN
          </Link>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 grid gap-6 md:grid-cols-3"
        >
          <FeatureCard
            icon="&#127968;"
            title="Room Builder"
            description="Create your own isometric rooms with drag & drop furniture"
          />
          <FeatureCard
            icon="&#128100;"
            title="Avatar Creator"
            description="Design unique pixel art avatars with endless customization"
          />
          <FeatureCard
            icon="&#127918;"
            title="Social Gaming"
            description="Meet friends, explore rooms, and play together"
          />
        </motion.div>

        {/* Version Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-4 right-4 font-mono text-xs text-muted-foreground"
        >
          v0.1.0 ALPHA
        </motion.div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute left-4 top-4 h-20 w-20 border-l-4 border-t-4 border-primary opacity-30" />
      <div className="absolute right-4 top-4 h-20 w-20 border-r-4 border-t-4 border-secondary opacity-30" />
      <div className="absolute bottom-4 left-4 h-20 w-20 border-b-4 border-l-4 border-secondary opacity-30" />
      <div className="absolute bottom-4 right-4 h-20 w-20 border-b-4 border-r-4 border-primary opacity-30" />
    </main>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="pixel-window p-6 text-center transition-all hover:translate-y-[-4px]">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-2 font-[family-name:var(--font-pixel)] text-sm text-primary">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
