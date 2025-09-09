import { useState, useEffect } from 'react'
import './style.css'

interface TreeSegment {
  branchSide: 'left' | 'right' | 'none'
}

function App() {
  const [playerSide, setPlayerSide] = useState<'left' | 'right'>('left')
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [showDebug, setShowDebug] = useState(false)
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
        case '?':
          setShowDebug(prev => !prev)
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
        Use left/right arrows to chop and switch sides • Press '?' to toggle debug info
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

      {/* Debug Panel */}
      {showDebug && (
        <div style={{
          marginTop: '20px',
          backgroundColor: '#f0f0f0',
          border: '2px solid #333',
          padding: '15px',
          fontFamily: 'monospace',
          fontSize: '12px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>Game State</h4>
              <div>Player Side: {playerSide}</div>
              <div>Score: {score}</div>
              <div>Game Over: {gameOver ? 'Yes' : 'No'}</div>
              <div>Total Segments: {treeSegments.length}</div>
            </div>
            
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>Current Tree Segment</h4>
              <div>Index: 0 (bottom segment)</div>
              <div>Branch Side: {treeSegments[0]?.branchSide || 'none'}</div>
              <div>Will Hit Branch: {treeSegments[0]?.branchSide === playerSide ? 'YES' : 'No'}</div>
              <div>Segment Y: 20px</div>
            </div>
            
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>Player Coordinates</h4>
              <div>X: {playerSide === 'left' ? '100px' : '250px'}</div>
              <div>Y: 20px</div>
              <div>Tree Center X: 175px</div>
              <div>Distance from Tree: {playerSide === 'left' ? '75px left' : '75px right'}</div>
            </div>
          </div>
          
          <div style={{ marginTop: '10px' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>All Tree Segments (bottom to top)</h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {treeSegments.map((segment, index) => (
                <span key={index} style={{ 
                  padding: '2px 6px',
                  backgroundColor: index === 0 ? '#ddd' : '#fff',
                  border: index === 0 ? '2px solid #333' : '1px solid #999',
                  borderRadius: '3px',
                  color: '#333'
                }}>
                  {index}: {segment.branchSide}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App