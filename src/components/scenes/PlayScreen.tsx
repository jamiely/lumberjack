import { useEffect } from 'react'
import { useGameState } from '../../hooks/useGameState'
import { useGameInput } from '../../hooks/useGameInput'
import { useAudioEventHandlers } from '../../hooks/useAudioEventHandlers'
import { useGameAudioSystem } from '../../hooks/useGameAudioSystem'
import { ScreenContainer } from '../ScreenContainer'
import GameBoard from '../GameBoard'
import ScoreDisplay from '../ScoreDisplay'
import DebugPanel from '../DebugPanel'
import { TimerBar } from '../TimerBar'
import type { GameState } from '../../game/GameState'
import type { CharacterType } from '../../characters'
import styles from '../../styles/layouts/PlayScreenLayout.module.css'

interface PlayScreenProps {
  onGameOver: (score: number, gameState: GameState) => void
  characterType?: CharacterType | null
}

export default function PlayScreen({ onGameOver, characterType }: PlayScreenProps) {
  const { gameState, chop, reset, toggleDebugMode, stateMachine } = useGameState()
  
  // Initialize audio event handlers (subscribes to game events)
  useAudioEventHandlers()
  
  // Initialize state machine audio handlers
  useGameAudioSystem(gameState, stateMachine)

  // Unified input handling (keyboard + mouse)
  useGameInput({
    onChopLeft: () => chop('left'),
    onChopRight: () => chop('right'),
    onReset: () => {
      if (gameState.gameOver) reset()
    },
    onToggleDebug: toggleDebugMode
  }, {
    gameOver: gameState.gameOver
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
    <ScreenContainer backgroundColor="transparent">
      <div className={styles.playScreenContainer}>
        {/* Full-screen GameBoard */}
        <GameBoard 
          treeSegments={gameState.treeSegments}
          playerSide={gameState.playerSide}
          playerState={gameState.playerState}
          gameOver={gameState.gameOver}
          mode="interactive"
          animatedSegments={gameState.animatedSegments}
          characterType={characterType}
        />
        
        {/* Hidden title for accessibility/tests */}
        <h1 className={styles.hiddenTitle}>
          Lumberjack Game
        </h1>

        {/* Timer Bar */}
        <div className={styles.timerBarContainer}>
          <TimerBar 
            timeRemaining={gameState.timeRemaining}
            maxTime={gameState.maxTime}
          />
        </div>

        {/* Overlay UI Elements */}
        <div className={styles.scoreDisplayContainer}>
          <ScoreDisplay 
            score={gameState.score}
            gameOver={gameState.gameOver}
          />
        </div>

        {/* Debug Panel Overlay */}
        <div className={styles.debugPanelContainer}>
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