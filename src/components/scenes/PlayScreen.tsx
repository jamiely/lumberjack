import { useEffect } from 'react'
import { useGameState } from '../../hooks/useGameState'
import { useKeyboardInput } from '../../hooks/useKeyboardInput'
import { ScreenContainer } from '../ScreenContainer'
import GameBoard from '../GameBoard'
import ScoreDisplay from '../ScoreDisplay'
import DebugPanel from '../DebugPanel'
import type { GameState } from '../../game/GameState'

interface PlayScreenProps {
  onGameOver: (score: number, gameState: GameState) => void
}

export default function PlayScreen({ onGameOver }: PlayScreenProps) {
  const { gameState, chop, reset, toggleDebugMode } = useGameState()

  useKeyboardInput({
    onChopLeft: () => chop('left'),
    onChopRight: () => chop('right'),
    onReset: () => {
      if (gameState.gameOver) reset()
    },
    onToggleDebug: toggleDebugMode
  })

  // Detect game over and trigger callback
  useEffect(() => {
    if (gameState.gameOver) {
      // Small delay to allow player to see the final state
      const timer = setTimeout(() => {
        onGameOver(gameState.score, gameState)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [gameState.gameOver, gameState.score, onGameOver, gameState])

  return (
    <ScreenContainer backgroundColor="#2c5234">
      <div style={{ 
        position: 'relative',
        width: '100%',
        height: '100%',
        fontFamily: 'Arial, sans-serif'
      }}>
        {/* Full-screen GameBoard */}
        <GameBoard 
          treeSegments={gameState.treeSegments}
          playerSide={gameState.playerSide}
          gameOver={gameState.gameOver}
          mode="interactive"
        />
        
        {/* Hidden title for accessibility/tests */}
        <h1 style={{ 
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}>
          Lumberjack Game
        </h1>

        {/* Overlay UI Elements */}
        <div style={{ 
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          zIndex: 10,
          pointerEvents: 'none'
        }}>
          <ScoreDisplay 
            score={gameState.score}
            gameOver={gameState.gameOver}
          />
        </div>

        {/* Debug Panel Overlay */}
        <div style={{ 
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          right: '10px',
          zIndex: 10,
          pointerEvents: 'none'
        }}>
          <DebugPanel 
            showDebug={gameState.showDebug}
            playerSide={gameState.playerSide}
            score={gameState.score}
            gameOver={gameState.gameOver}
            treeSegments={gameState.treeSegments}
          />
        </div>
      </div>
    </ScreenContainer>
  )
}