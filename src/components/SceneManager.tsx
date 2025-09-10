import { useState } from 'react'
import AttractScreen from './scenes/AttractScreen'
import PlayScreen from './scenes/PlayScreen'
import GameOverScreen from './scenes/GameOverScreen'

export type Scene = 'attract' | 'play' | 'gameOver'

export default function SceneManager() {
  const [currentScene, setCurrentScene] = useState<Scene>('attract')
  const [finalScore, setFinalScore] = useState<number>(0)
  const [highScore, setHighScore] = useState<number>(() => {
    const stored = localStorage.getItem('lumberjack-high-score')
    return stored ? parseInt(stored, 10) : 0
  })

  const handleStartGame = () => {
    setCurrentScene('play')
  }

  const handleGameOver = (score: number) => {
    setFinalScore(score)
    
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
          onRestart={handleRestart}
          onReturnToAttract={handleReturnToAttract}
        />
      )
  }
}