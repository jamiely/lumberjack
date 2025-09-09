import { useEffect } from 'react'

interface AttractScreenProps {
  highScore: number
  onStartGame: () => void
}

export default function AttractScreen({ highScore, onStartGame }: AttractScreenProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Any key press starts the game
      onStartGame()
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onStartGame])

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#2c5234',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }}>
      <h1 style={{ 
        fontSize: '4rem', 
        marginBottom: '2rem',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
      }}>
        TIMBERMAN
      </h1>
      
      <div style={{ 
        fontSize: '1.5rem', 
        marginBottom: '3rem',
        padding: '1rem',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: '8px'
      }}>
        <div style={{ marginBottom: '1rem' }}>
          HIGH SCORE: {highScore.toLocaleString()}
        </div>
      </div>

      <div style={{ 
        fontSize: '1.2rem', 
        marginBottom: '2rem',
        animation: 'blink 2s infinite'
      }}>
        PRESS ANY BUTTON TO PLAY
      </div>

      <div style={{ 
        fontSize: '1rem', 
        color: '#cccccc',
        maxWidth: '400px',
        lineHeight: '1.5'
      }}>
        <div style={{ marginBottom: '0.5rem' }}>CONTROLS:</div>
        <div style={{ marginBottom: '0.5rem' }}>LEFT ARROW = CHOP LEFT</div>
        <div>RIGHT ARROW = CHOP RIGHT</div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}