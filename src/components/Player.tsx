import UniversalSprite from './UniversalSprite'
import { getCharacterConfig, type CharacterType, type GameState } from '../characters'

interface PlayerProps {
  playerSide: 'left' | 'right'
  playerState: GameState
  gameOver: boolean
  leftPosition: number
  rightPosition: number
  bottomOffset: number
  characterType?: CharacterType
}

export default function Player({
  playerSide,
  playerState,
  gameOver,
  leftPosition,
  rightPosition,
  bottomOffset,
  characterType = 'lumberjack2'
}: PlayerProps) {
  const finalState = gameOver ? 'hit' : playerState
  const characterConfig = getCharacterConfig(characterType)
  const spriteState = characterConfig.mapGameStateToSprite(finalState)
  
  const { dimensions, positioning } = characterConfig.spriteConfig
  
  return (
    <div style={{
      position: 'absolute',
      left: playerSide === 'left' ? `${leftPosition - positioning.centeringOffset}px` : `${rightPosition - positioning.centeringOffset}px`,
      bottom: `${bottomOffset}px`,
      width: `${dimensions.width}px`,
      height: `${dimensions.height}px`,
      // Allow full sprite display without clipping
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end' // Bottom-align sprite with player area
    }}>
      <UniversalSprite 
        characterConfig={characterConfig}
        spriteState={spriteState}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  )
}