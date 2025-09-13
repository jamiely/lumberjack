import type { CharacterConfig } from '../characters/types'

interface UniversalSpriteProps {
  characterConfig: CharacterConfig
  spriteState: string
  width: number
  height: number
  className?: string
}

export default function UniversalSprite({ 
  characterConfig, 
  spriteState, 
  width, 
  height, 
  className = '' 
}: UniversalSpriteProps) {
  const { spriteConfig } = characterConfig
  const coords = spriteConfig.coordinates[spriteState]
  
  if (!coords) {
    console.warn(`Invalid sprite state "${spriteState}" for character "${characterConfig.id}"`)
    // Fallback to first available state
    const fallbackState = Object.keys(spriteConfig.coordinates)[0]
    const fallbackCoords = spriteConfig.coordinates[fallbackState]
    return renderSprite(spriteConfig, fallbackCoords, width, height, className, characterConfig.id, spriteState)
  }
  
  return renderSprite(spriteConfig, coords, width, height, className, characterConfig.id, spriteState)
}

function renderSprite(
  spriteConfig: CharacterConfig['spriteConfig'], 
  coords: [number, number, number, number], 
  width: number, 
  height: number, 
  className: string,
  characterId: string,
  spriteState: string
) {
  // Calculate background-position from sprite coordinates
  const bgPosX = -Math.round(coords[0] * spriteConfig.scaleFactor)
  const bgPosY = -Math.round(coords[1] * spriteConfig.scaleFactor)
  
  // Character-specific rendering logic
  let clipPath = 'none'
  let backgroundSize = `${Math.floor(1023 * spriteConfig.scaleFactor)}px ${Math.floor(1023 * spriteConfig.scaleFactor)}px` // Default for lumberjack1
  
  // Handle lumberjack1-specific features
  if (characterId === 'lumberjack1' && spriteState === 'hit') {
    // Special clipping for hit sprite to remove overlapping content
    clipPath = 'polygon(0% 0%, 70% 0%, 70% 100%, 0% 100%)'
  }
  
  // Handle lumberjack2-specific features  
  if (characterId === 'lumberjack2') {
    backgroundSize = `${Math.floor(768 * spriteConfig.scaleFactor)}px ${Math.floor(768 * spriteConfig.scaleFactor)}px`
  }
  
  return (
    <div 
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: `url(${spriteConfig.sheetPath})`,
        backgroundSize: backgroundSize,
        backgroundPosition: `${bgPosX}px ${bgPosY}px`,
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
        clipPath: clipPath
      }}
    />
  )
}