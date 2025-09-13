import { useState } from 'react'
import Player from './Player'
import { getCharacterTypes, type CharacterType } from '../characters'

export default function CharacterDemo() {
  const [currentCharacter, setCurrentCharacter] = useState<CharacterType>('lumberjack2')
  const [playerState, setPlayerState] = useState<'idle' | 'chopping' | 'hit'>('idle')
  const availableCharacters = getCharacterTypes()

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f0f0f0',
      minHeight: '400px'
    }}>
      <h2>Character Swapping Demo</h2>
      
      {/* Character Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Select Character: </label>
        <select 
          value={currentCharacter} 
          onChange={(e) => setCurrentCharacter(e.target.value as CharacterType)}
          style={{ marginRight: '20px', padding: '5px' }}
        >
          {availableCharacters.map(character => (
            <option key={character} value={character}>
              {character === 'lumberjack1' ? 'Classic Lumberjack' : 'Enhanced Lumberjack'}
            </option>
          ))}
        </select>
        
        <label style={{ marginRight: '10px' }}>State: </label>
        <select 
          value={playerState} 
          onChange={(e) => setPlayerState(e.target.value as 'idle' | 'chopping' | 'hit')}
          style={{ padding: '5px' }}
        >
          <option value="idle">Idle</option>
          <option value="chopping">Chopping</option>
          <option value="hit">Hit</option>
        </select>
      </div>

      {/* Character Display */}
      <div style={{
        position: 'relative',
        width: '600px',
        height: '300px',
        backgroundColor: '#87CEEB',
        border: '2px solid #000',
        margin: '20px 0'
      }}>
        <Player
          playerSide="left"
          playerState={playerState}
          gameOver={false}
          leftPosition={100}
          rightPosition={400}
          bottomOffset={50}
          characterType={currentCharacter}
        />
      </div>

      <div style={{ fontSize: '14px', color: '#666' }}>
        <p><strong>Current Character:</strong> {currentCharacter}</p>
        <p><strong>Current State:</strong> {playerState}</p>
        <p>Try switching between characters and states to see the differences!</p>
      </div>
    </div>
  )
}