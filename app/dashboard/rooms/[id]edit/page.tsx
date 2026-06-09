import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { RoomEditor } from '@/components/room/room-editor'

interface EditRoomPageProps {
  params: Promise<{ id: string }>
}

export default async function EditRoomPage({ params }: EditRoomPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get room data
  const { data: room } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .eq('owner_id', user.id) // Only owner can edit
    .single()

  if (!room) {
    notFound()
  }

  // Get room furniture
  const { data: roomFurniture } = await supabase
    .from('room_furniture')
    .select('*, furniture(*)')
    .eq('room_id', id)

  // Get all furniture for catalog
  const { data: allFurniture } = await supabase
    .from('furniture')
    .select('*')
    .eq('is_available', true)

  return (
    <RoomEditor 
      room={room}
      roomFurniture={roomFurniture || []}
      allFurniture={allFurniture || []}
      userId={user.id}
    />
  )
}
