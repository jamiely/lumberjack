interface ScoreDisplayProps {
  score: number
  gameOver: boolean
}

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div style={{ 
      marginBottom: '10px', 
      fontSize: '48px',
      color: '#ffffff',
      fontWeight: 'bold',
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
    }}>
      {score}
    </div>
  )
}