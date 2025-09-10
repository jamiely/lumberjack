import type { TreeSegment } from '../game/GameState'

interface GameBoardProps {
  treeSegments: TreeSegment[]
  playerSide: 'left' | 'right'
  gameOver: boolean
  mode?: 'interactive' | 'static' | 'frozen'
}

export default function GameBoard({ treeSegments, playerSide, gameOver, mode = 'interactive' }: GameBoardProps) {
  const getOpacity = () => {
    if (mode === 'frozen') return 0.7
    if (mode === 'static') return 0.8
    return 1
  }

  const getPointerEvents = () => {
    return mode === 'interactive' ? 'auto' : 'none'
  }

  return (
    <div style={{ 
      position: 'relative', 
      width: '540px', 
      height: '960px', 
      backgroundColor: '#87CEEB',
      border: '2px solid #333',
      overflow: 'hidden',
      opacity: getOpacity(),
      pointerEvents: getPointerEvents()
    }}>
      {/* Tree segments */}
      {treeSegments.map((segment, index) => (
        <div key={index}>
          {/* Tree trunk segment */}
          <div style={{
            position: 'absolute',
            left: '236px',
            bottom: `${index * 115 + 38}px`,
            width: '67px',
            height: '115px',
            backgroundColor: '#8B4513',
            border: '2px solid #000'
          }} />
          
          {/* Branch */}
          {segment.branchSide !== 'none' && (
            <div style={{
              position: 'absolute',
              left: segment.branchSide === 'left' ? '169px' : '304px',
              bottom: `${index * 115 + 77}px`,
              width: '67px',
              height: '38px',
              backgroundColor: '#654321',
              border: '2px solid #000'
            }} />
          )}
        </div>
      ))}

      {/* Player */}
      <div style={{
        position: 'absolute',
        left: playerSide === 'left' ? '135px' : '337px',
        bottom: '38px',
        width: '40px',
        height: '77px',
        backgroundColor: gameOver ? 'red' : 'blue',
        border: '2px solid #000'
      }} />
    </div>
  )
}