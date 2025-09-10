import { useEffect } from 'react'
import { ScreenContainer } from '../ScreenContainer'
import GameBoard from '../GameBoard'
import { createInitialGameState } from '../../game/GameState'

interface AttractScreenProps {
  highScore: number
  onStartGame: () => void
}

export default function AttractScreen({ highScore, onStartGame }: AttractScreenProps) {
  const initialGameState = createInitialGameState()

  useEffect(() => {
    const handleKeyPress = () => {
      // Any key press starts the game
      onStartGame()
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onStartGame])

  return (
    <ScreenContainer backgroundColor="#2c5234">
      <div style={{ 
        position: 'relative',
        width: '100%',
        height: '100%',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center'
      }}>
        {/* Full-screen GameBoard */}
        <GameBoard 
          treeSegments={initialGameState.treeSegments}
          playerSide={initialGameState.playerSide}
          gameOver={initialGameState.gameOver}
          mode="static"
        />

        {/* Overlay text content */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'rgba(44, 82, 52, 0.9)',
          padding: '30px',
          borderRadius: '15px',
          border: '3px solid rgba(255,255,255,0.3)'
        }}>
          <h1 style={{ 
            fontSize: '3rem', 
            margin: '0 0 1rem 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}>
           LUMBERJACK 
          </h1>
          
          <div style={{ 
            fontSize: '1.2rem', 
            marginBottom: '1.5rem',
            padding: '0.8rem',
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: '8px'
          }}>
            HIGH SCORE: {highScore.toLocaleString()}
          </div>

          <div style={{ 
            fontSize: '1rem', 
            marginBottom: '1rem',
            animation: 'blink 2s infinite',
            fontWeight: 'bold'
          }}>
            PRESS ANY BUTTON TO PLAY
          </div>

          <div style={{ 
            fontSize: '0.9rem', 
            color: '#cccccc',
            lineHeight: '1.3'
          }}>
            <div style={{ marginBottom: '0.3rem' }}>CONTROLS:</div>
            <div style={{ marginBottom: '0.3rem' }}>LEFT ARROW = CHOP LEFT</div>
            <div>RIGHT ARROW = CHOP RIGHT</div>
          </div>
        </div>

        <style>{`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.3; }
          }
        `}</style>
      </div>
    </ScreenContainer>
  )
}