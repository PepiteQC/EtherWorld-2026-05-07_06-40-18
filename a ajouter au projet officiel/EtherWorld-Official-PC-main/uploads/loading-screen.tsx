'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  onComplete?: () => void
  minDuration?: number
}

const HACKER_LINES = [
  '> INITIALIZING ETHERWORLD CORE...',
  '> LOADING BIOMASS PROTOCOLS...',
  '> SYNCING NEURAL INTERFACE...',
  '> ESTABLISHING QUANTUM LINK...',
  '> DECRYPTING AVATAR DATA...',
  '> CALIBRATING ISOMETRIC ENGINE...',
  '> LOADING FURNITURE SPRITES...',
  '> CONNECTING TO ETHER NETWORK...',
  '> INITIALIZING ROOM BUILDER...',
  '> SYSTEM READY. WELCOME TO ETHERWORLD.',
]

export function LoadingScreen({ onComplete, minDuration = 4000 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [currentLines, setCurrentLines] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)

  const handleComplete = useCallback(() => {
    setIsComplete(true)
    setTimeout(() => {
      onComplete?.()
    }, 500)
  }, [onComplete])

  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / minDuration) * 100, 100)
      setProgress(newProgress)

      if (newProgress >= 100) {
        clearInterval(interval)
        handleComplete()
      }
    }, 50)

    return () => clearInterval(interval)
  }, [minDuration, handleComplete])

  useEffect(() => {
    const lineInterval = setInterval(() => {
      setCurrentLines(prev => {
        if (prev.length >= HACKER_LINES.length) return prev
        return [...prev, HACKER_LINES[prev.length]]
      })
    }, 400)

    return () => clearInterval(lineInterval)
  }, [])

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-background"
        >
          {/* Animated Grid Background */}
          <div className="absolute inset-0 grid-bg opacity-50" />
          
          {/* Scanlines Effect */}
          <div className="scanlines absolute inset-0" />
          
          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 w-1"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: i % 3 === 0 ? 'var(--neon-red)' : i % 3 === 1 ? 'var(--biomass-green)' : 'var(--cyber-yellow)',
                  boxShadow: i % 3 === 0 
                    ? '0 0 10px var(--neon-red-glow), 0 0 20px var(--neon-red-glow)' 
                    : i % 3 === 1
                    ? '0 0 10px var(--biomass-glow), 0 0 20px var(--biomass-glow)'
                    : '0 0 10px var(--cyber-yellow), 0 0 20px var(--cyber-yellow)',
                }}
                animate={{
                  y: [0, -100, 0],
                  x: [0, Math.random() * 50 - 25, 0],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center gap-8 px-4">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="glitch"
            >
              <h1 className="neon-glow font-[family-name:var(--font-pixel)] text-4xl font-bold tracking-wider text-primary md:text-6xl">
                ETHERWORLD
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="neon-glow-green font-mono text-sm text-secondary"
            >
              ENTERING THE VIRTUAL REALM
            </motion.p>

            {/* Terminal Window */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pixel-window w-full max-w-lg p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <div className="h-3 w-3 bg-destructive" />
                <div className="h-3 w-3 bg-accent" />
                <div className="h-3 w-3 bg-secondary" />
                <span className="ml-2 font-mono text-xs text-muted-foreground">terminal.exe</span>
              </div>
              <div className="h-48 overflow-hidden font-mono text-xs text-terminal-green">
                {currentLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="py-0.5"
                  >
                    {line}
                  </motion.div>
                ))}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block h-4 w-2 bg-terminal-green"
                />
              </div>
            </motion.div>

            {/* Progress Bar */}
            <div className="w-full max-w-md">
              <div className="pixel-border mb-2 h-6 w-full overflow-hidden bg-muted">
                <motion.div
                  className="h-full bg-primary"
                  style={{ 
                    width: `${progress}%`,
                    boxShadow: '0 0 10px var(--neon-red), 0 0 20px var(--neon-red-glow)'
                  }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <div className="flex justify-between font-mono text-xs text-muted-foreground">
                <span>LOADING...</span>
                <span className="neon-glow text-primary">{Math.floor(progress)}%</span>
              </div>
            </div>

            {/* Biomass Animation */}
            <div className="mt-4 flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="h-4 w-4 bg-secondary"
                  style={{
                    boxShadow: '0 0 10px var(--biomass-glow)'
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Corner Decorations */}
          <div className="absolute left-4 top-4 h-16 w-16 border-l-4 border-t-4 border-primary opacity-50" />
          <div className="absolute right-4 top-4 h-16 w-16 border-r-4 border-t-4 border-secondary opacity-50" />
          <div className="absolute bottom-4 left-4 h-16 w-16 border-b-4 border-l-4 border-secondary opacity-50" />
          <div className="absolute bottom-4 right-4 h-16 w-16 border-b-4 border-r-4 border-primary opacity-50" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
