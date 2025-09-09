import type { TreeSegment } from '../game/GameState'

interface DebugPanelProps {
  showDebug: boolean
  playerSide: 'left' | 'right'
  score: number
  gameOver: boolean
  treeSegments: TreeSegment[]
}

export default function DebugPanel({ 
  showDebug, 
  playerSide, 
  score, 
  gameOver, 
  treeSegments 
}: DebugPanelProps) {
  if (!showDebug) return null

  return (
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
  )
}