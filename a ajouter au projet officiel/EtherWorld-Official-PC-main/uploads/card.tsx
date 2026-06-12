'use client'

import { motion } from 'framer-motion'

interface DashboardCardProps {
  icon: string
  title: string
  value: string
  color: 'cyan' | 'yellow' | 'green' | 'purple' | 'red'
}

const colorClasses = {
  cyan: 'text-cyan-400',
  yellow: 'text-yellow-400',
  green: 'text-green-400',
  purple: 'text-purple-400',
  red: 'text-red-400',
}

export function DashboardCard({ icon, title, value, color }: DashboardCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="pixel-window p-4"
    >
      <div className="flex items-center gap-4">
        <div className="text-3xl" dangerouslySetInnerHTML={{ __html: icon }} />
        <div>
          <p className="font-mono text-xs text-muted-foreground">{title}</p>
          <p className={`font-[family-name:var(--font-pixel)] text-xl ${colorClasses[color]}`}>
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
