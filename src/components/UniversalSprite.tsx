import type { CharacterConfig, PoseBounds } from '../characters/types'

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
  const pose = spriteConfig.poses[spriteState]
  
  if (!pose) {
    console.warn(`Invalid sprite state "${spriteState}" for character "${characterConfig.id}"`)
    // Fallback to first available state
    const fallbackState = Object.keys(spriteConfig.poses)[0]
    const fallbackPose = spriteConfig.poses[fallbackState]
    return renderSprite(spriteConfig, fallbackPose, width, height, className)
  }
  
  return renderSprite(spriteConfig, pose, width, height, className)
}

function renderSprite(
  spriteConfig: CharacterConfig['spriteConfig'], 
  pose: PoseBounds, 
  targetWidth: number, 
  targetHeight: number, 
  className: string
) {
  // Calculate aspect-ratio-preserving scale
  const scaleX = targetWidth / pose.width
  const scaleY = targetHeight / pose.height
  const scale = Math.min(scaleX, scaleY) // Preserve aspect ratio
  
  // Calculate scaled dimensions
  const scaledSheetWidth = spriteConfig.sheetWidth * scale
  const scaledSheetHeight = spriteConfig.sheetHeight * scale
  const scaledPoseWidth = pose.width * scale
  const scaledPoseHeight = pose.height * scale
  
  // Calculate clip coordinates as percentages
  const clipLeft = (pose.x / spriteConfig.sheetWidth) * 100
  const clipTop = (pose.y / spriteConfig.sheetHeight) * 100  
  const clipRight = ((pose.x + pose.width) / spriteConfig.sheetWidth) * 100
  const clipBottom = ((pose.y + pose.height) / spriteConfig.sheetHeight) * 100
  
  // Center the scaled pose within the target container
  const offsetX = (targetWidth - scaledPoseWidth) / 2
  const offsetY = (targetHeight - scaledPoseHeight) / 2
  
  return (
    <div 
      className={className}
      style={{
        width: `${targetWidth}px`,
        height: `${targetHeight}px`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          width: `${scaledSheetWidth}px`,
          height: `${scaledSheetHeight}px`,
          backgroundImage: `url(${spriteConfig.sheetPath})`,
          backgroundSize: `${scaledSheetWidth}px ${scaledSheetHeight}px`,
          backgroundPosition: '0 0',
          backgroundRepeat: 'no-repeat',
          position: 'absolute',
          left: `${offsetX - pose.x * scale}px`,
          top: `${offsetY - pose.y * scale}px`,
          clipPath: `polygon(${clipLeft}% ${clipTop}%, ${clipRight}% ${clipTop}%, ${clipRight}% ${clipBottom}%, ${clipLeft}% ${clipBottom}%)`
        }}
      />
    </div>
  )
}