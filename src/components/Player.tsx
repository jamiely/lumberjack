import LumberjackSprite from './LumberjackSprite'
import { SPRITE_PLAYER_WIDTH, SPRITE_PLAYER_HEIGHT, SPRITE_DISPLAY_SIZE, SPRITE_CENTERING_OFFSET } from '../constants'

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
      <LumberjackSprite 
        state={finalState}
        width={SPRITE_DISPLAY_SIZE}
        height={SPRITE_DISPLAY_SIZE}
      />
    </div>
  )
}