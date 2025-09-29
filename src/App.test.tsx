import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

const resetLocation = () => window.history.replaceState({}, '', '/')
const enableTestMode = () => window.history.replaceState({}, '', '/?testMode=true')

describe('App Integration Tests', () => {
  beforeEach(() => {
    resetLocation()
    enableTestMode()
  })

  afterEach(() => {
    vi.useRealTimers()
    resetLocation()
  })
  it('renders attract screen initially', () => {
    render(<App />)
    
    expect(screen.getByRole('heading', { level: 1, name: /Lumberjack/i })).toBeInTheDocument()
    expect(screen.getByText('PRESS ANY BUTTON TO PLAY')).toBeInTheDocument()
    expect(screen.getByText(/All time highscore:/)).toBeInTheDocument()
    expect(screen.getByText(/CONTROLS:/)).toBeInTheDocument()
  })

  it('delays instructions for five seconds when not forced', async () => {
    vi.useFakeTimers()
    resetLocation()
    render(<App />)

    expect(screen.queryByText('PRESS ANY BUTTON TO PLAY')).not.toBeInTheDocument()
    expect(screen.queryByText(/CONTROLS:/)).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(screen.getByText('PRESS ANY BUTTON TO PLAY')).toBeInTheDocument()
    expect(screen.getByText(/CONTROLS:/)).toBeInTheDocument()
  })

  it('transitions from attract to play screen', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Should start on attract screen
    expect(screen.getByRole('heading', { level: 1, name: /Lumberjack/i })).toBeInTheDocument()
    
    // Press any key to start game
    await user.keyboard('{ArrowLeft}')
    
    // Should now be on play screen
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Lumberjack Game')
    expect(screen.getByText('0')).toBeInTheDocument()
    // Score display now shows only the number without additional text
    
    // Check for game board container
    const gameBoard = document.querySelector('[style*="width: 540px"]')
    expect(gameBoard).toBeInTheDocument()
  })

  it('integrates game state management with UI updates', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Start game from attract screen
    await user.keyboard('{Enter}')
    
    // Should be on play screen now
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.queryByText(/GAME OVER/)).not.toBeInTheDocument()
    
    // Simulate safe chop (left arrow when no left branch in segments[1])
    await user.keyboard('{ArrowLeft}')
    
    // Score should increase
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('integrates keyboard input with game actions', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Start game from attract screen
    await user.keyboard('{Enter}')
    
    // Toggle debug mode with '?' key
    expect(screen.queryByText('Game State')).not.toBeInTheDocument()
    
    await user.keyboard('?')
    
    expect(screen.getByText('Game State')).toBeInTheDocument()
    expect(screen.getByText('Player Side: left')).toBeInTheDocument()
    
    // Toggle off
    await user.keyboard('?')
    
    expect(screen.queryByText('Game State')).not.toBeInTheDocument()
  })

  it('integrates scene transitions and game over functionality', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Start game from attract screen
    await user.keyboard('{Enter}')
    
    // Should be on play screen
    expect(screen.getByText('Lumberjack Game')).toBeInTheDocument()
    
    // We need to trigger a game over first
    // Try to find a collision scenario by examining initial state
    // Looking at initial state: segments[1] has 'right' branch, so right chop should cause collision
    await user.keyboard('{ArrowRight}')
    
    // Should transition to game over screen after delay
    expect(await screen.findByText('GAME OVER!', {}, { timeout: 2000 })).toBeInTheDocument()
    
    // Should show final score and restart option
    expect(screen.getByText(/YOUR SCORE:/)).toBeInTheDocument()
    expect(screen.getByText('PRESS ANY BUTTON TO PLAY AGAIN')).toBeInTheDocument()
    
    // Press any key to restart
    await user.keyboard('{Enter}')
    
    // Should go back to play screen with new game
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('Lumberjack Game')).toBeInTheDocument()
  })

  it('integrates all components working together', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Start game from attract screen
    await user.keyboard('{Enter}')
    
    // Enable debug mode
    await user.keyboard('?')
    
    // Should show debug info
    expect(screen.getByText('Game State')).toBeInTheDocument()
    expect(screen.getByText('Total Segments: 8')).toBeInTheDocument()
    
    // Game components should all be present
    expect(screen.getByText('0')).toBeInTheDocument()
    // Score display now shows only the number without additional text
    
    // Game board should be rendered (check for tree trunk sprites)
    const treeTrunks = document.querySelectorAll('[style*="background-image: url(\\"./images/trunk.png\\")"]')
    expect(treeTrunks.length).toBeGreaterThan(0)
  })
})
