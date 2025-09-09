import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import GameBoard from '../GameBoard'
import { TreeSegment } from '../../game/GameState'

describe('GameBoard', () => {
  const mockTreeSegments: TreeSegment[] = [
    { branchSide: 'none' },
    { branchSide: 'left' },
    { branchSide: 'right' }
  ]

  it('renders the game board container with correct styles', () => {
    const { container } = render(
      <GameBoard 
        treeSegments={mockTreeSegments}
        playerSide="left"
        gameOver={false}
      />
    )
    
    const gameBoard = container.firstChild as HTMLElement
    expect(gameBoard).toHaveStyle({
      position: 'relative',
      width: '400px',
      height: '500px',
      backgroundColor: '#87CEEB'
    })
  })

  it('renders correct number of tree segments', () => {
    const { container } = render(
      <GameBoard 
        treeSegments={mockTreeSegments}
        playerSide="left"
        gameOver={false}
      />
    )
    
    // Each segment creates a trunk div with specific brown color
    const trunks = container.querySelectorAll('[style*="background-color: rgb(139, 69, 19)"]')
    expect(trunks).toHaveLength(3)
  })

  it('renders tree trunks for all segments', () => {
    const { container } = render(
      <GameBoard 
        treeSegments={mockTreeSegments}
        playerSide="left"
        gameOver={false}
      />
    )
    
    const trunks = container.querySelectorAll('[style*="background-color: rgb(139, 69, 19)"]')
    expect(trunks).toHaveLength(3) // One trunk per segment
  })

  it('renders branches only for segments with branches', () => {
    const { container } = render(
      <GameBoard 
        treeSegments={mockTreeSegments}
        playerSide="left"
        gameOver={false}
      />
    )
    
    const branches = container.querySelectorAll('[style*="background-color: rgb(101, 67, 33)"]')
    expect(branches).toHaveLength(2) // Only segments with left/right branches
  })

  it('positions player on correct side', () => {
    const { container, rerender } = render(
      <GameBoard 
        treeSegments={mockTreeSegments}
        playerSide="left"
        gameOver={false}
      />
    )
    
    let player = container.querySelector('[style*="left: 100px"]')
    expect(player).toBeInTheDocument()
    
    rerender(
      <GameBoard 
        treeSegments={mockTreeSegments}
        playerSide="right"
        gameOver={false}
      />
    )
    
    player = container.querySelector('[style*="left: 250px"]')
    expect(player).toBeInTheDocument()
  })

  it('changes player color when game over', () => {
    const { container, rerender } = render(
      <GameBoard 
        treeSegments={mockTreeSegments}
        playerSide="left"
        gameOver={false}
      />
    )
    
    let player = container.querySelector('[style*="background-color: blue"]')
    expect(player).toBeInTheDocument()
    
    rerender(
      <GameBoard 
        treeSegments={mockTreeSegments}
        playerSide="left"
        gameOver={true}
      />
    )
    
    player = container.querySelector('[style*="background-color: red"]')
    expect(player).toBeInTheDocument()
  })

  it('positions branches on correct side', () => {
    const segmentsWithBranches: TreeSegment[] = [
      { branchSide: 'left' },
      { branchSide: 'right' }
    ]
    
    const { container } = render(
      <GameBoard 
        treeSegments={segmentsWithBranches}
        playerSide="left"
        gameOver={false}
      />
    )
    
    const leftBranch = container.querySelector('[style*="left: 125px"]')
    const rightBranch = container.querySelector('[style*="left: 225px"]')
    
    expect(leftBranch).toBeInTheDocument()
    expect(rightBranch).toBeInTheDocument()
  })
})