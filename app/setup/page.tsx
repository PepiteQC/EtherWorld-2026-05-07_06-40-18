'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Copy, Database, Loader2 } from 'lucide-react'

const SETUP_SQL = `-- EtherWorld Database Setup
-- Run this SQL in your Supabase SQL Editor

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

-- Seed default furniture
INSERT INTO furniture (name, category, width, height, can_sit, is_walkable, price_credits, price_diamonds) VALUES
('Blue Chair', 'seating', 1, 1, true, false, 50, 0),
('Red Sofa', 'seating', 2, 1, true, false, 150, 0),
('Wood Table', 'tables', 2, 2, false, false, 100, 0),
('Small Lamp', 'lighting', 1, 1, false, false, 30, 0),
('Potted Plant', 'decoration', 1, 1, false, false, 25, 0),
('Bookshelf', 'storage', 1, 2, false, false, 200, 0),
('Bed Single', 'bedroom', 2, 1, true, false, 300, 5),
('Bed Double', 'bedroom', 2, 2, true, false, 500, 10),
('TV Modern', 'electronics', 2, 1, false, false, 400, 15),
('Arcade Machine', 'electronics', 1, 1, false, false, 0, 50),
('Neon Sign', 'decoration', 2, 1, false, false, 0, 25),
('DJ Booth', 'electronics', 2, 2, false, false, 0, 100)
ON CONFLICT DO NOTHING;
`

export default function SetupPage() {
  const [copied, setCopied] = useState(false)
  const [checking, setChecking] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(SETUP_SQL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const checkDatabase = async () => {
    setChecking(true)
    try {
      const res = await fetch('/api/setup-db')
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setMessage(data.message)
      } else {
        setStatus('error')
        setMessage(data.message || data.error)
      }
    } catch {
      setStatus('error')
      setMessage('Failed to check database')
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-neon-red/20 p-4">
            <Database className="h-8 w-8 text-neon-red" />
          </div>
          <h1 className="font-pixel text-2xl text-foreground">EtherWorld Database Setup</h1>
          <p className="mt-2 text-muted-foreground">
            Copy the SQL below and run it in your Supabase SQL Editor
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <span className="font-pixel text-sm text-foreground">setup.sql</span>
            <Button
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy SQL
                </>
              )}
            </Button>
          </div>
          <pre className="max-h-96 overflow-auto p-4 font-mono text-xs text-muted-foreground">
            {SETUP_SQL}
          </pre>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Button
            onClick={checkDatabase}
            disabled={checking}
            className="gap-2 bg-neon-red hover:bg-neon-red/80"
          >
            {checking ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                Check Database Status
              </>
            )}
          </Button>

          {status !== 'idle' && (
            <div
              className={`rounded-lg p-4 ${
                status === 'success'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {message}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card/50 p-6">
          <h2 className="mb-4 font-pixel text-lg text-foreground">Instructions</h2>
          <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
            <li>Click &quot;Copy SQL&quot; to copy the setup script</li>
            <li>Go to your Supabase Dashboard</li>
            <li>Navigate to SQL Editor</li>
            <li>Paste and run the SQL</li>
            <li>Come back here and click &quot;Check Database Status&quot;</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
