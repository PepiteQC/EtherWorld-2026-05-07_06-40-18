import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function PlayPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get public rooms
  const { data: publicRooms } = await supabase
    .from('rooms')
    .select('*, profiles(username)')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(20)

  // Get user's rooms
  const { data: myRooms } = await supabase
    .from('rooms')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pixel-window p-6">
        <h1 className="mb-2 font-[family-name:var(--font-pixel)] text-2xl text-foreground">
          PLAY
        </h1>
        <p className="text-muted-foreground">
          Select a room to enter and start exploring EtherWorld!
        </p>
      </div>

      {/* My Rooms Quick Access */}
      {myRooms && myRooms.length > 0 && (
        <div className="pixel-window p-6">
          <h2 className="mb-4 font-[family-name:var(--font-pixel)] text-lg text-foreground">
            MY ROOMS
          </h2>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {myRooms.map(room => (
              <Link key={room.id} href={`/room/${room.id}`}>
                <div className="pixel-border cursor-pointer bg-muted p-4 text-center transition-all hover:bg-accent">
                  <div className="mb-2 text-3xl">&#127968;</div>
                  <p className="truncate font-[family-name:var(--font-pixel)] text-xs text-foreground">
                    {room.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Public Rooms */}
      <div className="pixel-window p-6">
        <h2 className="mb-4 font-[family-name:var(--font-pixel)] text-lg text-foreground">
          PUBLIC ROOMS
        </h2>
        
        {!publicRooms || publicRooms.length === 0 ? (
          <div className="py-8 text-center">
            <p className="mb-4 text-muted-foreground">No public rooms yet.</p>
            <Link
              href="/dashboard/rooms/create"
              className="pixel-button inline-block bg-secondary px-6 py-3 font-mono text-sm text-secondary-foreground"
            >
              CREATE FIRST ROOM
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {publicRooms.map(room => (
              <Link key={room.id} href={`/room/${room.id}`}>
                <div className="pixel-border cursor-pointer bg-muted p-4 transition-all hover:bg-accent">
                  <div className="mb-3 flex h-24 items-center justify-center bg-background/50">
                    <span className="text-4xl opacity-50">&#127968;</span>
                  </div>
                  <h3 className="mb-1 truncate font-[family-name:var(--font-pixel)] text-xs text-foreground">
                    {room.name}
                  </h3>
                  <p className="truncate text-[10px] text-muted-foreground">
                    by {room.profiles?.username || 'Unknown'}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>&#128101; 0/{room.max_visitors}</span>
                    <span>&#128204; {room.width}x{room.height}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
