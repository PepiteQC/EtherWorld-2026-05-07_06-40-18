'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { InventoryItem } from '@/lib/types/database'

interface InventoryGridProps {
  inventory: InventoryItem[]
}

export function InventoryGrid({ inventory }: InventoryGridProps) {
  if (inventory.length === 0) {
    return (
      <div className="pixel-window p-8 text-center">
        <p className="mb-4 text-4xl">&#128230;</p>
        <p className="mb-4 text-muted-foreground">Your inventory is empty.</p>
        <Link
          href="/dashboard/shop"
          className="pixel-button inline-block bg-secondary px-6 py-3 font-mono text-sm text-secondary-foreground"
        >
          GO TO SHOP
        </Link>
      </div>
    )
  }

  return (
    <div className="pixel-window p-6">
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6">
        {inventory.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className="pixel-border relative cursor-pointer bg-muted p-3 transition-all hover:bg-accent"
          >
            {/* Quantity Badge */}
            {item.quantity > 1 && (
              <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center bg-primary font-mono text-xs text-primary-foreground">
                {item.quantity}
              </div>
            )}

            {/* Item Icon */}
            <div className="mb-2 flex h-16 items-center justify-center bg-background/50">
              <span className="text-3xl opacity-70">
                {item.furniture?.category === 'seating' ? '&#129681;' :
                 item.furniture?.category === 'tables' ? '&#129705;' :
                 item.furniture?.category === 'lighting' ? '&#128161;' :
                 item.furniture?.category === 'decoration' ? '&#127797;' :
                 item.furniture?.category === 'bedroom' ? '&#128716;' :
                 item.furniture?.category === 'electronics' ? '&#128250;' :
                 '&#128230;'}
              </span>
            </div>

            {/* Item Name */}
            <p className="truncate text-center font-mono text-xs text-foreground">
              {item.furniture?.name || 'Unknown'}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
