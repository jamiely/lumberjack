import { useEffect } from 'react'
import { useGameState } from '../../hooks/useGameState'
import { useKeyboardInput } from '../../hooks/useKeyboardInput'
import GameBoard from '../GameBoard'
import ScoreDisplay from '../ScoreDisplay'
import DebugPanel from '../DebugPanel'

interface PlayScreenProps {
  onGameOver: (score: number) => void
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
        onGameOver(gameState.score)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [gameState.gameOver, gameState.score, onGameOver])

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Timberman Game</h1>
      
      <ScoreDisplay 
        score={gameState.score}
        gameOver={gameState.gameOver}
      />
      
      <GameBoard 
        treeSegments={gameState.treeSegments}
        playerSide={gameState.playerSide}
        gameOver={gameState.gameOver}
      />

      <DebugPanel 
        showDebug={gameState.showDebug}
        playerSide={gameState.playerSide}
        score={gameState.score}
        gameOver={gameState.gameOver}
        treeSegments={gameState.treeSegments}
      />
    </div>
  )
}