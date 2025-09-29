import { useEffect, useCallback } from 'react'
import { ScreenContainer } from '../ScreenContainer'
import GameBoard from '../GameBoard'
import { createInitialGameState } from '../../game/GameState'
import { useAudioContext, useGameAudio } from '../../audio'
import type { CharacterType } from '../../characters'

interface AttractScreenProps {
  highScore: number
  characterType: CharacterType
  onStartGame: () => void
}

export default function AttractScreen({ highScore, characterType, onStartGame }: AttractScreenProps) {
  const initialGameState = createInitialGameState()
  const { initializeAudio, isInitialized, audioState } = useAudioContext()
  const { playBackgroundMusic } = useGameAudio()

  // Initialize audio and play background music on user interaction
  const initializeAudioOnFirstInteraction = useCallback(() => {
    // If audio is not initialized, initialize it first
    if (!isInitialized) {
      initializeAudio()
        .then(() => {
          console.log('Audio initialized on first interaction in AttractScreen, starting background music')
          playBackgroundMusic()
        })
        .catch(error => {
          console.warn('Failed to initialize audio:', error)
        })
    } else {
      // Audio is already initialized, just start background music
      console.log('Audio already initialized, starting background music on user interaction')
      playBackgroundMusic()
    }
  }, [isInitialized, initializeAudio, playBackgroundMusic])

  useEffect(() => {
    const handleKeyPress = () => {
      // Initialize audio on first keypress
      initializeAudioOnFirstInteraction()
      // Any key press starts the game
      onStartGame()
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onStartGame, initializeAudioOnFirstInteraction])

  // Add click handler to initialize audio and start game
  useEffect(() => {
    const handleClick = () => {
      // Initialize audio on first click and start the game
      initializeAudioOnFirstInteraction()
      onStartGame()
    }

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [initializeAudioOnFirstInteraction, onStartGame])

  return (
    <ScreenContainer backgroundColor="transparent">
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
          playerState={initialGameState.playerState}
          gameOver={initialGameState.gameOver}
          mode="static"
          characterType={characterType}
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
          textAlign: 'center',
          width: '540px'
        }}>
          <h1 style={{ 
            fontSize: '3rem', 
            margin: '0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}>
            <img 
              src="/images/title.png" 
              alt="Lumberjack" 
              style={{ width: '90%', height: 'auto', display: 'block', margin: '0 auto' }} 
            />
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
