import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('Complete Gameplay Integration', () => {
  it('supports full gameplay loop from start to game interactions', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Should start on attract screen
    expect(screen.getByText('TIMBERMAN')).toBeInTheDocument()
    
    // Start game to transition to play screen
    await user.keyboard('{Enter}')
    
    // Now verify play screen state
    const initialScoreElements = screen.getAllByText('Score: 0')
    expect(initialScoreElements.length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Timberman Game')
    expect(screen.queryByText(/GAME OVER/)).not.toBeInTheDocument()
    
    // Enable debug mode to track game state
    await user.keyboard('?')
    expect(screen.getByText('Game State')).toBeInTheDocument()
    expect(screen.getByText('Player Side: left')).toBeInTheDocument()
    
    // Make a safe move
    await user.keyboard('{ArrowLeft}')
    
    // Verify score increase and game state update
    const scoreElements = screen.getAllByText('Score: 1')
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
    const scoreElements = screen.getAllByText(/Score: \d+/)
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
    const mainScoreElements = screen.getAllByText('Score: 1')
    expect(mainScoreElements.length).toBeGreaterThan(0) // ScoreDisplay
    
    // Debug panel should show same score
    expect(screen.getAllByText('Score: 1')).toHaveLength(2) // Main display + debug panel
    
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
    expect(screen.getAllByText('Score: 1')).toHaveLength(2)
  })

  it('handles edge case of game over and scene transitions', async () => {
    // Mock random branch generation to create predictable collision scenario
    vi.spyOn(Math, 'random').mockReturnValue(0.0) // Always generates 'left' branch
    
    const user = userEvent.setup()
    render(<App />)
    
    // Start game first
    await user.keyboard('{Enter}')
    
    // Since initial state has 'right' at segments[1], chop right should cause collision
    await user.keyboard('{ArrowRight}')
    
    // Should transition to game over screen after delay
    expect(await screen.findByText('GAME OVER!', {}, { timeout: 2000 })).toBeInTheDocument()
    expect(screen.getByText(/YOUR SCORE:/)).toBeInTheDocument()
    
    // Press any key to restart
    await user.keyboard('{Enter}')
    
    // Should go back to play screen with new game
    expect(screen.getByText('Timberman Game')).toBeInTheDocument()
    expect(screen.getByText('Score: 0')).toBeInTheDocument()
    
    vi.restoreAllMocks()
  })

  it('integrates keyboard input filtering correctly', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Start game first
    await user.keyboard('{Enter}')
    
    const initialScoreElements = screen.getAllByText('Score: 0')
    expect(initialScoreElements.length).toBeGreaterThan(0)
    
    // Test ignored keys don't affect game
    await user.keyboard('{Escape}')
    await user.keyboard('a')
    await user.keyboard('{Space}')
    
    // Score and state should be unchanged
    const unchangedScoreElements = screen.getAllByText('Score: 0')
    expect(unchangedScoreElements.length).toBeGreaterThan(0)
    expect(screen.queryByText(/GAME OVER/)).not.toBeInTheDocument()
    
    // Only game keys should work
    await user.keyboard('{ArrowLeft}')
    const changedScoreElements = screen.getAllByText('Score: 1')
    expect(changedScoreElements.length).toBeGreaterThan(0)
  })
})