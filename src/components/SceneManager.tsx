import { useState } from 'react'
import AttractScreen from './scenes/AttractScreen'
import PlayScreen from './scenes/PlayScreen'
import GameOverScreen from './scenes/GameOverScreen'
import type { GameState } from '../game/GameState'
import type { CharacterType } from '../characters'
import { selectCharacterTypeFromCurrentUrl } from '../utils/characterSelection'

export type Scene = 'attract' | 'play' | 'gameOver'

export default function SceneManager() {
  const [currentScene, setCurrentScene] = useState<Scene>('attract')
  const [finalScore, setFinalScore] = useState<number>(0)
  const [finalGameState, setFinalGameState] = useState<GameState | null>(null)
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType | null>(null)
  const [highScore, setHighScore] = useState<number>(() => {
    const stored = localStorage.getItem('lumberjack-high-score')
    return stored ? parseInt(stored, 10) : 0
  })

  const handleStartGame = () => {
    // Select character for this game session
    const characterType = selectCharacterTypeFromCurrentUrl()
    setSelectedCharacter(characterType)
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
    // Select new character for restart
    const characterType = selectCharacterTypeFromCurrentUrl()
    setSelectedCharacter(characterType)
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
          characterType={selectedCharacter}
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