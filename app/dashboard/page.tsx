import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DashboardCard } from '@/components/dashboard/card'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user stats
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
    const { data: publicRooms } = await supabase

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="pixel-window p-6">
        <h1 className="mb-2 font-[family-name:var(--font-pixel)] text-2xl text-foreground">
          WELCOME, <span className="text-primary">{profile?.username?.toUpperCase() || 'PLAYER'}</span>
        </h1>
        <p className="text-muted-foreground">
          {"What would you like to do today in EtherWorld?"}
        </p>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          icon="&#128142;"
          title="DIAMONDS"
          value={profile?.diamonds?.toLocaleString() || '0'}
          color="cyan"
        />
        <DashboardCard
          icon="&#128176;"
          title="CREDITS"
          value={profile?.credits?.toLocaleString() || '0'}
          color="yellow"
        />
        <DashboardCard
          icon="&#127968;"
          title="MY ROOMS"
          value={roomCount?.toString() || '0'}
          color="green"
        />
        <DashboardCard
          icon="&#128230;"
          title="INVENTORY"
          value={inventoryCount?.toString() || '0'}
          color="purple"
        />
      </div>

   