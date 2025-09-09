import { useState, useEffect } from 'react'
import './style.css'

interface TreeSegment {
  branchSide: 'left' | 'right' | 'none'
}

function App() {
  const [playerSide, setPlayerSide] = useState<'left' | 'right'>('left')
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [treeSegments, setTreeSegments] = useState<TreeSegment[]>([
    { branchSide: 'none' },
    { branchSide: 'right' },
    { branchSide: 'none' },
    { branchSide: 'left' },
    { branchSide: 'none' },
    { branchSide: 'right' },
    { branchSide: 'none' },
    { branchSide: 'left' }
  ])

  const generateRandomBranch = (): TreeSegment => {
    const random = Math.random()
    if (random < 0.3) return { branchSide: 'left' }
    if (random < 0.6) return { branchSide: 'right' }
    return { branchSide: 'none' }
  }

  const chop = (side: 'left' | 'right') => {
    if (gameOver) return

    const bottomSegment = treeSegments[0]
    
    if (bottomSegment.branchSide === side) {
      setGameOver(true)
      return
    }

    setPlayerSide(side)
    setScore(prev => prev + 1)
    
    setTreeSegments(prev => [
      ...prev.slice(1),
      generateRandomBranch()
    ])
  }

  const resetGame = () => {
    setPlayerSide('left')
    setScore(0)
    setGameOver(false)
    setTreeSegments([
      { branchSide: 'none' },
      { branchSide: 'right' },
      { branchSide: 'none' },
      { branchSide: 'left' },
      { branchSide: 'none' },
      { branchSide: 'right' },
      { branchSide: 'none' },
      { branchSide: 'left' }
    ])
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowLeft':
          chop('left')
          break
        case 'ArrowRight':
          chop('right')
          break
        case 'r':
          if (gameOver) resetGame()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameOver, treeSegments])

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Timberman Game</h1>
      <div style={{ marginBottom: '10px', fontSize: '18px' }}>
        Score: {score}
      </div>
      <div style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
        Use left/right arrows to chop and switch sides
      </div>
      {gameOver && (
        <div style={{ marginBottom: '10px', fontSize: '16px', color: 'red' }}>
          GAME OVER! Hit a branch. Press 'R' to restart.
        </div>
      )}
      
      <div style={{ 
        position: 'relative', 
        width: '400px', 
        height: '500px', 
        backgroundColor: '#87CEEB',
        border: '2px solid #333',
        overflow: 'hidden',
        margin: '0 auto'
      }}>
        {/* Tree segments */}
        {treeSegments.map((segment, index) => (
          <div key={index}>
            {/* Tree trunk segment */}
            <div style={{
              position: 'absolute',
              left: '175px',
              bottom: `${index * 60 + 20}px`,
              width: '50px',
              height: '60px',
              backgroundColor: '#8B4513',
              border: '2px solid #000'
            }} />
            
            {/* Branch */}
            {segment.branchSide !== 'none' && (
              <div style={{
                position: 'absolute',
                left: segment.branchSide === 'left' ? '125px' : '225px',
                bottom: `${index * 60 + 40}px`,
                width: '50px',
                height: '20px',
                backgroundColor: '#654321',
                border: '2px solid #000'
              }} />
            )}
          </div>
        ))}

        {/* Player */}
        <div style={{
          position: 'absolute',
          left: playerSide === 'left' ? '100px' : '250px',
          bottom: '20px',
          width: '30px',
          height: '40px',
          backgroundColor: gameOver ? 'red' : 'blue',
          border: '2px solid #000'
        }} />
      </div>
    </div>
  )
}

export default App