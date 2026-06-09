'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function CreateRoomPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [width, setWidth] = useState(10)
  const [height, setHeight] = useState(10)
  const [isPublic, setIsPublic] = useState(true)
  const [maxVisitors, setMaxVisitors] = useState(25)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in')
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert({
          owner_id: user.id,
          name,
          description: description || null,
          width,
          height,
          is_public: isPublic,
          max_visitors: maxVisitors,
        })
        .select()
        .single()

      if (error) throw error
      router.push(`/dashboard/rooms/${data.id}/edit`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create room')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/rooms"
          className="pixel-button bg-muted px-3 py-2 font-mono text-xs text-foreground"
        >
          &larr; BACK
        </Link>
        <h1 className="font-[family-name:var(--font-pixel)] text-2xl text-foreground">
          CREATE ROOM
        </h1>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pixel-window p-6"
      >
        <form onSubmit={handleCreate} className="space-y-6">
          {/* Room Name */}
          <div>
            <label className="mb-2 block font-mono text-xs text-muted-foreground">
              ROOM NAME
            </label>
            <input
              type="text"
              required
              maxLength={50}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Room"
              className="pixel-border w-full bg-input p-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block font-mono text-xs text-muted-foreground">
              DESCRIPTION (OPTIONAL)
            </label>
            <textarea
              maxLength={200}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your room..."
              rows={3}
              className="pixel-border w-full resize-none bg-input p-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Size */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-mono text-xs text-muted-foreground">
                WIDTH (TILES)
              </label>
              <input
                type="number"
                min={5}
                max={20}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="pixel-border w-full bg-input p-3 font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block font-mono text-xs text-muted-foreground">
                HEIGHT (TILES)
              </label>
              <input
                type="number"
                min={5}
                max={20}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="pixel-border w-full bg-input p-3 font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Max Visitors */}
          <div>
            <label className="mb-2 block font-mono text-xs text-muted-foreground">
              MAX VISITORS
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={maxVisitors}
              onChange={(e) => setMaxVisitors(Number(e.target.value))}
              className="pixel-border w-full bg-input p-3 font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Public Toggle */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`pixel-button px-4 py-2 font-mono text-xs ${
                isPublic ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {isPublic ? '&#128275; PUBLIC' : '&#128274; PRIVATE'}
            </button>
            <span className="text-xs text-muted-foreground">
              {isPublic ? 'Anyone can visit this room' : 'Only invited users can visit'}
            </span>
          </div>

          {/* Preview */}
          <div className="pixel-border bg-background/50 p-4">
            <p className="mb-2 font-mono text-xs text-muted-foreground">PREVIEW</p>
            <div 
              className="grid-bg mx-auto flex items-center justify-center border border-border"
              style={{ 
                width: Math.min(width * 20, 400), 
                height: Math.min(height * 20, 400) 
              }}
            >
              <span className="text-2xl opacity-30">&#127968;</span>
            </div>
            <p className="mt-2 text-center font-mono text-xs text-muted-foreground">
              {width}x{height} tiles
            </p>
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="pixel-button w-full bg-primary py-3 font-[family-name:var(--font-pixel)] text-sm text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
          >
            {isLoading ? 'CREATING...' : 'CREATE ROOM'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
