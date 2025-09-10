import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import GameBoard from '../GameBoard'
import type { TreeSegment, AnimatedSegment } from '../../game/GameState'

describe('GameBoard', () => {
  const mockTreeSegments: TreeSegment[] = [
    { branchSide: 'none' },
    { branchSide: 'left' },
    { branchSide: 'right' }
  ]

  it('renders the game board container with correct full-screen dimensions', () => {
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
      width: '540px',
      height: '960px',
      backgroundColor: '#87CEEB',
      opacity: '1',
      pointerEvents: 'auto'
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
    
    let player = container.querySelector('[style*="left: 135px"]')
    expect(player).toBeInTheDocument()
    
    rerender(
      <GameBoard 
        treeSegments={mockTreeSegments}
        playerSide="right"
        gameOver={false}
      />
    )
    
    player = container.querySelector('[style*="left: 337px"]')
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
    
    const leftBranch = container.querySelector('[style*="left: 169px"]')
    const rightBranch = container.querySelector('[style*="left: 304px"]')
    
    expect(leftBranch).toBeInTheDocument()
    expect(rightBranch).toBeInTheDocument()
  })

  describe('mode functionality', () => {
    it('defaults to interactive mode with full opacity and pointer events', () => {
      const { container } = render(
        <GameBoard 
          treeSegments={mockTreeSegments}
          playerSide="left"
          gameOver={false}
        />
      )
      
      const gameBoard = container.firstChild as HTMLElement
      expect(gameBoard).toHaveStyle({
        opacity: '1',
        pointerEvents: 'auto'
      })
    })

    it('applies interactive mode styles correctly', () => {
      const { container } = render(
        <GameBoard 
          treeSegments={mockTreeSegments}
          playerSide="left"
          gameOver={false}
          mode="interactive"
        />
      )
      
      const gameBoard = container.firstChild as HTMLElement
      expect(gameBoard).toHaveStyle({
        opacity: '1',
        pointerEvents: 'auto'
      })
    })

    it('applies static mode styles correctly', () => {
      const { container } = render(
        <GameBoard 
          treeSegments={mockTreeSegments}
          playerSide="left"
          gameOver={false}
          mode="static"
        />
      )
      
      const gameBoard = container.firstChild as HTMLElement
      expect(gameBoard).toHaveStyle({
        opacity: '0.8',
        pointerEvents: 'none'
      })
    })

    it('applies frozen mode styles correctly', () => {
      const { container } = render(
        <GameBoard 
          treeSegments={mockTreeSegments}
          playerSide="left"
          gameOver={false}
          mode="frozen"
        />
      )
      
      const gameBoard = container.firstChild as HTMLElement
      expect(gameBoard).toHaveStyle({
        opacity: '0.7',
        pointerEvents: 'none'
      })
    })

    it('disables interactions for static and frozen modes', () => {
      const { container, rerender } = render(
        <GameBoard 
          treeSegments={mockTreeSegments}
          playerSide="left"
          gameOver={false}
          mode="static"
        />
      )
      
      let gameBoard = container.firstChild as HTMLElement
      expect(gameBoard).toHaveStyle({ pointerEvents: 'none' })

      rerender(
        <GameBoard 
          treeSegments={mockTreeSegments}
          playerSide="left"
          gameOver={false}
          mode="frozen"
        />
      )
      
      gameBoard = container.firstChild as HTMLElement
      expect(gameBoard).toHaveStyle({ pointerEvents: 'none' })
    })
  })

  describe('animated segments', () => {
    let mockRemoveAnimatedSegment: ReturnType<typeof vi.fn>
    
    beforeEach(() => {
      mockRemoveAnimatedSegment = vi.fn()
      // Mock performance.now for consistent animation testing
      vi.spyOn(performance, 'now').mockReturnValue(1000)
      
      // Mock requestAnimationFrame to prevent infinite recursion in tests
      let animationCallCount = 0
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        // Only call the callback once to avoid infinite recursion in tests
        if (animationCallCount === 0) {
          animationCallCount++
          setTimeout(() => cb(1000), 0) // Use setTimeout to avoid immediate recursion
        }
        return 1
      })
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('renders animated segments when provided', () => {
      const mockAnimatedSegments: AnimatedSegment[] = [
        {
          branchSide: 'left',
          animationId: 'test-segment-1',
          startTime: 0,
          direction: 'right',
          startPosition: { x: 236, y: 38 }
        }
      ]

      const { container } = render(
        <GameBoard 
          treeSegments={mockTreeSegments}
          playerSide="left"
          gameOver={false}
          animatedSegments={mockAnimatedSegments}
          onRemoveAnimatedSegment={mockRemoveAnimatedSegment}
        />
      )

      // Should render animated trunk with higher z-index
      const animatedTrunks = container.querySelectorAll('[style*="z-index: 10"]')
      expect(animatedTrunks.length).toBeGreaterThan(0)
    })

    it('renders animated branches when segment has branches', () => {
      const mockAnimatedSegments: AnimatedSegment[] = [
        {
          branchSide: 'left',
          animationId: 'test-segment-with-branch',
          startTime: 0,
          direction: 'right',
          startPosition: { x: 236, y: 38 }
        }
      ]

      const { container } = render(
        <GameBoard 
          treeSegments={mockTreeSegments}
          playerSide="left"
          gameOver={false}
          animatedSegments={mockAnimatedSegments}
          onRemoveAnimatedSegment={mockRemoveAnimatedSegment}
        />
      )

      // Should render both animated trunk and branch
      const animatedElements = container.querySelectorAll('[style*="z-index: 10"]')
      expect(animatedElements.length).toBe(2) // trunk + branch
    })

    it('does not render branches for animated segments with no branches', () => {
      const mockAnimatedSegments: AnimatedSegment[] = [
        {
          branchSide: 'none',
          animationId: 'test-segment-no-branch',
          startTime: 0,
          direction: 'right',
          startPosition: { x: 236, y: 38 }
        }
      ]

      const { container } = render(
        <GameBoard 
          treeSegments={mockTreeSegments}
          playerSide="left"
          gameOver={false}
          animatedSegments={mockAnimatedSegments}
          onRemoveAnimatedSegment={mockRemoveAnimatedSegment}
        />
      )

      // Should render only animated trunk, no branch
      const animatedElements = container.querySelectorAll('[style*="z-index: 10"]')
      expect(animatedElements.length).toBe(1) // only trunk
    })

    it('renders multiple animated segments', () => {
      const mockAnimatedSegments: AnimatedSegment[] = [
        {
          branchSide: 'left',
          animationId: 'test-segment-1',
          startTime: 0,
          direction: 'right',
          startPosition: { x: 236, y: 38 }
        },
        {
          branchSide: 'right',
          animationId: 'test-segment-2',
          startTime: 100,
          direction: 'left',
          startPosition: { x: 236, y: 38 }
        }
      ]

      const { container } = render(
        <GameBoard 
          treeSegments={mockTreeSegments}
          playerSide="left"
          gameOver={false}
          animatedSegments={mockAnimatedSegments}
          onRemoveAnimatedSegment={mockRemoveAnimatedSegment}
        />
      )

      // Should render elements for both segments (2 trunks + 2 branches)
      const animatedElements = container.querySelectorAll('[style*="z-index: 10"]')
      expect(animatedElements.length).toBe(4) // 2 trunks + 2 branches
    })

    it('handles empty animated segments array gracefully', () => {
      const { container } = render(
        <GameBoard 
          treeSegments={mockTreeSegments}
          playerSide="left"
          gameOver={false}
          animatedSegments={[]}
          onRemoveAnimatedSegment={mockRemoveAnimatedSegment}
        />
      )

      // Should not render any animated elements
      const animatedElements = container.querySelectorAll('[style*="z-index: 10"]')
      expect(animatedElements.length).toBe(0)
    })

    it('works without animated segments props (backwards compatibility)', () => {
      const { container } = render(
        <GameBoard 
          treeSegments={mockTreeSegments}
          playerSide="left"
          gameOver={false}
        />
      )

      // Should render normally without errors
      const gameBoard = container.firstChild as HTMLElement
      expect(gameBoard).toBeInTheDocument()

      // Should not render any animated elements
      const animatedElements = container.querySelectorAll('[style*="z-index: 10"]')
      expect(animatedElements.length).toBe(0)
    })
  })
})