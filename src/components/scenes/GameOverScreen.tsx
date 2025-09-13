import { useEffect, useState } from 'react'
import { ScreenContainer } from '../ScreenContainer'
import GameBoard from '../GameBoard'
import type { GameState } from '../../game/GameState'
import type { CharacterType } from '../../characters'

interface GameOverScreenProps {
  finalScore: number
  highScore: number
  isNewHighScore: boolean
  finalGameState: GameState | null
  characterType: CharacterType | null
  onRestart: () => void
  onReturnToAttract: () => void
}

export default function GameOverScreen({ 
  finalScore, 
  highScore, 
  isNewHighScore, 
  finalGameState,
  characterType,
  onRestart, 
  onReturnToAttract 
}: GameOverScreenProps) {
  const [, setTimeRemaining] = useState(5)

  useEffect(() => {
    const handleKeyPress = () => {
      // Any key press restarts the game immediately
      onRestart()
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onRestart])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          onReturnToAttract()
          return 5 // Reset for next time
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onReturnToAttract])

  return (
    <ScreenContainer backgroundColor="#1a1a1a">
      <div style={{ 
        position: 'relative',
        width: '100%',
        height: '100%',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center'
      }}>
        {/* Full-screen GameBoard */}
        {finalGameState && (
          <GameBoard 
            treeSegments={finalGameState.treeSegments}
            playerSide={finalGameState.playerSide}
            playerState={finalGameState.playerState}
            gameOver={finalGameState.gameOver}
            mode="frozen"
            animatedSegments={finalGameState.animatedSegments}
            characterType={characterType}
          />
        )}

        {/* Overlay score and text content */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'rgba(26, 26, 26, 0.9)',
          padding: '30px',
          borderRadius: '15px',
          border: '3px solid rgba(255,68,68,0.5)'
        }}>
          <h1 style={{ 
            fontSize: '3rem', 
            margin: '0 0 1rem 0',
            color: '#ff4444',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}>
            GAME OVER!
          </h1>
          
          <div style={{ 
            fontSize: '1.5rem', 
            marginBottom: '1rem',
            padding: '0.8rem',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '8px'
          }}>
            YOUR SCORE: {finalScore.toLocaleString()}
          </div>

          <div style={{ 
            fontSize: '1.2rem', 
            marginBottom: '1rem',
            padding: '0.8rem',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '8px'
          }}>
            HIGH SCORE: {highScore.toLocaleString()}
          </div>

          {isNewHighScore && (
            <div style={{ 
              fontSize: '1.5rem', 
              marginBottom: '1rem',
              color: '#ffdd44',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              animation: 'pulse 1.5s infinite'
            }}>
              ★ NEW HIGH SCORE! ★
            </div>
          )}

          <div style={{ 
            fontSize: '1rem', 
            marginBottom: '1rem',
            animation: 'blink 2s infinite',
            fontWeight: 'bold'
          }}>
            PRESS ANY BUTTON TO PLAY AGAIN
          </div>

        </div>

        <style>{`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.3; }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}</style>
      </div>
    </ScreenContainer>
  )
}