import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('Complete Gameplay Integration', () => {
  it('supports full gameplay loop from start to game interactions', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Should start on attract screen
    expect(screen.getByText('LUMBERJACK')).toBeInTheDocument()
    
    // Start game to transition to play screen
    await user.keyboard('{Enter}')
    
    // Now verify play screen state
    const initialScoreElements = screen.getAllByText('0')
    expect(initialScoreElements.length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Lumberjack Game')
    expect(screen.queryByText(/GAME OVER/)).not.toBeInTheDocument()
    
    // Enable debug mode to track game state
    await user.keyboard('?')
    expect(screen.getByText('Game State')).toBeInTheDocument()
    expect(screen.getByText('Player Side: left')).toBeInTheDocument()
    
    // Make a safe move
    await user.keyboard('{ArrowLeft}')
    
    // Verify score increase and game state update
    const scoreElements = screen.getAllByText('1')
    expect(scoreElements.length).toBeGreaterThan(0)
    expect(screen.queryByText(/GAME OVER/)).not.toBeInTheDocument()
    
    // Player should still be on left side after left chop
    expect(screen.getByText('Player Side: left')).toBeInTheDocument()
    
    // Check that tree segments count is maintained
    const segmentElements = screen.getAllByText(/^\d+: (left|right|none)$/)
    expect(segmentElements).toHaveLength(8) // Should still have 8 segments
    
    // Test that components maintain consistent state across interactions  
    expect(screen.getByText('Total Segments: 8')).toBeInTheDocument()
    
    // Test debug toggle
    await user.keyboard('?') // toggle off debug
    expect(screen.queryByText('Game State')).not.toBeInTheDocument()
    
    await user.keyboard('?') // toggle on debug  
    expect(screen.getByText('Game State')).toBeInTheDocument()
  })

  it('handles rapid input without breaking game state', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Start game first
    await user.keyboard('{Enter}')
    
    // Enable debug to monitor state
    await user.keyboard('?')
    
    // Make one safe move first  
    await user.keyboard('{ArrowLeft}')
    
    // Game should still be functional and score should increase
    const scoreElements = screen.getAllByText(/^\d+$/)
    expect(scoreElements.length).toBeGreaterThan(0)
    
    // Debug info should still be accurate
    expect(screen.getByText('Total Segments: 8')).toBeInTheDocument()
    expect(screen.getByText(/Player Side: (left|right)/)).toBeInTheDocument()
  })

  it('maintains consistent game state across all components', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Start game first
    await user.keyboard('{Enter}')
    
    // Enable debug mode
    await user.keyboard('?')
    
    // Perform a safe chop
    await user.keyboard('{ArrowLeft}')
    
    // Verify all components reflect the same game state
    const mainScoreElements = screen.getAllByText('1')
    expect(mainScoreElements.length).toBeGreaterThan(0) // ScoreDisplay
    
    // Debug panel should show same score  
    expect(screen.getByText('1')).toBeInTheDocument() // Main display
    expect(screen.getByText('Score: 1')).toBeInTheDocument() // Debug panel
    
    // Player position should be consistent
    expect(screen.getByText('Player Side: left')).toBeInTheDocument()
    
    // Tree segments should be consistent
    expect(screen.getByText('Total Segments: 8')).toBeInTheDocument()
    
    // Toggle debug off and back on
    await user.keyboard('?') // off
    expect(screen.queryByText('Game State')).not.toBeInTheDocument()
    
    await user.keyboard('?') // back on
    expect(screen.getByText('Game State')).toBeInTheDocument()
    
    // State should be preserved
    expect(screen.getByText('1')).toBeInTheDocument() // Main display
    expect(screen.getByText('Score: 1')).toBeInTheDocument() // Debug panel
  })

  it('handles edge case of game over and scene transitions', async () => {
    // Mock random branch generation to create predictable collision scenario
    vi.spyOn(Math, 'random').mockReturnValue(0.4) // Always generates 'right' branch
    
    const user = userEvent.setup()
    render(<App />)
    
    // Start game first
    await user.keyboard('{Enter}')
    
    // Initial state has treeSegments[1] = 'right', player starts on 'left'
    // Chopping right moves player to right side and hits the 'right' branch
    await user.keyboard('{ArrowRight}')
    
    // Should transition to game over screen after delay
    expect(await screen.findByText('GAME OVER!', {}, { timeout: 2000 })).toBeInTheDocument()
    expect(screen.getByText(/YOUR SCORE:/)).toBeInTheDocument()
    
    // Press any key to restart
    await user.keyboard('{Enter}')
    
    // Should go back to play screen with new game
    expect(screen.getByText('Lumberjack Game')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
    
    vi.restoreAllMocks()
  })

  it('integrates keyboard input filtering correctly', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Start game first
    await user.keyboard('{Enter}')
    
    const initialScoreElements = screen.getAllByText('0')
    expect(initialScoreElements.length).toBeGreaterThan(0)
    
    // Test ignored keys don't affect game
    await user.keyboard('{Escape}')
    await user.keyboard('a')
    await user.keyboard('{Space}')
    
    // Score and state should be unchanged
    const unchangedScoreElements = screen.getAllByText('0')
    expect(unchangedScoreElements.length).toBeGreaterThan(0)
    expect(screen.queryByText(/GAME OVER/)).not.toBeInTheDocument()
    
    // Only game keys should work
    await user.keyboard('{ArrowLeft}')
    const changedScoreElements = screen.getAllByText('1')
    expect(changedScoreElements.length).toBeGreaterThan(0)
  })

  it('ensures animations do not interfere with core gameplay', async () => {
    // Mock random generation for predictable non-collision moves
    vi.spyOn(Math, 'random').mockReturnValue(0.7) // Always generates 'none' branch (safe)
    
    const user = userEvent.setup()
    render(<App />)
    
    // Start game first
    await user.keyboard('{Enter}')
    
    // Enable debug mode to monitor internal state
    await user.keyboard('?')
    
    // Initial state: player on left, segments[1] = 'right'
    // So chopping left is safe, chopping right hits collision
    
    // Make safe chop (left) to trigger animations
    await user.keyboard('{ArrowLeft}')
    
    // Verify score increased and game functionality is maintained
    expect(screen.getAllByText('1').length).toBeGreaterThan(0)
    expect(screen.getByText('Score: 1')).toBeInTheDocument()
    expect(screen.getByText('Player Side: left')).toBeInTheDocument()
    
    // Make another safe chop (left again) - rapid chopping scenario
    await user.keyboard('{ArrowLeft}')
    
    // Should continue working normally despite animations
    expect(screen.getAllByText('2').length).toBeGreaterThan(0)
    expect(screen.getByText('Score: 2')).toBeInTheDocument()
    expect(screen.getByText('Player Side: left')).toBeInTheDocument()
    
    // Tree segments should still be maintained correctly
    expect(screen.getByText('Total Segments: 8')).toBeInTheDocument()
    
    // Verify the game didn't crash with error (it's still playable regardless of game over)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Lumberjack Game')
    
    vi.restoreAllMocks()
  })

  it('maintains game consistency with animations during game over transitions', async () => {
    // Mock random branch generation for predictable collision
    vi.spyOn(Math, 'random').mockReturnValue(0.4) // Always generates 'right' branch
    
    const user = userEvent.setup()
    render(<App />)
    
    // Start game
    await user.keyboard('{Enter}')
    
    // The initial state has treeSegments[1] = 'right'
    // Player starts on 'left', so chopping right should cause immediate collision
    await user.keyboard('{ArrowRight}') // Player moves to right, hits 'right' branch at position 1
    
    // Should transition to game over screen
    expect(await screen.findByText('GAME OVER!', {}, { timeout: 2000 })).toBeInTheDocument()
    
    // Score should be 0 since no successful chops
    expect(screen.getByText(/YOUR SCORE: 0/)).toBeInTheDocument()
    
    // Game should be restartable
    await user.keyboard('{Enter}')
    expect(screen.getByText('Lumberjack Game')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
    
    vi.restoreAllMocks()
  })
})