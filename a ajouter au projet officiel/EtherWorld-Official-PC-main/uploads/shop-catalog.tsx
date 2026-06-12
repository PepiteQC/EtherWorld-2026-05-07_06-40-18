'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import type { Furniture, Profile } from '@/lib/types/database'
import { FURNITURE_CATEGORIES } from '@/lib/types/database'

interface ShopCatalogProps {
  furniture: Furniture[]
  profile: Profile | null
}

export function ShopCatalog({ furniture, profile }: ShopCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [buying, setBuying] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const filteredFurniture = selectedCategory === 'all'
    ? furniture
    : furniture.filter(f => f.category === selectedCategory)

  const handleBuy = async (item: Furniture) => {
    setBuying(item.id)
    setMessage(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !profile) {
      setMessage({ type: 'error', text: 'You must be logged in' })
      setBuying(null)
      return
    }

    // Check if user has enough currency
    if (item.price_diamonds > 0 && (profile.diamonds || 0) < item.price_diamonds) {
      setMessage({ type: 'error', text: 'Not enough diamonds!' })
      setBuying(null)
      return
    }
    if (item.price_credits > 0 && (profile.credits || 0) < item.price_credits) {
      setMessage({ type: 'error', text: 'Not enough credits!' })
      setBuying(null)
      return
    }

    try {
      // Add to inventory
      const { error: inventoryError } = await supabase
        .from('inventory')
        .upsert({
          user_id: user.id,
          furniture_id: item.id,
          quantity: 1,
        }, {
          onConflict: 'user_id,furniture_id',
        })

      if (inventoryError) throw inventoryError

      // Update user currency
      const updates: Partial<Profile> = {}
      if (item.price_diamonds > 0) {
        updates.diamonds = (profile.diamonds || 0) - item.price_diamonds
      }
      if (item.price_credits > 0) {
        updates.credits = (profile.credits || 0) - item.price_credits
      }

      if (Object.keys(updates).length > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id)

        if (profileError) throw profileError
      }

      setMessage({ type: 'success', text: `Purchased ${item.name}!` })
      // Refresh page to update currency
      window.location.reload()
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Purchase failed' })
    } finally {
      setBuying(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="pixel-window p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`pixel-button px-3 py-2 font-mono text-xs ${
              selectedCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
            }`}
          >
            ALL
          </button>
          {FURNITURE_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`pixel-button px-3 py-2 font-mono text-xs uppercase ${
                selectedCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`pixel-border p-4 ${
            message.type === 'success' ? 'bg-secondary/20 text-secondary' : 'bg-destructive/20 text-destructive'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Items Grid */}
      <div className="pixel-window p-6">
        {filteredFurniture.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No items in this category.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredFurniture.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="pixel-border bg-muted p-4"
              >
                {/* Item Preview */}
                <div className="mb-3 flex h-20 items-center justify-center bg-background/50">
                  <span className="text-4xl opacity-70">
                    {item.category === 'seating' ? '&#129681;' :
                     item.category === 'tables' ? '&#129705;' :
                     item.category === 'lighting' ? '&#128161;' :
                     item.category === 'decoration' ? '&#127797;' :
                     item.category === 'bedroom' ? '&#128716;' :
                     item.category === 'electronics' ? '&#128250;' :
                     '&#128230;'}
                  </span>
                </div>

                {/* Item Info */}
                <h3 className="mb-1 truncate font-[family-name:var(--font-pixel)] text-xs text-foreground">
                  {item.name}
                </h3>
                <p className="mb-2 text-xs text-muted-foreground">
                  {item.width}x{item.height} | {item.category}
                </p>

                {/* Price */}
                <div className="mb-3 flex items-center gap-2">
                  {item.price_diamonds > 0 && (
                    <span className="flex items-center gap-1 text-xs text-cyan-400">
                      <span>&#128142;</span>
                      {item.price_diamonds}
                    </span>
                  )}
                  {item.price_credits > 0 && (
                    <span className="flex items-center gap-1 text-xs text-accent">
                      <span>&#128176;</span>
                      {item.price_credits}
                    </span>
                  )}
                  {item.price_diamonds === 0 && item.price_credits === 0 && (
                    <span className="text-xs text-secondary">FREE</span>
                  )}
                </div>

                {/* Buy Button */}
                <button
                  onClick={() => handleBuy(item)}
                  disabled={buying === item.id}
                  className="pixel-button w-full bg-secondary py-2 font-mono text-xs text-secondary-foreground disabled:opacity-50"
                >
                  {buying === item.id ? 'BUYING...' : 'BUY'}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
