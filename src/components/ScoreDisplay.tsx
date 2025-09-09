interface ScoreDisplayProps {
  score: number
  gameOver: boolean
}

export default function ScoreDisplay({ score, gameOver }: ScoreDisplayProps) {
  return (
    <>
      <div style={{ marginBottom: '10px', fontSize: '18px' }}>
        Score: {score}
      </div>
      <div style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
        Use left/right arrows to chop and switch sides • Press '?' to toggle debug info
      </div>
      {gameOver && (
        <div style={{ marginBottom: '10px', fontSize: '16px', color: 'red' }}>
          GAME OVER! Hit a branch. Press 'R' to restart.
        </div>
      )}
    </>
  )
}