import { useState } from 'react'
import AttractScreen from './scenes/AttractScreen'
import PlayScreen from './scenes/PlayScreen'
import GameOverScreen from './scenes/GameOverScreen'
import type { GameState } from '../game/GameState'

export type Scene = 'attract' | 'play' | 'gameOver'

export default function SceneManager() {
  const [currentScene, setCurrentScene] = useState<Scene>('attract')
  const [finalScore, setFinalScore] = useState<number>(0)
  const [finalGameState, setFinalGameState] = useState<GameState | null>(null)
  const [highScore, setHighScore] = useState<number>(() => {
    const stored = localStorage.getItem('lumberjack-high-score')
    return stored ? parseInt(stored, 10) : 0
  })

  const handleStartGame = () => {
    setCurrentScene('play')
  }

  const handleGameOver = (score: number, gameState: GameState) => {
    setFinalScore(score)
    setFinalGameState(gameState)
    
    // Update high score if needed
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('lumberjack-high-score', score.toString())
    }
    
    setCurrentScene('gameOver')
  }

  const handleRestart = () => {
    setCurrentScene('play')
  }

  const handleReturnToAttract = () => {
    setCurrentScene('attract')
  }

  switch (currentScene) {
    case 'attract':
      return (
        <AttractScreen 
          highScore={highScore}
          onStartGame={handleStartGame}
        />
      )
    
    case 'play':
      return (
        <PlayScreen 
          onGameOver={handleGameOver}
        />
      )
    
    case 'gameOver':
      return (
        <GameOverScreen 
          finalScore={finalScore}
          highScore={highScore}
          isNewHighScore={finalScore > 0 && finalScore === highScore}
          finalGameState={finalGameState}
          onRestart={handleRestart}
          onReturnToAttract={handleReturnToAttract}
        />
      )
  }
}