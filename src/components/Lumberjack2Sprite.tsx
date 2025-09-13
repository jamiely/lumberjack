import type { Lumberjack2SpriteConfig } from '../types/sprite'

type Lumberjack2State = 
  | 'idleFrame1' 
  | 'idleFrame2' 
  | 'chopAnticipation' 
  | 'chopImpact' 
  | 'chopFollowThrough' 
  | 'chopRecovery' 
  | 'hitStunned' 
  | 'knockedDown'

interface Lumberjack2SpriteProps {
  state: Lumberjack2State
  width: number
  height: number
  className?: string
  spriteConfig: Lumberjack2SpriteConfig
}

export default function Lumberjack2Sprite({ 
  state, 
  width, 
  height, 
  className = '',
  spriteConfig
}: Lumberjack2SpriteProps) {
  const coords = spriteConfig.coordinates[state]
  
  // Calculate background-position from sprite coordinates
  const bgPosX = -Math.round(coords[0] * spriteConfig.scaleFactor)
  const bgPosY = -Math.round(coords[1] * spriteConfig.scaleFactor)
  
  return (
    <div 
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: `url(${spriteConfig.sheetPath})`,
        backgroundSize: `${spriteConfig.scaledSheetWidth}px ${spriteConfig.scaledSheetHeight}px`,
        backgroundPosition: `${bgPosX}px ${bgPosY}px`,
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden'
      }}
    />
  )
}

export type { Lumberjack2State, Lumberjack2SpriteProps }