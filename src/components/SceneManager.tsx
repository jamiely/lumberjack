import { useState } from 'react'
import AttractScreen from './scenes/AttractScreen'
import PlayScreen from './scenes/PlayScreen'
import GameOverScreen from './scenes/GameOverScreen'
import type { GameState } from '../game/GameState'
import type { CharacterType } from '../characters'
import { selectCharacterTypeFromCurrentUrl, isCharacterForcedByCurrentUrl, getRandomCharacterType } from '../utils/characterSelection'

export type Scene = 'attract' | 'play' | 'gameOver'

export default function SceneManager() {
  const [currentScene, setCurrentScene] = useState<Scene>('attract')
  const [finalScore, setFinalScore] = useState<number>(0)
  const [finalGameState, setFinalGameState] = useState<GameState | null>(null)
  // Track whether character is forced by URL parameter
  const [isCharacterForced] = useState<boolean>(() => isCharacterForcedByCurrentUrl())
  // Select character immediately on mount so it's available for attract screen
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType>(() => selectCharacterTypeFromCurrentUrl())
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
    // Select new random character if not forced by URL parameter
    if (!isCharacterForced) {
      setSelectedCharacter(getRandomCharacterType())
    }
    setCurrentScene('play')
  }

  const handleReturnToAttract = () => {
    // Select new character for next game: URL-forced character if present, otherwise new random
    if (!isCharacterForced) {
      setSelectedCharacter(getRandomCharacterType())
    }
    // If character is forced by URL, keep the current character (no change needed)
    setCurrentScene('attract')
  }

  switch (currentScene) {
    case 'attract':
      return (
        <AttractScreen 
          highScore={highScore}
          characterType={selectedCharacter}
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
          characterType={selectedCharacter}
          onRestart={handleRestart}
          onReturnToAttract={handleReturnToAttract}
        />
      )
  }
}