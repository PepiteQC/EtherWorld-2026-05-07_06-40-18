import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { RoomView } from '@/components/room/room-view'

interface RoomPageProps {
  params: Promise<{ id: string }>
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get room data
  const { data: room } = await supabase
    .from('rooms')
    .select('*, profiles(username)')
    .eq('id', id)
    .single()

  if (!room) {
    notFound()
  }

  // Get room furniture
  const { data: roomFurniture } = await supabase
    .from('room_furniture')
    .select('*, furniture(*)')
    .eq('room_id', id)

  // Get user's avatar
  const { data: avatar } = await supabase
    .from('avatars')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()

  // Check user permissions
  const isOwner = room.owner_id === user.id
  
  const { data: permission } = await supabase
    .from('room_permissions')
    .select('permission_level')
    .eq('room_id', id)
    .eq('user_id', user.id)
    .single()

  const userPermission = isOwner ? 'owner' : (permission?.permission_level || 'visitor')

  return (
    <RoomView 
      room={room}
      furniture={roomFurniture || []}
      avatar={avatar}
      userPermission={userPermission}
      userId={user.id}
    />
  )
}
