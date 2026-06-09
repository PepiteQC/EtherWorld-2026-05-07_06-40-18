import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ShopCatalog } from '@/components/dashboard/shop-catalog'

export default async function ShopPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile for currency
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get available furniture
  const { data: furniture } = await supabase
    .from('furniture')
    .select('*')
    .eq('is_available', true)
    .order('category')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-pixel)] text-2xl text-foreground">
          SHOP
        </h1>
        <div className="flex items-center gap-4">
          <div className="pixel-border flex items-center gap-2 bg-muted px-3 py-2">
            <span className="text-lg">&#128142;</span>
            <span className="font-mono text-sm text-cyan-400">
              {profile?.diamonds?.toLocaleString() || 0}
            </span>
          </div>
          <div className="pixel-border flex items-center gap-2 bg-muted px-3 py-2">
            <span className="text-lg">&#128176;</span>
            <span className="font-mono text-sm text-accent">
              {profile?.credits?.toLocaleString() || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Shop Catalog */}
      <ShopCatalog furniture={furniture || []} profile={profile} />
    </div>
  )
}
