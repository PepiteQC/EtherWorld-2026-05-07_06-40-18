'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const DIVINE_TITLES = [
  'ELU DES DIEUX',
  'MAITRE DE L\'ETHER',
  'GARDIEN SUPREME',
  'SOUVERAIN COSMIQUE',
  'ARBITRE DE L\'UNIVERS',
]

const PARTICLE_COUNT = 30

type Particle = {
  id: number
  x: number
  y: number
  size: number
  color: string
  speedX: number
  speedY: number
  opacity: number
  symbol: string
}

const SYMBOLS = ['✦', '◆', '★', '⬡', '◉', '⬟', '✸', '⊕']
const COLORS = ['#ff3333', '#ffd700', '#00ffcc', '#ff00ff', '#4fc3f7']

export function VipAdminAvatar({ username }: { username: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [titleIndex, setTitleIndex] = useState(0)
  const [glitchActive, setGlitchActive] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const animRef = useRef<number>(0)

  // Rotate titles
  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex(i => (i + 1) % DIVINE_TITLES.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  // Random glitch flash
  useEffect(() => {
    const glitch = () => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 120 + Math.random() * 200)
    }
    const interval = setInterval(glitch, 2000 + Math.random() * 3000)
    return () => clearInterval(interval)
  }, [])

  // Init particles
  useEffect(() => {
    setParticles(
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 6 + Math.random() * 12,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: -(0.1 + Math.random() * 0.35),
        opacity: 0.4 + Math.random() * 0.6,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      }))
    )
  }, [])

  // Animate particles
  useEffect(() => {
    let frame: number
    const tick = () => {
      setParticles(prev =>
        prev.map(p => {
          let nx = p.x + p.speedX
          let ny = p.y + p.speedY
          if (ny < -5) ny = 105
          if (nx < -5) nx = 105
          if (nx > 105) nx = -5
          return { ...p, x: nx, y: ny }
        })
      )
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-none border-2 border-[#ffd700] bg-[#0a0005] p-0"
      style={{ boxShadow: '0 0 40px #ffd70066, 0 0 80px #ff333344, inset 0 0 60px #00000088' }}
    >
      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 z-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)',
        }}
      />

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        {particles.map(p => (
          <span
            key={p.id}
            className="absolute select-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              fontSize: `${p.size}px`,
              color: p.color,
              opacity: p.opacity,
              textShadow: `0 0 8px ${p.color}`,
              transition: 'none',
              fontFamily: 'monospace',
            }}
          >
            {p.symbol}
          </span>
        ))}
      </div>

      {/* Top crown bar */}
      <div className="relative z-30 flex items-center justify-center gap-3 border-b-2 border-[#ffd700] bg-gradient-to-r from-[#1a0000] via-[#2a1100] to-[#1a0000] py-2 px-4">
        <span className="font-[family-name:var(--font-pixel)] text-[8px] tracking-[0.25em] text-[#ffd700]" style={{ textShadow: '0 0 10px #ffd700' }}>
          ★ ACCES DIVIN SUPREME ★
        </span>
      </div>

      {/* Main body */}
      <div className="relative z-30 flex flex-col items-center px-6 pt-4 pb-6">
        {/* Glowing halo behind avatar */}
        <div className="relative mb-2 flex items-center justify-center">
          {/* Halo rings */}
          <div className="absolute rounded-full"
            style={{
              width: 220, height: 220,
              background: 'radial-gradient(circle, #ffd70022 0%, #ff333322 40%, transparent 70%)',
              animation: 'spin 8s linear infinite',
            }}
          />
          <div className="absolute rounded-full border border-[#ffd70044]"
            style={{ width: 200, height: 200, animation: 'spin 5s linear infinite reverse' }}
          />
          <div className="absolute rounded-full border border-[#ff333344]"
            style={{ width: 180, height: 180, animation: 'spin 3s linear infinite' }}
          />

          {/* Avatar image */}
          <div
            className="relative overflow-hidden rounded-sm"
            style={{
              width: 160,
              height: 200,
              filter: glitchActive
                ? 'drop-shadow(0 0 20px #ffd700) hue-rotate(20deg) saturate(2)'
                : 'drop-shadow(0 0 16px #ffd700aa) drop-shadow(0 0 32px #ff333366)',
              transform: glitchActive ? `translate(${(Math.random()-0.5)*6}px, 0)` : 'none',
              transition: 'filter 0.1s',
            }}
          >
            <Image
              src="/images/avatar-admin-vip.jpg"
              alt="Admin VIP Alien Avatar"
              width={160}
              height={200}
              className="object-cover object-top"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          {/* Crown badge top right */}
          <div className="absolute -top-3 -right-3 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#ffd700] bg-[#1a0800] text-xl"
            style={{ boxShadow: '0 0 14px #ffd700, 0 0 28px #ff3333' }}
          >
            <span style={{ filter: 'drop-shadow(0 0 6px #ffd700)' }}>👑</span>
          </div>
        </div>

        {/* Username */}
        <div className={`mb-1 font-[family-name:var(--font-pixel)] text-sm tracking-widest text-[#ffd700] ${glitchActive ? 'opacity-70' : ''}`}
          style={{ textShadow: '0 0 12px #ffd700, 0 0 24px #ff9900' }}
        >
          {username}
        </div>

        {/* Rotating divine title */}
        <div className="mb-3 h-5 overflow-hidden">
          <div
            className="font-[family-name:var(--font-pixel)] text-[9px] tracking-[0.2em] text-[#ff3333]"
            style={{
              textShadow: '0 0 8px #ff3333, 0 0 16px #ff0000',
              animation: 'pulse 2s ease-in-out infinite',
            }}
            key={titleIndex}
          >
            {DIVINE_TITLES[titleIndex]}
          </div>
        </div>

        {/* VIP Badge */}
        <div className="mb-4 flex items-center gap-2 border border-[#ffd700] bg-gradient-to-r from-[#1a0800] via-[#2d1500] to-[#1a0800] px-4 py-1"
          style={{ boxShadow: '0 0 10px #ffd70066' }}
        >
          <span className="font-[family-name:var(--font-pixel)] text-[8px] text-[#00ffcc]" style={{ textShadow: '0 0 8px #00ffcc' }}>
            LVL MAX
          </span>
          <span className="text-[#ffd700]">|</span>
          <span className="font-[family-name:var(--font-pixel)] text-[8px] text-[#ffd700]" style={{ textShadow: '0 0 8px #ffd700' }}>
            VIP ULTIME
          </span>
          <span className="text-[#ffd700]">|</span>
          <span className="font-[family-name:var(--font-pixel)] text-[8px] text-[#ff3333]" style={{ textShadow: '0 0 8px #ff3333' }}>
            ADMIN
          </span>
        </div>

        {/* Stats row */}
        <div className="grid w-full grid-cols-3 gap-2 border-t border-[#ffd70033] pt-4">
          {[
            { label: 'DIAMANTS', value: '∞', color: '#00ffcc' },
            { label: 'CREDITS', value: '∞', color: '#ffd700' },
            { label: 'POUVOIR', value: '9999', color: '#ff3333' },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="font-[family-name:var(--font-pixel)] text-sm font-bold"
                style={{ color: s.color, textShadow: `0 0 10px ${s.color}` }}
              >
                {s.value}
              </span>
              <span className="font-[family-name:var(--font-pixel)] text-[7px] text-[#ffffff55]">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom divine bar */}
      <div className="relative z-30 flex items-center justify-center border-t-2 border-[#ffd700] bg-gradient-to-r from-[#1a0000] via-[#2a1100] to-[#1a0000] py-2">
        <div className="flex items-center gap-2">
          {['#ff3333','#ffd700','#00ffcc','#ff00ff','#4fc3f7'].map((c, i) => (
            <div key={i} className="h-2 w-2 rounded-full"
              style={{ backgroundColor: c, boxShadow: `0 0 6px ${c}`, animation: `pulse ${1 + i * 0.2}s ease-in-out infinite` }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
      `}</style>
    </div>
  )
}
