'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push('/dashboard')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="scanlines absolute inset-0 pointer-events-none" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: i % 2 === 0 ? 'var(--neon-red)' : 'var(--biomass-green)',
              boxShadow: i % 2 === 0 ? '0 0 10px var(--neon-red-glow)' : '0 0 10px var(--biomass-glow)',
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="mb-8 block text-center">
          <h1 className="neon-glow font-[family-name:var(--font-pixel)] text-3xl font-bold text-primary">
            ETHERWORLD
          </h1>
        </Link>

        {/* Login Form */}
        <div className="pixel-window p-8">
          <div className="mb-6 flex items-center gap-2">
            <div className="h-3 w-3 bg-destructive" />
            <div className="h-3 w-3 bg-accent" />
            <div className="h-3 w-3 bg-secondary" />
            <span className="ml-2 font-mono text-xs text-muted-foreground">login.exe</span>
          </div>

          <h2 className="mb-2 font-[family-name:var(--font-pixel)] text-xl text-foreground">
            LOGIN
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Enter your credentials to access EtherWorld
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-2 block font-mono text-xs text-muted-foreground" htmlFor="email">
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                placeholder="player@etherworld.io"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pixel-border w-full bg-input p-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-2 block font-mono text-xs text-muted-foreground" htmlFor="password">
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pixel-border w-full bg-input p-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pixel-border bg-destructive/20 p-2 font-mono text-xs text-destructive"
              >
                ERROR: {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="pixel-button w-full bg-primary py-3 font-[family-name:var(--font-pixel)] text-sm text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
            >
              {isLoading ? 'CONNECTING...' : 'ENTER'}
            </button>
          </form>

          <div className="mt-6 text-center font-mono text-sm text-muted-foreground">
            {"New to EtherWorld? "}
            <Link href="/auth/sign-up" className="text-secondary hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Corner Decorations */}
      <div className="absolute left-4 top-4 h-16 w-16 border-l-4 border-t-4 border-primary opacity-30" />
      <div className="absolute right-4 bottom-4 h-16 w-16 border-b-4 border-r-4 border-secondary opacity-30" />
    </div>
  )
}
