import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { UserManagement } from '@/components/admin/user-management'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/dashboard')
  }

  // Get all users
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin"
          className="pixel-button bg-muted px-3 py-2 font-mono text-xs text-foreground"
        >
          &larr; BACK
        </Link>
        <h1 className="font-[family-name:var(--font-pixel)] text-2xl text-foreground">
          USER MANAGEMENT
        </h1>
      </div>

      {/* Users List */}
      <UserManagement users={users || []} />
    </div>
  )
}
