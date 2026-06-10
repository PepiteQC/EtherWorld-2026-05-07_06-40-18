'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { AvatarPreview } from './avatar-preview'
import { 
  BODY_TYPES, HAIR_STYLES, SKIN_COLORS, HAIR_COLORS, 
  EYE_STYLES, MOUTH_STYLES, EYEBROW_STYLES,
  TOP_STYLES, BOTTOM_STYLES, SHOE_STYLES, OUTFIT_COLORS,
  type Avatar 
} from '@/lib/types/database'

interface AvatarCreatorProps {
  initialAvatar: Avatar | null
  userId: string
}

type TabType = 'body' | 'face' | 'hair' | 'outfit'

export function AvatarCreator({ initialAvatar, userId }: AvatarCreatorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('body')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Avatar state
  const [bodyType, setBodyType] = useState(initialAvatar?.body_type || 'default')
  const [skinColor, setSkinColor] = useState(initialAvatar?.skin_color || '#f5d0c5')
  const [hairStyle, setHairStyle] = useState(initialAvatar?.hair_style || 'short')
  const [hairColor, setHairColor] = useState(initialAvatar?.hair_color || '#4a3728')
  const [faceData, setFaceData] = useState(initialAvatar?.face_data || {
    eyes: 'default',
    mouth: 'smile',
    eyebrows: 'default',
  })
  const [outfitData, setOutfitData] = useState(initialAvatar?.outfit_data || {
    top: 'tshirt',
    bottom: 'pants',
    shoes: 'sneakers',
    topColor: '#6366f1',
    bottomColor: '#3b82f6',
    shoesColor: '#1f2937',
  })

  const currentAvatar = {
    body_type: bodyType,
    skin_color: skinColor,
    hair_style: hairStyle,
    hair_color: hairColor,
    face_data: faceData,
    outfit_data: outfitData,
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    const supabase = createClient()

    try {
      if (initialAvatar) {
        // Update existing avatar
        const { error } = await supabase
          .from('avatars')
          .update({
            body_type: bodyType,
            skin_color: skinColor,
            hair_style: hairStyle,
            hair_color: hairColor,
            face_data: faceData,
            outfit_data: outfitData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', initialAvatar.id)

        if (error) throw error
      } else {
        // Create new avatar
        const { error } = await supabase
          .from('avatars')
          .insert({
            user_id: userId,
            body_type: bodyType,
            skin_color: skinColor,
            hair_style: hairStyle,
            hair_color: hairColor,
            face_data: faceData,
            outfit_data: outfitData,
          })

        if (error) throw error
      }

      setMessage({ type: 'success', text: 'Avatar saved successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save' })
    } finally {
      setSaving(false)
    }
  }

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'body', label: 'BODY', icon: '&#128100;' },
    { id: 'face', label: 'FACE', icon: '&#128566;' },
    { id: 'hair', label: 'HAIR', icon: '&#128135;' },
    { id: 'outfit', label: 'OUTFIT', icon: '&#128085;' },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Preview Panel */}
      <div className="pixel-window p-6">
        <h2 className="mb-4 font-[family-name:var(--font-pixel)] text-lg text-foreground">
          PREVIEW
        </h2>
        <div className="flex aspect-square items-center justify-center bg-muted">
          <AvatarPreview avatar={currentAvatar} size="large" />
        </div>
        
        {/* Save Button */}
        <div className="mt-4 space-y-2">
          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center font-mono text-xs ${
                message.type === 'success' ? 'text-secondary' : 'text-destructive'
              }`}
            >
              {message.text}
            </motion.p>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="pixel-button w-full bg-secondary py-3 font-[family-name:var(--font-pixel)] text-sm text-secondary-foreground disabled:opacity-50"
          >
            {saving ? 'SAVING...' : 'SAVE AVATAR'}
          </button>
        </div>
      </div>

      {/* Editor Panel */}
      <div className="pixel-window p-6">
        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pixel-button flex-1 px-2 py-2 font-mono text-xs ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <span dangerouslySetInnerHTML={{ __html: tab.icon }} className="mr-1" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'body' && (
            <BodyEditor
              bodyType={bodyType}
              setBodyType={setBodyType}
              skinColor={skinColor}
              setSkinColor={setSkinColor}
            />
          )}
          {activeTab === 'face' && (
            <FaceEditor
              faceData={faceData}
              setFaceData={setFaceData}
            />
          )}
          {activeTab === 'hair' && (
            <HairEditor
              hairStyle={hairStyle}
              setHairStyle={setHairStyle}
              hairColor={hairColor}
              setHairColor={setHairColor}
            />
          )}
          {activeTab === 'outfit' && (
            <OutfitEditor
              outfitData={outfitData}
              setOutfitData={setOutfitData}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// Body Editor Component
function BodyEditor({ 
  bodyType, setBodyType, skinColor, setSkinColor 
}: {
  bodyType: string
  setBodyType: (v: string) => void
  skinColor: string
  setSkinColor: (v: string) => void
}) {
  return (
    <>
      <div>
        <label className="mb-2 block font-mono text-xs text-muted-foreground">BODY TYPE</label>
        <div className="grid grid-cols-4 gap-2">
          {BODY_TYPES.map(type => (
            <button
              key={type}
              onClick={() => setBodyType(type)}
              className={`pixel-button py-2 font-mono text-xs capitalize ${
                bodyType === type ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block font-mono text-xs text-muted-foreground">SKIN COLOR</label>
        <div className="grid grid-cols-5 gap-2">
          {SKIN_COLORS.map(color => (
            <button
              key={color}
              onClick={() => setSkinColor(color)}
              className={`pixel-border h-10 w-full transition-transform ${
                skinColor === color ? 'scale-110 ring-2 ring-primary' : ''
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </>
  )
}

// Face Editor Component
function FaceEditor({ 
  faceData, setFaceData 
}: {
  faceData: { eyes: string; mouth: string; eyebrows: string }
  setFaceData: (v: { eyes: string; mouth: string; eyebrows: string }) => void
}) {
  return (
    <>
      <div>
        <label className="mb-2 block font-mono text-xs text-muted-foreground">EYES</label>
        <div className="grid grid-cols-4 gap-2">
          {EYE_STYLES.map(style => (
            <button
              key={style}
              onClick={() => setFaceData({ ...faceData, eyes: style })}
              className={`pixel-button py-2 font-mono text-xs capitalize ${
                faceData.eyes === style ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block font-mono text-xs text-muted-foreground">MOUTH</label>
        <div className="grid grid-cols-3 gap-2">
          {MOUTH_STYLES.map(style => (
            <button
              key={style}
              onClick={() => setFaceData({ ...faceData, mouth: style })}
              className={`pixel-button py-2 font-mono text-xs capitalize ${
                faceData.mouth === style ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block font-mono text-xs text-muted-foreground">EYEBROWS</label>
        <div className="grid grid-cols-3 gap-2">
          {EYEBROW_STYLES.map(style => (
            <button
              key={style}
              onClick={() => setFaceData({ ...faceData, eyebrows: style })}
              className={`pixel-button py-2 font-mono text-xs capitalize ${
                faceData.eyebrows === style ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

// Hair Editor Component
function HairEditor({ 
  hairStyle, setHairStyle, hairColor, setHairColor 
}: {
  hairStyle: string
  setHairStyle: (v: string) => void
  hairColor: string
  setHairColor: (v: string) => void
}) {
  return (
    <>
      <div>
        <label className="mb-2 block font-mono text-xs text-muted-foreground">HAIR STYLE</label>
        <div className="grid grid-cols-5 gap-2">
          {HAIR_STYLES.map(style => (
            <button
              key={style}
              onClick={() => setHairStyle(style)}
              className={`pixel-button py-2 font-mono text-xs capitalize ${
                hairStyle === style ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block font-mono text-xs text-muted-foreground">HAIR COLOR</label>
        <div className="grid grid-cols-5 gap-2">
          {HAIR_COLORS.map(color => (
            <button
              key={color}
              onClick={() => setHairColor(color)}
              className={`pixel-border h-10 w-full transition-transform ${
                hairColor === color ? 'scale-110 ring-2 ring-primary' : ''
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </>
  )
}

// Outfit Editor Component  
function OutfitEditor({ 
  outfitData, setOutfitData 
}: {
  outfitData: {
    top: string
    bottom: string
    shoes: string
    topColor: string
    bottomColor: string
    shoesColor: string
  }
  setOutfitData: (v: typeof outfitData) => void
}) {
  return (
    <>
      <div>
        <label className="mb-2 block font-mono text-xs text-muted-foreground">TOP</label>
        <div className="mb-2 grid grid-cols-3 gap-2">
          {TOP_STYLES.map(style => (
            <button
              key={style}
              onClick={() => setOutfitData({ ...outfitData, top: style })}
              className={`pixel-button py-2 font-mono text-xs capitalize ${
                outfitData.top === style ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-1">
          {OUTFIT_COLORS.map(color => (
            <button
              key={color}
              onClick={() => setOutfitData({ ...outfitData, topColor: color })}
              className={`pixel-border h-6 w-full ${
                outfitData.topColor === color ? 'ring-2 ring-primary' : ''
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block font-mono text-xs text-muted-foreground">BOTTOM</label>
        <div className="mb-2 grid grid-cols-5 gap-2">
          {BOTTOM_STYLES.map(style => (
            <button
              key={style}
              onClick={() => setOutfitData({ ...outfitData, bottom: style })}
              className={`pixel-button py-2 font-mono text-xs capitalize ${
                outfitData.bottom === style ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-1">
          {OUTFIT_COLORS.map(color => (
            <button
              key={color}
              onClick={() => setOutfitData({ ...outfitData, bottomColor: color })}
              className={`pixel-border h-6 w-full ${
                outfitData.bottomColor === color ? 'ring-2 ring-primary' : ''
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block font-mono text-xs text-muted-foreground">SHOES</label>
        <div className="mb-2 grid grid-cols-5 gap-2">
          {SHOE_STYLES.map(style => (
            <button
              key={style}
              onClick={() => setOutfitData({ ...outfitData, shoes: style })}
              className={`pixel-button py-2 font-mono text-xs capitalize ${
                outfitData.shoes === style ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-1">
          {OUTFIT_COLORS.map(color => (
            <button
              key={color}
              onClick={() => setOutfitData({ ...outfitData, shoesColor: color })}
              className={`pixel-border h-6 w-full ${
                outfitData.shoesColor === color ? 'ring-2 ring-primary' : ''
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </>
  )
}
