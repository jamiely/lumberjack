import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DebugPanel from '../DebugPanel'
import type { TreeSegment } from '../../game/GameState'

describe('DebugPanel', () => {
  const mockTreeSegments: TreeSegment[] = [
    { branchSide: 'none' },
    { branchSide: 'left' },
    { branchSide: 'right' }
  ]

  const defaultProps = {
    showDebug: true,
    playerSide: 'left' as const,
    score: 10,
    gameOver: false,
    treeSegments: mockTreeSegments
  }

  it('renders nothing when showDebug is false', () => {
    const { container } = render(
      <DebugPanel {...defaultProps} showDebug={false} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders debug panel when showDebug is true', () => {
    render(<DebugPanel {...defaultProps} />)
    expect(screen.getByText('Game State')).toBeInTheDocument()
    expect(screen.getByText('Current Tree Segment')).toBeInTheDocument()
    expect(screen.getByText('Player Coordinates')).toBeInTheDocument()
  })

  it('displays correct game state information', () => {
    render(<DebugPanel {...defaultProps} />)
    expect(screen.getByText('Player Side: left')).toBeInTheDocument()
    expect(screen.getByText('Score: 10')).toBeInTheDocument()
    expect(screen.getByText('Game Over: No')).toBeInTheDocument()
    expect(screen.getByText('Total Segments: 3')).toBeInTheDocument()
  })

  it('displays correct game state when game is over', () => {
    render(<DebugPanel {...defaultProps} gameOver={true} />)
    expect(screen.getByText('Game Over: Yes')).toBeInTheDocument()
  })

  it('displays current tree segment information', () => {
    render(<DebugPanel {...defaultProps} />)
    expect(screen.getByText('Index: 0 (bottom segment)')).toBeInTheDocument()
    expect(screen.getByText('Branch Side: none')).toBeInTheDocument()
    expect(screen.getByText('Will Hit Branch: No')).toBeInTheDocument()
    expect(screen.getByText('Segment Y: 20px')).toBeInTheDocument()
  })

  it('shows collision warning when player would hit branch', () => {
    const segmentsWithCollision: TreeSegment[] = [
      { branchSide: 'left' }, // Player is on left, so this would be a collision
      { branchSide: 'right' }
    ]
    
    render(
      <DebugPanel 
        {...defaultProps} 
        treeSegments={segmentsWithCollision}
        playerSide="left"
      />
    )
    
    expect(screen.getByText('Will Hit Branch: YES')).toBeInTheDocument()
  })

  it('displays player coordinates for left side', () => {
    render(<DebugPanel {...defaultProps} playerSide="left" />)
    expect(screen.getByText('X: 100px')).toBeInTheDocument()
    expect(screen.getByText('Y: 20px')).toBeInTheDocument()
    expect(screen.getByText('Distance from Tree: 75px left')).toBeInTheDocument()
  })

  it('displays player coordinates for right side', () => {
    render(<DebugPanel {...defaultProps} playerSide="right" />)
    expect(screen.getByText('X: 250px')).toBeInTheDocument()
    expect(screen.getByText('Distance from Tree: 75px right')).toBeInTheDocument()
  })

  it('displays all tree segments with correct formatting', () => {
    render(<DebugPanel {...defaultProps} />)
    expect(screen.getByText('All Tree Segments (bottom to top)')).toBeInTheDocument()
    expect(screen.getByText('0: none')).toBeInTheDocument()
    expect(screen.getByText('1: left')).toBeInTheDocument()
    expect(screen.getByText('2: right')).toBeInTheDocument()
  })

  it('highlights current segment in segment list', () => {
    const { container } = render(<DebugPanel {...defaultProps} />)
    
    // Find the segment spans and check styling
    const segments = container.querySelectorAll('span')
    const currentSegment = Array.from(segments).find(span => 
      span.textContent === '0: none'
    )
    const otherSegment = Array.from(segments).find(span => 
      span.textContent === '1: left'
    )
    
    expect(currentSegment).toHaveStyle({ backgroundColor: '#ddd' })
    expect(otherSegment).toHaveStyle({ backgroundColor: '#fff' })
  })

  it('handles empty tree segments array', () => {
    render(
      <DebugPanel 
        {...defaultProps} 
        treeSegments={[]}
      />
    )
    
    expect(screen.getByText('Total Segments: 0')).toBeInTheDocument()
    expect(screen.getByText('Branch Side: none')).toBeInTheDocument()
  })
})