interface ScoreDisplayProps {
  score: number
  gameOver: boolean
}

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div style={{ marginBottom: '10px', fontSize: '36px' }}>
      {score}
    </div>
  )
}