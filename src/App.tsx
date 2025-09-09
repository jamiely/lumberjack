import './style.css'
import { useGameState } from './hooks/useGameState'
import { useKeyboardInput } from './hooks/useKeyboardInput'
import GameBoard from './components/GameBoard'
import ScoreDisplay from './components/ScoreDisplay'
import DebugPanel from './components/DebugPanel'

function App() {
  const { gameState, chop, reset, toggleDebugMode } = useGameState()

  useKeyboardInput({
    onChopLeft: () => chop('left'),
    onChopRight: () => chop('right'),
    onReset: () => {
      if (gameState.gameOver) reset()
    },
    onToggleDebug: toggleDebugMode
  })

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Timberman Game</h1>
      
      <ScoreDisplay 
        score={gameState.score}
        gameOver={gameState.gameOver}
      />
      
      <GameBoard 
        treeSegments={gameState.treeSegments}
        playerSide={gameState.playerSide}
        gameOver={gameState.gameOver}
      />

      <DebugPanel 
        showDebug={gameState.showDebug}
        playerSide={gameState.playerSide}
        score={gameState.score}
        gameOver={gameState.gameOver}
        treeSegments={gameState.treeSegments}
      />
    </div>
  )
}

export default App