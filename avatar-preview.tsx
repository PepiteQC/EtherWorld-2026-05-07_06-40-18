'use client'

import { motion } from 'framer-motion'

interface AvatarPreviewProps {
  avatar: {
    body_type: string
    skin_color: string
    hair_style: string
    hair_color: string
    face_data: {
      eyes: string
      mouth: string
      eyebrows: string
    }
    outfit_data: {
      top: string
      bottom: string
      shoes: string
      topColor: string
      bottomColor: string
      shoesColor: string
    }
  }
  size?: 'small' | 'medium' | 'large'
  animation?: 'idle' | 'walk' | 'wave' | 'dance'
}

const SIZES = {
  small: { width: 64, height: 96 },
  medium: { width: 128, height: 192 },
  large: { width: 200, height: 300 },
}

// Eye shapes based on style
const getEyeShape = (style: string) => {
  switch (style) {
    case 'round': return { width: '20%', height: '18%', borderRadius: '50%' }
    case 'almond': return { width: '22%', height: '14%', borderRadius: '50% 50% 40% 40%' }
    case 'cat': return { width: '24%', height: '12%', borderRadius: '50% 50% 30% 30%', transform: 'rotate(-5deg)' }
    case 'anime': return { width: '26%', height: '24%', borderRadius: '40%' }
    case 'tired': return { width: '18%', height: '10%', borderRadius: '50%' }
    case 'happy': return { width: '20%', height: '8%', borderRadius: '0 0 50% 50%' }
    case 'cool': return { width: '28%', height: '10%', borderRadius: '2px' }
    default: return { width: '18%', height: '16%', borderRadius: '50%' }
  }
}

// Mouth shapes
const getMouthShape = (style: string) => {
  switch (style) {
    case 'smile': return { width: '30%', height: '8%', borderRadius: '0 0 50% 50%', background: '#ff6b6b' }
    case 'neutral': return { width: '20%', height: '4%', borderRadius: '2px', background: '#ff6b6b' }
    case 'open': return { width: '25%', height: '15%', borderRadius: '50%', background: '#333' }
    case 'smirk': return { width: '25%', height: '6%', borderRadius: '0 0 50% 0', background: '#ff6b6b' }
    case 'pout': return { width: '15%', height: '10%', borderRadius: '50%', background: '#ff8888' }
    case 'grin': return { width: '35%', height: '10%', borderRadius: '0 0 50% 50%', background: '#fff' }
    default: return { width: '25%', height: '6%', borderRadius: '0 0 50% 50%', background: '#ff6b6b' }
  }
}

// Hair shapes
const getHairStyle = (style: string, color: string, width: number) => {
  const baseStyle = {
    position: 'absolute' as const,
    backgroundColor: color,
  }
  
  switch (style) {
    case 'short':
      return (
        <div style={{ ...baseStyle, top: '0', left: '10%', right: '10%', height: '25%', borderRadius: '50% 50% 0 0' }} />
      )
    case 'long':
      return (
        <>
          <div style={{ ...baseStyle, top: '0', left: '5%', right: '5%', height: '30%', borderRadius: '50% 50% 0 0' }} />
          <div style={{ ...baseStyle, top: '25%', left: '0', width: '15%', height: '40%', borderRadius: '0 0 50% 50%' }} />
          <div style={{ ...baseStyle, top: '25%', right: '0', width: '15%', height: '40%', borderRadius: '0 0 50% 50%' }} />
        </>
      )
    case 'curly':
      return (
        <>
          <div style={{ ...baseStyle, top: '0', left: '5%', right: '5%', height: '28%', borderRadius: '50% 50% 20% 20%' }} />
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ 
              ...baseStyle, 
              top: `${5 + i * 5}%`, 
              left: `${i * 20}%`, 
              width: '20%', 
              height: '15%', 
              borderRadius: '50%',
              opacity: 0.9
            }} />
          ))}
        </>
      )
    case 'spiky':
      return (
        <>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ 
              ...baseStyle, 
              top: '-5%', 
              left: `${10 + i * 18}%`, 
              width: '15%', 
              height: '30%', 
              borderRadius: '50% 50% 0 0',
              transform: `rotate(${(i - 2) * 15}deg)`
            }} />
          ))}
        </>
      )
    case 'mohawk':
      return (
        <div style={{ 
          ...baseStyle, 
          top: '-10%', 
          left: '35%', 
          width: '30%', 
          height: '40%', 
          borderRadius: '50% 50% 0 0'
        }} />
      )
    case 'ponytail':
      return (
        <>
          <div style={{ ...baseStyle, top: '0', left: '10%', right: '10%', height: '25%', borderRadius: '50% 50% 0 0' }} />
          <div style={{ ...baseStyle, top: '10%', right: '-5%', width: '20%', height: '45%', borderRadius: '50%' }} />
        </>
      )
    case 'braids':
      return (
        <>
          <div style={{ ...baseStyle, top: '0', left: '10%', right: '10%', height: '25%', borderRadius: '50% 50% 0 0' }} />
          <div style={{ ...baseStyle, top: '20%', left: '-5%', width: '15%', height: '50%', borderRadius: '0 0 50% 50%' }} />
          <div style={{ ...baseStyle, top: '20%', right: '-5%', width: '15%', height: '50%', borderRadius: '0 0 50% 50%' }} />
        </>
      )
    case 'afro':
      return (
        <div style={{ 
          ...baseStyle, 
          top: '-15%', 
          left: '-10%', 
          right: '-10%', 
          height: '50%', 
          borderRadius: '50%'
        }} />
      )
    case 'bob':
      return (
        <>
          <div style={{ ...baseStyle, top: '0', left: '5%', right: '5%', height: '25%', borderRadius: '50% 50% 0 0' }} />
          <div style={{ ...baseStyle, top: '20%', left: '0', right: '0', height: '20%', borderRadius: '0 0 30% 30%' }} />
        </>
      )
    case 'bald':
      return null
    default:
      return (
        <div style={{ ...baseStyle, top: '0', left: '10%', right: '10%', height: '25%', borderRadius: '50% 50% 0 0' }} />
      )
  }
}

export function AvatarPreview({ avatar, size = 'medium', animation = 'idle' }: AvatarPreviewProps) {
  const { width, height } = SIZES[size]
  const eyeStyle = getEyeShape(avatar.face_data.eyes)
  const mouthStyle = getMouthShape(avatar.face_data.mouth)

  // Animation variants
  const idleAnimation = {
    y: [0, -3, 0],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
  }

  return (
    <motion.div
      className="avatar-pixel relative"
      style={{ width, height }}
      animate={animation === 'idle' ? idleAnimation : undefined}
    >
      {/* Hair (back layer for some styles) */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        {getHairStyle(avatar.hair_style, avatar.hair_color, width)}
      </div>

      {/* Head */}
      <div
        className="absolute"
        style={{
          top: '5%',
          left: '15%',
          right: '15%',
          height: '30%',
          backgroundColor: avatar.skin_color,
          borderRadius: '50% 50% 45% 45%',
          zIndex: 1,
        }}
      >
        {/* Face features */}
        {/* Eyes */}
        <div
          className="absolute"
          style={{
            top: '35%',
            left: '18%',
            backgroundColor: '#333',
            ...eyeStyle,
          }}
        >
          <div 
            className="absolute"
            style={{
              top: '20%',
              left: '30%',
              width: '40%',
              height: '40%',
              backgroundColor: '#fff',
              borderRadius: '50%',
            }}
          />
        </div>
        <div
          className="absolute"
          style={{
            top: '35%',
            right: '18%',
            backgroundColor: '#333',
            ...eyeStyle,
          }}
        >
          <div 
            className="absolute"
            style={{
              top: '20%',
              left: '30%',
              width: '40%',
              height: '40%',
              backgroundColor: '#fff',
              borderRadius: '50%',
            }}
          />
        </div>

        {/* Eyebrows */}
        <div
          className="absolute"
          style={{
            top: '25%',
            left: '15%',
            width: '22%',
            height: '6%',
            backgroundColor: avatar.hair_color,
            borderRadius: '2px',
            transform: avatar.face_data.eyebrows === 'angry' ? 'rotate(10deg)' : 
                       avatar.face_data.eyebrows === 'worried' ? 'rotate(-10deg)' : 'none',
          }}
        />
        <div
          className="absolute"
          style={{
            top: '25%',
            right: '15%',
            width: '22%',
            height: '6%',
            backgroundColor: avatar.hair_color,
            borderRadius: '2px',
            transform: avatar.face_data.eyebrows === 'angry' ? 'rotate(-10deg)' : 
                       avatar.face_data.eyebrows === 'worried' ? 'rotate(10deg)' : 'none',
          }}
        />

        {/* Mouth */}
        <div
          className="absolute"
          style={{
            top: '65%',
            left: '50%',
            transform: 'translateX(-50%)',
            ...mouthStyle,
          }}
        />
      </div>

      {/* Body */}
      <div
        className="absolute"
        style={{
          top: '33%',
          left: '20%',
          right: '20%',
          height: '35%',
          backgroundColor: avatar.outfit_data.topColor,
          borderRadius: '20% 20% 0 0',
          zIndex: 1,
        }}
      >
        {/* Neck */}
        <div
          className="absolute"
          style={{
            top: '-15%',
            left: '35%',
            right: '35%',
            height: '20%',
            backgroundColor: avatar.skin_color,
          }}
        />
      </div>

      {/* Legs */}
      <div
        className="absolute"
        style={{
          top: '65%',
          left: '22%',
          width: '25%',
          height: '25%',
          backgroundColor: avatar.outfit_data.bottomColor,
          borderRadius: '0 0 30% 30%',
          zIndex: 1,
        }}
      />
      <div
        className="absolute"
        style={{
          top: '65%',
          right: '22%',
          width: '25%',
          height: '25%',
          backgroundColor: avatar.outfit_data.bottomColor,
          borderRadius: '0 0 30% 30%',
          zIndex: 1,
        }}
      />

      {/* Shoes */}
      <div
        className="absolute"
        style={{
          top: '88%',
          left: '18%',
          width: '28%',
          height: '12%',
          backgroundColor: avatar.outfit_data.shoesColor,
          borderRadius: '30% 30% 50% 50%',
          zIndex: 1,
        }}
      />
      <div
        className="absolute"
        style={{
          top: '88%',
          right: '18%',
          width: '28%',
          height: '12%',
          backgroundColor: avatar.outfit_data.shoesColor,
          borderRadius: '30% 30% 50% 50%',
          zIndex: 1,
        }}
      />

      {/* Arms */}
      <div
        className="absolute"
        style={{
          top: '38%',
          left: '5%',
          width: '18%',
          height: '28%',
          backgroundColor: avatar.skin_color,
          borderRadius: '40%',
          zIndex: 0,
        }}
      />
      <div
        className="absolute"
        style={{
          top: '38%',
          right: '5%',
          width: '18%',
          height: '28%',
          backgroundColor: avatar.skin_color,
          borderRadius: '40%',
          zIndex: 0,
        }}
      />

      {/* Gel-like shine overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
          borderRadius: '20%',
          zIndex: 10,
        }}
      />
    </motion.div>
  )
}
