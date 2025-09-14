import { useState, useMemo } from 'react'
import AttractScreen from './scenes/AttractScreen'
import PlayScreen from './scenes/PlayScreen'
import GameOverScreen from './scenes/GameOverScreen'
import type { GameState } from '../game/GameState'
import type { CharacterType } from '../characters'
import { selectCharacterTypeFromCurrentUrl, isCharacterForcedByCurrentUrl } from '../utils/characterSelection'
import { HighScoreService, CharacterSelectionService } from '../services'

export type Scene = 'attract' | 'play' | 'gameOver'

export default function SceneManager() {
  // Initialize services
  const highScoreService = useMemo(() => new HighScoreService(), [])
  const characterSelectionService = useMemo(() => {
    const forcedCharacter = isCharacterForcedByCurrentUrl() ? selectCharacterTypeFromCurrentUrl() : undefined
    return new CharacterSelectionService(forcedCharacter)
  }, [])

  const [currentScene, setCurrentScene] = useState<Scene>('attract')
  const [finalScore, setFinalScore] = useState<number>(0)
  const [finalGameState, setFinalGameState] = useState<GameState | null>(null)
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false)
  // Select character immediately on mount so it's available for attract screen
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType>(() => characterSelectionService.selectCharacter())
  const [highScore, setHighScore] = useState<number>(() => highScoreService.getHighScore())

  const handleStartGame = () => {
    setCurrentScene('play')
  }

  const handleGameOver = (score: number, gameState: GameState) => {
    setFinalScore(score)
    setFinalGameState(gameState)
    
    // Check if this is a new high score before updating
    const newHighScore = highScoreService.isNewHighScore(score)
    setIsNewHighScore(newHighScore)
    
    // Update high score if needed
    if (newHighScore) {
      highScoreService.saveHighScore(score)
      setHighScore(score)
    }
    
    setCurrentScene('gameOver')
  }

  const handleRestart = () => {
    // Select new character if not forced by URL parameter
    if (!characterSelectionService.isCharacterForced()) {
      setSelectedCharacter(characterSelectionService.getRandomCharacter())
    }
    setCurrentScene('play')
  }

  const handleReturnToAttract = () => {
    // Select new character for next game if not forced by URL parameter
    if (!characterSelectionService.isCharacterForced()) {
      setSelectedCharacter(characterSelectionService.getRandomCharacter())
    }
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
          isNewHighScore={isNewHighScore}
          finalGameState={finalGameState}
          characterType={selectedCharacter}
          onRestart={handleRestart}
          onReturnToAttract={handleReturnToAttract}
        />
      )
  }
}