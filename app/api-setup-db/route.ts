import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createAdminClient()
    
    // Create profiles table
    const { error: profilesError } = await supabase.from('profiles').select('id').limit(1)
    if (profilesError?.code === '42P01') {
      // Table doesn't exist, we need to create it via Supabase Dashboard or migrations
      return NextResponse.json({ 
        success: false, 
        message: 'Database tables not found. Please run the SQL setup in Supabase Dashboard.',
        setupRequired: true
      })
    }

    // Check if tables exist
    const { data: furnitureData, error: furnitureError } = await supabase
      .from('furniture')
      .select('id')
      .limit(1)

    if (furnitureError?.code === '42P01') {
      return NextResponse.json({ 
        success: false, 
        message: 'Furniture table not found. Please run the SQL setup.',
        setupRequired: true
      })
    }

    // If furniture is empty, seed it
    if (!furnitureData || furnitureData.length === 0) {
      const { error: seedError } = await supabase.from('furniture').insert([
        { name: 'Blue Chair', category: 'seating', width: 1, height: 1, can_sit: true, is_walkable: false, price_credits: 50, price_diamonds: 0 },
        { name: 'Red Sofa', category: 'seating', width: 2, height: 1, can_sit: true, is_walkable: false, price_credits: 150, price_diamonds: 0 },
        { name: 'Wood Table', category: 'tables', width: 2, height: 2, can_sit: false, is_walkable: false, price_credits: 100, price_diamonds: 0 },
        { name: 'Small Lamp', category: 'lighting', width: 1, height: 1, can_sit: false, is_walkable: false, price_credits: 30, price_diamonds: 0 },
        { name: 'Potted Plant', category: 'decoration', width: 1, height: 1, can_sit: false, is_walkable: false, price_credits: 25, price_diamonds: 0 },
        { name: 'Bookshelf', category: 'storage', width: 1, height: 2, can_sit: false, is_walkable: false, price_credits: 200, price_diamonds: 0 },
        { name: 'Bed Single', category: 'bedroom', width: 2, height: 1, can_sit: true, is_walkable: false, price_credits: 300, price_diamonds: 5 },
        { name: 'Bed Double', category: 'bedroom', width: 2, height: 2, can_sit: true, is_walkable: false, price_credits: 500, price_diamonds: 10 },
        { name: 'TV Modern', category: 'electronics', width: 2, height: 1, can_sit: false, is_walkable: false, price_credits: 400, price_diamonds: 15 },
        { name: 'Arcade Machine', category: 'electronics', width: 1, height: 1, can_sit: false, is_walkable: false, price_credits: 0, price_diamonds: 50 },
        { name: 'Neon Sign', category: 'decoration', width: 2, height: 1, can_sit: false, is_walkable: false, price_credits: 0, price_diamonds: 25 },
        { name: 'DJ Booth', category: 'electronics', width: 2, height: 2, can_sit: false, is_walkable: false, price_credits: 0, price_diamonds: 100 },
      ])

      if (seedError) {
        return NextResponse.json({ 
          success: false, 
          error: seedError.message,
          message: 'Failed to seed furniture'
        }, { status: 500 })
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database is ready!'
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// SQL to create tables - run this in Supabase SQL Editor
export const SETUP_SQL = `
-- Utilisateurs etendus (profiles)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  diamonds INTEGER DEFAULT 100,
  credits INTEGER DEFAULT 1000,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Avatars
CREATE TABLE IF NOT EXISTS avatars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT DEFAULT 'My Avatar',
  body_type TEXT DEFAULT 'default',
  skin_color TEXT DEFAULT '#f5d0c5',
  hair_style TEXT DEFAULT 'short',
  hair_color TEXT DEFAULT '#4a3728',
  face_data JSONB DEFAULT '{"eyes": "default", "mouth": "smile", "eyebrows": "default"}',
  outfit_data JSONB DEFAULT '{"top": "tshirt", "bottom": "pants", "shoes": "sneakers", "topColor": "#6366f1", "bottomColor": "#3b82f6", "shoesColor": "#1f2937"}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rooms
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  width INTEGER DEFAULT 10,
  height INTEGER DEFAULT 10,
  background TEXT DEFAULT 'default',
  floor_texture TEXT DEFAULT 'wood',
  is_public BOOLEAN DEFAULT TRUE,
  max_visitors INTEGER DEFAULT 25,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meubles/Objets catalogue
CREATE TABLE IF NOT EXISTS furniture (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT DEFAULT 'decoration',
  sprite_url TEXT,
  width INTEGER DEFAULT 1,
  height INTEGER DEFAULT 1,
  can_sit BOOLEAN DEFAULT FALSE,
  is_walkable BOOLEAN DEFAULT FALSE,
  price_diamonds INTEGER DEFAULT 0,
  price_credits INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Placements dans les rooms
CREATE TABLE IF NOT EXISTS room_furniture (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  furniture_id UUID REFERENCES furniture(id) ON DELETE CASCADE,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  z INTEGER DEFAULT 0,
  rotation INTEGER DEFAULT 0,
  placed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Permissions rooms
CREATE TABLE IF NOT EXISTS room_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  permission_level TEXT CHECK (permission_level IN ('owner', 'editor', 'visitor', 'banned')) DEFAULT 'visitor',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- Inventaire utilisateur
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  furniture_id UUID REFERENCES furniture(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, furniture_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE furniture ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_furniture ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Avatars policies
CREATE POLICY "avatars_select_own" ON avatars FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "avatars_insert_own" ON avatars FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "avatars_update_own" ON avatars FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "avatars_delete_own" ON avatars FOR DELETE USING (auth.uid() = user_id);

-- Rooms policies
CREATE POLICY "rooms_select_public" ON rooms FOR SELECT USING (is_public = true OR auth.uid() = owner_id);
CREATE POLICY "rooms_insert_own" ON rooms FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "rooms_update_own" ON rooms FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "rooms_delete_own" ON rooms FOR DELETE USING (auth.uid() = owner_id);

-- Furniture policies (public read)
CREATE POLICY "furniture_select_all" ON furniture FOR SELECT USING (true);
CREATE POLICY "furniture_insert_admin" ON furniture FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- Room furniture policies
CREATE POLICY "room_furniture_select" ON room_furniture FOR SELECT USING (
  EXISTS (SELECT 1 FROM rooms WHERE rooms.id = room_furniture.room_id AND (rooms.is_public = true OR rooms.owner_id = auth.uid()))
);
CREATE POLICY "room_furniture_insert" ON room_furniture FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM rooms WHERE rooms.id = room_furniture.room_id AND rooms.owner_id = auth.uid())
  OR EXISTS (SELECT 1 FROM room_permissions WHERE room_permissions.room_id = room_furniture.room_id AND room_permissions.user_id = auth.uid() AND room_permissions.permission_level IN ('owner', 'editor'))
);
CREATE POLICY "room_furniture_update" ON room_furniture FOR UPDATE USING (
  EXISTS (SELECT 1 FROM rooms WHERE rooms.id = room_furniture.room_id AND rooms.owner_id = auth.uid())
  OR EXISTS (SELECT 1 FROM room_permissions WHERE room_permissions.room_id = room_furniture.room_id AND room_permissions.user_id = auth.uid() AND room_permissions.permission_level IN ('owner', 'editor'))
);
CREATE POLICY "room_furniture_delete" ON room_furniture FOR DELETE USING (
  EXISTS (SELECT 1 FROM rooms WHERE rooms.id = room_furniture.room_id AND rooms.owner_id = auth.uid())
);

-- Room permissions policies
CREATE POLICY "room_permissions_select" ON room_permissions FOR SELECT USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM rooms WHERE rooms.id = room_permissions.room_id AND rooms.owner_id = auth.uid())
);
CREATE POLICY "room_permissions_insert" ON room_permissions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM rooms WHERE rooms.id = room_permissions.room_id AND rooms.owner_id = auth.uid())
);
CREATE POLICY "room_permissions_update" ON room_permissions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM rooms WHERE rooms.id = room_permissions.room_id AND rooms.owner_id = auth.uid())
);
CREATE POLICY "room_permissions_delete" ON room_permissions FOR DELETE USING (
  EXISTS (SELECT 1 FROM rooms WHERE rooms.id = room_permissions.room_id AND rooms.owner_id = auth.uid())
);

-- Inventory policies
CREATE POLICY "inventory_select_own" ON inventory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "inventory_insert_own" ON inventory FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "inventory_update_own" ON inventory FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "inventory_delete_own" ON inventory FOR DELETE USING (auth.uid() = user_id);

-- Trigger for auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'username', 'player_' || substr(new.id::text, 1, 8))
  )
  ON CONFLICT (id) DO NOTHING;
  
  INSERT INTO public.avatars (user_id)
  VALUES (new.id)
  ON CONFLICT DO NOTHING;
  
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
`
