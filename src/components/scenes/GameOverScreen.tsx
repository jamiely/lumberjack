import { useEffect, useState } from 'react'

interface GameOverScreenProps {
  finalScore: number
  highScore: number
  isNewHighScore: boolean
  onRestart: () => void
  onReturnToAttract: () => void
}

export default function GameOverScreen({ 
  finalScore, 
  highScore, 
  isNewHighScore, 
  onRestart, 
  onReturnToAttract 
}: GameOverScreenProps) {
  const [timeRemaining, setTimeRemaining] = useState(5)

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
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }}>
      <h1 style={{ 
        fontSize: '4rem', 
        marginBottom: '2rem',
        color: '#ff4444',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
      }}>
        GAME OVER!
      </h1>
      
      <div style={{ 
        fontSize: '2rem', 
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '8px'
      }}>
        YOUR SCORE: {finalScore.toLocaleString()}
      </div>

      <div style={{ 
        fontSize: '1.5rem', 
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '8px'
      }}>
        HIGH SCORE: {highScore.toLocaleString()}
      </div>

      {isNewHighScore && (
        <div style={{ 
          fontSize: '1.8rem', 
          marginBottom: '2rem',
          color: '#ffdd44',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          animation: 'pulse 1.5s infinite'
        }}>
          ★ NEW HIGH SCORE! ★
        </div>
      )}

      <div style={{ 
        fontSize: '1.2rem', 
        marginBottom: '2rem',
        animation: 'blink 2s infinite'
      }}>
        PRESS ANY BUTTON TO PLAY AGAIN
      </div>

      <div style={{ 
        fontSize: '1rem', 
        color: '#cccccc'
      }}>
        Returning to attract in {timeRemaining}...
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
  )
}