import Lumberjack2Sprite from './Lumberjack2Sprite'
import { SPRITE_PLAYER_WIDTH, SPRITE_PLAYER_HEIGHT, LUMBERJACK2_DISPLAY_SIZE, SPRITE_CENTERING_OFFSET } from '../constants'
import { getLumberjack2SpriteConfig, mapGameStateToLumberjack2Pose } from '../utils/spriteConfig'

interface PlayerProps {
  playerSide: 'left' | 'right'
  playerState: 'idle' | 'chopping' | 'hit'
  gameOver: boolean
  leftPosition: number
  rightPosition: number
  bottomOffset: number
}

export default function Player({
  playerSide,
  playerState,
  gameOver,
  leftPosition,
  rightPosition,
  bottomOffset
}: PlayerProps) {
  const finalState = gameOver ? 'hit' : playerState
  const mappedPose = mapGameStateToLumberjack2Pose(finalState)
  
  return (
    <div style={{
      position: 'absolute',
      left: playerSide === 'left' ? `${leftPosition - SPRITE_CENTERING_OFFSET}px` : `${rightPosition - SPRITE_CENTERING_OFFSET}px`,
      bottom: `${bottomOffset}px`,
      width: `${SPRITE_PLAYER_WIDTH}px`,
      height: `${SPRITE_PLAYER_HEIGHT}px`,
      // Allow full sprite display without clipping
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end' // Bottom-align sprite with player area
    }}>
      <Lumberjack2Sprite 
        state={mappedPose}
        width={LUMBERJACK2_DISPLAY_SIZE}
        height={LUMBERJACK2_DISPLAY_SIZE}
        spriteConfig={getLumberjack2SpriteConfig()}
      />
    </div>
  )
}