'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import type { Profile } from '@/lib/types/database'

interface UserManagementProps {
  users: Profile[]
}

export function UserManagement({ users: initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(search.toLowerCase()) ||
    user.id.toLowerCase().includes(search.toLowerCase())
  )

  const toggleAdmin = async (userId: string, currentStatus: boolean) => {
    setUpdating(userId)
    const supabase = createClient()

    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: !currentStatus })
      .eq('id', userId)

    if (!error) {
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, is_admin: !currentStatus } : u
      ))
    }

    setUpdating(null)
  }

  const updateCurrency = async (userId: string, type: 'diamonds' | 'credits', amount: number) => {
    setUpdating(userId)
    const supabase = createClient()

    const { error } = await supabase
      .from('profiles')
      .update({ [type]: amount })
      .eq('id', userId)

    if (!error) {
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, [type]: amount } : u
      ))
    }

    setUpdating(null)
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="pixel-window p-4">
        <input
          type="text"
          placeholder="Search by username or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pixel-border w-full bg-input p-3 font-mono text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Users Table */}
      <div className="pixel-window p-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border text-left font-mono text-xs text-muted-foreground">
                <th className="pb-3">USERNAME</th>
                <th className="pb-3">DIAMONDS</th>
                <th className="pb-3">CREDITS</th>
                <th className="pb-3">ADMIN</th>
                <th className="pb-3">JOINED</th>
                <th className="pb-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border"
                >
                  <td className="py-3 font-mono text-sm text-foreground">
                    {user.username || 'Unknown'}
                    <p className="text-[10px] text-muted-foreground">{user.id.slice(0, 8)}...</p>
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      value={user.diamonds}
                      onChange={(e) => updateCurrency(user.id, 'diamonds', Number(e.target.value))}
                      className="pixel-border w-20 bg-input p-1 font-mono text-xs text-cyan-400"
                    />
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      value={user.credits}
                      onChange={(e) => updateCurrency(user.id, 'credits', Number(e.target.value))}
                      className="pixel-border w-20 bg-input p-1 font-mono text-xs text-accent"
                    />
                  </td>
                  <td className="py-3">
                    <span className={`inline-block px-2 py-1 font-mono text-xs ${
                      user.is_admin ? 'bg-destructive text-destructive-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {user.is_admin ? 'ADMIN' : 'USER'}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-xs text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleAdmin(user.id, user.is_admin)}
                        disabled={updating === user.id}
                        className={`pixel-button px-2 py-1 font-mono text-xs disabled:opacity-50 ${
                          user.is_admin ? 'bg-muted text-foreground' : 'bg-destructive text-destructive-foreground'
                        }`}
                      >
                        {user.is_admin ? 'REMOVE ADMIN' : 'MAKE ADMIN'}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">No users found.</p>
          )}
        </div>
      </div>
    </div>
  )
}
