import { SPRITE_SHEET_PATH, SPRITE_COORDS, SPRITE_SCALE_FACTOR, SPRITE_SCALED_SHEET_SIZE } from '../constants'

interface LumberjackSpriteProps {
  state: 'idle' | 'chopping' | 'hit'
  width: number
  height: number
  className?: string
}

export default function LumberjackSprite({ 
  state, 
  width, 
  height, 
  className = '' 
}: LumberjackSpriteProps) {
  const coords = SPRITE_COORDS[state]
  
  // Calculate background-position from sprite coordinates with higher precision
  const bgPosX = -Math.round(coords[0] * SPRITE_SCALE_FACTOR)
  const bgPosY = -Math.round(coords[1] * SPRITE_SCALE_FACTOR)
  
  // Special clipping for hit sprite to remove overlapping content
  let clipPath = 'none'
  if (state === 'hit') {
    // Clip the hit sprite to remove the right portion with overlapping character
    clipPath = 'polygon(0% 0%, 70% 0%, 70% 100%, 0% 100%)' // Show only left 70% of sprite
  }
  
  return (
    <div 
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: `url(${SPRITE_SHEET_PATH})`,
        backgroundSize: `${SPRITE_SCALED_SHEET_SIZE}px ${SPRITE_SCALED_SHEET_SIZE}px`,
        backgroundPosition: `${bgPosX}px ${bgPosY}px`,
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
        clipPath: clipPath // Use clip-path for precise cropping
      }}
    />
  )
}