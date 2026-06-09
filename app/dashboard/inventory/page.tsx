import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { InventoryGrid } from '@/components/dashboard/inventory-grid'

export default async function InventoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user inventory with furniture details
  const { data: inventory } = await supabase
    .from('inventory')
    .select('*, furniture(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-pixel)] text-2xl text-foreground">
          INVENTORY
        </h1>
        <p className="font-mono text-sm text-muted-foreground">
          {inventory?.length || 0} items
        </p>
      </div>

      {/* Inventory Grid */}
      <InventoryGrid inventory={inventory || []} />
    </div>
  )
}
