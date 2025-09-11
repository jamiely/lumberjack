import { useEffect } from 'react'
import { ScreenContainer } from '../ScreenContainer'
import GameBoard from '../GameBoard'
import { createInitialGameState } from '../../game/GameState'
import { useAudioContext } from '../../audio'

interface AttractScreenProps {
  highScore: number
  onStartGame: () => void
}

export default function AttractScreen({ highScore, onStartGame }: AttractScreenProps) {
  const initialGameState = createInitialGameState()
  const { audioState, isInitialized } = useAudioContext()

  useEffect(() => {
    const handleKeyPress = () => {
      // Any key press starts the game
      onStartGame()
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onStartGame])

  return (
    <ScreenContainer backgroundColor="#87CEEB">
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

        {/* Top Banner - High Score */}
        <div style={{
          position: 'fixed',
          top: '0px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '540px',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '10px 0',
          fontSize: '1.2rem',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: '#FFD700',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
        }}>
          All time highscore: {highScore.toLocaleString()}
        </div>

        {/* Vertical Center - Game Title */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: '3rem', 
            margin: '0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}>
           LUMBERJACK 
          </h1>
        </div>

        {/* Bottom Overlay - Controls and Play */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'rgba(44, 82, 52, 0.9)',
          padding: '20px 30px',
          borderRadius: '15px',
          border: '3px solid rgba(255,255,255,0.3)'
        }}>
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
            lineHeight: '1.3',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '0.3rem' }}>CONTROLS:</div>
            <div style={{ marginBottom: '0.3rem' }}>LEFT ARROW = CHOP LEFT</div>
            <div>RIGHT ARROW = CHOP RIGHT</div>
          </div>

          {/* Audio Enable Prompt */}
          {!isInitialized && (
            <div style={{ 
              marginTop: '1rem',
              padding: '10px 15px',
              backgroundColor: 'rgba(255, 165, 0, 0.2)',
              border: '2px solid rgba(255, 165, 0, 0.6)',
              borderRadius: '8px',
              fontSize: '0.8rem',
              color: '#ffcc80',
              lineHeight: '1.3',
              textAlign: 'center'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>
                🔊 AUDIO READY
              </div>
              <div>
                Audio will be enabled when you start playing.
                <br />
                Make sure your volume is at a comfortable level!
              </div>
            </div>
          )}

          {audioState === 'error' && (
            <div style={{ 
              marginTop: '1rem',
              padding: '10px 15px',
              backgroundColor: 'rgba(255, 0, 0, 0.2)',
              border: '2px solid rgba(255, 0, 0, 0.6)',
              borderRadius: '8px',
              fontSize: '0.8rem',
              color: '#ffaaaa',
              lineHeight: '1.3',
              textAlign: 'center'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>
                🔇 AUDIO UNAVAILABLE
              </div>
              <div>
                Audio could not be initialized.
                <br />
                The game will work without sound.
              </div>
            </div>
          )}
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