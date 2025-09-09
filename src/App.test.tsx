import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App Integration Tests', () => {
  it('renders all major components', () => {
    render(<App />)
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Timberman Game')
    expect(screen.getByText('Score: 0')).toBeInTheDocument()
    expect(screen.getByText(/Use left\/right arrows to chop and switch sides/)).toBeInTheDocument()
    
    // Check for game board container
    const gameBoard = document.querySelector('[style*="width: 400px"]')
    expect(gameBoard).toBeInTheDocument()
  })

  it('integrates game state management with UI updates', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Initial state
    expect(screen.getByText('Score: 0')).toBeInTheDocument()
    expect(screen.queryByText(/GAME OVER/)).not.toBeInTheDocument()
    
    // Simulate safe chop (left arrow when no left branch in segments[1])
    await user.keyboard('{ArrowLeft}')
    
    // Score should increase
    expect(screen.getByText('Score: 1')).toBeInTheDocument()
  })

  it('integrates keyboard input with game actions', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Toggle debug mode with '?' key
    expect(screen.queryByText('Game State')).not.toBeInTheDocument()
    
    await user.keyboard('?')
    
    expect(screen.getByText('Game State')).toBeInTheDocument()
    expect(screen.getByText('Player Side: left')).toBeInTheDocument()
    
    // Toggle off
    await user.keyboard('?')
    
    expect(screen.queryByText('Game State')).not.toBeInTheDocument()
  })

  it('integrates reset functionality when game is over', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // We need to trigger a game over first
    // Try to find a collision scenario by examining initial state
    // Since this is integration testing, we'll simulate the key that would cause collision
    // Looking at initial state: segments[1] has 'right' branch, so right chop should cause collision
    await user.keyboard('{ArrowRight}')
    
    // Should show game over
    expect(screen.getByText(/GAME OVER/)).toBeInTheDocument()
    
    // Reset with 'r' key
    await user.keyboard('r')
    
    // Should reset to initial state
    expect(screen.getByText('Score: 0')).toBeInTheDocument()
    expect(screen.queryByText(/GAME OVER/)).not.toBeInTheDocument()
  })

  it('integrates all components working together', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Enable debug mode
    await user.keyboard('?')
    
    // Should show debug info
    expect(screen.getByText('Game State')).toBeInTheDocument()
    expect(screen.getByText('Total Segments: 8')).toBeInTheDocument()
    
    // Game components should all be present (use getAllByText for duplicated content)
    const scoreElements = screen.getAllByText('Score: 0')
    expect(scoreElements.length).toBeGreaterThan(0)
    expect(screen.getByText(/Use left\/right arrows/)).toBeInTheDocument()
    
    // Game board should be rendered (check for tree trunk color)
    const treeTrunks = document.querySelectorAll('[style*="background-color: rgb(139, 69, 19)"]')
    expect(treeTrunks.length).toBeGreaterThan(0)
  })
})