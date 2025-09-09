import { TreeSegment } from '../game/GameState'

interface GameBoardProps {
  treeSegments: TreeSegment[]
  playerSide: 'left' | 'right'
  gameOver: boolean
}

export default function GameBoard({ treeSegments, playerSide, gameOver }: GameBoardProps) {
  return (
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
  )
}