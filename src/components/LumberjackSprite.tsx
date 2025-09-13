import type { SpriteConfig } from '../constants'

interface LumberjackSpriteProps {
  state: 'idle' | 'chopping' | 'hit'
  width: number
  height: number
  className?: string
  spriteConfig: SpriteConfig
}

export default function LumberjackSprite({ 
  state, 
  width, 
  height, 
  className = '',
  spriteConfig
}: LumberjackSpriteProps) {
  const coords = spriteConfig.coordinates[state]
  
  // Calculate background-position from sprite coordinates with higher precision
  const bgPosX = -Math.round(coords[0] * spriteConfig.scaleFactor)
  const bgPosY = -Math.round(coords[1] * spriteConfig.scaleFactor)
  
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
        backgroundImage: `url(${spriteConfig.sheetPath})`,
        backgroundSize: `${spriteConfig.scaledSheetSize}px ${spriteConfig.scaledSheetSize}px`,
        backgroundPosition: `${bgPosX}px ${bgPosY}px`,
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
        clipPath: clipPath // Use clip-path for precise cropping
      }}
    />
  )
}